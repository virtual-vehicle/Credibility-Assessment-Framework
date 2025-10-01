const linkage_check = require("./linkage_check_syntax");

/**
 * @module metrics/requirements/level_2
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks if a single requirement fulfills quality aspects in a way that specifications can be built upon it and 
 * validation results can refer to it 
 * 
 * @author lvtan3005
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase requirements
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} namedGraph stringified JSON-LD of the named graph that shows the linkage of the requirement
 * @param {String} resourceIri The IRI of the requirement resource to be checked
 * @param {String} stmd The stringified STMD content (where all resources are tracked)
 * @returns {ResultLog} result and logging information
 */
const checkLinkageSyntax = linkage_check.linkageCheckSyntax

exports.checkLinkageSyntax = checkLinkageSyntax;