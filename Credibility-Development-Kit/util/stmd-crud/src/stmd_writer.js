const c2p_extractors = require('./converted_to_parsed_extractors');
const { STMD_TREE,
        ROOT_ELEMENT_NAME,
        GENERAL_INFORMATION_NAME,
        LINKS_PARENT_NAME,
        RESOURCE_NAME,
        RESOUCE_REFERENCE_NAME, 
        ANNOTATIONS_PARENT_NAME,
        CLASSIFICATION_PARENT_NAME,
        LIFECYCLE_PARENT_NAME} = require('./constants');
const parser = require('./parser');

/**
 * @typedef {import('../types/specification').SimulationTaskMetaDataAttributes} SimulationTaskMetaDataAttributes
 * @typedef {import('../types/specification').GeneralInformationType} GeneralInformationType
 * @typedef {import('../types/internal_types').AvailableResource} AvailableResource
 * @typedef {import('../types/internal_types').AvailableResourceReference} AvailableResourceReference
 * @typedef {import('../types/internal_types').AvailableLink} AvailableLink
 * @typedef {import('../types/internal_types').AvailableClassification} AvailableClassification
 * @typedef {import('../types/internal_types').AvailableAnnotation} AvailableAnnotation 
 * @typedef {import('../types/internal_types').AvailableLifeCycleEntry} AvailableLifeCycleEntry 
 */

