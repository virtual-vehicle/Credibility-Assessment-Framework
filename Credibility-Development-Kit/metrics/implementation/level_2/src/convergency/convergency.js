const util = require('../../../../../util/util-common');
const { Signal } = require('../../../../../util/signal');
const schemas = require('../../types/schemas');

/**
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

exports.verifyConvergency = verifyConvergency;

/**
 * Verifies if the solution to the discretized equations approaching the continuum solution to the partial 
 * differential equations in the limit of decreasing element size.
 *
 * @author localhorst87
 * @param {string} resultExact
 * @param {...string} resultDiscretized
 * @return {ResultLog}
 */
function verifyConvergency(resultExact, ...resultDiscretized) {
    try {
        let resultExact = JSON.parse(resultExact);
    }
    catch (err) {
        return {
            result: false,
            log: "exact measurement can not be JSON-parsed"
        };
    }

    if (!util.isStructureValid(resultExact, schemas.MEASUREMENT)) {
        return {
            result: false,
            log: "exact measurement does not fulfill the required JSON schema"
        };
    }

    if (resultDiscretized.length < 2) {
        return {
            result: false,
            log: "at least 2 discretized measurements must be given"
        };
    }

    let discretizedSolutions = [];

    for (let resDiscr of resultDiscretized) {
        try {
            let resDiscr = JSON.parse(resDiscr);
        }
        catch (err) {
            return {
                result: false,
                log: "not all discretized measurements can be JSON-parsed"
            };
        }
        if (!util.isStructureValid(resDiscr, schemas.MEASUREMENT)) {
            return {
                result: false,
                log: "not all discretized measurements fulfill the required JSON schema"
            };
        }

        let discretizedSolution = new Signal(resDiscr.time, resDiscr.values, {name: "discretized solution", unit_values: resDiscr.unit});
        discretizedSolutions.push(discretizedSolution);
    }

    discretizedSolutions.sort((a, b) => b.timestep - a.timestep); // sort array (coarsest mesh first, finest mesh last)
    let exactSolution = new Signal(resultExact.time, resultExact.values, {name: "exact solution", unit_values: resultExact.unit});

    let lastSignal = discretizedSolutions.shift();
    let diff = lastSignal.subtract(exactSolution);
    let diffConcreteLast = diff.sliceToIndex(-1);

    while (discretizedSolutions.length > 0) {
        lastSignal = discretizedSolutions.shift();
        diff = lastSignal.subtract(exactSolution);
        
        let diffConcreteNew = diff.sliceToIndex(-1);
        if (diffConcreteNew.compare("<=", diffConcreteLast, {reduce: true}) == false) {
            return {
                result: false,
                log: "discrete solutions do not converge to exact solution"
            }
        }

        diffConcreteLast = diffConcreteNew;
    }

    return {
        result: true,
        log: "discrete solutions converge to exact solution"
    };
}