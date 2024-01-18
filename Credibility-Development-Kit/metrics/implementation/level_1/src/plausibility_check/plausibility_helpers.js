/**
 * @typedef {import('../../types/types').ParameterModification} ParameterModification
 * @typedef {import('../../types/types').MeasurementCollection} MeasurementCollection
 * @typedef {import('../../types/types').CuttingIndices} CuttingIndices
 * @typedef {import('../../types/types').CompareOptions} CompareOptions
 * @typedef {import('../../types/types').SignalTuple} SignalTuple
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

exports.isResultsComplete = isResultsComplete;
exports.createCompareOptions = createCompareOptions;
exports.getRequiredSignal = getRequiredSignal;

/**
 * Checks if the required measurements from the paramter modification setup are available
 * in the measurement collection
 *
 * @author: localhorst87
 * @param {Signal[]} signalsBaseline
 * @param {Signal[]} signalsVariation
 * @param {ParameterModification} parameterModification The parameter modification setup
 * @return {ResultLog} return true/false if all measurements are available/not available
 */
function isResultsComplete(signalsBaseline, signalsVariation, parameterModification) {
    const nameOfSignal = parameterModification.influenced_variable.name;

    if (!isSignalAvailable(signalsBaseline, nameOfSignal)) {
        return {
            result: false,
            log:  "required signal " + nameOfSignal + " is not available in the reference results"
        };
    }
    if (!isSignalAvailable(signalsVariation, nameOfSignal)) {
        return {
            result: false,
            log: "required signal " + nameOfSignal + " is not available in the variation results"
        };
    }

    let baselineSignalToEvaluate = getRequiredSignal(signalsBaseline, parameterModification);
    let variationSignalToEvaluate = getRequiredSignal(signalsVariation, parameterModification);

    if (baselineSignalToEvaluate.length == 0) {
        return {
            result: false,
            log: "required signal " + nameOfSignal + " has zero length in baseline results!"
        };
    }
    if (variationSignalToEvaluate.length == 0) {
        return {
            result: false,
            log: "required signal " + nameOfSignal + " has zero length in variation results!"
        };
    }
    
    return {
        result: true,
        log: "results are complete"
    };
}

/**
 * @param {Signal[]} signals 
 * @param {ParameterModification} parameterModification 
 * @returns {Signal[]}
 */
function getRequiredSignal(signals, parameterModification) {
    return signals.find(signal => signal.name == parameterModification.influenced_variable.name);
}

/**
 * Creates the options argument for the Signal.compare method, based on the information,
 * given in the ParameterModification
 *
 * @author: localhorst87
 * @param {ParameterModification} parameterModification The parameter modification setup
 * @return {CompareOptions} compare options ready to use in Signal.compare
 */
function createCompareOptions(parameterModification) {
    let threshold, tolerance, unit;

    if (parameterModification.influenced_variable.threshold) {
        unit = parameterModification.influenced_variable.threshold.unit ? parameterModification.influenced_variable.threshold.unit : undefined;
        threshold = parameterModification.influenced_variable.threshold.value;
        tolerance = 0; // will be ignored in the compare method and is set to 0 by default either

        if (unit =="%")
            threshold /= 100;
    }
    else if (parameterModification.influenced_variable.tolerance) {
        unit = parameterModification.influenced_variable.tolerance.unit ? parameterModification.influenced_variable.tolerance.unit : undefined;
        tolerance = parameterModification.influenced_variable.tolerance.value;
        threshold = 0; // will be ignored in the compare method and is set to 0 by default either

        if (unit =="%")
            tolerance /= 100;
    }
    else {
        unit = undefined;
        threshold = 0;
        tolerance = 0;
    }
    
    return {
        comparison: parameterModification.influenced_variable.comparison,
        threshold: threshold,
        tolerance: tolerance,
        unit: parameterModification.influenced_variable.comparison == "absolute" ? unit : undefined,
        reduce: true
    };
}

/**
 * @param {Signal[]} signals 
 * @param {string} nameOfSignal 
 * @returns {boolean}
 */
function isSignalAvailable(signals, nameOfSignal) {
    return signals.reduce((isAvailable, signal) => isAvailable || signal.name == nameOfSignal, false);
}