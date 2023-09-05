const verisign = require("../../../util/veri-sign");
const systemStructureCheck = require("./src/verifySystemStructure");

/**
 * @module metrics/implementation/level_1
 */

/**
 * Checks if an artifact has passed the expert review (e.g., code verification) and if the signed expert statement is valid
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
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkExpertReview = verisign.checkExpertStatement;

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

exports.checkExpertReview = checkExpertReview;
exports.checkSystemStructure = checkSystemStructure;