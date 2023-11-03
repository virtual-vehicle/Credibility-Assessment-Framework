const time_domain_metrics = require('./src/time_domain');
const schemas = require('./types/schemas');


/**
 * @module metrics/evaluation/level_2
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks if the mean absolute error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * MAE = 1/n * sum[1:n](|reference - experiment|)
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step []
 * @param {string} experimentResults stringified results of simulation experiment,
 *                                   implementing {@link schemas.MEASUREMENT}
 * @param {string} referenceResults stringified results of the reference results (e.g., measurements),
 *                                  implementing {@link schemas.MEASUREMENT} 
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the MAE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkMeanAbsoluteError = time_domain_metrics.checkMae;

/**
 * Checks if the mean squared error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * MSE = 1/n * sum[1:n](reference - experiment)²
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step []
 * @param {string} experimentResults stringified results of simulation experiment,
 *                                   implementing {@link schemas.MEASUREMENT}
 * @param {string} referenceResults stringified results of the reference results (e.g., measurements),
 *                                  implementing {@link schemas.MEASUREMENT} 
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the MSE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkMeanSquaredError = time_domain_metrics.checkMse;

/**
 * Checks if the root mean squared error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * RMSE = sqrt(1/n * sum[1:n](reference - experiment)²)
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step []
 * @param {string} experimentResults stringified results of simulation experiment,
 *                                   implementing {@link schemas.MEASUREMENT}
 * @param {string} referenceResults stringified results of the reference results (e.g., measurements),
 *                                  implementing {@link schemas.MEASUREMENT} 
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the RMSE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkRootMeanSquaredError = time_domain_metrics.checkRmse;

/**
 * Checks if the mean absolute percent error w.r.t. the time-domain between two signals does not exceed the given 
 * threshold
 * 
 * MAPE = 100/n * sum[1:n](|reference - experiment|/|reference|)
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step []
 * @param {string} experimentResults stringified results of simulation experiment,
 *                                   implementing {@link schemas.MEASUREMENT}
 * @param {string} referenceResults stringified results of the reference results (e.g., measurements),
 *                                  implementing {@link schemas.MEASUREMENT} 
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the MAPE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkMeanAbsolutePercentError = time_domain_metrics.checkMape;

/**
 * Checks if Theils Inequality Coefficient w.r.t. the time-domain between two signals does not exceed the given 
 * threshold
 * 
 * TIC = RMSE(reference, experiment) / (RMS(reference) + RMS(experiment))
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step []
 * @param {string} experimentResults stringified results of simulation experiment,
 *                                   implementing {@link schemas.MEASUREMENT}
 * @param {string} referenceResults stringified results of the reference results (e.g., measurements),
 *                                  implementing {@link schemas.MEASUREMENT} 
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the TIC must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkTheilsInequalityCoefficient = time_domain_metrics.checkTic;

exports.checkMeanAbsoluteError = checkMeanAbsoluteError;
exports.checkMeanSquaredError = checkMeanSquaredError;
exports.checkRootMeanSquaredError = checkRootMeanSquaredError;
exports.checkMeanAbsolutePercentError = checkMeanAbsolutePercentError;
exports.checkTheilsInequalityCoefficient = checkTheilsInequalityCoefficient;