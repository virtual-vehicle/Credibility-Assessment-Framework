const { Signal } = require('../../../../../util/signal');

exports.verifyDiscretizationError = verifyDiscretizationError;

/**
 * Verifies if the discretization error is within the expected range, using generalized Richardson extrapolation 
 * for different time meshes.
 * 
 * It estimates the error in numerical solutions based on numerical solutions on two or more 
 * meshes with different levels of refinement. The numerical solutions are used to obtain 
 * a higher-order estimate of the exact solution. This estimate of the exact solution can 
 * be used to estimate the error in the numerical solutions.
 * 
 * @author localhorst87
 * @param {string} results1 first simulation results 
 * @param {string} results2 second simulation results, must be from the same experiment as results1
 *                          but with a different time step size
 * @param {number | string} timeToEvaluateStart the start time for evaluating the discretization error, as typically not 
 *                                              the complete results will be evaluated but only a meaningful snippet
 * @param {number | string} timeToEvaluateEnd the end time for evaluating the discretization error, as typically not the
 *                                            complete results will be evaluated but only a meaningful snippet
 * @param {number | string} p the order of the numerical scheme - for details, study richardson extrapolation :)
 * @param {number | string} errorThresholdPercentage the allowed discretization error in %
 * @return {ResultLog}
 */
function verifyDiscretizationError(results1, results2, timeToEvaluateStart, timeToEvaluateEnd, p, errorThresholdPercentage) {
    try {
        let results1 = JSON.parse(results1);
    }
    catch (err) {
        return {
            result: false,
            log: "results1 could not be JSON-parsed"
        }
    }

    try {
        let results2 = JSON.parse(results2);
    }
    catch (err) {
        return {
            result: false,
            log: "results2 could not be JSON-parsed"
        }
    }

    let signal1 = new Signal(results1.time, results1.values, {name: "reference signal", unit_values: results1.unit});
    let signal2 = new Signal(results2.time, results2.values, {name: "reference signal", unit_values: results2.unit});
    
    signal1 = signal1.sliceToTime(Number(timeToEvaluateStart), Number(timeToEvaluateEnd));
    signal2 = signal2.sliceToTime(Number(timeToEvaluateStart), Number(timeToEvaluateEnd));

    let exactSignalApprox = richardsonExtrapolationTime(signal1, signal2, Number(p));

    let diffSignal = signal1.subtract(exactSignalApprox);
    let errorSignal = diffSignal.divide(exactSignalApprox);

    if (errorSignal.values.every(err => 100 * err <= Number(errorThresholdPercentage))) {
        return {
            result: true,
            log: "discretization error is below allowed error"
        };
    }
    else {
        return {
            result: false,
            log: "discretization error exceeds allowed error"
        };
    }
}

/**
 * Generalized Richardson extrapolation for different time meshes.
 * Estimates the error in numerical solutions based on numerical solutions on two or more 
 * meshes with different levels of refinement. The numerical solutions are used to obtain 
 * a higher-order estimate of the exact solution. This estimate of the exact solution can 
 * be used to estimate the error in the numerical solutions.
 *
 * @author: localhorst87
 * @param {Signal} signal1 Fine-meshed simulation results (if signal2 is coarse-meshed, else vice versa)
 * @param {Signal} signal2 Coarse- meshed simulation results (if signal2 is fine-meshed, else vice versa)
 * @param {number} p The accuracy order of the numerical scheme
 * @return {Signal} An estimation of the exact solution
 */
function richardsonExtrapolationTime(signal1, signal2, p = 2) {
    if (!Number.isInteger(p) || p < 1 )
        throw("p must be an integer value greater than 0");

    if (signal1.duration != signal2.duration)
        throw("Duration of both Signals is not the same");
    
    if (signal1.time[0] != signal2.time[0])
        throw("Signals do not cover the same time range");

    let dt1 = signal1.timestep; // Signal.timestep will throw an error if step size is not consistent throughout the Signal
    let dt2 = signal2.timestep;
    
    let coarseSignal, fineSignal;
    let coarseStep, fineStep;

    if (dt1 > dt2) {
        coarseSignal = signal1.copy();
        fineSignal = signal2.copy();
        coarseStep = dt1;
        fineStep = dt2;
    }
    else if (dt2 > dt1) {
        coarseSignal = signal2.copy();
        fineSignal = signal1.copy();
        coarseStep = dt2;
        fineStep = dt1;
    }
    else 
        throw("The time step sizes of the given Signals must be different!");
    
    let r = coarseStep / fineStep; // mesh refinement factor
    fineSignal = fineSignal.interpolate(coarseSignal.time);    

    return fineSignal.add(fineSignal.subtract(coarseSignal).divide(Math.pow(r, p) - 1)); // f_fine + (f_fine - f_coarse) / (r^p - 1)
}