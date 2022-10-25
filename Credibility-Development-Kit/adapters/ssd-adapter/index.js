const Types = require("./types/types");
const fs = require('fs');
const helper = require('./src/helper');

const SSD_SPEC_FOLDER = "./types/spec/";
const SSD_SPEC_FILE = "SystemStructureDescription.xsd";

/**
 * @module adapters/ssd-adapter
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 * @typedef {import('./types/types').SystemStructure} SystemStructure
 * @typedef {import('./types/types').SystemElement} SystemElement
 * @typedef {import('./types/types').Connector} Connector
 * @typedef {import('./types/types').Connection} Connection
 */

exports.translate = translate;

/**
* Transforms an SSD into a JSON structure, according to the given elements to extract
* @author   localhorst87
* @param    {String} ssdPath    path of the SSD file to transform
* @return   {String}            returns the transformed and stringified SystemStructure object
*/
function translate(ssdPath) {
    try {
        var ssdString = fs.readFileSync(ssdPath, 'utf8');
    }
    catch (err) {
        return JSON.stringify({error : "Could not open specified SSD file"});
    }

    try {
        var xsdString = fs.readFileSync(SSD_SPEC_FOLDER + SSD_SPEC_FILE, 'utf8');
    }
    catch (err) {
        return JSON.stringify({error : "Could not open specified XSD file"});
    }

    if (!helper.validateXml(ssdString)) {
        return JSON.stringify({error : "Parsing of SSD not possible, due to invalid XML structure"});
    }
    if (!helper.validateSsd(ssdString, xsdString, SSD_SPEC_FOLDER)) {
        return JSON.stringify({error : "Parsing of SSD not possible, due to invalid implementation of the given XSD structure"});   
    }

    // XML and XSD structure is valid. String can be parsed
    let output = {
        elements: [],
        connectors: [],
        connections: [],
    };

    let parsedSsd = helper.parseSsd(ssdString);
    let tElementList = helper.extractTElements(parsedSsd);

    for (let tElement of tElementList) {
        let connectors = helper.extractConnectors(tElement); // will output an array
        output.connectors = output.connectors.concat(connectors);

        if (tElement.type == "System") { // only Systems contain connections
            let connections = helper.extractConnections(tElement); // will output an array
            output.connections = output.connections.concat(connections); 
        }

        delete tElement.tree; // we don't want to output the SSD tree structure, as this is a specific of SSD
        output.elements.push(tElement);
    }

    return JSON.stringify(output);
}