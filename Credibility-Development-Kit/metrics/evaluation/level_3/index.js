const uncertainty = require("./src/uncertainty");
const uncertainty_util = require("../../../util/uncertainty");

/**
 * @module metrics/evaluation/level_3
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Evaluates if the statistical distance (according to the Area Validation Metric) of two given distributions
 * is lower than the given threshold.
 * 
 * The first given distribution is from simulation results, the other distribution is from reference values (e.g., from 
 * measurements).
 * 
 * A distribution may either be given as a cumulative distribution function (CDF) or as P-Boxes. To create these
 * distributions from specific results, the {@link uncertainty_util} package can be used.
 * 
 * @author lvtan3005, localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 3
 * @phase evaluation
 * @step []
 * @param {String} distributionSim single EDF or P-Boxes from simulation data (as stringified JSON)
 * @param {String} distributionRef single EDF or P-Boxes from reference data (as stringified JSON)
 * @param {number} threshold evaluation criterion: Area validation metric must be below this value
 * @return {ResultLog} result and log if AVM is smaller than threshold
 */
const evaluateAvm = uncertainty.evaluateAvm

/**
 * Evaluates if the statistical distance (according to the NASA Area Validation Metric) of two given distributions
 * is lower than the given threshold.
 * 
 * The first given distribution is from simulation results, the other distribution is from reference values (e.g., from 
 * measurements).
 * 
 * A distribution may either be given as a cumulative distribution function (CDF) or as P-Boxes. To create these
 * distributions from specific results, the {@link uncertainty_util} package can be used.
 * 
 * @author lvtan3005, localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 3
 * @phase evaluation
 * @step []
 * @param {String} distributionSim single EDF or P-Boxes from simulation data (as stringified JSON)
 * @param {String} distributionRef single EDF or P-Boxes from reference data (as stringified JSON)
 * @param {number} threshold evaluation criterion: Area validation metric must be below this value
 * @return {ResultLog} result and log if NASA AVM is smaller than threshold
 */
const evaluateNasaAvm = uncertainty.evaluateNasaAvm

exports.evaluateAvm = evaluateAvm;
exports.evaluateNasaAvm = evaluateNasaAvm;