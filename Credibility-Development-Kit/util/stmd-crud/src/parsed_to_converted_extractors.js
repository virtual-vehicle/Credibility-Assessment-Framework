const {
    GENERAL_INFORMATION_NAME,
    RESOURCE_NAME,
    RESOUCE_REFERENCE_NAME,
    LINKS_PARENT_NAME,
    CLASSIFICATION_PARENT_NAME,
    ANNOTATIONS_PARENT_NAME,
    LIFECYCLE_PARENT_NAME,
    LIFECYCLE_ENTRY_NAMES } = require('./constants');

/**
 * @typedef {import('../types/specification').SimulationTaskMetaDataAttributes} SimulationTaskMetaDataAttributes
 * @typedef {import('../types/specification').GeneralInformationType} GeneralInformationType
 * @typedef {import('../types/specification').DerivationChain} DerivationChain
 * @typedef {import('../types/specification').DerivationChainEntry} DerivationChainEntry
 * @typedef {import('../types/specification').DerivationChainEntryAttributes} DerivationChainEntryAttributes
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
 * @typedef {import('../types/specification').LifeCycleInformationType} LifeCycleInformationType
 * @typedef {import('../types/specification').LifeCycleEntryType} LifeCycleEntryType
 */

/**
 * Extracts top level information from the STMD root element
 * 
 * @param {object} root 
 * @returns {SimulationTaskMetaDataAttributes} transformed SimulationTaskMetaDataAttributes object
 */
function extractTopLevelInformation(root) {
    return {
        name: root['@_name'],
        version: root['@_version'],
        GUID: root['@_GUID'],
        id: root['@_id'],
        description: root['@_description'],
        author: root['@_author'],
        fileversion: root['@_fileversion'],
        copyright: root['@_copyright'],
        license: root['@_license'],
        generationTool: 'SETLabs STMD Writer',
        generationDateAndTime: (new Date()).toISOString()
    };
}

function extractGeneralInformation(parent) {
    let generalInformation;
    if (parent[GENERAL_INFORMATION_NAME] !== undefined)
        generalInformation = transformGeneralInformation(parent[GENERAL_INFORMATION_NAME]);
    
    return generalInformation;
}

/**
 * Extracts all Classifications from a raw parsed parent element where Classifications are located
 * 
 * @param {object} parent raw parsed parent 
 * @returns {Classification[]} transformed Classification array 
 */
function extractClassification(parent) {
    let classifications = [];
    if (parent[CLASSIFICATION_PARENT_NAME] !== undefined)
        classifications = transformClassification(parent[CLASSIFICATION_PARENT_NAME]);
    
    return classifications;
}

/**
 * Extracts all Annotations from a raw parsed parent element where Annotations are located
 * 
 * @param {object} parent raw parsed parent 
 * @returns {Annotation[]} transformed Annotation array 
 */
function extractAnnotations(parent) {
    let annotations = [];
    if (parent[ANNOTATIONS_PARENT_NAME] !== undefined) {
        let annotationsParent = transformAnnotations(parent[ANNOTATIONS_PARENT_NAME]); // returns Annotations object
        annotations = annotationsParent.Annotation;
    }
    
    return annotations;
}

/**
 * Extracts Resources from a raw parsed parent element where Resources are located (may be a Particle or a 
 * LifeCycleEntry)
 * 
 * @param {object} parent raw parsed parent
 * @returns {ResourceType[]} transformed ResourceType array
 */
function extractResources(parent) {
    let resources = [];
    if (parent[RESOURCE_NAME] !== undefined)
        resources = transformResource(parent[RESOURCE_NAME]);
    
    return resources;
}

/**
 * Extracts ResourceReferences from a raw parsed parent element where ResourceReferences are located (may be a Particle
 * or a LifeCycleEntry)
 * 
 * @param {object} parent raw parsed parent object 
 * @returns {ResourceReference[]} transformed ResourceReference array
 */
function extractResourceReferences(parent) {
    let resourceReferences = [];
    if (parent[RESOUCE_REFERENCE_NAME] !== undefined)
        resourceReferences = transformResourceReference(parent[RESOUCE_REFERENCE_NAME]);
    
    return resourceReferences;
}

