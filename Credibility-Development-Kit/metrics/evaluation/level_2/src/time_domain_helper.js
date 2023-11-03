const { Signal } = require('../../../../util/signal');
const util = require('../../../../util/util-common');
const schemas = require('../types/schemas');

/**
 * @typedef {import('../types/types').SignalsCollection} SignalsCollection
 * @typedef {import('../types/types').Measurement} Measurement 
 * @typedef {import('../types/types').ResultLog} ResultLog 
 */

exports.calcRms = calcRms;
exports.makeSignals = makeSignals;
exports.checkPreConditions = checkPreConditions;

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
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {SignalsCollection}
 */
function makeSignals(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    let experimentSignal = new Signal(experimentResults.time, experimentResults.values, {name: "experiment", unit_values: experimentResults.unit});
    let referenceSignal = new Signal(referenceResults.time, referenceResults.values, {name: "reference", unit_values: referenceResults.unit});
    
    experimentSignal.sliceToTime(evaluationTimeStart, evaluationTimeEnd);
    referenceSignal.sliceToTime(evaluationTimeStart, evaluationTimeEnd);

    return {
        experiment: experimentSignal,
        reference: referenceSignal
    };
}

/**
 * 
 * @param {Measurement} experimentResults 
 * @param {Measurement} referenceResults 
 * @param {number} evaluationTimeStart 
 * @param {number} evaluationTimeEnd 
 * @returns {ResultLog}
 */
function checkPreConditions(experimentResults, referenceResults, evaluationTimeStart, evaluationTimeEnd) {
    try {
        experimentResults = JSON.parse(experimentResults);
    }    
    catch (err) {
        return {
            result: false,
            log: "experimentResults could not be JSON-parsed"
        };
    }

    try {
        referenceResults = JSON.parse(referenceResults);
    }    
    catch (err) {
        return {
            result: false,
            log: "referenceResults could not be JSON-parsed"
        };
    } 
    
    if (!util.isStructureValid(experimentResults, schemas.MEASUREMENT)) {
        return {
            result: false,
            log: "experimentResults does not fulfill the required schema"
        };
    }

    if (!util.isStructureValid(referenceResults, schemas.MEASUREMENT)) {
        return {
            result: false,
            log: "referenceResults does not fulfill the required schema"
        };
    }

    if (evaluationTimeStart > evaluationTimeEnd) {
        return {
            results: false,
            log: "evaluation start time must not be greater than the evaluation end time"
        };
    }

    return {
        results: true,
        log: "precheck passed"
    };
}