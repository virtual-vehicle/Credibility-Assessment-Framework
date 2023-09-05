/**
 * @typedef {import('../types/specification').SimulationTaskMetaDataAttributes} SimulationTaskMetaDataAttributes
 * @typedef {import('../types/specification').GeneralInformationType} GeneralInformationType
 * @typedef {import('../types/specification').DerivationChain} DerivationChain
 * @typedef {import('../types/specification').DerivationChainEntry} DerivationChainEntry
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
 * @typedef {import('../types/specification').ResponsibleType} ResponsibleType
 */

/**
 * @param {SimulationTaskMetaDataAttributes} topLevelInformation
 * @returns {object}
 */
function transformTopLevelInformation(topLevelInformation) {
    return {
        '@_version': topLevelInformation.version,
        '@_name': topLevelInformation.name,
        '@_GUID': topLevelInformation.GUID,
        '@_id': topLevelInformation.id,
        '@_description': topLevelInformation.description,
        '@_author': topLevelInformation.author,
        '@_fileversion': topLevelInformation.fileversion,
        '@_copyright': topLevelInformation.copyright,
        '@_license': topLevelInformation.license,
        '@_generationTool': topLevelInformation.generationTool,
        '@_generationDateAndTime': topLevelInformation.generationDateAndTime
    };
}

/**
 * 
 * @param {GeneralInformationType} generalInformation 
 * @returns {object}
 */
function transformGeneralInformation(generalInformation) {
    return {
        'stc:DerivationChain': generalInformation.DerivationChain !== undefined ? transformDerivationChain(generalInformation.DerivationChain) : undefined,
        'stc:Links': generalInformation.Links !== undefined ? transformLinks(generalInformation.Links) : undefined
    };
}

/**
 * 
 * @param {DerivationChain} derivationChain 
 * @returns {object}
 */
function transformDerivationChain(derivationChain) {
    let derivationChainEntries = [];
    for (let entry of derivationChain.DerivationChainEntry) {
        derivationChainEntries.push(transformDerivationChainEntry(entry))
    }

    return {
        'stc:DerivationChainEntry': derivationChainEntries.length > 0 ? derivationChainEntries : undefined
    };
}

/**
 * 
 * @param {DerivationChainEntry} derivationChainEntry
 * @returns {object}
 */
function transformDerivationChainEntry(derivationChainEntry) {
    return {
        '@_GUID': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.GUID : undefined,
        '@_author': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.author : undefined,
        '@_fileversion': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.fileversion : undefined,
        '@_copyright': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.copyright : undefined,
        '@_license': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.license : undefined,
        '@_generationTool': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.generationTool : undefined,
        '@_generationDateAndTime': derivationChainEntry.attributes !== undefined ? derivationChainEntry.attributes.generationDateAndTime : undefined
    };
}

// /**
//  * 
//  * @param {LifeCycleInformationType} lifeCycleInformation 
//  * @returns {object}
//  */
// function transformLifeCycleInformation(lifeCycleInformation) {
//     return {
//         'stc:Drafted': lifeCycleInformation.Drafted !== undefined ? transformLifeCycleEntry(lifeCycleInformation.Drafted) : undefined,
//         'stc:Defined': lifeCycleInformation.Defined !== undefined ? transformLifeCycleEntry(lifeCycleInformation.Defined) : undefined,
//         'stc:Validated': lifeCycleInformation.Validated !== undefined ? transformLifeCycleEntry(lifeCycleInformation.Validated) : undefined,
//         'stc:Approved': lifeCycleInformation.Validated !== undefined ? transformLifeCycleEntry(lifeCycleInformation.Approved) : undefined,
//         'stc:Archived': lifeCycleInformation.Archived !== undefined ? transformLifeCycleEntry(lifeCycleInformation.Archived) : undefined,
//         'stc:Retraced': lifeCycleInformation.Retracted !== undefined ? transformLifeCycleEntry(lifeCycleInformation.Retracted) : undefined
//     };
// }

/**
 * 
 * @param {LifeCycleEntryType} lifeCycleEntry 
 * @returns {object}
 */