/**
 * Extracts all Links from a raw parsed parent element (may be GeneralInformation, a Phase, or a Step)
 * 
 * @param {object} parent raw parsed parent object 
 * @returns {Link[]} transformed Link array
 */
function extractLinks(parent) {
    let links = [];
    if (parent[LINKS_PARENT_NAME] !== undefined) {
        let linksType = transformLinks(parent[LINKS_PARENT_NAME]);
        links = linksType.Link;
    } 
    
    return links;
}

/**
 * Extracts the LifeCycleInformation from a raw parsed parent element (should be a Phase)
 * 
 * @param {object} parent raw parsed parent object (should be a raw parsed phase object)
 * @returns {LifeCycleInformationType} transformed LifeCylceInformation object
 */
function extractLifeCycleInformation(parent) {
    let lifeCycleInformation = {};
    if (parent[LIFECYCLE_PARENT_NAME] !== undefined) {
        for (let lifeCycleEntryName of LIFECYCLE_ENTRY_NAMES) {
            let lifeCycleEntryObject = parent[LIFECYCLE_PARENT_NAME][lifeCycleEntryName];
            if (lifeCycleEntryObject !== undefined) {
                let propertyName = lifeCycleEntryName.slice(4); // e.g.: stc:Draft --> Draft
                lifeCycleInformation[propertyName] = transformLifeCycleEntry(lifeCycleEntryObject);
            }
        }
    }

    return lifeCycleInformation;
}

/**
 * Transforms a raw parsed stmd:GeneralInformation object into a GeneralInformationType object
 * 
 * @param {object} generalInformationObject raw parsed
 * @returns {GeneralInformationType} transformed
 */
function transformGeneralInformation(generalInformationObject) {
    return {
        DerivationChain: generalInformationObject['stc:DerivationChain'] !== undefined ? transformDerivationChain(generalInformationObject['stc:DerivationChain']) : undefined,
        Links: generalInformationObject['stc:Links'] !== undefined ? transformLinks(generalInformationObject['stc:Links']) : undefined
    };
}

/**
 * Transforms a raw parsed stmd:DerivationChain object into a DerivationChain object
 * 
 * @param {object} derivationChainObject raw parsed
 * @returns {DerivationChain} transformed
 */
function transformDerivationChain(derivationChainObject) {
    return {
        DerivationChainEntry: transformDerivationChainEntries(derivationChainObject['stc:DerivationChainEntry'])
    };
}

/**
 * Transforms a raw parsed stc:DerivationChainEntry array into a DerivationChainEntry array
 * 
 * @param {object[]} derivationChainEntryArray raw parsed
 * @returns {DerivationChainEntry[]} transformed
 */
function transformDerivationChainEntries(derivationChainEntryArray) {
    let derivationChainEntries = [];
    for (let derivationChainEntry of derivationChainEntryArray) {
        derivationChainEntries.push({
            attributes: {
                GUID: derivationChainEntry['@_GUID'],
                author: derivationChainEntry['@_author'],
                fileversion: derivationChainEntry['@_fileversion'],
                copyright: derivationChainEntry['@_copyright'],
                license: derivationChainEntry['@_license'],
                generationTool: derivationChainEntry['@_generationTool'],
                generationDateAndTime: derivationChainEntry['@_generationDateAndTime']
            }
        });
    }

    return derivationChainEntries;
}

/**
 * Transforms a raw parsed stc:Links object into a Links array
 * 
 * @param {object} linksObject raw parsed stc:Links object
 * @returns {LinksType} transformed LinksType object
 */
function transformLinks(linksObject) {
    return {
        Link: transformLink(linksObject['stc:Link'])
    };
}

/**
 * Transforms a raw parsed stc:Link array into a Link array
 * 
 * @param {object[]} linkArray raw parsed stc:Link array
 * @returns {Link[]} transformed Link array
 */
function transformLink(linkArray) {
    let links = [];
    for (let linkObject of linkArray) {
        links.push({
            attributes: {
                xlink_type: "extended",
                xlink_title: linkObject['@_xlink:title'],
                xlink_role: linkObject['@_xlink:role']
            },
            Locator: transformLocator(linkObject['stc:Locator']),
            Arc: linkObject['stc:Arc'] !== undefined ? transformArc(linkObject['stc:Arc']) : undefined
        });
    }

    return links;
}

