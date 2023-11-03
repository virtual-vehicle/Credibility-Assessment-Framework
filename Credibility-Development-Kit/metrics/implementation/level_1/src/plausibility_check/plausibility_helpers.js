/**
 * @typedef {import('../../types/types').ParameterModification} ParameterModification
 * @typedef {import('../../types/types').MeasurementCollection} MeasurementCollection
 * @typedef {import('../../types/types').CuttingIndices} CuttingIndices
 * @typedef {import('../../types/types').CompareOptions} CompareOptions
 * @typedef {import('../../types/types').SignalTuple} SignalTuple
 */

exports.isResultsComplete = isResultsComplete;
exports.getRegionOfInterest = getRegionOfInterest;
exports.createCompareOptions = createCompareOptions;
exports.wrapResultsIntoSignals = wrapResultsIntoSignals;

/**
 * Checks if the required measurements from the paramter modification setup are available
 * in the measurement collection
 *
 * @author: localhorst87
 * @param {ParameterModification} parameterModification The parameter modification setup
 * @param {MeasurementCollection} measurements The measurement collection that contains 
 *                                             reference and variation measurements
 * @return {boolean} return true/false if all measurements are available/not available
 */
function isResultsComplete(resultsBaseline, resultsVariation, parameterModification) {
    const nameOfSignal = parameterModification.influenced_variable.name;

    if (resultsBaseline[nameOfSignal] === undefined) {
        console.log("required signal " + nameOfSignal + " is not available in the reference results");
        return false;
    }
    if (resultsVariation[nameOfSignal] === undefined) {
        console.log("required signal " + nameOfSignal + " is not available in the variation results");
        return false;
    }
    if (resultsBaseline[nameOfSignal].time === undefined) {
        console.log("time vector of required signal " + nameOfSignal + " is not available in the reference results");
        return false;
    }
    if (resultsBaseline[nameOfSignal].values === undefined) {
        console.log("value vector of required signal " + nameOfSignal + " is not available in the reference results");
        return false;
    }   
    if (resultsVariation[nameOfSignal].time === undefined) {
        console.log("time vector required signal " + nameOfSignal + " is not available in the variation results");
        return false;
    }
    if (resultsVariation[nameOfSignal].values === undefined) {
        console.log("value vector required signal " + nameOfSignal + " is not available in the variation results");
        return false;
    }

    // other checks (length > 0, time and value length have same length, etc.) will be checked
    // on creating the Signals from these arrays!
    
    return true;
}

/**
 * Returns a start and end index for cutting the reference and variation Signal,
 * according to the given reference point in the ParameterModification setup
 *
 * @author: localhorst87
 * @param {ParameterModification} parameterModification The parameter modification setup
 * @return {CuttingIndices} start and end index for cutting the Signals
 */
function getRegionOfInterest(parameterModification) {
    var startIdx, endIdx;

    switch (parameterModification.influenced_variable.reference_point) {
        case "start":
            startIdx = 0;
            endIdx = 1;
            break;
        case "end":
            startIdx = -1;
            endIdx = undefined;
            break;
        default: // continuously
            startIdx = undefined;
            endIdx = undefined;
    }

    return {
        start: startIdx,
        end: endIdx,
    };
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
 * Extracts the signals identified by signalName from the MeasurementCollection and creates
 * a SignalTuple out of it.
 * The availability of the signals inside the MeasurementCollection must have been checked
 * before! 
 *
 * @author: localhorst87
 * @param {MeasurementCollection} measurements The measurement collection that contains 
 *                                             reference and variation measurements
 * @param {string} signalName The signal to extract from the measurements and wrap into a
 *                            Signal object
 * @return {SignalTuple} reference and variation Signals of <signalName> variable
 */
function wrapResultsIntoSignals(resultsBaseline, resultsVariation, signalName) {
    const timeRefSignal = resultsBaseline[signalName].time;
    const valuesRefSignal = resultsBaseline[signalName].values;
    const configRefSignal = {
        name: signalName + "_reference",
        unit_values: resultsBaseline[signalName].unit,
    };

    const timeVariSignal = resultsVariation[signalName].time;
    const valuesVariSignal = resultsVariation[signalName].values;
    const configVariSignal = {
        name: signalName + "_variation",
        unit_values: resultsVariation[signalName].unit,
    };

    let referenceSignal = new Signal(timeRefSignal, valuesRefSignal, configRefSignal);
    let variationSignal = new Signal(timeVariSignal, valuesVariSignal, configVariSignal);

    return {
        reference: referenceSignal,
        variation: variationSignal,
    };
}