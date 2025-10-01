const verisign = require("veri-sign");

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

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
 * @param {String} signedExpertStatement stringified JSON implement the {@link verisign.SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkExpertReview = verisign.checkExpertStatement;

exports.checkExpertReview = checkExpertReview;