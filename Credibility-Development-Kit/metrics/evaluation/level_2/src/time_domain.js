const helper = require('./time_domain_helper');

/**
 * @typedef {import('../types/types').ResultLog} ResultLog 
 */

exports.checkMae = checkMae;
exports.checkMse = checkMse;
exports.checkRmse = checkRmse;
exports.checkMape = checkMape;
exports.checkTic = checkTic;

/**
 * Checks if the mean absolute error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * MAE = 1/n * sum[1:n](|reference - experiment|)
 * 
 * @param {string} experimentResults 
 * @param {string} referenceResults 
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkMae(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    experimentResults = JSON.parse(experimentResults);
    referenceResults = JSON.parse(referenceResults);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const mae = calcMae(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);

    if (mae <= threshold) {
        return {
            result: true,
            log: "mean absolute error is below threshold"
        };
    }
    else {
        return {
            result: false,
            log: "mean absolute error exceeds threshold"
        };
    }
}

/**
 * Checks if the mean squared error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * MSE = 1/n * sum[1:n](reference - experiment)²
 * 
 * @param {string} experimentResults 
 * @param {string} referenceResults 
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkMse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    experimentResults = JSON.parse(experimentResults);
    referenceResults = JSON.parse(referenceResults);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const mse = calcMse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);

    if (mse <= threshold) {
        return {
            result: true,
            log: "mean squared error is below threshold"
        };
    }
    else {
        return {
            result: false,
            log: "mean squared error exceeds threshold"
        };
    }
}

/**
 * Checks if the root mean squared error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * RMSE = sqrt( 1/n * sum[1:n](reference - experiment)² )
 * 
 * @param {string} experimentResults 
 * @param {string} referenceResults 
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkRmse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    experimentResults = JSON.parse(experimentResults);
    referenceResults = JSON.parse(referenceResults);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const rmse = calcRmse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);

    if (rmse <= threshold) {
        return {
            result: true,
            log: "root mean squared error is below threshold"
        };
    }
    else {
        return {
            result: false,
            log: "root mean squared error exceeds threshold"
        };
    }
}

/**
 * Checks if the mean absolute percent error w.r.t. the time-domain between two signals does not exceed the given 
 * threshold
 * 
 * MAPE = 100/n * sum[1:n](|reference - experiment|/|reference|)
 * 
 * @param {string} experimentResults 
 * @param {string} referenceResults 
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkMape(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    experimentResults = JSON.parse(experimentResults);
    referenceResults = JSON.parse(referenceResults);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const mape = calcMape(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);

    if (mape <= threshold) {
        return {
            result: true,
            log: "Mean absolute percent error is below threshold"
        };
    }
    else {
        return {
            result: false,
            log: "Mean absolute percent error exceeds threshold"
        };
    }
}

/**
 * Checks if Theils Inequality Coefficient w.r.t. the time-domain between two signals does not exceed the given 
 * threshold
 * 
 * TIC = RMSE(reference, experiment) / (RMS(reference) + RMS(experiment))
 * 
 * @param {string} experimentResults 
 * @param {string} referenceResults 
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkTic(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    experimentResults = JSON.parse(experimentResults);
    referenceResults = JSON.parse(referenceResults);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const tic = calcTic(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);

    if (tic <= threshold) {
        return {
            result: true,
            log: "Theils Inequality Criterion is below threshold"
        };
    }
    else {
        return {
            result: false,
            log: "Theils Inequality Criterion exceeds threshold"
        };
    }
}

/**
 * Calculates the mean absolut error w.r.t. the time-domain between two results
 * 
 * MAE = 1/n * sum[1:n](|reference - experiment|)
 * 
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcMae(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    let signals = helper.makeSignals(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    
    let experiment = signals.experiment;
    let reference = signals.reference;
    let diff = reference.subtract(experiment);

    return diff.values.reduce((sum, currentValue) => sum + Math.abs(currentValue)) / diff.length;
}

/**
 * Calculates the mean squared error w.r.t. the time-domain between two results
 * 
 * MSE = 1/n * sum[1:n](reference - experiment)²
 * 
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcMse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    let signals = helper.makeSignals(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    
    let experiment = signals.experiment;
    let reference = signals.reference;
    let diff = reference.subtract(experiment);

    return diff.values.reduce((sum, currentValue) => sum + Math.pow(currentValue, 2)) / diff.length; // 1/n * sum(diff²)
}

/**
 * Calculates the root mean squared error w.r.t. the time-domain between two results
 * 
 * RMSE = sqrt(1/n * sum[1:n](reference - experiment)² )
 * 
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcRmse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    const mse = calcMse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);

    return Math.sqrt(mse);
}

/**
 * Calculates the mean absolute percent error w.r.t. the time-domain between two results
 * 
 * MAPE = 100/n * sum[1:n](|reference - experiment|/|reference|)
 * 
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcMape(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    let signals = helper.makeSignals(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    
    let experiment = signals.experiment;
    let reference = signals.reference;
    let diffRel = reference.subtract(experiment).divide(reference);

    return diffRel.values.reduce((sum, currentValue) => sum + Math.abs(currentValue)) * 100 / diff.length;
}

/**
 * Calculates the Theil Inequality Coefficient w.r.t. the time-domain between two results
 * 
 * TIC = RMSE(reference, experiment) / (RMS(reference) + RMS(experiment))
 * 
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcTic(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    let signals = helper.makeSignals(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    
    let experiment = signals.experiment;
    let reference = signals.reference;

    const rmse = calcRmse(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd);
    const rmsRef = helper.calcRms(reference);
    const rmsExp = helper.calcRms(experiment, reference.units.values);

    return rmse / (rmsRef + rmsExp);
}