/**
 * Transforms a raw parsed stc:Locator array into a Locator array
 * 
 * @param {object[]} locatorArray raw parsed stc:Locator array
 * @returns {Locator[]} transformed Locator array
 */
function transformLocator(locatorArray) {
    let locators = [];
    for (let locatorObject of locatorArray) {
        locators.push({
            attributes: {
                xlink_type: "locator",
                xlink_href: locatorObject['@_xlink:href'],
                xlink_label: locatorObject['@_xlink:label'],
                xlink_title: locatorObject['@_xlink:title'],
                xlink_role: locatorObject['@_xlink:role']
            }
        });
    }

    return locators;
}

/**
 * Transforms a raw parsed stc:Arc array into a Arc array
 * 
 * @param {object[]} arcArray raw parsed stc:Arc array
 * @returns {Arc[]} transformed Arc array
 */
function transformArc(arcArray) {
    let arcs = [];
    for (let arcObject of arcArray) {
        arcs.push({
            attributes: {
                xlink_type: "arc",
                xlink_from: arcObject['@_xlink:from'],
                xlink_to: arcObject['@_xlink:to'],
                xlink_title: arcObject['@_xlink:title'],
                xlink_arcrole: arcObject['@_xlink:arcrole']
            }
        });
    }

    return arcs;
}

/**
 * Transforms a raw parsed stc:Resource array into a ResourceType array
 * 
 * @param {object[]} resourceArray raw parsed stc:Resource array
 * @returns {ResourceType[]} transformed ResourceType array
 */
function transformResource(resourceArray) {
    let resources = [];
    for (let resourceObject of resourceArray) {
        resources.push({
            attributes: {
                kind: resourceObject['@_kind'],
                type: resourceObject['@_type'],
                description: resourceObject['@_description'],
                id: resourceObject['@_id'],
                master: resourceObject['@_master'],
                scope: resourceObject['@_scope'],
                source: resourceObject['@_source']
            },
            Content: resourceObject['stc:Content'] !== undefined ? transformContent(resourceObject['stc:Content']) : undefined,
            Summary: resourceObject['stc:Summary'] !== undefined ? transformSummary(resourceObject['stc:Summary']) : undefined,
            MetaData: resourceObject['stc:MetaData'] !== undefined ? transformMetaData(resourceObject['stc:MetaData']) : undefined,
            Signature: resourceObject['stc:Signature'] !== undefined ? transformSignature(resourceObject['stc:Signature']) : undefined,
            Classification: resourceObject['stc:Classification'] !== undefined ? transformClassification(resourceObject['stc:Classification']) : undefined,
            Annotations: resourceObject['stc:Annotations'] !== undefined ? transformAnnotations(resourceObject['stc:Annotations']) : undefined
        });
    }

    return resources;
}

/**
 * Transforms a raw parsed stc:ResourceReference array into a ResourceReference array
 * 
 * @param {object[]} resourceReferenceArray raw parsed stc:ResourceReference array
 * @returns {ResourceReference[]} transformed ResourceReference array
 */
function transformResourceReference(resourceReferenceArray) {
    let resourceReferences = [];
    for (let resourceReferenceObject of resourceReferenceArray) {
        resourceReferences.push({
            attributes: {
                xlink_type: "simple",
                xlink_href: resourceReferenceObject['@_xlink:href'],
                id: resourceReferenceObject['@_id'],
                description: resourceReferenceObject['@_description']
            },
            Classification: resourceReferenceObject['stc:Classification'] !== undefined ? transformClassification(resourceReferenceObject['stc:Classification']) : undefined,
            Annotations: resourceReferenceObject['stc:Annotations'] !== undefined ? transformAnnotations(resourceReferenceObject['stc:Annotations']) : undefined            
        });
    }

    return resourceReferences;
}

/**
 * Transforms a raw parsed stc:Content object into a ContentType object
 * 
 * @param {object} contentObject raw parsed stc:Content object
 * @returns {ContentType} transformed ContentType object
 */