function transformLifeCycleEntry(lifeCycleEntry) {
    let resources = [];
    if (lifeCycleEntry.Resource !== undefined) {
        for (let resource of lifeCycleEntry.Resource) {
            resources.push(transformResource(resource));
        }
    }

    let references = [];
    if (lifeCycleEntry.ResourceReference !== undefined) {
        for (let reference of lifeCycleEntry.ResourceReference) {
            references.push(transformResourceReference(reference));
        }
    }

    return {
        '@_date': lifeCycleEntry.attributes !== undefined ? lifeCycleEntry.attributes.date : undefined,
        '@_checksum': lifeCycleEntry.attributes !== undefined ? lifeCycleEntry.attributes.checksum : undefined,
        '@_checksumType': lifeCycleEntry.attributes !== undefined ? lifeCycleEntry.attributes.checksumType : undefined,
        'stc:Resource': resources.length > 0 ? resources : undefined,
        'stc:ResourceReference': references.length > 0 ? references : undefined,
        'stc:Responsible': transformResponsible(lifeCycleEntry.Responsible),
        'stc:Signature': lifeCycleEntry.Signature !== undefined ? transformSignature(lifeCycleEntry.Signature) : undefined,
        'stc:Annotations': lifeCycleEntry.Annotations !== undefined ? transformAnnotations(lifeCycleEntry.Annotations) : undefined,
        'stc:Classification': lifeCycleEntry.Classification !== undefined ? transformClassification(lifeCycleEntry.Classification) : undefined
    }
}

/**
 * 
 * @param {ResponsibleType} responsible 
 * @returns {object}
 */
function transformResponsible(responsible) {
    return {
        '@_organization': responsible.attributes !== undefined ? responsible.attributes.organization : undefined,
        '@_role': responsible.attributes !== undefined ? responsible.attributes.role : undefined,
        '@_name': responsible.attributes !== undefined ? responsible.attributes.name : undefined
    };
}

/**
 * Transforms a ResourceType into a raw-parsed stc:Resource object
 * 
 * @param {ResourceType} resource tranformed Resource
 * @returns {object} raw-parsed stc:Resource object
 */
function transformResource(resource) {
    let signatures;
    if (resource.Signature !== undefined) {
        signatures = [];
        for (let signature of resource.Signature)
            signatures.push(transformSignature(signature));
    }

    let metaDatas;
    if (resource.MetaData !== undefined) {
        metaDatas = [];
        for (let metaData of resource.MetaData)
            metaDatas.push(transformMetaData(metaData));
    }

    let classifications;
    if (resource.Classification !== undefined) {
        classifications = [];
        for (let classification of resource.Classification)
            classifications.push(transformClassification(classification));
    }
    
    return {
        '@_kind': resource.attributes.kind,
        '@_type': resource.attributes.type, 
        '@_id': resource.attributes.id,
        '@_description': resource.attributes.description,
        '@_master': resource.attributes.master,
        '@_scope': resource.attributes.scope,
        '@_source': resource.attributes.source,
        'stc:Content': resource.Content !== undefined ? transformContent(resource.Content) : undefined,
        'stc:Signature': signatures,
        'stc:MetaData': metaDatas,
        'stc:Summary': resource.Summary !== undefined ? transformSummary(resource.Summary) : undefined,
        'stc:Annotations': resource.Annotations !== undefined ? transformAnnotations(resource.Annotations) : undefined,
        'stc:Classification': classifications
    };
}

/**
 * 
 * @param {ResourceReference} resourceReference 
 * @returns 
 */
function transformResourceReference(resourceReference) {
    let classifications;
    if (resourceReference.Classification !== undefined) {
        classifications = [];
        for (let classification of resourceReference.Classification)
            classifications.push(transformClassification(classification));
    }

    return {
        '@_xlink:type': resourceReference.attributes.xlink_type,
        '@_xlink:href': resourceReference.attributes.xlink_href,
        '@_id': resourceReference.attributes.id,
        '@_description': resourceReference.attributes.description,
        'stc:Classification': classifications,
        'stc:Annotations': resourceReference.Annotations !== undefined ? transformAnnotations(resourceReference.Annotations) : undefined
    };
}

/**
 * 
 * @param {LinksType} links 
 * @returns {object}
 */
function transformLinks(links) {
    let linkRaw = [];
    // links.Link contains at least 1 element
    for (let link of links.Link) {
        linkRaw.push(transformLink(link));
    }

    return {
        'stc:Link': linkRaw
    };
}

