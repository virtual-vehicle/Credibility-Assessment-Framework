const util = require('../../../../../util/util-common');
const schemas = require("../../types/schemas");
const helper = require("../plausibility_check/plausibility_helpers");

/**
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

exports.checkPlausibility = checkPlausibility;

/**
 * Quality evaluation method that checks if an expected behavior of certain variables
 * in a model are fulfilled
 * 
 * @author localhorst87
 * @param {string} parameterModification The stringified parameter modification setup
 * @param {string} measurementCollection The stringified measurement collection that contains reference and variation measurements
 * @return {ResultLog} return true/false upon fulfilling/not fulfilling the expectation
 */
function checkPlausibility(resultsBaseline, resultsVariation, parameterModification) {
    try {
        parameterModification = JSON.parse(parameterModificationString);
    }
    catch (err) {
        return {
            result: false,
            log: "parameter modification can not be JSON-parsed"
        }
    }

    try {
        resultsBaseline = JSON.parse(resultsBaseline);
    }
    catch (err) {
        return {
            result: false,
            log: "baseline results can not be JSON-parsed"
        }
    }

    try {
        resultsVariation = JSON.parse(resultsVariation);
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

    if(!helper.isResultsComplete(resultsBaseline, resultsVariation, parameterModification)) {
        return {
            result: false,
            log: "measurement collection is missing required signals"
        }
    }

    const signalName = parameterModification.influenced_variable.name;

    let signals = helper.wrapResultsIntoSignals(resultsBaseline, resultsVariation, signalName);
    const idx = helper.getRegionOfInterest(parameterModification);

    signals.reference = signals.reference.sliceToIndex(idx.start, idx.end);
    signals.variation = signals.variation.sliceToIndex(idx.start, idx.end);

    const cmpOperator = parameterModification.influenced_variable.expectation;
    const cmpOptions = helper.createCompareOptions(parameterModification);

    return signals.variation.compare(cmpOperator, signals.reference, cmpOptions);
}