const verisign = require("../../../util/veri-sign");
const { SIGNED_STATEMENT } = require("./types/schemas");

/**
 * @module metrics/requirements/level_1
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks if a single requirement fulfills quality aspects in a way that specifications can be built upon it and 
 * validation results can refer to it 
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 1
 * @phase requirements
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkSingleSemantic = verisign.checkExpertStatement;

/**
 * Checks if the collection of requirements fulfills quality aspects in a way that specifications can be built upon it 
 * and validation results can refer to it
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 1
 * @phase requirements
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkCollectionSemantic = verisign.checkExpertStatement;

exports.checkSingleSemantic = checkSingleSemantic;
exports.checkCollectionSemantic = checkCollectionSemantic;