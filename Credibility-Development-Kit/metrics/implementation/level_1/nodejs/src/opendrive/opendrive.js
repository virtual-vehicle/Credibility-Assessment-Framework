const util = require("util-common");

/**
 * @typedef {import('../types/types').ResultLog} ResultLog
 */

/**
 * @param {string} opendrive 
 * @param {string} xsdSchemaPath
 * @returns {ResultLog}
 */
function checkOpenDriveSyntax(opendrive, xsdSchemaPath) {
    if (typeof(opendrive) != "string") {
        return {
            result: false,
            log: "OpenDRIVE file needs to be given as string"
        };
    }

    if (util.validateXML(opendrive) === false) {
        return {
            result: false,
            log: "XML Syntax of OpenDRIVE file is corrupt"
        };
    }

    if (util.validateXMLAgainstXSD(opendrive, xsdSchemaPath) == false) {
        return {
            result: false,
            log: "OpenDRIVE file does not fulfill its given XSD schema"
        };
    }

    return {
        result: true,
        log: "The OpenDRIVE file syntax is valid"
    };
}

exports.checkOpenDriveSyntax = checkOpenDriveSyntax;