const helper = require('./uncertainty_helper');
const util = require("../../../../util/util-common");
const schemas = require("../types/schemas");

exports.evaluateAvm = evaluateAvm;
exports.evaluateNasaAvm = evaluateNasaAvm;
exports.calcAreaValidationMetric = calcAreaValidationMetric;
exports.calcAreaValidationMetricNasa = calcAreaValidationMetricNasa;

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
 * @typedef {import('../types/types').EmpiricalDistribution} EmpiricalDistribution
 * @typedef {import('../types/types').PBoxes} PBoxes 
 * @typedef {import('../types/types').ResultLog} ResultLog
 */

/**
 * Evaluates if the statistical distance (according to the Area Validation Metric) of two given distributions
 * is lower than the given threshold
 * 
 * @author localhorst87
 * @param {String} distributionSim single EDF or P-Boxes from simulation data (as stringified JSON)
 * @param {String} distributionRef single EDF or P-Boxes from reference data (as stringified JSON)
 * @param {number} threshold evaluation criterion: Area validation metric must be below this value
 * @return {ResultLog} result and log if AVM is smaller than threshold
 */
function evaluateAvm(distributionSim, distributionRef, threshold) {
    try {
        distributionSim = JSON.parse(distributionSim)
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse simulation distribution (" + err + ")"
        };
    }

    try {
        distributionRef = JSON.parse(distributionRef)
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse reference distribution (" + err + ")"
        };
    }

    if (!util.isStructureValid(distributionSim, schemas.EMPIRICAL_DISTRIBUTION_SCHEMA) && !util.isStructureValid(distributionSim, schemas.P_BOXES_SCHEMA)) {
        return {
            result: false,
            log: "simulation distribution must either implement the schema of the empirical distribution or of the p-boxes"
        };
    }

    if (!util.isStructureValid(distributionRef, schemas.EMPIRICAL_DISTRIBUTION_SCHEMA) && !util.isStructureValid(distributionRef, schemas.P_BOXES_SCHEMA)) {
        return {
            result: false,
            log: "reference distribution must either implement the schema of the empirical distribution or of the p-boxes"
        };
    }

    const avm = calcAreaValidationMetric(distributionSim, distributionRef);

    if (avm <= threshold) {
        return {
            result: true,
            log: "Area validation metric fulfills evaluation criterion (AVM = " + String(avm) + " " + distributionSim.unit + " <= " + String(threshold) + " " + distributionSim.unit + ")"
        }
    }
    else {
        return {
            result: false,
            log: "Area validation metric does not fulfill evaluation criterion (AVM = " + String(avm) + " " + distributionSim.unit + " > " + String(threshold) + " " + distributionSim.unit + ")"
        }     
    }
}

/**
 * Evaluates if the statistical distance (according to the NASA Area Validation Metric) of two given distributions
 * is lower than the given threshold
 * 
 * @author localhorst87
 * @param {String} distributionSim single EDF or P-Boxes from simulation data (as stringified JSON)
 * @param {String} distributionRef single EDF or P-Boxes from reference data (as stringified JSON)
 * @param {number} threshold evaluation criterion: Area validation metric must be below this value
 * @return {ResultLog} result and log if NASA AVM is smaller than threshold
 */
function evaluateNasaAvm(distributionSim, distributionRef, threshold) {
    try {
        distributionSim = JSON.parse(distributionSim)
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse simulation distribution (" + err + ")"
        };
    }

    try {
        distributionRef = JSON.parse(distributionRef)
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse reference distribution (" + err + ")"
        };
    }

    if (!util.isStructureValid(distributionSim, schemas.EMPIRICAL_DISTRIBUTION_SCHEMA) && !util.isStructureValid(distributionSim, schemas.P_BOXES_SCHEMA)) {
        return {
            result: false,
            log: "simulation distribution must either implement the schema of the empirical distribution or of the p-boxes"
        };
    }

    if (!util.isStructureValid(distributionRef, schemas.EMPIRICAL_DISTRIBUTION_SCHEMA) && !util.isStructureValid(distributionRef, schemas.P_BOXES_SCHEMA)) {
        return {
            result: false,
            log: "reference distribution must either implement the schema of the empirical distribution or of the p-boxes"
        };
    }

    const avm = calcAreaValidationMetricNasa(distributionSim, distributionRef);

    if (avm <= threshold) {
        return {
            result: true,
            log: "NASA Area validation metric fulfills evaluation criterion (NASA AVM = " + String(avm) + " " + distributionSim.unit + " <= " + String(threshold) + " " + distributionSim.unit + ")"
        }
    }
    else {
        return {
            result: false,
            log: "NASA Area validation metric does not fulfill evaluation criterion (NASA AVM = " + String(avm) + " " + distributionSim.unit + " > " + String(threshold) + " " + distributionSim.unit + ")"
        }     
    }
}

