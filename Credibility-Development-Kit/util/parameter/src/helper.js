const { Signal } = require("../../signal");
const util = require("../../util-common");
const mathjs = require("mathjs");

/**
 * @typedef {import('../types/types').ScalarParameter} ScalarParameter
 * @typedef {import('../types/types').SamplingConfig} SamplingConfig
 */

 const N_SAMPLES_DEFAULT = 5;
 const METHOD_DEFAULT = "equally spaced";

/**
 * Checks the input parameters for createSamples:
 * 
 * 1) check if parameter array only contains ScalarParameters
 * 
 * 2) check if configuration parameters are defined according to the given parameter combination
 * 
 * @author localhorst87
 * @private
 * @param {ScalarParameter[]} parameters parameter array input
 * @param {SamplingConfig} config number of samples and method definition
 */
function checkSamplingInputs(parameters, config) {
    for (let parameter of parameters) {
        if (parameter.constructor.name != "ScalarParameter")
            throw("only ScalarParameter objects allowed as parameters input");
    }

    let nOf = extractParameterCombination(parameters);

    // check for inconstistent inputs
    if (nOf.discrete > 0 && nOf.aleatory == 0 && nOf.epistemic == 0)
        throw("sampling for discrete parameters not possible, as only one value is possible");
    if (config.samples <= 0 || config.samples_aleatory <= 0 || config.samples_epistemic <= 0)
        throw("number of samples must be greater than 0");
    if (nOf.epistemic > 0 && nOf.aleatory > 0 && config.samples !== undefined && (config.samples_epistemic === undefined || config.samples_aleatory === undefined))
        throw("for mixed sampling (aleatory and epistemic), number of samples must be given individually (via config.samples_aleatory and .samples_epistemic");
    if (nOf.epistemic > 0 && nOf.aleatory > 0 && config.method !== undefined && (config.method_epistemic === undefined || config.method_aleatory === undefined))    
        throw("for mixed sampling (aleatory and epistemic), sampling method must be given individually (via config.method_aleatory and .method_epistemic");

    // set default values if values are missing
    if (nOf.aleatory > 0 && config.samples === undefined && config.samples_aleatory === undefined)
        config.samples_aleatory = N_SAMPLES_DEFAULT;
    if (nOf.epistemic > 0 && config.samples === undefined && config.samples_epistemic === undefined)
        config.samples_epistemic = N_SAMPLES_DEFAULT;
    if (nOf.aleatory > 0 && config.method === undefined && config.method_aleatory === undefined)
        config.method_aleatory = METHOD_DEFAULT;
    if (nOf.epistemic > 0 && config.method === undefined && config.method_epistemic === undefined)
        config.method_epistemic = METHOD_DEFAULT;
    
    // post-processing
    if (nOf.aleatory > 0 && nOf.epistemic == 0 && config.samples > 0 && config.samples_aleatory === undefined)
        config.samples_aleatory = config.samples;
    if (nOf.aleatory == 0 && nOf.epistemic > 0 && config.samples > 0 && config.samples_epistemic === undefined)
        config.samples_epistemic = config.samples;
    if (nOf.aleatory > 0 && nOf.epistemic == 0 && config.method !== undefined && config.method_aleatory === undefined)
        config.method_aleatory = config.method;
    if (nOf.aleatory == 0 && nOf.epistemic > 0 && config.method !== undefined && config.method_epistemic === undefined)
        config.method_epistemic = config.method;

    return config;
}

/**
 * Generate samples from parameters that are represented as 
 * cumulative distribution function.
 * 
 * Currently, "equally_spaced" and "monte_carlo" are available as sampling
 * methods. "equally_spaced" will create equidistant samples on the
 * probability scale and "monte_carlo" will create random samples on the 
 * probability scale - these samples are then mapped to samples of the random 
 * variable (i.e., the parameter values).
 * 
 * Samples are returned according to the following pattern, if m is the 
 * number of parameters and n the number of samples to be generated:
 * [ [x1_p1, ..., x1_pm], [x2_p1, ..., x2_pm], ..., [xn_p1, ..., xn_pm ]]
 * 
 * @author localhorst87
 * @private
 * @param {ScalarParameter[]} parameters 
 * @param {string} method The method to sample
 * @param {number} nSamples The number of sampkes
 * @returns {number[][]} generated samples
 */
function generateAleatorySamples(parameters, method, nSamples) {
    let pSamples, xSamples;
    
    xSamples = Array.from({length: nSamples}, () => []);

    for (let parameter of parameters) {
        if (method == "equally_spaced")
            pSamples = makeEquallySpacedArray(0, 1, nSamples, false, true);
        else if (method == "monte_carlo")
            pSamples = makeMonteCarloArray(0, 1, nSamples);
        else
            throw("sampling method not supported");
        
        let xSamplesParameter = getXFromPSamples(parameter, pSamples);

        // distribute the samples along the target array:
        // [ [x1_par1, x1_par2, x1_par3], [x2_par1, x2_par2, x2_par3], ...]
        for (let [i, x] of xSamplesParameter.entries()) {
            x = util.roundToInterval(x, parameter.interval);
            xSamples[i].push(x);
        }
    }

    return xSamples;
}

