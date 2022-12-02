const util = require("../../util-common");

exports.calcCumulativeHistogram = calcCumulativeHistogram;
exports.checkHistogramArray = checkHistogramArray;
exports.calcPBoxes = calcPBoxes;
exports.postprocessConfig = postprocessConfig;
exports.addUncertainty = addUncertainty;

/**
 * @typedef {import('../types/types').DiscreteDistribution} DiscreteDistribution
 * @typedef {import('../types/types').PBoxesConfig} PBoxesConfig
 * @typedef {import('../types/types').PBoxes} PBoxes
 */

// helper methods for arrays to make array unique
Array.prototype.unique = function () {
    return this.filter((val, i, self) => self.indexOf(val) === i);
}

// helper methods for arrays to find last index according to a condition
// based on current proposal: https://github.com/tc39/proposal-array-find-from-last
Array.prototype.findLastIndex = function (fn) {
    return this.length - 1 - [...this].reverse().findIndex(fn);
}

/**
 * Does the actual calculation to get a cumulative histogram from concrete data samples
 * 
 * @author localhorst87
 * @private
 * @param {number[]} data discrete values for calculating the cumulative distribution
 * @param {string} unit the unit of the random variable
 * @returns {DiscreteDistribution} the cumulative histogram
 */
 function calcCumulativeHistogram(data, unit) {
    let histogram = {
        type: "CDF",
        x: [],
        p: [],
        unit: unit
    };
    
    const nSamplesTotal = data.length;   
    const dataSorted = data.sort((a,b) => a-b);    
    const dataUnique = dataSorted.unique();
    
    let nSamples = 0;
    for (let uniqueValue of dataUnique) {
        nSamples += data.filter(el => el == uniqueValue).length;
        histogram.x.push(uniqueValue);
        histogram.p.push(nSamples / nSamplesTotal);
    }

    return histogram;
}

/**
 * Checks if histogram array is filled correctly
 * 
 * @author localhorst87
 * @private
 * @param {DiscreteDistribution[]} histograms cumulative histograms
 */
function checkHistogramArray(histograms) {
    if (histograms.every(el => el.x !== undefined && el.p !== undefined && el.unit !== undefined) == false)
        throw("at least one histogram has not defined a required property (x, p or unit)");
    if (histograms.map(el => el.unit).unique().length > 1)
        throw("units of histograms are not consistent!")
}

/**
 * Sets the values of the boundaries and the interval if not given directly
 * 
 * @author localhorst87
 * @private
 * @param {DiscreteDistribution[]} histograms cumulative histograms
 * @param {PBoxesConfig} config the configuration for the P-Boxes
 * @param {number} [offset] optional epistemic uncertainty offset
 * @returns {PBoxesConfig} the corrected configuration for the P-Boxes
 */
function postprocessConfig(histograms, config, offset) {
    const xValues = histograms.map(hist => hist.x).flat();

    if (config.interval === undefined)
    {
        let lsdValues = xValues.map(x => util.getLsd(x));

        if (offset !== 0)
            lsdValues.push(util.getLsd(offset));
        const lsd = Math.max(...lsdValues);
        config.interval = util.roundToDigit(Math.pow(10, -lsd), lsd);
    }
    
    if (config.x_min === undefined)
        config.x_min = util.floorToInterval(Math.min(...xValues) - offset, config.interval);
    if (config.x_max === undefined)
        config.x_max = util.ceilToInterval(Math.max(...xValues) + offset, config.interval);
    if (config.x_min >= config.x_max)
        throw("x_max must be greater than x_min");
    
    return config;
}

/**
 * Adds an epistemic uncertainty to existing PBoxes histogram
 * 
 * @author localhorst87
 * @private
 * @param {PBoxes} pBoxes the PBoxes object to add the uncertainty to
 * @param {number} uncertainty the epistemic uncertainty to add
 */
function addUncertainty(pBoxes, uncertainty) {
    // uncertainty is considered to be epistemic, therefore the 
    // offset is added to the random variable (SRQs)
    const lsdX = Math.max(...pBoxes.x.map(x => util.getLsd(x)));
    const xLower = pBoxes.x.map(x => util.roundToDigit(x + uncertainty, lsdX));
    const xUpper = pBoxes.x.map(x => util.roundToDigit(x - uncertainty, lsdX));

    const newLowerHist = {
        type: "CDF",
        x: xLower,
        p: pBoxes.p_lower,
        unit: pBoxes.unit
    };

    const newUpperHist = {
        type: "CDF",
        x: xUpper,
        p: pBoxes.p_upper,
        unit: pBoxes.unit
    };

    // for automatic config, in the call stack xMin, xMax and interval are selected in such a way
    // that no precision or data gets lost!
    const interval = util.roundToDigit(pBoxes.x[1] - pBoxes.x[0], lsdX); 
    const xMin = pBoxes.x[0];
    const xMax = pBoxes.x[pBoxes.x.length - 1];

    return calcPBoxes([newLowerHist, newUpperHist], xMin, xMax, interval);
}

/**
 * Does the actual calculation to get the P-Boxes
 * 
 * @author localhorst87
 * @private
 * @param {DiscreteDistribution[]} histograms cumulative histograms
 * @param {number} xMin the minimum of the random variable
 * @param {number} xMax the maximum of the random variable
 * @param {number} xInterval the step size of the random variable
 * @returns {PBoxes} P-Boxes calculated from the histograms
 */
function calcPBoxes(histograms, xMin, xMax, xInterval) {
    let pBoxes = {
        p_lower: [],
        p_upper: [],
        x: [],
        unit: undefined
    };

    const nSamples = Math.round((xMax - xMin) / xInterval + 1);
    pBoxes.x = Array.from({length: nSamples}, (_, i) => util.roundToInterval(xMin + xInterval * i, xInterval));

    for (let x of pBoxes.x) {

        let probabilities = [];
    
        for (let hist of histograms) {
            let idx = hist.x.findLastIndex(el => el <= x);
    
            if (idx == hist.x.length) {
                probabilities.push(0);
            }
            else {
                probabilities.push(hist.p[idx]);
            }

        }
    
        pBoxes.p_upper.push(Math.max(...probabilities));
        pBoxes.p_lower.push(Math.min(...probabilities));
    }

    pBoxes.unit = histograms[0].unit; // consistency of units is checked before in calling function!

    return pBoxes;
}