const schemas = require("../../types/schemas");
const util = require("../../../../../util/util-common");
const system_structure_helpers = require("./system_structure_helpers");

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

exports.verifySystemStructure = verifySystemStructure;

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
 * @kind function
 * @license BSD-2-Clause
 * @version 0.2
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
            log: "systemStructure can not be parsed"
        };
    }

    try {
        notRequired = JSON.parse(notRequired);
    }
    catch {
        return {
            result: false,
            log: "notRequired can not be parsed"
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