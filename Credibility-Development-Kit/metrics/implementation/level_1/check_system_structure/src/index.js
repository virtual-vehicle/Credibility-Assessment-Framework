const systemStructureCheck = require("./system_structure/verifySystemStructure");

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * @module metrics/implementation/level_1
 */



/**
 * Checks if the representation of a system structure (including all components, connectors and connections of the system) is well-defined
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 1
 * @phase implementation
 * @step [models, parameters, environment, test cases, integration]
 * @param {String} systemStructure the system model representation as a stringified SystemStructure
 * @param {String} [notRequired] a list of input connectors that do not require a connection. Must be stringified
 * @return {ResultLog} returns true/false and a log upon valid/invalid system structure
 */
const checkSystemStructure = systemStructureCheck.verifySystemStructure;

exports.checkSystemStructure = checkSystemStructure;