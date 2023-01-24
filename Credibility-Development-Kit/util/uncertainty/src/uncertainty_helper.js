const util = require("../../util-common");

exports.calcEmpiricalDistribution = calcEmpiricalDistribution;
exports.checkEdfArray = checkEdfArray;
exports.calcPBoxes = calcPBoxes;
exports.postprocessConfig = postprocessConfig;
exports.checkPBoxes = checkPBoxes;
exports.unifyDistribution = unifyDistribution;
exports.removeRedundantValues = removeRedundantValues;
exports.stripXLeft = stripXLeft;
exports.stripXRight = stripXRight;
exports.isEdf = isEdf;
exports.isPBox = isPBox;


/**
 * @typedef {import('../types/types').EmpiricalDistribution} EmpiricalDistribution
 * @typedef {import('../types/types').PBoxesConfig} PBoxesConfig
 * @typedef {import('../types/types').PBoxes} PBoxes
 */

// helper methods for arrays to make array unique
Array.prototype.unique = function () {
    return this.filter((val, i, self) => self.indexOf(val) === i);
}

// helper method to get difference between subsequent elements
Array.prototype.diff = function () {
    return this.slice(1).map((val,i) => val - this.slice(0, -1)[i])
}

// helper methods for arrays to find last index according to a condition
// based on current proposal: https://github.com/tc39/proposal-array-find-from-last
Array.prototype.findLastIndex = function (fn) {
    return this.length - 1 - [...this].reverse().findIndex(fn);
}

/**
 * Does the actual calculation to get a cumulative empirical distribution function from concrete data samples
 * 
 * @author localhorst87
 * @private
 * @param {number[]} data discrete values for calculating the cumulative distribution
 * @param {string} unit the unit of the random variable
 * @returns {EmpiricalDistribution} the cumulative empirical distribution function
 */
 function calcEmpiricalDistribution(data, unit) {
    let edf = {
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
        edf.x.push(uniqueValue);
        edf.p.push(nSamples / nSamplesTotal);
    }

    return edf;
}

/**
 * Checks if empirical distribution array is filled correctly
 * 
 * @author localhorst87
 * @private
 * @param {EmpiricalDistribution[]} edfs cumulative empirical distribution functions
 */
function checkEdfArray(edfs) {
    if (edfs.every(el => el.x.length == el.p.length) == false)
        throw("Lenght of Array x and p are not the same");
    if (edfs.every(el => el.x !== undefined && el.p !== undefined && el.unit !== undefined) == false)
        throw("at least one EDF has not defined a required property (x, p or unit)");
    if (edfs.map(el => el.unit).unique().length > 1)
        throw("units of EDFs are not consistent!");
    if (edfs.every(el => Math.max(...el.p) <= 1) == false)
        throw("probability values of EDFs must not be greater than 1");
    if (edfs.every(el => el.type=="CDF" ? Math.min(...el.p.diff()) >= 0 : true ) == false)
        throw("probability values of the EDF must be monotonously increasing");
    if (edfs.every(el => el.type=="CDF" ? Math.min(...el.x.diff()) > 0 : true ) == false)
        throw("random variable values of the EDF must be increasing");
    
    return true;
}

/**
 * Checks if pBox is filled correctly
 * 
 * @author lvtan3005
 * @private
 * @returns {PBoxes} valid P-Boxes
 */
 function checkPBoxes(pBoxes) {
    if (!pBoxes.p_right || !pBoxes.p_left || !pBoxes.unit || !pBoxes.x) {
        throw("at least one of attributes in PBox has not defined a required property (x, p_right, p_higher or unit)");
    }

    if (pBoxes.p_right.length != pBoxes.p_left.length || pBoxes.x.length != pBoxes.p_left.length) {
        throw("Array in PBox should have the same length");
    }

    if (Math.min(...pBoxes.x.diff()) <= 0) {
        throw("x values of the P-Box EDFs must be increasing");
    }
    if (Math.min(...pBoxes.p_right.diff()) < 0) {
        throw("Lower bound values of the P-Box EDFs must be increasing");
    }
    if (Math.min(...pBoxes.p_left.diff()) < 0) {
        throw("Upper Bound values of the P-Box EDFs must be increasing");
    }

    if (pBoxes.x.every((value, index) => pBoxes.p_right[index] <= pBoxes.p_left[index]) == false) {
        throw("Value of lower array is higher than upper array");
    }
    return true;
}

/**
 * Sets the values of the boundaries and the interval if not given directly
 * 
 * @author localhorst87
 * @private
 * @param {EmpiricalDistribution[]} edfs cumulative empirical distribution functions
 * @param {PBoxesConfig} config the configuration for the P-Boxes
 * @returns {PBoxesConfig} the corrected configuration for the P-Boxes
 */
function postprocessConfig(edfs, config) {
    const xValues = edfs.map(edf => edf.x).flat();

    if (config.interval === undefined)
    {
        let lsdValues = xValues.map(x => util.getLsd(x));

        const lsd = Math.max(...lsdValues);
        config.interval = util.roundToDigit(Math.pow(10, -lsd), lsd);
    }
    
    if (config.x_min === undefined)
        config.x_min = util.floorToInterval(Math.min(...xValues), config.interval);
    if (config.x_max === undefined)
        config.x_max = util.ceilToInterval(Math.max(...xValues), config.interval);
    if (config.x_min >= config.x_max)
        throw("x_max must be greater than x_min");
    
    return config;
}