function transformContent(contentObject) {
    // no attributes to prune, as Content is not allowed to have attributes
    return {
        any: contentObject
    };
}

/**
 * Transforms a raw parsed stc:Summary object into a Summary object
 * 
 * @param {object} summaryObject raw parsed stc:Summary object
 * @returns {Summary} transformed Summary object
 */
function transformSummary(summaryObject) {
    return {
        Content: summaryObject['stc:Content'] !== undefined ? transformContent(summaryObject['stc:Content']) : undefined,
        Signature: summaryObject['stc:Signature'] !== undefined ? transformSignature(summaryObject['stc:Signature']) : undefined,
        Classification: summaryObject['stc:Classification'] !== undefined ? transformClassification(summaryObject['stc:Classification']) : undefined,
        Annotations: summaryObject['stc:Annotations'] !== undefined ? transformAnnotations(summaryObject['stc:Annotations']) : undefined,
        attributes: {
            type: summaryObject['@_type'],
            source: summaryObject['@_source'],
            sourceBase: summaryObject['@_sourceBase']
        }
    };
}

/**
 * Transforms a raw parsed stc:MetaData array into a MetaData array
 * 
 * @param {object[]} metaDataArray raw parsed stc:MetaData array
 * @returns {MetaData[]} transformed MetaData array
 */
function transformMetaData(metaDataArray) {
    let metaData = [];
    for (let metaDataObject of metaDataArray) {
        metaData.push({
            attributes: {
                kind: metaDataObject['@_kind'],
                type: metaDataObject['@_type'],
                source: metaDataObject['@_source'],
                sourceBase: metaDataObject['@_sourceBase']
            },
            Content: metaDataObject['stc:Content'] !== undefined ? transformContent(metaDataObject['stc:Content']) : undefined,
            Signature: metaDataObject['stc:Signature'] !== undefined ? transformSignature(metaDataObject['stc:Signature']) : undefined,
            Classification: metaDataObject['stc:Classification'] !== undefined ? transformClassification(metaDataObject['stc:Classification']) : undefined,
            Annotations: metaDataObject['stc:Annotations'] !== undefined ? transformAnnotations(metaDataObject['stc:Annotations']) : undefined,
        });
    }

    return metaData;
}

/**
 * Transforms a raw parsed stc:Signature array into a SignatureType array
 * 
 * @param {object[]} signatureArray raw parsed stc:Signature array
 * @returns {SignatureType[]} transformed SignatureType array
 */
function transformSignature(signatureArray) {
    let signature = [];
    for (let signatureObject of signatureArray) {
        signature.push({
            attributes: {
                role: signatureObject['@_role'],
                type: signatureObject['@_type'],
                source: signatureObject['@_source'],
                sourceBase: signatureObject['@_sourceBase'],
            },
            Content: signatureObject['stc:Content'] !== undefined ? transformContent(signatureObject['stc:Content']) : undefined,
            Classification: signatureObject['stc:Classification'] !== undefined ? transformClassification(signatureObject['stc:Classification']) : undefined,
            Annotations: signatureObject['stc:Annotations'] !== undefined ? transformAnnotations(signatureObject['stc:Annotations']) : undefined,
        });
    }

    return signature;
}

/**
* Transforms a raw parsed stc:Classification array into a Classification array
* 
* @param {object[]} classificationArray raw parsed stc:Classification object
* @returns {Classification[]} transformed Classification object
*/
function transformClassification(classificationArray) {
    let classification = [];
    for (let classificationObject of classificationArray) {
        classification.push({
            attributes: {
                type: classificationObject['@_type']
            },
            ClassificationEntry: classificationObject['stc:ClassificationEntry'] !== undefined ? transformClassificationEntry(classificationObject['stc:ClassificationEntry']) : undefined,
        })
    }

    return classification;
}

/**
 * Transforms a raw parsed stc:ClassificationEntry array into a ClassificationEntry array
 * 
 * @param {object[]} classificationEntryArray raw parsed stc:ClassificationEntry array
 * @returns {ClassificationEntry[]} transformed ClassificationEntry array
 */
