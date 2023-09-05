const helper = require('./src/uncertainty_helper');
const util = require("../util-common");

exports.createEmpiricalDistribution = createEmpiricalDistribution;
exports.createPBoxes = createPBoxes;
exports.addUncertainty = addUncertainty;

/**
 * @module util/uncertainty
 * @memberof util
 */

/**
 * @typedef {import('./types/types').EmpiricalDistribution} EmpiricalDistribution
 * @typedef {import('./types/types').PBoxesConfig} PBoxesConfig
 * @typedef {import('./types/types').PBoxes} PBoxes 
 */

/**
 * Creates a cumulative empirical distribution from discrete data or Signals and an evaluation function
 * 
 * 
 * @author localhorst87 
 * @param {number[] | Signal[]} data array of concrete results or array of Signals
 * @param {Function} [evalFn] must be used if data is given as Signal array to know how to evaluate each Signal
 * @return {EmpiricalDistribution}
 */
function createEmpiricalDistribution(data, evalFn) {
    if (!Array.isArray(data))
        throw("data must be given as array");
    if (data.length <= 1)
        throw("more than 1 sample required");
    
    if (data.every(el => el.constructor.name == "Number")) {
        return helper.calcEmpiricalDistribution(data, "unknown");
    }
    else if (data.every(el => el.constructor.name == "Signal")) {
        if (evalFn === undefined)
            throw("if data is given as Signal array, an evaluation function must be given");
        if (typeof(evalFn) !== "function")
            throw("evaluation function must be a valid function");

        const unit = data[0].units.values;
        data = data.map(signal => evalFn(signal)); // apply evaluation function

        return helper.calcEmpiricalDistribution(data, unit);
    }
    else
        throw("data must be either an array of numbers or Signals");
}

/**
 * Creates probability boxes from several single cumulative distributions.
 * 
 * @author localhorst87 
 * @param {EmpiricalDistribution[]} edfs empirical (cumulative) distribution functions to extract max and min boundaries from
 * @param {PBoxesConfig} [config] the configuration
 * @return {PBoxes} the identified P-Boxes from the ensemble of EDFs
 */
function createPBoxes(edfs, config) {
    let pBoxes;

    // check first argument
    if (!Array.isArray(edfs))
        throw("empirical distributions must be given as array");
    if (edfs.length <= 1)
        throw("more than one empirical distribution is required for a P-Box");
    
    // no config given => auto config
    if (config === undefined)
        config = {};   
    else
        if (typeof(config) !== "object")
            throw("if two arguments are given, the second argument must be a configuration object")

    const isIntervalGiven = config.interval !== undefined;

    helper.checkEdfArray(edfs);
    config = helper.postprocessConfig(edfs, config);
    pBoxes = helper.calcPBoxes(edfs, config.x_min, config.x_max, config.interval);

    if (!isIntervalGiven)
        pBoxes = helper.removeRedundantValues(pBoxes);
    
    return pBoxes;
}

/**
 * Adds an epistemic uncertainty to existing P-Boxes
 * 
 * @author localhorst87, lvtan3005
 * @param {PBoxes | EmpiricalDistribution} distribution the EDF or p-Box to add the uncertainty to
 * @param {number | number[]} uncertainty the epistemic uncertainty to add. If a plain number is given, the uncertainty is added to both sides;
 *                                        if it is an array, the uncertainty is added specifically according to the array: [left, right]
 * @param {boolean} [keepIntervals=true]
 * @returns {PBoxes} the resulting p-boxes with the added uncertainty
 */
function addUncertainty(distribution, uncertainty, keepIntervals = true) {
    let xLeft = [];
    let xRight = [];
    let lsdX;

    // uncertainty is considered to be epistemic, therefore the offset is added to the random variable (SRQs)
    if (typeof(uncertainty) == "number") {
        lsdX = Math.max(...distribution.x.map(x => util.getLsd(x)), util.getLsd(uncertainty));
        xLeft = distribution.x.map(x => util.roundToDigit(x - uncertainty, lsdX));
        xRight = distribution.x.map(x => util.roundToDigit(x + uncertainty, lsdX));
    } else if (Array.isArray(uncertainty)) {
        lsdX = Math.max(...distribution.x.map(x => util.getLsd(x)), ...uncertainty.map(x => util.getLsd(x)));
        xLeft = distribution.x.map(x => util.roundToDigit(x - uncertainty[0], lsdX));
        xRight = distribution.x.map(x => util.roundToDigit(x + uncertainty[1], lsdX));
    } else
        throw("uncertainty must be given as plain number or as an array of two numbers");

    let pLeft, pRight;

    if (helper.isEdf(distribution)) {
        pLeft = distribution.p;
        pRight = distribution.p;
    }
    else if (helper.isPBox(distribution)) {
        pLeft = distribution.p_left;
        pRight = distribution.p_right;
    }
    else
        throw("distribution must be either an empirical distribution function or p-boxes");

    const newLeftEdf = {
        type: "CDF",
        x: xLeft,
        p: pLeft,
        unit: distribution.unit
    };

    const newRightEdf = {
        type: "CDF",
        x: xRight,
        p: pRight,
        unit: distribution.unit
    };

    let pBoxes;

    // if keepIntervals is true, the (shifted) intervals from the original distributions are used
    // if keepIntervals is false, only the discrete step-ticks are used as intervals
    if (keepIntervals) {
        const xLeftStripped = helper.stripXLeft(newLeftEdf.x, newLeftEdf.p); // x without redundant ones
        const xRightStripped = helper.stripXRight(newRightEdf.x, newRightEdf.p); // x without redundant zeros
        const allX = xLeftStripped.concat(xRightStripped).unique().sort((a,b) => a-b); // all unique x values sorted

        pBoxes = helper.calcPBoxes([newLeftEdf, newRightEdf], allX);
    }
    else {
        const interval = util.roundToDigit(Math.pow(10, -lsdX), lsdX);
        const xMin = Math.min(...newLeftEdf.x, ...newRightEdf.x);
        const xMax = Math.max(...newLeftEdf.x, ...newRightEdf.x);

        pBoxes = helper.calcPBoxes([newLeftEdf, newRightEdf], xMin, xMax, interval);
        pBoxes = helper.removeRedundantValues(pBoxes);
    }

    return pBoxes;
}