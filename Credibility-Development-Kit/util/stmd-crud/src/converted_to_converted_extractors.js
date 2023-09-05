const util = require('./util');

/**
 * @typedef {import('../types/specification').ResourceType} ResourceType
 * @typedef {import('../types/specification').ResourceTypeAttributes} ResourceTypeAttributes
 * @typedef {import('../types/specification').ResourceReference} ResourceReference
 * @typedef {import('../types/specification').ResourceReferenceAttributes} ResourceReferenceAttributes
 * @typedef {import('../types/specification').Classification} Classification
 * @typedef {import('../types/specification').ClassificationEntry} ClassificationEntry
 * @typedef {import('../types/specification').Annotations} Annotations
 * @typedef {import('../types/specification').Annotation} Annotation
 * @typedef {import('../types/specification').LinksType} LinksType
 * @typedef {import('../types/specification').Link} Link
 * @typedef {import('../types/specification').Locator} Locator
 * @typedef {import('../types/specification').Arc} Arc
 * @typedef {import('../types/internal_types').AvailableLink} AvailableLink
 * @typedef {import('../types/internal_types').AvailableResource} AvailableResource
 * @typedef {import('../types/internal_types').AvailableResourceReference} AvailableResourceReference
 * @typedef {import('../types/internal_types').AvailableClassification} AvailableClassification
 */

/**
 * Extracts all corresponding locators from an Arc
 * 
 * @param {Arc} arc 
 * @param {Locator[]} locators 
 * @returns {object} start and end locators
 */
function extractLocatorsFromArc(arc, locators) {
    let startLocators, endLocators;

    let startLocatorLabel = arc.attributes.xlink_from;
    let endLocatorLabel = arc.attributes.xlink_to;

    if (startLocatorLabel === undefined) {
        // according to https://www.w3.org/TR/xlink11/#xlink-arcs
        // If no value is supplied for a from or to attribute, the missing value is interpreted as standing for
        // all the labels supplied on locator-type elements in that extended-type element.
        startLocators = locators;
        // at least two locators must be present to fulfill the XSD. So no need to check for empty array here
    }
    else {
        // may be more than one, as a Locator label doesn't necessarily need to be unique,
        // according to https://www.w3.org/TR/xlink11/#xlink-arcs
        startLocators = locators.filter(locator => locator.attributes.xlink_label == arc.attributes.xlink_from);
        if (startLocators.length == 0)
            throw("Invalid Link: Locator with label " + arc.attributes.xlink_from + " is not existing!")
    }

    if (endLocatorLabel === undefined) {
        // same rules apply to end locators as for start locators (see above)
        endLocators = locators;
    }
    else {
        // same rules apply to end locators as for start locators (see above)
        endLocators = locators.filter(locator => locator.attributes.xlink_label == arc.attributes.xlink_to);
        if (endLocators.length == 0)
            throw("Invalid Link: Locator with label " + arc.attributes.xlink_to + " is not existing!")
    }

    return {
        start: startLocators,
        end: endLocators
    };
}

/**
 * Convert Resource array to AvailableResource array, based on the given location 
 * 
 * @param {ResourceType[]} resources 
 * @param {string[]} location 
 * @returns {AvailableResource[]}
 */
function convertToAvailableResources(resources, location) {
    return resources.map(res => {
        return {
            uid: util.generateRandomId(),
            location: location,
            resource: res
        }                        
    });
}

/**
 * Convert ResourceReference array to AvailableResourceReference array, based on the given location 
 * 
 * @param {ResourceReference[]} resourceReferences 
 * @param {string[]} location 
 * @returns {AvailableResourceReference[]}
 */
function convertToAvailableResourceReferences(resourceReferences, location) {
    return resourceReferences.map(resRef => {
        return {
            uid: util.generateRandomId(),
            location: location,
            resourceReference: resRef
        }                        
    });
}

/**
 * Converts a Link array to an AvailableLink array, based on the given location
 * 
 * @param {Link[]} links 
 * @param {string[]} location 
 * @returns {AvailableLink[]}
 */
function convertToAvailableLinks(links, location) {
    return links.map(link => {
        return {
            uid: util.generateRandomId(),
            location: location,
            link: link
        }
    });
}

/**
 * Converts a Classification array into an AvailableClassification array, based on the given location
 * 
 * @param {Classification[]} classifications 
 * @param {string[]} location 
 * @returns {AvailableClassification[]}
 */
function convertToAvailableClassifications(classifications, location) {
    return classifications.map(classification => {
        return {
            uid: util.generateRandomId(),
            location: location,
            classification: classification
        }
    });
}

/**
 * Converts an Annotation array into an AvailableAnnotation array, based on the given location
 * @param {Annotation[]} annotations 
 * @param {string[]} location 
 * @returns {AvailableAnnotation[]}
 */
function convertToAvailableAnnotations(annotations, location) {
    return annotations.map(annotation => {
        return {
            uid: util.generateRandomId(),
            location: location,
            annotation: annotation
        }
    });
}

exports.extractLocatorsFromArc = extractLocatorsFromArc;
exports.convertToAvailableResources = convertToAvailableResources;
exports.convertToAvailableResourceReferences = convertToAvailableResourceReferences;
exports.convertToAvailableLinks = convertToAvailableLinks;
exports.convertToAvailableClassifications = convertToAvailableClassifications;
exports.convertToAvailableAnnotations = convertToAvailableAnnotations;