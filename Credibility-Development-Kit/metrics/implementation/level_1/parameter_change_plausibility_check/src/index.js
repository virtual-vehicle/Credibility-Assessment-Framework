const plausibilityCheck = require("./src/plausibility_check/plausibility");

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * @module metrics/implementation/level_1
 */


/**
 * Dynamic code check, if a parameter change will be resulting in the expected behaivor of the simulation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 1
 * @phase implementation
 * @step [models, integration]
 * @param {string} resultsBaseline The stringified reference simulation results
 * @param {string} resultsVariation The stringified variation simulation results
 * @param {string} parameterModification The stringified parameter modification setup
 * @return {ResultLog} returns true/false and a log upon valid/invalid behaviour
 */
const checkPlausibility = plausibilityCheck.checkPlausibility;

exports.checkPlausibility = checkPlausibility;