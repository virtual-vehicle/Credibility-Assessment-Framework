const { Signal } = require('cdk-signal');

/**
 * @typedef {import('../types/types').SignalsCollection} SignalsCollection
 * @typedef {import('../types/types').Measurement} Measurement 
 * @typedef {import('../types/types').ResultLog} ResultLog 
 */

exports.calcRms = calcRms;
exports.checkPreConditions = checkPreConditions;
exports.extractSignal = extractSignal;

/**
 * Returns the root mean square of a signal
 * 
 * @param {Signal} signal 
 * @return {number}
 */
function calcRms(signal, unit) {
    if (unit !== undefined)
        signal = signal.convert("values", unit);

    let squaredSignal = signal.multiply(signal);

    return Math.sqrt(squaredSignal.values.reduce((sum, currentValue) => sum + Math.pow(currentValue, 2)) / diff.length);
}

/**
 * 
 * @param {string} experimentResults 
 * @param {string} referenceResults 
 * @param {string} signalNameExperiment
 * @param {string} signalNameReference
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {ResultLog}
 */
function checkPreConditions(experimentResults, referenceResults, signalNameExperiment, signalNameReference, evaluationTimeStart, evaluationTimeEnd) {
    try {
        experimentResults = JSON.parse(experimentResults);
    }
    catch (err) {
        return {
            result: false,
            log: "Experiment results can not be JSON-parsed"
        };
    }

    var allSignals;
    try {
        allSignals = experimentResults.map(signalString => new Signal(signalString)); // Signal[]
    }
    catch (err) {
        return {
            result: false,
            log: "Experiment Signals does not fulfill the Signal import schema"
        };
    }

    try {
        allSignals.filter(signal => signal.name == signalNameExperiment)[0];
    }
    catch (err) {
        return {
            result: false,
            log: "Signal " + signalNameExperiment + " not available in experiment results."
        };
    }

    try {
        referenceResults = JSON.parse(referenceResults);
    }
    catch (err) {
        return {
            result: false,
            log: "Reference results can not be JSON-parsed"
        };
    }

    try {
        allSignals = referenceResults.map(signalString => new Signal(signalString)); // Signal[]
    }
    catch (err) {
        return {
            result: false,
            log: "Reference Signals does not fulfill the Signal import schema"
        };
    }

    try {
        allSignals.filter(signal => signal.name == signalNameReference)[0];
    }
    catch (err) {
        return {
            result: false,
            log: "Signal " + signalNameReference + " not available in reference results."
        };
    }

    if (evaluationTimeStart > evaluationTimeEnd) {
        return {
            results: false,
            log: "Evaluation start time must not be greater than the evaluation end time"
        };
    }

    return {
        results: true,
        log: "Precheck passed"
    };
}

/**
 * @param {string} signalsString 
 * @param {string} signalName 
 * @returns {Signal}
 */
function extractSignal(signalsString, signalName) {
    let stringifiedSignalArray = JSON.parse(signalsString);
    let allSignals = stringifiedSignalArray.map(signalString => new Signal(signalString)); // Signal[]
    return allSignals.filter(signal => signal.name == signalName)[0];
}