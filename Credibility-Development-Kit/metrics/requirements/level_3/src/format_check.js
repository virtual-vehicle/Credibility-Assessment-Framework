const util = require("../../../../util/util-common");

exports.formatCheck = formatCheck;
const SPEC_FILE = "./specification/reqif.xsd"

/**
 * Validate an ReqIF XML (at the string form) against XSD and also check required attribute list
 *
 * @author   lvtan3005
 * @param    {String} requirement           raw string of ReqIF (2.0.x) ModelDescription
 * @param    {String} [attributesToCheck]   stringified array of required attributes in the model file
 * @return   {ResultLog}                    returns true/false upon valid/invalid signature
*/
function formatCheck(requirement, attributesToCheck = '[]') {
    if (!util.validateXML(requirement)) {
        return {
            log : "The requirement does not implement the given ReqIF schema correctly, due to invalid XML structure",
            result : false
        };
    }

    if (!util.validateXMLAgainstXSD(requirement, SPEC_FILE)) {
        return {
            log : "Parsing of Model Description not possible, due to invalid implementation according to the given XSD specification",
            result : false
        };
    }

    try {
        attributesToCheck = JSON.parse(namedGraph);
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse the attribute list (" + err + ")"
        };
    }

    if (attributesToCheck.length > 0) {
        var ckAttr = checkAttributesInModel(requirement, attributesToCheck);
        if (ckAttr.result == false) {
            return ckAttr
        } else {
            return {
                result : true,
                log : "The requirement fulfills the given ReqIF schema. (All required attributes are contained in the requirement)"
            }
        }
    }

    return {
        result : true,
        log : "The requirement fulfills the given ReqIF schema"
    }
}


/**
 * Check whether the required attributes in the ReqIF model
 *
 * @author   lvtan3005
 * @param    {String} modelDescString           raw string of ReqIF (2.0.x) ModelDescription
 * @param    {Array}  attributesToCheck         list of required attributes in the model file
 * @return   {ResultLog}                        returns true/false upon valid/invalid signature
*/

function checkAttributesInModel(modelDescString, attributesToCheck) {
    var model = util.parseXMLToJson(modelDescString);
    
    var attrDefifitions = model["REQ-IF"]["CORE-CONTENT"]["REQ-IF-CONTENT"]["SPEC-TYPES"]["SPEC-OBJECT-TYPE"]["SPEC-ATTRIBUTES"];
    var columnList = [];

    for (var ad in attrDefifitions) {
        if (attrDefifitions[ad][0]) {
            for (var sai in attrDefifitions[ad]) {
                columnList.push(attrDefifitions[ad][sai]["@_LONG-NAME"])
            }
        } else {
            columnList.push(attrDefifitions[ad]["@_LONG-NAME"])
        }
    }
    
    for (var ai in attributesToCheck) {
        if (!columnList.includes(attributesToCheck[ai])) {
            return {
                result : false,
                log : "The requirement is missing at least one required attribute, please check " + attributesToCheck[ai] 
            }
        };
    }

    return {
        result : true
    }
}