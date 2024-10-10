const { Signal } = require('cdk-signal');

/**
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

exports.verifyConvergency = verifyConvergency;

/**
 * Verifies if the solution to the discretized equations approaching the continuum solution to the partial 
 * differential equations in the limit of decreasing element size.
 *
 * @author localhorst87
 * @param {string} signalName the signal where convergency shall be evaluated
 * @param {number | string} nSamples number of equidistant samples to test
 * @param {string} resultExact
 * @param {...string} resultsDiscretized
 * @return {ResultLog}
 */
function verifyConvergency(signalName, nSamples, resultExact, ...resultsDiscretized) {
    var signalExact;
    try {
        resultExact = JSON.parse(resultExact);
        let signalsExact = resultExact.map(signalString => new Signal(signalString)); // Signal[]
        signalExact = signalsExact.filter(signal => signal.name == signalName)[0];
    }
    catch (err) {
        return {
            result: false,
            log: "exact measurement can not be JSON-parsed, does not fulfill the Signal import schema or Signal is not available"
        };
    }

    if (resultsDiscretized.length < 2) {
        return {
            result: false,
            log: "at least 2 discretized measurements must be given"
        };
    }

    let discretizedSolutions = []; // will be of type Signal[][]

    for (let resultDiscretized of resultsDiscretized) {
        var signalDiscretized;
        try {
            resultDiscretized = JSON.parse(resultDiscretized);
            let signalsDiscretized = resultDiscretized.map(signalString => new Signal(signalString)); // Signal[]
            signalDiscretized = signalsDiscretized.filter(signal => signal.name == signalName)[0];
        }
        catch (err) {
            return {
                result: false,
                log: "not all discretized measurements can be JSON-parsed or fulfill the Signal import schema"
            };
        }

        discretizedSolutions.push(signalDiscretized);
    }

    discretizedSolutions.sort((a, b) => b.timestep - a.timestep); // sort array (coarsest mesh first, finest mesh last)

    let lastSignal = discretizedSolutions.shift();
    let diffBefore = lastSignal.subtract(signalExact);

    while (discretizedSolutions.length > 0) {
        lastSignal = discretizedSolutions.shift();
        diffNew = lastSignal.subtract(signalExact);

        let timePointsToEvaluate = getEquidistantTimepoints(diffNew.duration, Number(nSamples));
        valuesToCompareBefore = timePointsToEvaluate.map(t => diffBefore.value(t));
        valuesToCompareNew = timePointsToEvaluate.map(t => diffNew.value(t));

        for (let i = 0; i < valuesToCompareNew.length; i++) {
            if (Math.abs(valuesToCompareNew[i]) > Math.abs(valuesToCompareBefore[i])) {
                return {
                    result: false,
                    log: "discrete solutions do not converge to exact solution"
                }
            }
        }                   

        diffBefore = diffNew;
    }

    return {
        result: true,
        log: "discrete solutions converge to exact solution"
    };
}

function getEquidistantTimepoints(duration, nSamples) {
    let dt = duration / (nSamples + 1);
    
    let timepoints = [];
    for (let i=1; i <= nSamples; i++) {
        timepoints.push(dt*i);
    }

    return timepoints;
}