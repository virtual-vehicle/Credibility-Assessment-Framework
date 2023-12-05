const convergency = require("./src/convergency/convergency");

/**
 * @typedef {import('./types/types').Measurement} Measurement
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * @module metrics/implementation/level_2
 */

/**
 * Verifies if the solution to the discretized equations approaching the continuum solution to the partial 
 * differential equations in the limit of decreasing element size.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase implementation
 * @step [integration]
 * @param {string} signalName the name of the signal to evaluate
 * @param {number | string} nSamples the number of equidistant samples to evaluate
 * @param {string} resultExact stringified Signal array as returned by a Signal adapter, like the openmcx-csv-adapter
 * @param {...string} resultDiscretized at least 2 stringified Signal arrays, as returned by a Signal adapter, like the openmcx-csv-adapter
 * @returns {ResultLog} result and logging information
 */
const checkConvergency = convergency.verifyConvergency;

exports.checkConvergency = checkConvergency;