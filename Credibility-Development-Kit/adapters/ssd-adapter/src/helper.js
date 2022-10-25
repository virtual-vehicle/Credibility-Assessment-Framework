const Types = require("../types/types");
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const xsdValidator = require('libxmljs2-xsd');

exports.validateXml = validateXml;
exports.validateSsd = validateSsd;
exports.parseSsd = parseSsd;
exports.extractTElements = extractTElements;
exports.validateXml = validateXml;
exports.extractConnectors = extractConnectors;
exports.extractConnections = extractConnections;
exports.extractConnectorType = extractConnectorType;

/**
 * @typedef {import('../types/types').SystemStructure} SystemStructure
 * @typedef {import('../types/types').SystemElement} SystemElement
 * @typedef {import('../types/types').Connector} Connector
 * @typedef {import('../types/types').Connection} Connection
 */

/**
* Checks if the XML structure of the given XML string is valid
* @author   localhorst87
* @param    {String} xmlString  XML as plain text
* @return   {Boolean}           returns true/false upon valid/invalid XML format
*/
function validateXml(xmlString) {
    const validationOptions = {
        allowBooleanAttributes: true
    };
    const validationResult = XMLValidator.validate(xmlString, validationOptions);

    return validationResult == true;
}

/**
* Checks if the SSD file fulfills the given XSD scheme
* @author   localhorst87
* @param    {String} ssdString      XML-validated SSD as plain text
* @param    {String} xsdString      XSD scheme as plain text
* @param    {String} basePath       The path of the folder where the XSD files are located
* @return   {Boolean}               returns true/false upon valid/invalid scheme
*/
function validateSsd(ssdString, xsdString, basePath) {
    let parsedXsd = xsdValidator.parse(xsdString, {baseUrl: basePath});
    let validationErrors = parsedXsd.validate(ssdString);
    
    return validationErrors == null;
}

/**
* Parses an SSD and returns a JSON translation of the SSD file,
* according to the logic of the fast-xml-parser library
* @author   localhorst87
* @param    {String} ssdString      validated SSD as plain text
* @return   {String}                SSD in JSON format
*/
function parseSsd(ssdString) {
    const parserOptions = {
        ignoreAttributes : false,
        isArray: (tagName, tagValue) => {
            if(tagName == 'ssd:Connector' || tagName == 'ssd:Connection' || tagName == 'ssd:Component' || tagName == 'ssd:SignalDictionaryReference' || tagName == 'ssd:System') return true;
            else return false;
        }
    };
    const xmlParser = new XMLParser(parserOptions);
    return xmlParser.parse(ssdString);
}

/**
* Recursively extracting all TElements (System, Components and SignalDictionaryReference) of the parsed SSD and returns
* them as object array with the following properties:
*   name: The specified name of the Element. It name is unique within the directly enclosing parent system
*   type: Will be "System", "Component" or "SignalDictionaryReference"
*   tree: The underlying object structure
*   subsystem: The pedigree of the enclosing parent systems. Will be [] if the system is on the highest layer
* @author   localhorst87
* @param    {Object} parsedSsd  the parsed SSD
* @return   {TElementInfo[]}    an array of all TElementInfo objects
*/
function extractTElements(parsedSsd) {
    let tElementList = []; // array to return
    let tElementsTemp = []; // temp array for recursive loop

    const rootSystem = parsedSsd['ssd:SystemStructureDescription']['ssd:System'][0]; // root system availability is enforced via the XSD
    tElementsTemp.push({
        name: rootSystem['@_name'], // availability of @_name is enforced via XSD
        type: "System",
        source: "",
        tree: rootSystem,
        subsystem: [],
    });

    while (tElementsTemp.length > 0) {
        let currentTElement = tElementsTemp.shift();
        tElementList.push(currentTElement);

        let elementTagsAndAttr = Object.keys(currentTElement.tree);
        if (!elementTagsAndAttr.includes('ssd:Elements')) continue; // no child elements to append, go to next iteration

        let availableTElementTypes = Object.keys(currentTElement.tree['ssd:Elements']); // "System" and/or "Component"

        for (let tElementType of availableTElementTypes) { 
            let subTElementTrees = currentTElement.tree['ssd:Elements'][tElementType]; // all Systems and/or Components as array

            for (let subTree of subTElementTrees) {
                let currentPedigree = [...currentTElement.subsystem];
                currentPedigree.push(currentTElement.tree['@_name']);
                
                tElementsTemp.push({
                    name: subTree['@_name'],
                    type: tElementType.slice(4), // slice function removes 'ssd:'
                    source: subTree['@_source'] ? subTree['@_source'] : "",
                    tree: subTree,
                    subsystem: currentPedigree,
                });
            }
        }
    }

    return tElementList;
}

