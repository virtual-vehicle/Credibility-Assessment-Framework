const Types = require("./types/types");
const schemas = require("./types/schemas");
const verisign = require("../../../../util/veri-sign");
const util = require("../../../../util/util-common");
const system_structure_helpers = require("./src/system_structure_helpers");

/**
 * @module metrics/implementation/models/level_1
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

exports.verifyExpertStatement = verifyExpertStatement;
exports.verifySystemStructure = verifySystemStructure;

/**
 * Checks if the given document has been signed by the expert that is identified by the given X509 certificate
 *
 * @author   localhorst87
 * @param    {String} signedDocument            stringified JSON containing the following properties: content, signature, 
 *                                              hash_algorithm, signature_encoding. 
 *                                              Can be created using sign from util/veri-sign.
 * @param    {String|Buffer} x509Certificate    PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected,
 *                                              if DER is used, a Buffer is expected
 * @return   {ResultLog}                        returns true/false upon valid/invalid signature
*/
function verifyExpertStatement(signedDocument, x509Certificate) {
    // Valid signedDocument type and structure is checked within util/veri-sign/verify.
    // Certificate validity is checked within util/veri-sign/verify as well

    const verification = verisign.verify(signedDocument, x509Certificate);

    if (verification.result == true) {
        return {
            result: true,
            log: "The expert statement has been proven valid" 
        };
    }
    else {
        return {
            result: false, 
            log: "The expert statement could not be proven valid (" + verification.log + ")"
        }
    };
}

/**
 * Performs verification of the given system model representation. In particular, the following checks will be carried out:
 * Verify if all subsystems are uniquely identifiable;
 * verify if all required inputs are connected unambigouosly;
 * verify if the data types of the connected element's connectors are consistent;
 * verify if each element a Connection references to is exactly available once in a subsystem.
 * 
 * The systemStructure is a generic data structure of the CDK and can be generated using the SSD adapter.
 *  
 * @author   localhorst87
 * @function
 * @param    {String} systemStructure       the system model representation as a stringified SystemStructure
 * @param    {String} [notRequired]         a list of input connectors that do not require a connection. Must be stringified
 * @return   {ResultLog}                    returns true/false and a log upon valid/invalid system structure
*/
function verifySystemStructure(systemStructure, notRequired = "[]") {
    let result = true;
    let log = "system structure is well-defined";

    try {
        systemStructure = JSON.parse(systemStructure);
    }
    catch {
        return {
            result: false,
            log: "systemStructure can not be parsed "
        };
    }

    try {
        notRequired = JSON.parse(notRequired);
    }
    catch {
        return {
            result: false,
            log: "connections that do not require an input can not be parsed "
        };
    }
    
    if(!util.isStructureValid(systemStructure, schemas.SYSTEM_STRUCTURE)) {
        return {
            result: false,
            log: "systemStructure does not fulfill the required schema"
        };
    }

    const checks = [
        system_structure_helpers.checkPedigrees(systemStructure),
        system_structure_helpers.areInputsConnected(systemStructure, notRequired),
        system_structure_helpers.areDataTypesConsistent(systemStructure),
        system_structure_helpers.checkConnectionElements(systemStructure),
        system_structure_helpers.areConnectionsAllowed(systemStructure)
    ];

    for (let resultLog of checks) {
        if (resultLog.result == false) {
            result = false;
            log = resultLog.log;
            break;
        }
    }

    return {
        result: result,
        log: log
    };
}