function transformClassificationEntry(classificationEntryArray) {
    let classificationEntry = [];
    for (let classificationEntryObject of classificationEntryArray) {
        classificationEntry.push({
            attributes: {
                keyword: classificationEntryObject['@_keyword'],
                xlink_type: "simple",
                xlink_href: classificationEntryObject['@_xlink:href']
            },
            any: pruneObject(classificationEntryObject, ['@_keyword', '@_xlink:type', '@_xlink:href'])
        });
    }

    return classificationEntry;
}

/**
* Transforms a raw parsed stc:Annotations object into a Annotations object
* 
* @param {object} annotationsObject raw parsed stc:Annotations object
* @returns {Annotations} transformed Annotations object
*/
function transformAnnotations(annotationsObject) {
    return {
        Annotation: transformAnnotation(annotationsObject['ssc:Annotation'])
    };
}

/**
 * Transforms a raw parsed ssc:Annotation array into an Annotation array
 * 
 * @param {object[]} annotationArray raw parsed ssc:Annotation array
 * @returns {Annotation[]} transformed Annotation array
 */
function transformAnnotation(annotationArray) {
    let annotation = [];
    for (let annotationObject of annotationArray) {
        annotation.push({
            attributes: {
                type: annotationObject['@_type']
            },
            any: pruneObject(annotationObject, ['@_type'])
        });
    }

    return annotation;
}

/**
 * Transforms a raw parsed stc:LifeCycleEntry object into a LifeCycleEntryType object
 * 
 * @param {object} lifeCycleEntryObject raw parsed stc:LifeCycleEntry object
 * @returns {LifeCycleEntryType} transformed LifeCycleEntryType object
 */
function transformLifeCycleEntry(lifeCycleEntryObject) {
    return {
        Responsible: transformResponsible(lifeCycleEntryObject['stc:Responsible']),
        Signature: lifeCycleEntryObject['stc:Signature'] !== undefined ? transformSignature(lifeCycleEntryObject['stc:Signature']) : undefined,
        Resource: lifeCycleEntryObject[RESOURCE_NAME] !== undefined ? transformResource(lifeCycleEntryObject[RESOURCE_NAME]) : undefined,
        ResourceReference: lifeCycleEntryObject[RESOUCE_REFERENCE_NAME] !== undefined ? transformResourceReference(lifeCycleEntryObject[RESOUCE_REFERENCE_NAME]) : undefined,
        Classification: lifeCycleEntryObject['stc:Classification'] !== undefined ? transformClassification(lifeCycleEntryObject['stc:Classification']) : undefined,
        Annotations: lifeCycleEntryObject['stc:Annotations'] !== undefined ? transformAnnotations(lifeCycleEntryObject['stc:Annotations']) : undefined,
        attributes: {
            date: lifeCycleEntryObject['@_date'],
            checksum: lifeCycleEntryObject['@_checksum'],
            checksumType: lifeCycleEntryObject['@_checksumType']
        }
    };
}

/**
 * Transforms a raw parsed stc:Responsible object into a ResponsibleType object
 * 
 * @param {object} responsibleObject raw parsed stc:Responsible object
 * @returns {ResponsibleType} transformed ResponsibleType object
 */
function transformResponsible(responsibleObject) {
    return {
        attributes: {
            organization: responsibleObject['@_organization'],
            role: responsibleObject['@_role'],
            name: responsibleObject['@_name']
        }
    };
}

/**
 * Prunes an object, which means it deletes all the attributes from the object
 * that names are given in keysToDelete
 * 
 * @param {object} objectToPrune 
 * @param {string[]} keysToDelete 
 * @returns {object} the pruned object
 */
function pruneObject(objectToPrune, keysToDelete) {
    let prunedObject = {};

    for (let key of Object.keys(objectToPrune)) {
        if (!keysToDelete.includes(key))
            prunedObject[key] = objectToPrune[key];
    }

    return prunedObject;
}

exports.extractGeneralInformation = extractGeneralInformation;
exports.extractTopLevelInformation = extractTopLevelInformation;
exports.extractResources = extractResources;
exports.extractResourceReferences = extractResourceReferences;
exports.extractLinks = extractLinks;
exports.extractClassification = extractClassification;
exports.extractAnnotations = extractAnnotations;
exports.extractLifeCycleInformation = extractLifeCycleInformation;