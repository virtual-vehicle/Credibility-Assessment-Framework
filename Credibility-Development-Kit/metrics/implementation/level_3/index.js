const error_estimation = require("./src/error_estimation/error_estim");

/**
 * @typedef {import('./types/types').Measurement} Measurement
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * @module metrics/implementation/level_3
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
 * @level 3
 * @phase implementation
 * @step [model, integration]
 * @param {string} results1 first simulation results 
 * @param {string} results2 second simulation results, must be from the same experiment as results1
 *                          but with a different time step size
 * @param {number | string} timeToEvaluateStart the start time for evaluating the discretization error, as typically not 
 *                                              the complete results will be evaluated but only a meaningful snippet
 * @param {number | string} timeToEvaluateEnd the end time for evaluating the discretization error, as typically not the
 *                                            complete results will be evaluated but only a meaningful snippet
 * @param {number | string} p the order of the numerical scheme - for details, study richardson extrapolation :)
 * @param {number | string} errorThresholdPercentage the allowed discretization error in %
 * @returns {ResultLog} result and logging information
 */
const checkDiscretizationError = error_estimation.verifyDiscretizationError;

exports.checkDiscretizationError = checkDiscretizationError;