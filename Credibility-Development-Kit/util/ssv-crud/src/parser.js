const { XMLParser, XMLBuilder } = require("fast-xml-parser");

/**
 * @param {string} ssvString 
 * @returns {object}
 */
function parseSSV(ssvString) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (tagName, _) => {
            if(tagName == 'ssv:Parameter' ||
                tagName == 'ssc:Item' ||
                tagName == 'ssc:Unit' ||
                tagName == 'ssc:Annotation') return true;
            else return false;
        }
    };
    const parser = new XMLParser(options);

    return parser.parse(ssvString);
}

/**
 * @param {object} ssvObject 
 * @returns {string}
 */
function writeSSV(ssvObject) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        suppressUnpairedNode: false,
        unpairedTags: [
            "ssv:Real",
            "ssv:Integer",
            "ssv:Boolean",
            "ssv:String",
            "ssv:Enumeration",
            "ssv:Binary",
            "ssc:BaseUnit",
            "ssc:Annotation"]
    };
    const writer = new XMLBuilder(options);

    return writer.build(ssvObject);
}

exports.parseSSV = parseSSV;
exports.writeSSV = writeSSV;