/**
 * 
 * @param {Link} link 
 * @returns {object}
 */
function transformLink(link) {
    let locators = [];
    // link.Locator contains at least 2 elements
    for (let locator of link.Locator) {
        locators.push(transformLocator(locator))
    };

    let arcs = [];
    if (link.Arc !== undefined) {
        for (let arc of link.Arc) {
            arcs.push(transformArc(arc))
        }
    }

    return {
        '@_xlink:type': link.attributes !== undefined ? link.attributes.xlink_type : undefined,
        '@_xlink:title': link.attributes !== undefined ? link.attributes.xlink_title : undefined,
        '@_xlink:role': link.attributes !== undefined ? link.attributes.xlink_role : undefined,
        'stc:Locator': locators,
        'stc:Arc': arcs.length > 0 ? arcs : undefined
    };
}

/**
 * 
 * @param {Locator} locator 
 * @returns {object}
 */
function transformLocator(locator) {
    return {
        '@_xlink:type': locator.attributes !== undefined ? locator.attributes.xlink_type : undefined,
        '@_xlink:href': locator.attributes !== undefined ? locator.attributes.xlink_href : undefined,
        '@_xlink:label': locator.attributes !== undefined ? locator.attributes.xlink_label : undefined,
        '@_xlink:title': locator.attributes !== undefined ? locator.attributes.xlink_title : undefined,
        '@_xlink:role': locator.attributes !== undefined ? locator.attributes.xlink_role : undefined
    };
}

/**
 * 
 * @param {Arc} arc 
 * @returns {object}
 */
function transformArc(arc) {
    return {
        '@_xlink:type': arc.attributes !== undefined ? arc.attributes.xlink_type : undefined,
        '@_xlink:from': arc.attributes !== undefined ? arc.attributes.xlink_from : undefined,
        '@_xlink:to': arc.attributes !== undefined ? arc.attributes.xlink_to : undefined,
        '@_xlink:title': arc.attributes !== undefined ? arc.attributes.xlink_title : undefined,
        '@_xlink:arcrole': arc.attributes !== undefined ? arc.attributes.xlink_arcrole : undefined
    }
}

/**
 * Transforms a ContentType into a raw-parsed stc:Content object
 * 
 * @param {ContentType} content 
 * @returns {object}
 */
function transformContent(content) {
    let contentRaw = {};

    if (content.any !== undefined) {
        if (typeof(content.any) === "object") {
            for (let childName of Object.keys(content.any)) {
                contentRaw[childName] = content.any[childName];
            }
        }
        else if (typeof(content.any) === "string") {
            contentRaw["#text"] = content.any;
        }
    }

    return contentRaw;
}

/**
 * 
 * @param {SignatureType} signature 
 * @returns {object}
 */
function transformSignature(signature) {
    let classifications;
    if (signature.Classification !== undefined) {
        classifications = [];
        for (let classification of signature.Classification)
            classifications.push(transformClassification(classification));
    }

    return {
        '@_role': signature.attributes !== undefined ? signature.attributes.role : undefined,
        '@_type': signature.attributes !== undefined ? signature.attributes.type : undefined,
        '@_source': signature.attributes !== undefined ? signature.attributes.source : undefined,
        '@_sourceBase': signature.attributes !== undefined ? signature.attributes.sourceBase : undefined,
        'stc:Content': transformContent(signature.Content),
        'stc:Annotations': transformAnnotations(signature.Annotations),
        'stc:Classification': classifications
    };
}

/**
 * 
 * @param {MetaData} metaData 
 * @returns {object}
 */
function transformMetaData(metaData) {
    let signatures;
    if (metaData.Signature !== undefined) {
        signatures = [];
        for (let signature of metaData.Signature)
            signatures.push(transformSignature(signature));
    }

    let classifications;
    if (metaData.Classification !== undefined) {
        classifications = [];
        for (let classification of metaData.Classification)
            classifications.push(transformClassification(classification));
    }

    return {
        '@_kind': metaData.attributes !== undefined ? metaData.attributes.kind : undefined,
        '@_type': metaData.attributes !== undefined ? metaData.attributes.type : undefined,
        '@_source': metaData.attributes !== undefined ? metaData.attributes.source : undefined,
        '@_sourceBase': metaData.attributes !== undefined ? metaData.attributes.sourceBase : undefined,
        'stc:Content': metaData.Content !== undefined ? transformContent(metaData.Content) : undefined,
        'stc:Signature': signatures,
        'stc:Annotations': metaData.Annotations !== undefined ? transformAnnotations(metaData.Annotations) : undefined,
        'stc:Classification': classifications
    };
}

