const parser = require('./parser');
const p2c_extractors = require('./parsed_to_converted_extractors');
const c2c_extractors = require('./converted_to_converted_extractors');
const graph_converter = require('./graph_converter');
const util = require('./util');
const {
    PHASE_TREE,
    ROOT_ELEMENT_NAME,
    LIFECYCLE_PARENT_NAME,
    LIFECYCLE_ENTRY_NAMES,
    GENERAL_INFORMATION_NAME } = require('./constants');

const {StmdWriter} = require('./stmd_writer');

/**
 * @typedef {import('../types/specification').SimulationTaskMetaDataAttributes} SimulationTaskMetaDataAttributes
 * @typedef {import('../types/specification').GeneralInformationType} GeneralInformationType
 * @typedef {import('../types/specification').ResourceType} ResourceType
 * @typedef {import('../types/specification').ResourceTypeAttributes} ResourceTypeAttributes
 * @typedef {import('../types/specification').ResourceReference} ResourceReference
 * @typedef {import('../types/specification').ResourceReferenceAttributes} ResourceReferenceAttributes
 * @typedef {import('../types/specification').ContentType} ContentType
 * @typedef {import('../types/specification').Summary} Summary
 * @typedef {import('../types/specification').SummaryAttributes} SummaryAttributes
 * @typedef {import('../types/specification').MetaData} MetaData
 * @typedef {import('../types/specification').MetaDataAttributes} MetaDataAttributes
 * @typedef {import('../types/specification').SignatureType} SignatureType
 * @typedef {import('../types/specification').SignatureTypeAttributes} SignatureTypeAttributes
 * @typedef {import('../types/specification').GElementCommon} GElementCommon
 * @typedef {import('../types/specification').Classification} Classification
 * @typedef {import('../types/specification').ClassificationAttributes} ClassificationAttributes
 * @typedef {import('../types/specification').ClassificationEntry} ClassificationEntry
 * @typedef {import('../types/specification').ClassificationEntryAttributes} ClassificationEntryAttributes
 * @typedef {import('../types/specification').Annotations} Annotations
 * @typedef {import('../types/specification').Annotation} Annotation
 * @typedef {import('../types/specification').AnnotationAttributes} AnnotationAttributes
 * @typedef {import('../types/specification').LinksType} LinksType
 * @typedef {import('../types/specification').Link} Link
 * @typedef {import('../types/specification').LinkAttributes} LinkAttributes
 * @typedef {import('../types/specification').Locator} Locator
 * @typedef {import('../types/specification').LocatorAttributes} LocatorAttributes
 * @typedef {import('../types/specification').Arc} Arc
 * @typedef {import('../types/specification').ArcAttributes} ArcAttributes
 * @typedef {import('../types/internal_types').AvailableResource} AvailableResource
 * @typedef {import('../types/internal_types').AvailableResourceReference} AvailableResourceReference
 * @typedef {import('../types/internal_types').AvailableLink} AvailableLink
 * @typedef {import('../types/internal_types').AvailableClassification} AvailableClassification
 * @typedef {import('../types/internal_types').AvailableAnnotation} AvailableAnnotation 
 * @typedef {import('../types/internal_types').AvailableLifeCycleEntry} AvailableLifeCycleEntry 
 * @typedef {import('../types/internal_types').ContextEntry} ContextEntry 
 */

/**
 * Pushes a new ContextEntry into a ContextEntry array only then, if the term is not yet included
 * 
 * @param {ContextEntry} newItem 
 */
Array.prototype.pushContextEntry = function (newItem, ...moreNewItems) {
    for (let item of [newItem].concat(moreNewItems))
        if (this.filter(existingItem => existingItem.term === item.term).length == 0) this.push(item);
}