/**
 * Calculates the area validation metric as the smallest possible areas between the distributions.
 * The distributions can be either empirical distribution functions or p-boxes
 * 
 * @author lvtan3005
 * @param {EmpiricalDistribution | PBoxes} distributionSim single EDF or P-Boxes from simulation data
 * @param {EmpiricalDistribution | PBoxes} distributionRef single EDF or P-Boxes from reference data
 * @return {number} the area validation metric
 */
function calcAreaValidationMetric(distributionSim, distributionRef) {
    distributionSim = helper.unifyDistribution(distributionSim);
    distributionRef = helper.unifyDistribution(distributionRef);

    let allX = distributionRef.x;
    allX = allX.concat(distributionSim.x);
    allX = allX.unique().sort((a,b) => a-b);    
    let avm = 0;

    const lsdX = Math.max(...distributionSim.p_right.map(v => util.getLsd(v)));

    for(let [ix, x] of allX.entries()) {
        let pidx_data = distributionSim.x.findLastIndex(el => el <= x);
        let p_left_data = distributionSim.p_left[pidx_data] || 0;
        let p_right_data = distributionSim.p_right[pidx_data] || 0;
        
        let pidx_exp = distributionRef.x.findLastIndex(el => el <= x);
        let p_left_exp = distributionRef.p_left[pidx_exp] || 0;
        let p_right_exp = distributionRef.p_right[pidx_exp] || 0;

        if (p_right_exp >  p_left_data) {
            diff = (p_right_exp - p_left_data) * (allX[ix+1] - allX[ix]);
            diff = util.roundToDigit(diff, lsdX);
            avm += diff;
        } 

        if (p_left_exp < p_right_data) {
            diff = (p_right_data - p_left_exp) * (allX[ix+1] - allX[ix]);
            diff = util.roundToDigit(diff, lsdX);
            avm += diff;
        } 
    }

    return avm;
}

/**
 * Calculates the area validation metric as the outter areas between the distributions.
 * The distributions can be either empirical distribution functions or p-boxes
 * 
 * @author lvtan3005
 * @param {EmpiricalDistribution | PBoxes} distributionSim single EDF or P-Boxes from simulation data
 * @param {EmpiricalDistribution | PBoxes} distributionRef single EDF or P-Boxes from reference data
 * @return {number} the area validation metric
 */
function calcAreaValidationMetricNasa(distributionSim, distributionRef) {
    distributionSim = helper.unifyDistribution(distributionSim);
    distributionRef = helper.unifyDistribution(distributionRef);

    let allX = distributionRef.x;
    allX = allX.concat(distributionSim.x);
    allX = allX.unique().sort((a,b) => a-b);    
    let avm = 0;

    const lsdX = Math.max(...distributionSim.p_right.map(v => util.getLsd(v)));

    for(let [ix, x] of allX.entries()) {
        let pidx_data = distributionSim.x.findLastIndex(el => el <= x);
        let p_left_data = distributionSim.p_left[pidx_data] || 0;
        let p_right_data = distributionSim.p_right[pidx_data] || 0;
        
        let pidx_exp = distributionRef.x.findLastIndex(el => el <= x);
        let p_left_exp = distributionRef.p_left[pidx_exp] || 0;
        let p_right_exp = distributionRef.p_right[pidx_exp] || 0;
        
        if (p_left_exp > p_left_data) {
            diff = (p_left_exp - p_left_data) * (allX[ix+1] - allX[ix]);
            diff = util.roundToDigit(diff, lsdX);
            avm += diff;
        }
        if (p_right_exp < p_right_data) {
            diff = (p_right_data - p_right_exp) * (allX[ix+1] - allX[ix]);
            diff = util.roundToDigit(diff, lsdX);
            avm += diff;
        }

    }

    return avm;
}