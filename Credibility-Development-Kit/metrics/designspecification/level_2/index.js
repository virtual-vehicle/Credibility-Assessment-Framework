const linkage_check = require("./src/linkage_check_syntax");
const verisign = require("../../../util/veri-sign");
const { SIGNED_STATEMENT } = require("../../../util/veri-sign/types/schemas");

/**
 * @module metrics/designspecification/level_2
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks if a justification of a single design specification is supported with linkage.
 * 
 * @author lvtan3005
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase designspecification
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} namedGraph stringified JSON-LD of the named graph that shows the linkage of the design
 * @param {String} resourceIri The IRI of the design resource to be checked
 * @param {String} stmd The stringified STMD content (where all resources are tracked)
 * @returns {ResultLog} result and logging information
 */
const checkLinkageSyntax = linkage_check.linkageCheckSyntax

/**
 * Checks if the linkage of a single design makes sense from semantical point-of-view, i.e., if the causal dependency of a design and its sources
 * and validation result is comprehensible.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase designspecification
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
const checkLinkageSemantics = verisign.checkExpertStatement;

exports.checkLinkageSyntax = checkLinkageSyntax;
exports.checkLinkageSemantics = checkLinkageSemantics;