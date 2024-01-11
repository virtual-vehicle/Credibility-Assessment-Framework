const helper = require('./time_domain_helper');
const {Signal} = require('../../../../util/signal');

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
 * @param {string} signalName
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkMae(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    let experimentResultSignal = extractSignal(experimentResults, signalName);
    let referenceResultSignal = extractSignal(referenceResults, signalName);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const mae = calcMae(experimentResultSignal, referenceResultSignal, evaluationTimeStart, evaluationTimeEnd);

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
 * @param {string} signalName
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkMse(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    let experimentResultSignal = extractSignal(experimentResults, signalName);
    let referenceResultSignal = extractSignal(referenceResults, signalName);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const mse = calcMse(experimentResultSignal, referenceResultSignal, evaluationTimeStart, evaluationTimeEnd);

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
 * @param {string} signalName
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkRmse(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    let experimentResultSignal = extractSignal(experimentResults, signalName);
    let referenceResultSignal = extractSignal(referenceResults, signalName);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const rmse = calcRmse(experimentResultSignal, referenceResultSignal, evaluationTimeStart, evaluationTimeEnd);

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
 * @param {string} signalName
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkMape(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, signalName, 
        evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    let experimentResultSignal = extractSignal(experimentResults, signalName);
    let referenceResultSignal = extractSignal(referenceResults, signalName);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const mape = calcMape(experimentResultSignal, referenceResultSignal, evaluationTimeStart, evaluationTimeEnd);

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
 * @param {string} signalName
 * @param {number | string} evaluationTimeStart 
 * @param {number | string} evaluationTimeEnd 
 * @param {number | string} threshold
 * @returns {ResultLog}
 */
function checkTic(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd, threshold) {
    const preCheck = helper.checkPreConditions(experimentResults, referenceResults, signalName, evaluationTimeStart, evaluationTimeEnd);
    if (preCheck.result === false)
        return preCheck;

    let experimentResultSignal = extractSignal(experimentResults, signalName);
    let referenceResultSignal = extractSignal(referenceResults, signalName);
    evaluationTimeStart = Number(evaluationTimeStart);
    evaluationTimeEnd = Number(evaluationTimeEnd);
    threshold = Number(threshold);

    const tic = calcTic(experimentResultSignal, referenceResultSignal, evaluationTimeStart, evaluationTimeEnd);

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
 * @param {Signal} experiment 
 * @param {Signal} reference 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcMae(experiment, reference, evaluationTimeStart, evaluationTimeEnd) {
    experiment = experiment.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    reference = reference.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    let diff = reference.subtract(experiment);

    return diff.values.reduce((sum, currentValue) => sum + Math.abs(currentValue)) / diff.length;
}

/**
 * Calculates the mean squared error w.r.t. the time-domain between two results
 * 
 * MSE = 1/n * sum[1:n](reference - experiment)²
 * 
 * @param {Signal} experiment 
 * @param {Signal} reference 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcMse(experiment, reference, evaluationTimeStart, evaluationTimeEnd) {   
    experiment = experiment.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    reference = reference.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    let diff = reference.subtract(experiment);

    return diff.values.reduce((sum, currentValue) => sum + Math.pow(currentValue, 2)) / diff.length; // 1/n * sum(diff²)
}

/**
 * Calculates the root mean squared error w.r.t. the time-domain between two results
 * 
 * RMSE = sqrt(1/n * sum[1:n](reference - experiment)² )
 * 
 * @param {Signal} experiment 
 * @param {Signal} reference 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcRmse(experiment, reference, evaluationTimeStart, evaluationTimeEnd) {
    const mse = calcMse(experiment, reference, evaluationTimeStart, evaluationTimeEnd);

    return Math.sqrt(mse);
}

/**
 * Calculates the mean absolute percent error w.r.t. the time-domain between two results
 * 
 * MAPE = 100/n * sum[1:n](|reference - experiment|/|reference|)
 * 
 * @param {Signal} experiment 
 * @param {Signal} reference 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcMape(experiment, reference, evaluationTimeStart, evaluationTimeEnd) {    
    experiment = experiment.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    reference = reference.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    let diffRel = reference.subtract(experiment).divide(reference);

    return diffRel.values.reduce((sum, currentValue) => sum + Math.abs(currentValue)) * 100 / diff.length;
}

/**
 * Calculates the Theil Inequality Coefficient w.r.t. the time-domain between two results
 * 
 * TIC = RMSE(reference, experiment) / (RMS(reference) + RMS(experiment))
 * 
 * @param {Signal} experiment 
 * @param {Signal} reference 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {number}
 */
function calcTic(experiment, reference, evaluationTimeStart, evaluationTimeEnd) {
    experiment = experiment.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    reference = reference.sliceToTime(evaluationTimeStart, evaluationTimeEnd);

    const rmse = calcRmse(experiment, reference, evaluationTimeStart, evaluationTimeEnd);
    const rmsRef = helper.calcRms(reference);
    const rmsExp = helper.calcRms(experiment, reference.units.values);

    return rmse / (rmsRef + rmsExp);
}