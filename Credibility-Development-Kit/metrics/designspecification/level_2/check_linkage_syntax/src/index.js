const linkage_check = require("./linkage_check_syntax");

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

exports.checkLinkageSyntax = checkLinkageSyntax;