/**
* Extracting the connectors of a TElement and returns an array of the connectors as a Connector type
* @author   localhorst87
* @param    {TElementInfo} tElement         the extracted TElementInfo from the parsed SSD
* @return   {Connector[]}                   an array of all connectors of this TElement
*/
function extractConnectors(tElementInfo) {
    let extractedConnectors = [];

    let tElementTagsAndAttr = Object.keys(tElementInfo.tree)
    if (!tElementTagsAndAttr.includes('ssd:Connectors')) return extractedConnectors; // Connectors not available

    let connectorList = tElementInfo.tree['ssd:Connectors']['ssd:Connector'];
    for (let connector of connectorList) {
        extractedConnectors.push({
            "subsystem": tElementInfo.subsystem,
            "element": tElementInfo.name,
            "name": connector['@_name'],
            "kind": connector['@_kind'],
            "type": extractConnectorType(connector)
        });
    }

    return extractedConnectors;
}

/**
* Extracting the connections (=wiring) between all components and returns an array of the connections as a Connection type
* @author   localhorst87
* @param    {TElementInfo} tElement     The extracted TElementInfo from the parsed SSD
* @return   {Connection[]}              An array of all connections
*/
function extractConnections(tElement) {
    let extractedConnections = [];

    let systemTags = Object.keys(tElement.tree);
    if (!systemTags.includes('ssd:Connections')) return extractedConnections; // Connections not available

    const connectionList = tElement.tree['ssd:Connections']['ssd:Connection'];
    for (let connection of connectionList) {    

        // let connectionTagsAndAttr = Object.keys(connection);

        // // start and end element are optional. If not given, the system is the start/end element
        // let elementStart, elementEnd; 
        // if (!connectionTagsAndAttr.includes('@_startElement')) elementStart = ""; // in this case the startElement is the System itself
        // else elementStart = connection['@_startElement'];
        // if (!connectionTagsAndAttr.includes('@_endElement')) elementEnd = ""; // in this case the endElement is the System itself
        // else elementEnd = connection['@_endElement'];

        let subsystem = [...tElement.subsystem];
        subsystem.push(tElement.name); 
        
        extractedConnections.push({
            "subsystem": subsystem,
            "element_start": connection['@_startElement'] ? connection['@_startElement'] : "",
            "name_start": connection['@_startConnector'],
            "element_end": connection['@_endElement'] ? connection['@_endElement'] : "",
            "name_end": connection['@_endConnector']
        });
    }

    return extractedConnections;
}

/**
* Helper function to extract the data type of a Connector. Return "undefined_type" if 
* no GTypeChoice is available
* @author   localhorst87
* @param    {Object} parsedConnector    the parsed Connector SSD structure
* @return   {String}                    the identified data type
*/
function extractConnectorType(parsedConnector) {
    let tagsAndAttrNames = Object.keys(parsedConnector);
    let type = "undefined_type";

    tagsAndAttrNames.forEach(name => {
        // GTypeChoice is the only tag that begins with "ssc:" inside "Connector"
        if (name.startsWith("ssc:")) {
            type = name.slice(4);
        }
    })

    return type;
}