/**
 * Does the actual calculation to get the P-Boxes
 * 
 * @author localhorst87
 * @private
 * @param {EmpiricalDistribution[]} edfs (cumulative) empirical disitribution functions
 * @param {number} xMinOrXArray if xMax and xInterval given: The minimum of the random variable. 
 *                              Else: the target x values
 * @param {number} [xMax] if xMin and xInterval given: The maximum of the random variable.
 * @param {number} [xInterval] if xMin and xMax given: The step size of the random variable
 * @returns {PBoxes} P-Boxes calculated from the EDFs
 */
function calcPBoxes(edfs, xMinOrXArray, xMax, xInterval) {
    let pBoxes = {
        p_right: [],
        p_left: [],
        x: [],
        unit: undefined
    };

    if (Array.isArray(xMinOrXArray)) {
        pBoxes.x = xMinOrXArray;
    }
    else {
        const xMin = xMinOrXArray;
        const nSamples = Math.round((xMax - xMin) / xInterval + 1);
        pBoxes.x = Array.from({length: nSamples}, (_, i) => util.roundToInterval(xMin + xInterval * i, xInterval));
    }

    for (let x of pBoxes.x) {

        let probabilities = [];
    
        for (let edf of edfs) {
            let idx = edf.x.findLastIndex(el => el <= x);
    
            if (idx == edf.x.length) {
                probabilities.push(0);
            }
            else {
                probabilities.push(edf.p[idx]);
            }

        }
    
        pBoxes.p_left.push(Math.max(...probabilities));
        pBoxes.p_right.push(Math.min(...probabilities));
    }

    pBoxes.unit = edfs[0].unit; // consistency of units is checked before in calling function!

    return pBoxes;
}

function isEdf(input) {
    if (input.type === undefined || input.x === undefined || input.p === undefined)
        return false;
    if (input.type !== "CDF")
        return false;
    else
        return true;
}

function isPBox(input) {
    if (input.x === undefined || input.p_right === undefined || input.p_left === undefined)
        return false;
    else
        return true;
}

/**
 * In case it's unknown if an EDF or P-Boxes are handed over, this function can be used for unification by 
 * returning a P-Box:
 * 
 * If an EDF is passed to the function, it will create a P-Box from it, with p_left = p_right
 * 
 * If a P-Box is passed, it will simply be checked if formulated correctly
 * 
 * @param {EmpiricalDistribution | PBoxes} distribution a cumulative empirical distribution function (EDF) or P-Boxes
 * @returns {PBoxes} unified distribution object
 */
function unifyDistribution(distribution) {
    if(isPBox(distribution)) {
        // check if P-Box is formulated correctly
        checkPBoxes(distribution);
    }
    else if (isEdf(distribution)) {
        // convert EDF to p-box with left boundary equal to right boundary to unify further calculations
        distribution = {
            x: distribution.x,
            p_right: distribution.p,
            p_left: distribution.p,
            unit: distribution.unit,
        };
    }
    else
        throw("distribution of simulation values must be either an empirical distribution or p-boxes");
    
    return distribution;
}

/**
 * Removes redundant values from a P-Boxes object. That is all consecutive
 * values where p_left and p_right are consecutive equal.
 * 
 * @param {PBoxes} pBoxes p-boxes to clean the values for
 * @returns {PBoxes} p-boxes without redundant values
 */
function removeRedundantValues(pBoxes) {
    let keepIdx = [];

    // take first value only if p_left and p_right not both zero
    if (pBoxes.p_left[0] > 0 || pBoxes.p_right[0] > 0)
        keepIdx.push(0);

    for (let i = 0; i < pBoxes.x.length - 1; i++) {
        let isRedundant = pBoxes.p_left[i + 1] == pBoxes.p_left[i] && pBoxes.p_right[i + 1] == pBoxes.p_right[i];
    
        if (!isRedundant) 
            keepIdx.push(i + 1);
    }

    pBoxes.x = keepIdx.map(i => pBoxes.x[i]);
    pBoxes.p_left = keepIdx.map(i => pBoxes.p_left[i]);
    pBoxes.p_right = keepIdx.map(i => pBoxes.p_right[i]);

    return pBoxes;
}

/**
 * Removes all x-ticks where p values contain redundant 1 values
 * 
 * @param {number[]} x random variable ticks 
 * @param {number[]} p according probability values
 * @returns 
 */
function stripXLeft(x, p) {
    const endIdx = p.findIndex(val => val == 1);

    return x.slice(0, endIdx + 1);
}

/**
 * Removes all x-ticks where p values are 0
 * 
 * @param {number[]} x random variable ticks 
 * @param {number[]} p according probability values
 * @returns 
 */
function stripXRight(x, p) {
    const startIdx = p.findIndex(val => val > 0);

    return x.slice(startIdx);
}