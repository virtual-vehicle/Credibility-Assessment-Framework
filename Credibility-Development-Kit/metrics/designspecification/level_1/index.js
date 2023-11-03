const verisign = require("../../../util/veri-sign");
const { SIGNED_STATEMENT } = require("./types/schemas");

/**
 * @module metrics/designspecification/level_1
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */


/**
 * Review all the resource in the design specification and check whether its justification is given and comprehensive
 * and validation results can refer to it
 * 
 * @author lvtan3005
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 1
 * @phase designspecification
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkJustification = verisign.checkExpertStatement;

exports.checkJustification = checkJustification;