/**
 * Generate samples from parameters that are represented as 
 * epistemic distribution function.
 * 
 * Currently, "equally_spaced" and "monte_carlo" are available as sampling
 * methods. "equally_spaced" will create equidistant samples and "monte_carlo" 
 * will create random samples of the parameter values within the limits.
 * 
 * Samples are returned according to the following pattern, if m is the 
 * number of parameters and n the number of samples to be generated:
 * [ [x1_p1, ..., x1_pm], [x2_p1, ..., x2_pm], ..., [xn_p1, ..., xn_pm ]]
 * 
 * @author localhorst87
 * @private
 * @param {ScalarParameter[]} parameters 
 * @param {string} method The method to sample
 * @param {number} nSamples The number of sampkes
 * @returns {number[][]} generated samples
 */
function generateEpistemicSamples(parameters, method, nSamples) {
    let xSamples = Array.from({length: nSamples}, () => []);

    for (let parameter of parameters) {
        let [min, max] = parameter.limits;
        let xSamplesParameter;

        if (method == "equally_spaced")
            xSamplesParameter = makeEquallySpacedArray(min, max, nSamples, true, true);
        else if (method == "monte_carlo")
            xSamplesParameter = makeMonteCarloArray(min, max, nSamples);
        else
            throw("sampling method not supported");

        // distribute the samples along the target array:
        // [ [x1_p1, x1_p2, x1_p3], [x2_p1, x2_p2, x2_p3], ...]
        for (let [i, x] of xSamplesParameter.entries()) {
            x = util.roundToInterval(x, parameter.interval);
            xSamples[i].push(x);
        }
    }

    return xSamples;
}

/**
 * Extracts the parameter combination for sample generation:
 * 
 * @author localhorst87
 * @private
 * @param {ScalarParameter[]} parameters all parameters as an array
 * @returns {Objects} the number of parameter uncertainty types
 */
function extractParameterCombination(parameters) {
    let nAleatory = nEpistemic = nDiscrete = 0;

    for (let par of parameters) {
        nAleatory += par.uncertainty_classification == "aleatory";
        nEpistemic += par.uncertainty_classification == "epistemic";
        nDiscrete += par.uncertainty_classification == "discrete";
    }

    return {
        aleatory: nAleatory,
        epistemic: nEpistemic,
        discrete: nDiscrete
    };
}

function makeMonteCarloArray(min, max, nSamples) {
    return Array.from({length: nSamples}, () => Math.random() * (max - min) + min);
}

/**
 * Creates an array with equal intervals between the each sample. IF includeBoundaries is 
 * set to false, the first sample will be the min and the last sample will be the max
 * sample, otherwise the first sample will have a the half interval distance to the min 
 * value (same for last sample and max value).
 * 
 * @author localhorst87
 * @private
 * @param {number} min The smallest possible value 
 * @param {number} max The highest possible value
 * @param {number} nSamples The number of samples to be generated
 * @param {boolean} includeBoundaries if true, min and max will be included
 * @param {boolean} [shuffleArray=false] if true, the order will be shuffled
 * @returns {number[]} The equally spaced array
 */
function makeEquallySpacedArray(min, max, nSamples, includeBoundaries, shuffleArray = false) {
    let dist, start;

    if (includeBoundaries == true) {
        dist = (max - min) / (nSamples - 1);
        start = min;
    }
    else {
        dist = (max - min) / nSamples;
        start = min + dist / 2;
    }

    let array = Array.from({length: nSamples}, (_, i) => start + dist * i);

    if (shuffleArray == true)
        array = shuffle(array);

    return array;
}

/**
 * based on samples of cumulated probabilities (between 0 and 1), samples from the
 * random variable will be returned. Practically, it's applying the discrete inverse 
 * function of the CDF (f: p -> x)
 * 
 * @author localhorst87
 * @private
 * @param {ScalarParameter} parameter The parameter to sample from
 * @param {number[]} pSamples The samples of the cumulated probability (between 0 and 1)
 * @returns {number[]} The samples of the parameter value
 */
function getXFromPSamples(parameter, pSamples) {
    let samples = [];

    let cdf = parameter.calcCdf();
    let cdfWrapped = new Signal(cdf.p, cdf.x, {name: "helper", precision: 15});

    for (let p of pSamples) {
        let x = cdfWrapped.interpolate([p]).values[0];
        samples.push(x);
    }    

    return samples;
}

/**
 * Shuffles the entries of an array
 * 
 * @author localhorst87
 * @private
 * @param {any[]} array The array to shuffle
 * @returns {any[]} The shuffled array
 */
function shuffle(array) {
    let shuffledArray = [];
    array = [...array];
    while (array.length > 0) {
        let pick = mathjs.randomInt(0, array.length); // max element is EXCLUDED !
        shuffledArray.push(array[pick]);
        array.splice(pick, 1);
    }
    return shuffledArray;
}

module.exports = {
    extractParameterCombination,
    makeEquallySpacedArray,
    makeMonteCarloArray,
    getXFromPSamples,
    generateAleatorySamples,
    generateEpistemicSamples,
    checkSamplingInputs,
    shuffle,
    N_SAMPLES_DEFAULT,
    METHOD_DEFAULT
};