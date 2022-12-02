const histHelper = require('./src/histogram_helper');

exports.createCumulativeHistogram = createCumulativeHistogram;
exports.createPBoxes = createPBoxes;

/**
 * @module util/uncertainty
 * @memberof util
 */

/**
 * @typedef {import('./types/types').DiscreteDistribution} DiscreteDistribution
 * @typedef {import('./types/types').PBoxesConfig} PBoxesConfig
 * @typedef {import('./types/types').PBoxes} PBoxes 
 */

/**
 * Creates a P-Box Histogram from several single cumulative histograms.
 * 
 * @param {DiscreteDistribution[]} histograms cumulative histograms to extract max and min boundaries from
 * @param {number | PBoxesConfig} [arg2] either and epistemic uncertainty offset or (if no offset is given) the 
 *                                      configuration used to specify the minimum, maximum and interval of the 
 *                                      random variable (i.e. the System Response Quantity)
 * @param {PBoxesConfig} [arg3] must be the configuration, if no offset is given
 * @return {PBoxes} the identified P-Boxes from the ensemble of histograms
 */
function createPBoxes(histograms, arg2, arg3) {
    let offset, config, pBoxes;

    // check first argument
    if (!Array.isArray(histograms))
        throw("histograms must be given as array");
    if (histograms.length <= 1)
        throw("more than one histogram is required for a P-Box");
    
    // one argument given => auto config, no offset
    if (arg2 === undefined && arg3 === undefined) {
        offset = 0;
        config = {};        
    }
    // two arguments given => offset or config
    else if (arg2 !== undefined && arg3 === undefined) { 
        if (typeof(arg2) == "number") { 
            // auto config, offset given
            offset = arg2;
            config = {};
        }
        else if (typeof(arg2) == "object") { 
            // config given, no offset
            offset = 0;
            config = arg2;
        }
        else
            throw("if two arguments are given, the second argument must be an offset or a configuration object")
    }
    // three arguments  given ==> config and offset
    else if (arg2 !== undefined && arg3 !== undefined) {
        if (typeof(arg2) != "number" || typeof(arg3) != "object")
            throw("if three arguments are given, the second argument must be an offset, the third a config object");
        
        offset = arg2;
        config = arg3;
    }

    histHelper.checkHistogramArray(histograms);
    config = histHelper.postprocessConfig(histograms, config, offset);
    pBoxes = histHelper.calcPBoxes(histograms, config.x_min, config.x_max, config.interval);

    if (offset !== 0) {
        if (offset < 0)
            throw("offset must be greater than zero");
        pBoxes = histHelper.addUncertainty(pBoxes, offset);
    }   
    
    return pBoxes;
}

/**
 * 
 * @param {number[] | Signal[]} data array of concrete results or array of Signals
 * @param {Function} [evalFn] must be used if data is given as Signal array to know how to evaluate each Signal
 * @return {DiscreteDistribution}
 */
function createCumulativeHistogram(data, evalFn) {
    if (!Array.isArray(data))
        throw("data must be given as array");
    if (data.length <= 1)
        throw("more than 1 sample required");
    
    if (data.every(el => el.constructor.name == "Number")) {
        return histHelper.calcCumulativeHistogram(data, "unknown");
    }
    else if (data.every(el => el.constructor.name == "Signal")) {
        if (evalFn === undefined)
            throw("if data is given as Signal array, an evaluation function must be given");
        if (typeof(evalFn) !== "function")
            throw("evaluation function must be a valid function");

        const unit = data[0].units.values;
        data = data.map(signal => evalFn(signal)); // apply evaluation function

        return histHelper.calcCumulativeHistogram(data, unit);
    }
    else
        throw("data must be either an array of numbers or Signals");
}