/**
 * 
 * @param {Summary} summary 
 * @returns {object}
 */
function transformSummary(summary) {
    let signatures;
    if (summary.Signature !== undefined) {
        signatures = [];
        for (let signature of summary.Signature)
            signatures.push(transformSignature(signature));
    }

    let classifications;
    if (summary.Classification !== undefined) {
        classifications = [];
        for (let classification of summary.Classification)
            classifications.push(transformClassification(classification));
    }

    return {
        '@_type': summary.attributes !== undefined ? summary.attributes.type : undefined,
        '@_source': summary.attributes !== undefined ? summary.attributes.source : undefined,
        '@_sourceBase': summary.attributes !== undefined ? summary.attributes.sourceBase : undefined, 
        'stc:Content': summary.Content !== undefined ? transformContent(summary.Content) : undefined,
        'stc:Signature': signatures,
        'stc:Annotations': summary.Annotations !== undefined ? transformAnnotations(summary.Annotations) : undefined,
        'stc:Classification': classifications
    };
}

/**
 * 
 * @param {Annotations} annotations 
 * @returns  {object}
 */
function transformAnnotations(annotations) {
    let annotationsRaw = [];
    // annotations.Annotation contains at least 1 element
    for (let annotation of annotations.Annotation) {
        annotationsRaw.push(transformAnnotation(annotation));
    }

    return {
        'ssc:Annotation': annotationsRaw
    };
}

/**
 * 
 * @param {Annotation} annotation 
 * @returns {object}
 */
function transformAnnotation(annotation) {
    let annotationRaw = {
        '@_type': annotation.attributes.type
    };

    if (annotation.any !== undefined) {
        if (typeof(annotation.any) === "object") {
            for (let childName of Object.keys(annotation.any)) {
                annotationRaw[childName] = annotation.any[childName];
            }
        }
        else if (typeof(annotation.any) === "string") {
            annotationRaw['#text'] = annotation.any;
        }
    }
    
    return annotationRaw;
}

/**
 * 
 * @param {Classification} classification 
 * @returns {object}
 */
function transformClassification(classification) {
    let classificationEntryRaw = [];

    if (classification.ClassificationEntry !== undefined) {
        for (let classificationEntry of classification.ClassificationEntry) {
            classificationEntryRaw.push(transformClassificationEntry(classificationEntry))
        }
    }

    return {
        '@_type': classification.attributes.type,
        'stc:ClassificationEntry': classificationEntryRaw.length > 0 ? classificationEntryRaw : undefined
    };    
}

/**
 * 
 * @param {ClassificationEntry} classificationEntry 
 * @returns {object}
 */
function transformClassificationEntry(classificationEntry) {
    let classificationEntryRaw = {
        '@_keyword': classificationEntry.attributes !== undefined ? classificationEntry.attributes.keyword : undefined,
        '@_xlink:type': classificationEntry.attributes !== undefined ? classificationEntry.attributes.xlink_type : undefined,
        '@_xlink:href': classificationEntry.attributes !== undefined ? classificationEntry.attributes.xlink_href : undefined,
    };

    if (classificationEntry.any !== undefined) {
        if (typeof(classificationEntry.any) === "object") {
            for (let childName of Object.keys(classificationEntry.any)) {
                classificationEntryRaw[childName] = classificationEntry.any[childName];
            }
        }
        else if (typeof(classificationEntry.any === "string")) {
            classificationEntryRaw['#text'] = classificationEntry.any;
        }
    };

    return classificationEntryRaw;
}

exports.transformTopLevelInformation = transformTopLevelInformation;
exports.transformGeneralInformation = transformGeneralInformation;
exports.transformLifeCycleEntry = transformLifeCycleEntry;
exports.transformResource = transformResource;
exports.transformResourceReference = transformResourceReference;
exports.transformLink = transformLink;
exports.transformClassification = transformClassification;
exports.transformAnnotation = transformAnnotation;