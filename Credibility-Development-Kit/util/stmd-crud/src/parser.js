const { XMLParser, XMLBuilder } = require("fast-xml-parser");

/**
 * 
 * @param {string} stmdString 
 * @returns {object}
 */
function parseSTMD(stmdString) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (tagName, _) => {
            if(tagName == 'stc:Resource' || 
                tagName == 'stc:ResourceReference' || 
                tagName == 'stc:Signature' || 
                tagName == 'stc:MetaData' || 
                tagName == 'stc:Classification' ||
                tagName == 'ssc:Annotation' ||
                tagName == 'stc:ClassificationEntry' || 
                tagName == 'stc:Link' ||
                tagName == 'stc:Arc' ||
                tagName == 'stc:DerivationChainEntry') return true;
            else return false;
        }
    };
    const parser = new XMLParser(options);

    return parser.parse(stmdString);
}

/**
 * 
 * @param {object} stmdObject 
 * @returns {string}
 */
function writeSTMD(stmdObject) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        suppressUnpairedNode: false,
        unpairedTags: [
            "stc:Resource",
            "stc:ResourceReference",
            "stc:DerivationChainEntry",
            "stc:Classification",
            "stc:ClassificationEntry",
            "ssc:Annotation",
            "stc:Locator",
            "stc:Arc",
            "stc:Responsible",
            "stc:Signature",
            "stc:MetaData",
            "stc:Summary"]
    };
    const writer = new XMLBuilder(options);

    return writer.build(stmdObject);
}

exports.parseSTMD = parseSTMD;
exports.writeSTMD = writeSTMD;