exports.StmdReader = class StmdReader {
    /**
     * The raw parsed STMD file, parsed by fast-xml-parser
     * 
     * @private 
     * @type {object}
     */
    #stmdRawParsed;

    /**
     * The top level information of the STMD file
     * 
     * @private 
     * @type {SimulationTaskMetaDataAttributes}
     */
    #topLevelInformation;

    /**
     * The GeneralInformation element of the STMD file (there's only one)
     * 
     * @private
     * @type {GeneralInformationType}
     */
    #generalInformation;

    /**
     * All available Resources and the corresponding location inside the STMD
     * 
     * @private
     * @type {AvailableResource[]}
     */
    #resources = [];

    /**
     * All available ResourceReferences and the corresponding location inside the STMD
     * 
     * @private
     * @type {AvailableResourceReference[]}
     */
    #resourceReferences = [];

    /**
     * All available Links in the STMD
     * 
     * @private
     * @type {AvailableLink[]}
     */
    #links = [];

    /**
     * All super Classifications in the STMD, that means, all classifications that can be found in the STMD, without
     * the Classifications inside Resources/ResourceReferences and their child elements.
     * 
     * @private 
     * @type {AvailableClassification[]}
     */
    #superClassifications = [];

    /**
     * All super Annotations in the STMD, that means, all annotations that can be found in the STMD, without
     * the Annotations inside Resources/ResourceReferences and their child elements.
     * 
     * @private 
     * @type {AvailableAnnotation[]}
     */
    #superAnnotations = [];

    /**
     * All LifeCycleEntries in the STMD
     * 
     * @private 
     * @type {AvailableLifeCycleEntry[]}
     */
    #lifeCycleEntries = [];

    /**
     * Creates an object to access any element inside a [STMD file](https://pmsfit.github.io/SSPTraceability/master/).
     * To use it, the string of the STMD file must be handed over on initialization of the StmdCrud.
     * 
     * Please note: The conformance of the STMD file to its schema definition must be given for proper functionality
     * of the StmdReader.
     * 
     * @param {string} stmdString the stringified STMD file
     */
    constructor(stmdString = "") {
        if (stmdString !== "") {
            this.#stmdRawParsed = parser.parseSTMD(stmdString);
            this.#extractTopLevelInformation();
            this.#extractGeneralInformation();
            this.#extractAllResourcesAndReferences();
            this.#extractAllLinks();
            this.#extractSuperGElementsCommon();
            this.#extractLifeCylceInformation();
        }
    }

    /**
     * Exports the current STMD
     * 
     * @returns {string} the STMD XML-string
     */
    export() {
        let stmdWriter = new StmdWriter();
        stmdWriter.setTopLevelInformation(this.#topLevelInformation);
        stmdWriter.setGeneralInformation(this.#generalInformation);
        stmdWriter.addSuperAnnotations(this.#superAnnotations);
        stmdWriter.addSuperClassifications(this.#superClassifications);
        stmdWriter.addLifeCycleInformation(this.#lifeCycleEntries);
        stmdWriter.addResources(this.#resources);
        stmdWriter.addResourceReferences(this.#resourceReferences);
        stmdWriter.addLinks(this.#links);
        
        return stmdWriter.export();
    }

    /**
     * Returns the top level information of the STMD file. That is all attributes, defined in the root element
     * (at least name, version and GUID)
     * 
     * @author localhorst87
     * @returns {SimulationTaskMetaDataAttributes} the top-level information
     */
    getTopLevelInformation() {
        return this.#topLevelInformation;
    }

    /**
     * Returns the General Information of the STMD file.
     * 
     * @author localhorst87
     * @returns {GeneralInformationType} the General Information
     */
    getGeneralInformation() {
        return this.#generalInformation;
    }

    /**
     * Returns all Resource elements (converted stc:Resource) of a given element in the STMD, given by a location.
     * 
     * A Resource element defines the structure and attributes of information about a resource that is related to the 
     * particular step and particle.
     * 
     * The location must be given as an array of all parent elements
     * 
     * @author localhorst87
     * @example getResources(['stmd:SimulationTaskMetaData', 'stmd:RequirementsPhase', 'stmd:VerifyRequirements', 'stc:Output'])
     * @param {string[]} location the location as array of strings
     * @param {boolean} [ingestSubElements=false] if true, all Resources from child elements will also be considered
     * @returns {AvailableResource[]} all Resources of the given location
     */
    getResources(location, ingestSubElements = false) {        
        if (ingestSubElements) {
            // accesses the tree elements, based on the given location, like PHASE_TREE[ location[0] ][ location[1] ][...]
            let startTree = location.reduce((treeElement, xmlElement) => treeElement[xmlElement], PHASE_TREE);

            return this.#collectRecursively(startTree, location, this.#collectResources, this.#resources);
        }
        else
            return this.#collectResources(location);
    }

    /**
     * Adds a new Resource to the given location
     * 
     * @param {ResourceType} resource 
     * @param {string[]} location 
     * @returns {boolean} operation successful
     */
    addResource(resource, location) {
        if (this.#isResourceIdExisting(resource.attributes.id))
            return false;
        
        const availableResource = c2c_extractors.convertToAvailableResources([resource], location);
        this.#resources.push(...availableResource);
        
        return true;
    }

    /**
     * Updates the Resource with the same UID. If the uid can not be found, the operation will be cancelled.
     * 
     * @author localhorst87
     * @param {ResourceType} resource 
     * @param {string[]} location 
     * @param {string} uid
     * @returns {boolean} operation successful
     */
    updateResource(resource, location, uid) {
        const idxRes = this.#resources.findIndex(availableResource => availableResource.uid == uid);
        if (idxRes < 0)
            return false;

        if (this.#isResourceIdExisting(resource.attributes.id))
            return false;
        
        const availableResource = {
            uid: uid,
            location: location,
            resource: resource
        };
        this.#resources.splice(idxRes, 1, availableResource);

        return true;
    }

    /**
     * Deletes the Resource with the given UID.
     * 
     * @param {string} uid 
     * @returns {boolean} operation successful
     */
    deleteResource(uid) {
        const idxRes = this.#resources.findIndex(availableResource => availableResource.uid == uid);
        if (idxRes < 0)
            return false;

        // if resource has defined an ID, search for all ResourceReferences that reference to this resource and delete them!
        const resourceId = this.#resources[idxRes].resource.attributes.id;
        if (resourceId !== undefined) {
            const href = "#" + resourceId;
            const resourceRefs = this.#resourceReferences.filter(resourceRef => resourceRef.resourceReference.attributes.xlink_href == href);
            for (let ref of resourceRefs) 
                this.deleteResourceReference(ref.uid);
        }

        this.#resources.splice(idxRes, 1);
        
        return true;       
    }

    /**
     * Returns all ResourceReference elements (converted stc:ResourceReference) of a given element in the STMD, given by
     * the location.
     * 
     * A ResourceReference element references a resource element defined in another place, that is related to the 
     * particular step and particle.
     * 
     * The location must be given as an array of all parent elements.
     * 
     * @author localhorst87
     * @example getResourceReferences(['stmd:SimulationTaskMetaData', 'stmd:RequirementsPhase','stmd:VerifyRequirements', 'stc:Output'])
     * @param {string[]} location the location as array of strings
     * @param {boolean} [ingestSubElements=false] if true, all ResourceReferences from child elements will also be considered
     * @returns {AvailableResourceReference[]} all ResourceReferences of the given location
     */
    getResourceReferences(location, ingestSubElements = false) {
        if (ingestSubElements) {
            // accesses the tree elements, based on the given location, like PHASE_TREE[ location[0] ][ location[1] ][...]
            let startTree = location.reduce((treeElement, xmlElement) => treeElement[xmlElement], PHASE_TREE);

            return this.#collectRecursively(startTree, location, this.#collectResourceReferences, this.#resourceReferences);
        }
        else
            return this.#collectResourceReferences(location);
    }

    /**
     * Adds a new ResourceReference to the given location
     * 
     * @param {ResourceReference} resourceReference
     * @param {string[]} location 
     * @returns {boolean} operation successful
     */
    addResourceReference(resourceReference, location) {
        if (this.#isResourceReferenceIdExisting(resourceReference.attributes.id))
            return false;
        
        const availableResourceReference = c2c_extractors.convertToAvailableResourceReferences([resourceReference], location);
        this.#resourceReferences.push(...availableResourceReference);
        
        return true;
    }

    /**
     * Deletes the ResourceReference with the given UID
     * 
     * @param {string} uid the uid of the ResourceReference to delete
     * @returns {boolean} true/false upon successful/failed deletion
     */
    deleteResourceReference(uid) {
        const idxRes = this.#resourceReferences.findIndex(availableReference => availableReference.uid == uid);
        if (idxRes < 0)
            return false;

        this.#resourceReferences.splice(idxRes, 1);

        return true;
    }

    /**
     * Returns all Link elements (converted stc:Link) of a given parent element in the STMD, given by a location.
     *  
     * The Link element represents a single link no matter if it is an STMD file internal link or a link targeted to the
     * outside of the STMD file.
     * 
     * The location must be given as an array of all parent elements.
     * 
     * Please note: The Link elements below the LinksType element (stc:Links) are returned here, so stc:Links must not 
     * be part of the location!
     * 
     * @author localhorst87
     * @example getLinks(['stmd:SimulationTaskMetaData', 'stmd:ImplementationPhase', 'stmd:IntegrateSimulation'])
     * // returns all Link elements given in the stc:Links elements of the stmd:IntegrateSimulation step
     * @param {string[]} location the location as array of strings
     * @param {boolean} [ingestSubElements=false] if true, all Links from child elements will also be considered
     * @returns {AvailableLink[]} all Links of the given location
     */
    getLinks(location, ingestSubElements = false) {
        if (ingestSubElements) {
            // accesses the tree elements, based on the given location, like PHASE_TREE[ location[0] ][ location[1] ][...]
            let startTree = location.reduce((treeElement, xmlElement) => treeElement[xmlElement], PHASE_TREE);

            return this.#collectRecursively(startTree, location, this.#collectLinks, this.#links);
        }
        else
            return this.#collectLinks(location);
    }

    /**
     * Adds a new Link to the given location
     * 
     * @param {Link} link
     * @param {string[]} location 
     * @returns {boolean}
     */
    addLink(link, location) {
        const availableLink = c2c_extractors.convertToAvailableLinks([link], location);
        this.#links.push(...availableLink);

        return true;
    }

    /**
     * Updates the Link with the same UID. If the uid can not be found, the operation will be cancelled.
     * 
     * @param {Link} link 
     * @param {string[]} location 
     * @param {string} uid 
     * @returns {boolean}
     */
    updateLink(link, location, uid) {
        const idxLink = this.#links.findIndex(availableLink => availableLink.uid == uid);
        if (idxLink < 0)
            return false;
        
        const availableLink = {
            uid: uid,
            location: location,
            link: link
        };
        this.#links.splice(idxLink, 1, availableLink);

        return true;
    }

    /**
     * Deletes the link with the given UID.
     * 
     * @param {string} uid
     * @returns {boolean}
     */
    deleteLink(uid) {
        const idxLink = this.#links.findIndex(availableLink => availableLink.uid == uid);
        if (idxLink < 0)
            return false;

        this.#links.splice(idxLink, 1);
        
        return true;
    }

    /**
     * Returns all Classification elements (converted stc:Classification) of a given parent element in the STMD, given
     * by a location.
     * 
     * The Classification element, which can occur multiple times inside the parent element, provides a set of 
     * ClassificationEntry elements of an STMD modeling element, provided as Keyword Value Pairs (KWP), the meaning of
     * which is interpreted according to the name of the classification provided in the name attribute. 
     * This approach is used, for example, to provide searchable keywords for content, or to assign and track quality or
     * validation level requirements across the STMD process, or to maintain variant or other classification content 
     * across the process.
     * 
     * The location must be given as an array of all parent elements.
     * 
     * Please note: Classifications inside Resources or ResourceReferences can not be requested with this method.
     * For this purpose, use getResources and explore its child elements
     * 
     * @author localhorst87
     * @example getClassifications(['stmd:SimulationTaskMetaData', 'stmd:RequirementsPhase', 'stmd:VerifyRequirements'])
     * // returns all stc:Classification elements of the stmd:VerifyRequirements step
     * @param {string[]} location the location as array of strings
     * @returns {Classification[]} all Classifications of the given location
     */
    getClassifications(location) {
        location = location.map(elementName => elementName.trim()); // remove possible whitespaces from element names
        let classifications = this.#superClassifications.filter(avilableClassification => avilableClassification.location.toString() == location.toString());

        return classifications.map(avilableClassification => avilableClassification.classification);
    }

    /**
     * Returns all Annotation elements (converted stc:Annotation) of a given parent element in the STMD, given
     * by a location.
     * 
     * The Annotations element is used to add a list of additional free style annotations.
     * 
     * Please note: Annotations inside Resources or ResourceReferences can not be requested with this method.
     * For this purpose, use getResources and explore its child elements.
     * 
     * Please note: The Annotation elements below the Annotations element (stc:Annotations) are returned here, so stc:Annotations 
     * must not be part of the location!
     * 
     * @author localhorst87
     * @example getAnnotations(['stmd:SimulationTaskMetaData', 'stmd:RequirementsPhase', 'stmd:VerifyRequirements'])
     * // 
     * @param {string[]} location the location as array of strings
     * @returns {Annotation[]} all Annotations of the given location
     */
    getAnnotations(location) {
        location = location.map(elementName => elementName.trim()); // remove possible whitespaces from element names
        let annotations = this.#superAnnotations.filter(avilableAnnotation => avilableAnnotation.location.toString() == location.toString());

        return annotations.map(avilableAnnotation => avilableAnnotation.annotation);
    }

    /**
     * Returns all LifeCycleEntry elements as AvailableLifeCycleEntry element of a given parent element in the STMD,
     * given by a location. The location should point to a phase, as only phases contain lifecycle information.
     * 
     * @author localhorst87
     * @param {string[]} location the location as array of strings (should be a phase)
     * @returns {AvailableLifeCycleEntry[]} all AvailableLifeCycleEntry elements of the given location
     */
    getLifeCycleEntries(location) {
        location = location.map(elementName => elementName.trim()); // remove possible whitespaces from element names
        return this.#lifeCycleEntries.filter(availableEntry => availableEntry.location.toString() == location.toString());
    }

    /**
     * Returns the Resource the given ResourceReference is referencing to
     * 
     * @author localhorst87
     * @param {ResourceReference} resourceReference the ResourceReference with the reference to the target Resource
     * @returns {AvailableResource} the target Resource
     */
    getResourceFromReference(resourceReference) {
        const targetId = util.getResourceIdFromHref(resourceReference.attributes.xlink_href);
        const targetResource = this.#resources.filter(availableRes => availableRes.resource.attributes.id == targetId);
    
        if (targetResource.length == 0)
            throw("Resource with id '" + targetId + "' does not exist");
        
        return targetResource[0];
    }

    /**
     * Returns the Resource with the given ID
     * 
     * @author localhorst87
     * @param {string} id the target ID of the Resource
     * @returns {AvailableResource | undefined} the target Resource or undefined if a Resource with the given ID does 
     *                                          not exist
     */
    getResourceFromId(id) {
        return this.#resources
            .find(availableRes => availableRes.resource.attributes.id === id);         
    }

    /**
     * Creates a JSON-LD graph from the given link, using the given vocabulary
     * 
     * @author localhorst87
     * @param {Link} link               a converted XLink, e.g. received by the getLinks method
     * @param {ContextEntry[]} context  context for the named-graph in the shape of key-value-pairs as it is returned by
     *                                  the getVocabulary method (key-value-pairs)
     * @returns {string}                a JSON-LD named graph, as defined in
     *                                  https://www.w3.org/TR/json-ld/#named-graphs
     */
    createGraphFromLink(link, context) {        
        let graph = {
            "@context": { },
            "@graph": [ ]
        };

        for (let arc of link.Arc) {
            let locatorTuple = c2c_extractors.extractLocatorsFromArc(arc, link.Locator);
            for (let startLocator of locatorTuple.start) {
                for (let endLocator of locatorTuple.end) {
                    let startNode = graph_converter.createJsonLdStartNode(arc, startLocator, endLocator);
                    let endNode = graph_converter.createJsonLdEndNode(endLocator);
                    graph = graph_converter.integrateJsonLdNodeIntoGraph(startNode, graph);
                    graph = graph_converter.integrateJsonLdNodeIntoGraph(endNode, graph);
                }
            }
        }

        graph = graph_converter.addContextToGraph(graph, context);
        graph = graph_converter.addTitleToGraph(graph, link);

        return JSON.stringify(graph);
    }
    
    /**
     * Adds the top level information of the STMD file to the private property
     */
    #extractTopLevelInformation() {
        this.#topLevelInformation = p2c_extractors.extractTopLevelInformation(this.#stmdRawParsed[ROOT_ELEMENT_NAME]);
    }

    #extractGeneralInformation() {
        this.#generalInformation = p2c_extractors.extractGeneralInformation(this.#stmdRawParsed[ROOT_ELEMENT_NAME]);
    }
    
    /**
     * Loops through all subelements of the given (sub-)phase tree and triggers the given collect function that is used
     * to collect assets
     * 
     * @param {object} tree the tree to loop recursively
     * @param {string[]} location the current location in the tree
     * @param {Function} collectFcn the triggered function that collects certain assets 
     * @param {any[]} collectSource the list of all elements where to collect the assets from
     * @param {any[]} [collector=[]] the accumulated list of collected assets. Will be an empty array if not given
     *                               explicitely

     * @returns {any[]} the collector accumulated with new data
     */
    #collectRecursively(tree, location, collectFcn, collectSource, collector = []) {
        const newElements = collectFcn(location, collectSource);
        collector.push(...newElements);
        
        let subelements = Object.keys(tree);
        while (subelements.length > 0) {
            let subLocation = subelements.shift();
            this.#collectRecursively(tree[subLocation], [...location, subLocation], collectFcn, collectSource, collector);
        }

        return collector;
    }

    /**
     * Function to collect Resources to be used in #collectRecursively
     * 
     * @param {string[]} resourceLocation 
     * @param {AvailableResource[]} [allResources=this.#resources] 
     * @returns {AvailableResource[]}
     */
    #collectResources(resourceLocation, allResources = this.#resources) {
        // remove possible whitespaces from element names    
        resourceLocation = resourceLocation.map(elementName => elementName.trim());   

        return allResources.filter(res => res.location.toString() == resourceLocation.toString());
    }

    /**
     * Function to collect ResourceReferences to be used in #collectRecursively
     * 
     * @param {string[]} resReferenceLocation 
     * @param {AvailableResourceReference[]} allResReferences 
     * @returns {AvailableResourceReference[]}
     */
    #collectResourceReferences(resReferenceLocation, allResReferences = this.#resourceReferences) {
        // remove possible whitespaces from element names    
        resReferenceLocation = resReferenceLocation.map(elementName => elementName.trim());   

        return allResReferences
            .filter(availableResRef => availableResRef.location.toString() == resReferenceLocation.toString());
    }

    /**
     * Function to collect Links to be used in #collectRecursively
     * 
     * @param {string[]} linkLocation 
     * @param {AvailableLink[]} [allLinks = this.#links] 
     * @returns {AvailableLink[]}
     */
    #collectLinks(linkLocation, allLinks = this.#links) {
        // remove possible whitespaces from element names    
        linkLocation = linkLocation.map(elementName => elementName.trim());

        return allLinks
            .filter(link => link.location.toString() == linkLocation.toString());
    }

    /**
     * Checks if the resource id (not the internal uid!) is already taken
     * 
     * @param {string} id 
     * @returns {boolean}
     */
    #isResourceIdExisting(id) {
        if (id === undefined)
            return false;
        else {
            return this.#resources
                .filter(availRes => availRes.resource.attributes.id !== undefined)
                .filter(availRes => availRes.resource.attributes.id === id)
                .length > 0;
        }
    }

    /**
     * Checks if the resource reference id (not the internal uid!) is already taken
     * 
     * @param {string} id 
     * @returns {boolean}
     */
    #isResourceReferenceIdExisting(id) {
        if (id === undefined)
            return false;
        else {
            return this.#resourceReferences
            .filter(availRef => availRef.resourceReference.attributes.id !== undefined)
            .filter(availRef => availRef.resourceReference.attributes.id === id)
            .length() > 0;
        }
    }

    /**
     * Adds all References and ReferenceResources to the private properties
     */
    #extractAllResourcesAndReferences() {
        let phaseRawParsed, stepRawParsed, lcEntryRawParsed, particleRawParsed, currentLocation;

        // loop through all phases (stmd:AnalysisPhase, stmd:RequirementsPhase, ...)
        const stmdPhaseNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME]);
        for (let phase of stmdPhaseNames) {
            phaseRawParsed = this.#stmdRawParsed[ROOT_ELEMENT_NAME][phase];
            if (phaseRawParsed === undefined) continue;

            // loop through all steps of a phase (stmd:DefineModelRequirements, stmd:DefineParameterRequirements, ...)
            const stmdStepNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME][phase]);
            for (let step of stmdStepNames) {
                stepRawParsed = phaseRawParsed[step];
                if (stepRawParsed === undefined) continue;

                // loop through all particles (stc:Input, stc:Procedure, ...)
                const particleNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME][phase][step]);
                for (let particle of particleNames) {
                    particleRawParsed = stepRawParsed[particle];
                    if (particleRawParsed === undefined) continue;

                    currentLocation = [ROOT_ELEMENT_NAME, phase, step, particle];
                    this.#addResources(particleRawParsed, currentLocation);
                    this.#addResourceReferences(particleRawParsed, currentLocation);
                }

                if (stepRawParsed[LIFECYCLE_PARENT_NAME] === undefined) continue;

                // loop through all LifeCycleEntries (stc:Drafted, stc:Defined, ...)
                for (let lcEntry of LIFECYCLE_ENTRY_NAMES) {
                    lcEntryRawParsed = stepRawParsed[LIFECYCLE_PARENT_NAME][lcEntry];
                    if (lcEntryRawParsed === undefined) continue;
    
                    currentLocation = [ROOT_ELEMENT_NAME, phase, step, LIFECYCLE_PARENT_NAME, lcEntry];
                    this.#addResources(lcEntryRawParsed, currentLocation);
                    this.#addResourceReferences(lcEntryRawParsed, currentLocation);
                }
            }

            if (phaseRawParsed[LIFECYCLE_PARENT_NAME] === undefined) continue;

            // loop through all LifeCycleEntries (stc:Drafted, stc:Defined, ...)
            for (let lcEntry of LIFECYCLE_ENTRY_NAMES) {
                lcEntryRawParsed = phaseRawParsed[LIFECYCLE_PARENT_NAME][lcEntry];
                if (lcEntryRawParsed === undefined) continue;

                currentLocation = [ROOT_ELEMENT_NAME, phase, LIFECYCLE_PARENT_NAME, lcEntry];
                this.#addResources(lcEntryRawParsed, currentLocation);
                this.#addResourceReferences(lcEntryRawParsed, currentLocation);
            }
        }
    }

    /**
     * Adds all Links to the private property
     */
    #extractAllLinks() {
        let phaseRawParsed, stepRawParsed, currentLocation;

        // loop through all phases (stmd:AnalysisPhase, stmd:RequirementsPhase, ...)
        const stmdPhaseNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME]);
        for (let phase of stmdPhaseNames) {
            phaseRawParsed = this.#stmdRawParsed[ROOT_ELEMENT_NAME][phase];
            if (phaseRawParsed === undefined) continue;

            currentLocation = [ROOT_ELEMENT_NAME, phase];
            this.#addLinks(phaseRawParsed, currentLocation);

            // loop through all steps of a phase (stmd:DefineModelRequirements, stmd:DefineParameterRequirements, ...)
            const stmdStepNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME][phase]);
            for (let step of stmdStepNames) {
                stepRawParsed = phaseRawParsed[step];
                if (stepRawParsed === undefined) continue;

                currentLocation = [ROOT_ELEMENT_NAME, phase, step];
                this.#addLinks(stepRawParsed, currentLocation);
            }
        }

        // extract Links from GeneralInformation
        let generalInfoRawParsed = this.#stmdRawParsed[GENERAL_INFORMATION_NAME];
        if (generalInfoRawParsed === undefined) return;

        currentLocation = [ROOT_ELEMENT_NAME, GENERAL_INFORMATION_NAME];
        this.#addLinks(generalInfoRawParsed, currentLocation);
    }

    /**
     * Adds all the Classifications and Annotations in the STMD that are not located below Resources and 
     * ResourceReferences to the private properties
     */
    #extractSuperGElementsCommon() {
        let phaseRawParsed, stepRawParsed, particleRawParsed, lcEntryRawParsed, currentLocation;

        // add possible Classification below root element
        const rootRawParsed = this.#stmdRawParsed[ROOT_ELEMENT_NAME];
        currentLocation = [ROOT_ELEMENT_NAME];
        this.#addClassification(rootRawParsed, currentLocation);
        this.#addAnnotation(rootRawParsed, currentLocation);

        // loop through all Phases (stmd:AnalysisPhase, stmd:RequirementsPhase, ...)
        const stmdPhaseNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME]);
        for (let phase of stmdPhaseNames) {
            phaseRawParsed = this.#stmdRawParsed[ROOT_ELEMENT_NAME][phase];
            if (phaseRawParsed === undefined) continue;

            currentLocation = [ROOT_ELEMENT_NAME, phase];
            this.#addClassification(phaseRawParsed, currentLocation);
            this.#addAnnotation(phaseRawParsed, currentLocation);

            // loop through all Steps of a phase (stmd:DefineModelRequirements, stmd:DefineParameterRequirements, ...)
            const stmdStepNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME][phase]);
            for (let step of stmdStepNames) {
                stepRawParsed = phaseRawParsed[step];
                if (stepRawParsed === undefined) continue;

                currentLocation = [ROOT_ELEMENT_NAME, phase, step];
                this.#addClassification(stepRawParsed, currentLocation);
                this.#addAnnotation(stepRawParsed, currentLocation);

                // loop through all particles (stc:Input, stc:Procedure, ...)
                const particleNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME][phase][step]);
                for (let particle of particleNames) {
                    particleRawParsed = stepRawParsed[particle];
                    if (particleRawParsed === undefined) continue;

                    currentLocation = [ROOT_ELEMENT_NAME, phase, step, particle];
                    this.#addClassification(particleRawParsed, currentLocation);
                    this.#addAnnotation(particleRawParsed, currentLocation);
                }

                if (stepRawParsed[LIFECYCLE_PARENT_NAME] === undefined) continue;

                // loop through all LifeCycleEntries (stc:Drafted, stc:Defined, ...)
                for (let lcEntry of LIFECYCLE_ENTRY_NAMES) {
                    lcEntryRawParsed = stepRawParsed[LIFECYCLE_PARENT_NAME][lcEntry];
                    if (lcEntryRawParsed === undefined) continue;
    
                    currentLocation = [ROOT_ELEMENT_NAME, phase, step, LIFECYCLE_PARENT_NAME, lcEntry];
                    this.#addClassification(lcEntryRawParsed, currentLocation);
                    this.#addAnnotation(lcEntryRawParsed, currentLocation);
                }
            }
        }
    }

    /**
     * Adds LifeCycleEntry elements from all phases to the private property
     */
    #extractLifeCylceInformation() {
        let phaseRawParsed, stepRawParsed, currentLocation;

        const stmdPhaseNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME]);
        for (let phase of stmdPhaseNames) {
            phaseRawParsed = this.#stmdRawParsed[ROOT_ELEMENT_NAME][phase];
            if (phaseRawParsed === undefined) continue;

            currentLocation = [ROOT_ELEMENT_NAME, phase];
            this.#addLifeCycleEntries(phaseRawParsed, currentLocation);

            const stmdStepNames = Object.keys(PHASE_TREE[ROOT_ELEMENT_NAME][phase]);
            for (let step of stmdStepNames) {
                stepRawParsed = this.#stmdRawParsed[ROOT_ELEMENT_NAME][phase][step];
                if (stepRawParsed === undefined) continue;

                currentLocation = [ROOT_ELEMENT_NAME, phase, step];
                this.#addLifeCycleEntries(stepRawParsed, currentLocation);
            }
        }
    }

    /**
     * Adds all available Resources of the given parent element to the private property #resources
     * 
     * @param {object} parentRawParsed raw-parsed parent element 
     * @param {string[]} currentLocation the location, as expected in a AvailableResource type
     */
    #addResources(parentRawParsed, currentLocation) {
        let resources = p2c_extractors.extractResources(parentRawParsed);
        resources = c2c_extractors.convertToAvailableResources(resources, currentLocation);
        this.#resources.push(...resources);
    }

    /**
     * Adds all available ResourceReferences of the given parent element to the private property #resourceReferences
     * 
     * @param {object} parentRawParsed raw-parsed parent element 
     * @param {string[]} currentLocation the location, as expected in a AvailableResourceReference type
     */
    #addResourceReferences(parentRawParsed, currentLocation) {
        let resourceReferences = p2c_extractors.extractResourceReferences(parentRawParsed);
        resourceReferences = c2c_extractors.convertToAvailableResourceReferences(resourceReferences, currentLocation)
        this.#resourceReferences.push(...resourceReferences);
    }

    /**
     * Adds all available Link elements of the given parent element to the private property #links
     * 
     * @param {object} parentRawParsed raw-parsed parent element 
     * @param {string[]} currentLocation the location, as expected in a AvailableLink type
     */
    #addLinks(parentRawParsed, currentLocation) {
        let links = p2c_extractors.extractLinks(parentRawParsed);
        links = c2c_extractors.convertToAvailableLinks(links, currentLocation);
        this.#links.push(...links);
    }

    /**
     * Adds all available super Classification elements of the given parent element to the private property
     * #superClassifications (that is, all Classification elements that can be found in the STMD, without the 
     * Classification elements inside Resources/ResourceReferences and their child elements)
     * 
     * @param {object} parentRawParsed 
     * @param {string[]} currentLocation 
     */
    #addClassification(parentRawParsed, currentLocation) {
        let classifications = p2c_extractors.extractClassification(parentRawParsed); // Classification[]
        classifications = c2c_extractors.convertToAvailableClassifications(classifications, currentLocation);
        this.#superClassifications.push(...classifications);
    }

    /**
     * Adds all available super Annotation elements of the given parent element to the private property
     * #superAnnotations (that is, all Annotation elements that can be found in the STMD, without the Annotation
     * elements inside Resources/ResourceReferences and their child elements)
     * 
     * @param {object} parentRawParsed 
     * @param {string[]} currentLocation 
     */
    #addAnnotation(parentRawParsed, currentLocation) {
        let annotations = p2c_extractors.extractAnnotations(parentRawParsed); // Annotation[]
        annotations = c2c_extractors.convertToAvailableAnnotations(annotations, currentLocation);
        this.#superAnnotations.push(...annotations)
    }

    /**
     * Adds all availabe LifeCycleEntry elements of the given phase to the private property #lifeCycleEntries
     * @param {object} phaseRawParsed 
     * @param {string[]} currentLocation 
     */
    #addLifeCycleEntries(phaseRawParsed, currentLocation) {
         // extract LifeCycleInformationType; e.g. {Drafted: {...}, Validated: {...}, ... }
        let lifeCycleInformation = p2c_extractors.extractLifeCycleInformation(phaseRawParsed);

        // get array of available LifeCycleEntries, e.g. ["Drafted", "Validated"]
        let lifeCycleEntryNames = Object.keys(lifeCycleInformation); 

        for (let entryName of lifeCycleEntryNames) {
            this.#lifeCycleEntries.push({
                location: currentLocation,
                status: entryName,
                lifeCycleEntry: lifeCycleInformation[entryName]
            });
        }
    }
}