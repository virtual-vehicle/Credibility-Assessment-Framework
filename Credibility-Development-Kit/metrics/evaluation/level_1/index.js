const verisign = require("../../../util/veri-sign");
const { SIGNED_STATEMENT } = require("./types/schemas");

/**
 * @module metrics/evaluation/level_1
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks the expert statement about if the simulation is a sufficient representation of the target system.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 1
 * @phase evaluation
 * @step []
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkExpertValidation = verisign.checkExpertStatement;

exports.checkExpertValidation = checkExpertValidation;