exports.StmdWriter = class StmdWriter {
    /**
     * The generated object for usage in XML builder from fast-xml-parser
     * 
     * @private 
     * @type {object}
     */
    #stmdObject;

    /**
     * Top-level information to be temporally stored and appended after calling the sorting function (otherwise it gets
     * lost!)
     * 
     * @private 
     * @type {object}
     */
    #topLevelInformationXmlObject;

    constructor() {
        this.#init();
    }

    /**
     * 
     */
    #init() {
        this.#stmdObject = {
            '?xml': {
                '@_version': '1.0',
                '@_encoding': 'UTF-8'
            }
        }
        this.#stmdObject[ROOT_ELEMENT_NAME] = {};
    }


    /**
     * 
     * @returns {string}
     */
    export() {
        var sortedStmdObject = {};
        this.#sortStmdObject(this.#stmdObject, sortedStmdObject, STMD_TREE);
        sortedStmdObject = this.#addNamespaceAttributes(sortedStmdObject);
        sortedStmdObject[ROOT_ELEMENT_NAME] = {...sortedStmdObject[ROOT_ELEMENT_NAME], ...this.#topLevelInformationXmlObject};

        return parser.writeSTMD(sortedStmdObject);
    }
    
    /**
     * 
     * @param {SimulationTaskMetaDataAttributes} topLevelInformation 
     */
    setTopLevelInformation(topLevelInformation) {
        this.#topLevelInformationXmlObject = c2p_extractors.transformTopLevelInformation(topLevelInformation);
    };

    /**
     * 
     * @param {GeneralInformationType} generalInformation 
     */
    setGeneralInformation(generalInformation) {
        this.#stmdObject[ROOT_ELEMENT_NAME][GENERAL_INFORMATION_NAME] = c2p_extractors.transformGeneralInformation(generalInformation);
    }

    /**
     * 
     * @param {AvailableResource[]} availableResources 
     */
    addResources(availableResources) {
        for (let availableResource of availableResources) {
            let xmlObject = c2p_extractors.transformResource(availableResource.resource);
            let location = [...availableResource.location];
            this.#addXmlObject(xmlObject, location, RESOURCE_NAME);
        }
    }

    /**
     * 
     * @param {AvailableResourceReference[]} availableResourceReferences 
     */
    addResourceReferences(availableResourceReferences) {
        for (let availableReference of availableResourceReferences) {
            let xmlObject = c2p_extractors.transformResourceReference(availableReference.resourceReference);
            let location = [...availableReference.location];
            this.#addXmlObject(xmlObject, location, RESOUCE_REFERENCE_NAME);
        }  
    }

    /**
     * 
     * @param {AvailableLink[]} availableLinks 
     */
    addLinks(availableLinks) {
        for (let availableLink of availableLinks) {
            let xmlObject = c2p_extractors.transformLink(availableLink.link);
            let location = [...availableLink.location, LINKS_PARENT_NAME];
            this.#addXmlObject(xmlObject, location, 'stc:Link');
        }
    }

    /**
     * 
     * @param {AvailableAnnotation[]} availableAnnotations 
     */
    addSuperAnnotations(availableAnnotations) {
        for (let availableAnnotation of availableAnnotations) {
            let xmlObject = c2p_extractors.transformAnnotation(availableAnnotation.annotation);
            let location = [...availableAnnotation.location, ANNOTATIONS_PARENT_NAME];
            this.#addXmlObject(xmlObject, location, 'ssc:Annotation');
        }
    }

    /**
     * 
     * @param {AvailableClassification[]} availableClassifications 
     */
    addSuperClassifications(availableClassifications) {
        for (let availableClassification of availableClassifications) {
            let xmlObject = c2p_extractors.transformClassification(availableClassification.classification);
            let location = [...availableClassification.location];
            this.#addXmlObject(xmlObject, location, CLASSIFICATION_PARENT_NAME);
        }
    }

    /**
     * 
     * @param {AvailableLifeCycleEntry[]} availableLifeCycleEntries 
     */
    addLifeCycleInformation(availableLifeCycleEntries) {
        for (let availableLifeCycleEntry of availableLifeCycleEntries) {
            let xmlObject = c2p_extractors.transformLifeCycleEntry(availableLifeCycleEntry.lifeCycleEntry);
            let location = [...availableLifeCycleEntry.location, LIFECYCLE_PARENT_NAME];
            let lcIdentifier = 'stc:' + availableLifeCycleEntry.status;
            this.#addXmlObject(xmlObject, location, lcIdentifier);
        }
    }

    /**
     * Adds the namespace information to the root element
     * 
     * @param {object} stmdObject 
     * @returns {object}
     */
    #addNamespaceAttributes(stmdObject) {
        stmdObject[ROOT_ELEMENT_NAME]['@_xmlns:stmd'] = 'http://apps.pmsf.net/STMD/SimulationTaskMetaData';
        stmdObject[ROOT_ELEMENT_NAME]['@_xmlns:stc'] = 'http://apps.pmsf.net/SSPTraceability/SSPTraceabilityCommon';
        stmdObject[ROOT_ELEMENT_NAME]['@_xmlns:ssc'] = 'http://ssp-standard.org/SSP1/SystemStructureCommon';
        stmdObject[ROOT_ELEMENT_NAME]['@_xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
        stmdObject[ROOT_ELEMENT_NAME]['@_xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance';
        stmdObject[ROOT_ELEMENT_NAME]['@_xsi:schemaLocation'] = 'http://apps.pmsf.net/STMD/SimulationTaskMetaData https://raw.githubusercontent.com/PMSFIT/SSPTraceability/v1.0-beta2/STMD.xsd';
        
        return stmdObject;
    }

    /**
     * 
     * @param {object} element
     * @param {string[]} location 
     * @param {string} elementIdentifier
     */
    #addXmlObject(xmlObject, location, elementIdentifier) {
        let stmdObjectReference = this.#stmdObject;

        while(location.length > 0) {
            let propertyName = location.shift();
            if (stmdObjectReference[propertyName] === undefined)
                stmdObjectReference[propertyName] = {};
            
            // once final child property is reached, add the element
            if (location.length == 0) {
                if (stmdObjectReference[propertyName][elementIdentifier] === undefined)
                    stmdObjectReference[propertyName][elementIdentifier] = [];
                
                stmdObjectReference[propertyName][elementIdentifier].push(xmlObject);
            }
            
            stmdObjectReference = stmdObjectReference[propertyName];
        }
    }

    #sortStmdObject(unsortedObject, sortedObject, targetTree, treeElementList = []) {
        let childElements = Object.keys(targetTree);
        
        while (childElements.length > 0) {
            let childElement = childElements.shift();
            
            if (unsortedObject[childElement] !== undefined) {
                if (Object.keys(targetTree[childElement]).length == 0) 
                    sortedObject[childElement] = unsortedObject[childElement];
                
                else 
                    sortedObject[childElement] = {};

                this.#sortStmdObject(unsortedObject[childElement], sortedObject[childElement], targetTree[childElement], [...treeElementList, childElement])
            }
        }
        
        return sortedObject;
    }
}