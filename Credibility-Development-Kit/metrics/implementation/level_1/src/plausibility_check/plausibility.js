const util = require('util-common');
const schemas = require("../../types/schemas");
const helper = require("../plausibility_check/plausibility_helpers");
const { Signal } = require("cdk-signal");

/**
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

exports.checkPlausibility = checkPlausibility;

/**
 * Quality evaluation method that checks if an expected behavior of certain variables
 * in a model are fulfilled
 * 
 * @author localhorst87
 * @param {string} resultsBaseline The stringified Signal array of the reference results,
 *                                 as returned by a time-series adapter (e.g., openmcx-csv-adapter)
 * @param {string} resultsVariation The stringified Signal array of the results after parameter modification,
 *                                  as returned by a time-series adapter (e.g., openmcx-csv-adapter)
 * @param {string} parameterModification The stringified parameter modification setup
 * @return {ResultLog} return true/false upon fulfilling/not fulfilling the expectation
 */
function checkPlausibility(resultsBaseline, resultsVariation, parameterModification) {
    try {
        parameterModification = JSON.parse(parameterModification);
    }
    catch (err) {
        return {
            result: false,
            log: "parameter modification can not be JSON-parsed"
        }
    }

    var signalsBaseline, signalsVariation;

    try {
        resultsBaseline = JSON.parse(resultsBaseline); // will be resulting in an array of exported Signals (string[])
        signalsBaseline = resultsBaseline.map(signalString => new Signal(signalString)); // Signal[]
    }
    catch (err) {
        return {
            result: false,
            log: "baseline results can not be JSON-parsed"
        }
    }

    try {
        resultsVariation = JSON.parse(resultsVariation); // will be resulting in an array of exported Signals (string[])
        signalsVariation = resultsVariation.map(signalString => new Signal(signalString)); // Signal[]
    }
    catch (err) {
        return {
            result: false,
            log: "variation results can not be JSON-parsed"
        }
    }

    if (!util.isStructureValid(parameterModification, schemas.PARAMETER_MODIFICATION)) {
        return {
            result: false,
            log: "parameter modification structure is not valid"
        }
    }    

    const isResultsComplete = helper.isResultsComplete(signalsBaseline, signalsVariation, parameterModification);
    if(isResultsComplete.result == false)
        return isResultsComplete;
        
    let baselineSignalToEvaluate = helper.getRequiredSignal(signalsBaseline, parameterModification);
    let variationSignalToEvaluate = helper.getRequiredSignal(signalsVariation, parameterModification);

    const startTime = parameterModification.influenced_variable.timepoints_to_check.start;
    const endTime = parameterModification.influenced_variable.timepoints_to_check.end !== undefined ? parameterModification.influenced_variable.timepoints_to_check.end : startTime;

    baselineSignalToEvaluate = baselineSignalToEvaluate.sliceToTime(startTime, endTime);
    variationSignalToEvaluate = variationSignalToEvaluate.sliceToTime(startTime, endTime);

    const cmpOperator = parameterModification.influenced_variable.expectation;
    const cmpOptions = helper.createCompareOptions(parameterModification);

    const result = variationSignalToEvaluate.compare(cmpOperator, baselineSignalToEvaluate, cmpOptions);

    if (result == true) {
        return {
            result: true,
            log: "simulation results match the expectation"
        };
    }
    else {
        return {
            result: false,
            log: "simulation results do not match the expectation"
        }
    }    
}