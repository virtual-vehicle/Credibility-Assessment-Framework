const util = require("../util-common");util
const mathjs = require("mathjs");
const schemas = require("./types/schemas");
const helper = require("./src/helper");

exports.createSamples = createSamples;

/**
 * @module util/parameter
 * @memberof util
 */

/**
 * @typedef {import('./types/types').ScalarParameter} ScalarParameter
 * @typedef {import('./types/types').ParameterConfig} ParameterConfig
 * @typedef {import('./types/types').DiscreteDistribution} DiscreteDistribution
 * @typedef {import('./types/types').SamplingConfig} SamplingConfig
 * @typedef {import('./types/types').ParameterSampling} ParameterSampling
 */

const DEFAULT_UNIT = "-";
const VALID_SOURCES = ["unknown", "estimated", "provided", "computed", "measured", "calibrated"];
const N_SAMPLES_MAX = 1e4;

exports.N_SAMPLES_MAX = N_SAMPLES_MAX;

exports.ScalarParameter = class ScalarParameter {
    name;
    #data; 
    #uncertainty; 
    #source;

    /**
     * Creates an instance of a ScalarParameter with the specified information
     *
     * @author localhorst87
     * @constructor
     * @param {number} nominal The nominal value of the parameter
     * @param {ParameterConfig} config Additional configuration to describe the parameter
     * @return {ScalarParameter} The instance of a ScalarParameter
     */
    constructor(nominal, config) {
        // check argument correctness first
        if (typeof(nominal) != "number")
            throw("nominal value must be a numeric value!");
        this.#checkConfig(nominal, config);

        // init property structure
        this.#data = {
            nominal: undefined,
            upper: undefined,
            lower: undefined,
            unit: undefined,
            interval: undefined
        };

        this.#uncertainty = {
            type: undefined,
            standardDeviation: undefined,
        };

        this.#source = {
            data: undefined,
            uncertainty: undefined
        };

        // extract and write property values
        this.name = config.name;
        this.interval = config.interval !== undefined ? config.interval : 1e-3;
        this.nominal_value = nominal;
        this.unit = config.unit !== undefined ? config.unit : DEFAULT_UNIT;
        this.#uncertainty.type = this.#extractUncertaintyType(config);
        this.source_value = config.source_value != undefined ? config.source_value : "unknown";

        if (this.#uncertainty.type != "fixed") {
            let limits = this.#extractLimits(nominal, config);
            this.lower_limit = limits.lower;
            this.upper_limit = limits.upper;
            this.source_uncertainty = config.source_uncertainty != undefined ? config.source_uncertainty : "unknown";
        }
        if (this.#uncertainty.type == "truncated normal") {
            let stdDev = this.#extractStandardDeviation(nominal, config);
            this.standard_deviation = stdDev;
        }
    }

    /**
     * Returns the nominal value of the parameter
     *
     * @author localhorst87
     * @return {number} nominal value
     */
    get nominal_value() {
        return this.#data.nominal;
    }

    /**
     * Returns the lower and upper limit of the parameter value
     * in the following array [lower, upper]
     *
     * @author localhorst87
     * @return {number[]} limits
     */
    get limits() {
        if (this.#uncertainty.type == "fixed")
            return [this.#data.nominal, this.#data.nominal];
        else
            return [this.#data.lower, this.#data.upper];
    }

    /**
     * Returns the unit of the parameter
     * 
     * @author localhorst87
     * @return {string} parameter unit
     */
    get unit() {
        return this.#data.unit;
    }

    /**
     * Returns the interval of the parameter
     * 
     * @author localhorst87
     * @return {number} interval
     */
    get interval() {
        return this.#data.interval;
    }

    /**
     * Returns the uncertainty type ("fixed", "range", or "truncated normal")
     * 
     * @author localhorst87
     * @return {string} uncertainty type
     */
    get uncertainty_type() {
        return this.#uncertainty.type;
    }

    /**
     * Returns the uncertainty class ("discrete", "aleatory", "epistemic")
     * 
     * @author localhorst87
     * @return {string} uncertainty class
     */
    get uncertainty_classification() {
        if (this.#uncertainty.type == "truncated normal")
            return "aleatory";
        else if (this.#uncertainty.type == "range")
            return "epistemic";
        else
            return "discrete";
    }

    /**
     * Returns the standard deviation
     * 
     * @author localhorst87
     * @return {number} standard deviation
     */
    get standard_deviation() {
        return this.#uncertainty.standardDeviation;
    }

    /**
     * Returns the source of the nominal value of the parameter, meaning
     * how it has been identified ("unknown", "estimated", "provided", 
     * "computed", "measured", "calibrated")
     * 
     * @author localhorst87
     * @return {string} value source
     */
    get source_value() {
        return this.#source.data;
    }

    /**
     * Returns the source of the uncertainty (limits, standard deviation) 
     * of the parameter, meaning how it has been identified ("unknown", 
     * "estimated", "provided", "computed", "measured", "calibrated")
     * 
     * @author localhorst87
     * @return {string} uncertainty source
     */
    get source_uncertainty() {
        return this.#source.uncertainty;
    }

    /**
     * Sets the nominal value of the parameter respecting the interval
     *
     * @author localhorst87
     * @param {number} val new nominal value
     */
    set nominal_value(val) {
        if (typeof(val) != "number")
            throw("nominal value must be a numeric value.");

        this.#data.nominal = this.#applyInterval(val);
    }

    /**
     * Sets the limits of the parameter respecting the interval 
     *
     * @author localhorst87
     * @param {number[]} limits lower and upper limit
     */
    set limits(limits) {
        if (!Array.isArray(limits))
            throw("limits must be given as array");
        if (limits.length != 2)
            throw("limits must contain exactly two numbers");
        this.lower_limit = limits[0];
        this.upper_limit = limits[1];
    }

    /**
     * Sets the lower limit of the parameter respecting the interval 
     *
     * @author localhorst87
     * @param {number} lim new lower limit
     */
    set lower_limit(lim) {
        if (typeof(lim) != "number")
            throw("limit must be a numeric value");
        if (lim > this.nominal_value)
            throw("lower limit must not be greater than the nominal value");
        this.#data.lower = this.#applyInterval(lim);
    }

    /**
     * Sets the upper limit of the parameter respecting the interval 
     *
     * @author localhorst87
     * @param {number} lim new lower limit
     */
    set upper_limit(lim) {
        if (typeof(lim) != "number")
            throw("limit must be a numeric value");
        if (lim < this.nominal_value)
            throw("upper limit must not be lower than the nominal value");
        
        this.#data.upper = this.#applyInterval(lim);
    }

    /**
     * Sets the unit of the parameter, checking if it's a valid unit.
     * It does NOT do conversion of the value...
     *
     * @author localhorst87
     * @param {string} unit unit of the parameter value
     */
    set unit(unit) {
        if (typeof(unit) != "string")
            throw("unit must be given as string");

        if (unit != "-")
            if (!this.#isUnitValid(unit))
                throw("Unit " + unit + " is unknown or not supported");

        this.#data.unit = unit;
    }

    /**
     * Sets a new interval and applies the interval to all relevant values
     * (nominal, limits, standard deviation) in case interval is reduced
     *
     * @author localhorst87
     * @param {number} val new interval
     */
    set interval(val) {
        if (typeof(val) != "number")
            throw("interval must be a numeric value");
        if (val <= 0)
            throw("interval must be greater than 0");

        let isFirstAssignment = this.#data.interval == undefined;
        this.#data.interval = val;
        
        // adjust interval of values if not first assignment
        if (isFirstAssignment) { 
            return;
        }
        else {
            this.nominal = this.#data.nominal;
            if (this.uncertainty_type != "fixed") {
                this.lower_limit = this.#data.lower;
                this.upper_limit = this.#data.upper;
            }
            if (this.uncertainty_type == "truncated normal") {
                this.standard_deviation = this.#uncertainty.standardDeviation;
            }
        }
    }

    /**
     * Sets new limits based on the new absolute tolerance
     *
     * @author localhorst87
     * @param {number} tol new absolute tolerance
     */
    set tolerance_absolute(tol) {
        if (typeof(tol) != "number")
            throw("tolerance must be a numeric value");
        if (tol < 0)
            throw("tolerance must be > 0");
        
        if (tol == 0) { // remove limits
            this.#data.lower = undefined;
            this.#data.upper = undefined;
            this.#uncertainty.type = "fixed";
        }
        else {
            this.lower_limit = this.#data.nominal - tol;
            this.upper_limit = this.#data.nominal + tol;
    
            // update uncertainty type if no limits have been defined before
            if (this.uncertainty_type == "fixed")
                this.#uncertainty.type = "range";
        }
    }

    /**
     * Sets new limits based on the new relative tolerance
     *
     * @author localhorst87
     * @param {number} tol new relative tolerance
     */
    set tolerance_relative(tol) {
        if (typeof(tol) != "number")
            throw("tolerance must be a numeric value");
        if (tol < 0)
            throw("tolerance must be > 0");
        
        if (tol == 0) { // remove limits
            this.#data.lower = undefined;
            this.#data.upper = undefined;
            this.#uncertainty.type = "fixed";
        }
        else {
            this.lower_limit = this.nominal_value - Math.abs(this.nominal_value) * tol;
            this.upper_limit = this.nominal_value + Math.abs(this.nominal_value) * tol;
    
            // update uncertainty type if no limits have been defined before
            if (this.uncertainty_type == "fixed")
                this.#uncertainty.type = "range";
        }
    }

    /**
     * Sets a new standard deviation and reassigns the uncertainty type, in case
     * standard deviation has not been provided before
     *
     * @author localhorst87
     * @param {number} stddev new standard deviation
     */
    set standard_deviation(stddev) {
        if (typeof(stddev) != "number")
            throw("standard deviation must be a numeric value");
        if (stddev < 0)
            throw("standard deviation must be > 0");
        if (this.#data.lower == undefined || this.#data.upper == undefined)
            throw("for a truncated normal distribution, define limits first");
        
        if (stddev == 0) { // remove standard deviation
            this.#uncertainty.standardDeviation = undefined;
            this.#uncertainty.type = "range";
        }
        else {
            this.#uncertainty.standardDeviation = stddev;

            // update uncertainty type if no deviatino has been given before
            if (this.uncertainty_type == "range")
                this.#uncertainty.type = "truncated normal";
        }
    }

    /**
     * Sets a new standard deviation based on the factor and
     * reassigns the uncertainty type, in case standard deviation 
     * has not been provided before. Can only be applied if limits
     * are symmetric (i.e., has been calculated from a tolerance)
     *
     * @author localhorst87
     * @param {number} factor new standard deviation factor
     */
    set standard_deviation_factor(factor) {
        if (typeof(factor) != "number")
            throw("factor must be a numeric value");
        if (factor <= 0)
            throw("factor must be > 0");
        if (this.#data.lower == undefined || this.#data.upper == undefined)
            throw("for a truncated normal distribution, define limits first");
        if (this.nominal_value - this.lower_limit != this.upper_limit - this.nominal_value)
            throw("standard deviation factor can only be used for symmetric limits. Correct limits first")
            
        let tolerance = this.#applyInterval(this.nominal_value - this.lower_limit); // avoid floating point errors, e.g. 0.2-0.18 = 0.020000000000000018
        this.#data.standardDeviation = tolerance/factor;

        // update uncertainty type if no deviatino has been given before
        if (this.uncertainty_type == "range")
            this.#uncertainty.type = "truncated normal";
    }

    /**
     * Sets the source of the nominal value of the parameter, meaning
     * how it has been identified. Must be either "unknown", "estimated",
     * "provided", "computed", "measured", or "calibrated".
     *
     * @author localhorst87
     * @param {string} source source of nominal value
     */
    set source_value(source) {
        if (typeof(source) != "string")
            throw("source must be given as string");
        if (VALID_SOURCES.some((allowedSource) => allowedSource == source) == false)
            throw("not supported source value. Allowed values: unknown, estimated, provided, computed, measured, calibrated");
        
        this.#source.data = source;
    }

    /**
     * Sets the source of the uncertainty value of the parameter, meaning
     * how it has been identified. Must be either "unknown", "estimated",
     * "provided", "computed", "measured", or "calibrated".
     *
     * @author localhorst87
     * @param {string} source source of uncertainty
     */
    set source_uncertainty(source) {
        if (typeof(source) != "string")
            throw("source must be given as string");
        if (VALID_SOURCES.some((allowedSource) => allowedSource == source) == false)
            throw("not supported source value. Allowed values: unknown, estimated, provided, computed, measured, calibrated");
        
        this.#source.uncertainty = source;
    }

    /**
     * Calculates a discrete Probability Density Function (PDF) of the Truncated 
     * Normal Distribution of this parameter. 
     * 
     * The number of samples is by default set to the maximum possible values, with
     * respect to the interval of the parameter.
     * 
     * @param {number} [nSamples=-1] number of samples for the discrete PDF
     * @returns {DiscreteDistribution} The PDF
     */
    calcPdf(nSamples = -1) {
        if (this.standard_deviation == undefined)
            throw("PDF can not be created, as no standard deviation is given")
        if (!Number.isInteger(nSamples))
            throw("number of samples must be an integer value");
        
        const nSamplesTheoretic = Math.floor((this.limits[1] - this.limits[0]) / this.interval);

        if (nSamples > nSamplesTheoretic || nSamples < 0) {
            nSamples = Math.min(N_SAMPLES_MAX, nSamplesTheoretic);
            console.log("number of samples has been set to " + String(nSamples))
        }
        
        let x = helper.makeEquallySpacedArray(this.limits[0], this.limits[1], nSamples, false);
        x = Array.from(x, el => this.#applyInterval(el)) // applies interval
        
        let pdf = {
            type: "PDF",
            x: x,
            p: [],
            unit: this.#data.unit
        };

        let a = (this.#data.lower - this.nominal_value) / this.standard_deviation;
        let b = (this.#data.upper - this.nominal_value) / this.standard_deviation;
        let Z = this.#calcCdfOfSnd(b) - this.#calcCdfOfSnd(a);

        for (let x of pdf.x) {
            let xi = (x - this.nominal_value) / this.standard_deviation;
            const p = this.#calcPdfOfSnd(xi) / (this.standard_deviation * Z);

            pdf.p.push(p);
        }

        return pdf;        
    }

    /**
     * Calculates a discrete Cumulative Distribution Function (PDF) of the Truncated 
     * Normal Distribution of this parameter. 
     * 
     * The number of samples is by default set to the maximum possible values, with
     * respect to the interval of the parameter.
     * 
     * @author localhorst87
     * @param {number} nSamples 
     * @returns {DiscreteDistribution} The CDF
     */
    calcCdf(nSamples = -1) {
        if (this.standard_deviation == undefined)
            throw("CDF can not be created, as no standard deviation is given")
        if (!Number.isInteger(nSamples))
            throw("number of samples must be an integer value");

        const nSamplesTheoretic = Math.floor((this.limits[1] - this.limits[0]) / this.interval) + 1;

        if (nSamples > nSamplesTheoretic || nSamples < 0)
            nSamples = Math.min(N_SAMPLES_MAX + 1, nSamplesTheoretic);
        
        let x = helper.makeEquallySpacedArray(this.limits[0], this.limits[1], nSamples, true);
        x = Array.from(x, el => this.#applyInterval(el)) // applies interval

        let cdf = {
            type: "CDF",
            x: x,
            p: [],
            unit: this.#data.unit
        };

        let a = (this.#data.lower - this.nominal_value) / this.standard_deviation;
        let b = (this.#data.upper - this.nominal_value) / this.standard_deviation;
        let Z = this.#calcCdfOfSnd(b) - this.#calcCdfOfSnd(a);

        for (let x of cdf.x) {
            let xi = (x - this.nominal_value) / this.standard_deviation;
            const p = (this.#calcCdfOfSnd(xi) - this.#calcCdfOfSnd(a)) / Z;

            cdf.p.push(p);
        }

        return cdf;
        
    }

    /**
     * Calculates the relative probability of the standard normal distribution
     * 
     * @param {number} x The random variable input
     * @returns {number} The relative probability of the SND
     */
    #calcPdfOfSnd(x) {
        return Math.exp(-0.5 * Math.pow(x, 2)) / Math.sqrt(2 * Math.PI);
    }

    /**
     * Calculates the cumulative probability of the standard normal distribution
     * 
     * @param {number} x The random variable input 
     * @returns {number} The cumulative probability of the SND
     */
    #calcCdfOfSnd(x) {
        return 0.5 * (1 + mathjs.erf(x / Math.sqrt(2)));
    }

    /**
     * checks if the ParameterConfig is valid by checking the structure, the
     * correct assignment of limits and the correct assignment of the standard
     * deviation. Throws an error, if ill-defined.
     *
     * @author localhorst87
     * @private
     * @param {number} nominal the nominal value of the parameter
     * @param {ParameterConfig} config The ParameterConfig of the parameter
     */
    #checkConfig(nominal, config) {
        // schematic restrictions violated?
        if (!util.isStructureValid(config, schemas.SCALAR_PARAMETER_CONFIG))
            throw("ParameterConfig structure is not valid");

        // limits defined correctly?
        this.#checkLimits(nominal, config);

        // standard deviation defined correctly?
        this.#checkStandardDev(config);
    }

    /**
     * checks if given unit is a supported unit
     *
     * @author localhorst87
     * @private
     * @param {string} unitName unit name according to MathJS unit convention
     * @return {boolean} return true/false upon valid/invalid unit
     */
    #isUnitValid(unitName) {
        if (unitName == "-")
            return true;
        
        var isValid = true;
        
        try {
            mathjs.unit(unitName);
        }
        catch {
            isValid = false;
        }

        return isValid;
    }

    /**
     * checks if limit properties are defined correctly
     *
     * @author localhorst87
     * @private
     * @param {number} nominal The nominal value of the parameter
     * @param {ParameterConfig} config Additional configuration to describe the parameter
     */
    #checkLimits(nominal, config) {
        if (config.upper_limit != undefined && config.lower_limit == undefined)
            throw("if upper limit is given, a lower limit must be provided, too");
        if (config.upper_limit == undefined && config.lower_limit != undefined)
            throw("if lower limit is given, an upper limit must be provided, too");
        if ((config.tolerance_absolute != undefined || config.tolerance_relative != undefined) 
                && (config.lower_limit != undefined || config.upper_limit != undefined))
            throw("limit must be exclusively defined directly or with a tolerance, but not with both arguments");
        if (config.tolerance_absolute != undefined && config.tolerance_relative != undefined)
            throw("tolerance must be either defined absolutely or relatively, but not with both arguments");
    }

    /**
     * checks if standard deviation properties are defined correctly
     *
     * @author localhorst87
     * @private
     * @param {ParameterConfig} config Additional configuration to describe the parameter
     */
    #checkStandardDev(config) {
        let limitsGiven = config.lower_limit != undefined && config.upper_limit != undefined;
        let toleranceGiven = config.tolerance_absolute != undefined || config.tolerance_relative != undefined;
        
        if (config.standard_deviation != undefined && config.standard_deviation_factor != undefined)
            throw("standard deviation must be exclusively defined directly or with a factor, but not with both arguments");
        if (config.standard_deviation  != undefined && !(limitsGiven || toleranceGiven))
            throw("if standard deviation is defined, limits or a tolerance must be given");
        if (config.standard_deviation_factor != undefined && !toleranceGiven)
            throw("if standard deviation is given as a factor, a tolerance must be given");
    }

    /**
     * extracts the type of the uncertainty (fixed value, interval or distribution) from the ParameterConfig
     *
     * @author localhorst87
     * @private
     * @param {ParameterConfig} config Additional configuration to describe the parameter
     * @return {string} The uncertainty type (truncated normal, interval, or fixed)
     */
    #extractUncertaintyType(config) {
        let limitsGiven = config.lower_limit != undefined && config.upper_limit != undefined;
        let toleranceGiven = config.tolerance_absolute != undefined || config.tolerance_relative != undefined;
        let stdDevGiven = config.standard_deviation != undefined || config.standard_deviation_factor != undefined;

        if ((limitsGiven || toleranceGiven) && stdDevGiven) {
            return "truncated normal";
        }
        else if((limitsGiven || toleranceGiven) && !stdDevGiven) {
            return "range";
        }
        else {
            return "fixed";
        }
    }

    /**
     * extracts the limits from the ParameterConfig properties, either directly or via the given tolerance
     *
     * @author localhorst87
     * @private
     * @param {ParameterConfig} config Additional configuration to describe the parameter
     * @return {Object} contains lower and upper limits via properties .lower and .upper 
     */
    #extractLimits(nominal, config) {
        let lower, upper;

        // function will only be called in case one of these cases will definitely occur (checked before)
        if (config.lower_limit != undefined && config.upper_limit != undefined) {
            lower = config.lower_limit;
            upper = config.upper_limit;
        }
        else if (config.tolerance_absolute != undefined) {
            lower = nominal - config.tolerance_absolute;
            upper = nominal + config.tolerance_absolute;
        }
        else if (config.tolerance_relative != undefined) {
            lower = nominal - Math.abs(nominal) * config.tolerance_relative;
            upper = nominal + Math.abs(nominal) * config.tolerance_relative;
        }

        return {
            lower: this.#applyInterval(lower),
            upper: this.#applyInterval(upper)
        };
    }

    /**
     * extracts the standard deviation from the ParameterConfig, either directly or via the 
     * standard deviation factor and the given tolerance
     *
     * @author localhorst87
     * @private
     * @param {ParameterConfig} config Additional configuration to describe the parameter
     * @return {number} the standard deviation
     */
    #extractStandardDeviation(nominal, config) {
        if (config.standard_deviation !== undefined) {
            return config.standard_deviation
        }
        else if (config.standard_deviation_factor !== undefined) {
            let tolerance = config.tolerance_relative !== undefined ? Math.abs(nominal) * config.tolerance_relative : config.tolerance_absolute;
            tolerance = this.#applyInterval(tolerance);
            return tolerance / config.standard_deviation_factor;
        } 
        // no else case, a tolerance is definitely given (checked before)
    }

    /**
     * wraps roundToInterval with the interval of this instance
     *
     * @author localhorst87
     * @private
     * @param {number} val raw numeric value
     * @return {number} number with applied interval
     */
    #applyInterval(val) {
        return util.roundToInterval(val, this.#data.interval);
    }
    
}

/**
 * Description
 * 
 * @author localhorst87
 * @param {ScalarParameter | ScalarParameter[]} parameters 
 * @param {SamplingConfig} config 
 * @returns {ParameterSampling}
 */
function createSamples(parameters, config) {
    if (!Array.isArray(parameters))
        parameters = [parameters];
    
    config = helper.checkSamplingInputs(parameters, config);

    let parametersAleatory = parameters.filter(par => par.uncertainty_classification == "aleatory");
    let parametersEpistemic = parameters.filter(par => par.uncertainty_classification == "epistemic");
    let parametersDiscrete = parameters.filter(par => par.uncertainty_classification == "discrete");

    let samplesAleatory = config.samples_aleatory > 0 ? 
        helper.generateAleatorySamples(parametersAleatory, config.method_aleatory, config.samples_aleatory) : [[]];

    let samplesEpistemic = config.samples_epistemic > 0 ? 
        helper.generateEpistemicSamples(parametersEpistemic, config.method_epistemic, config.samples_epistemic) : [[]];

    let samplesDiscrete = parametersDiscrete.map(par => par.nominal_value);

    let samples = []

    for (let xA of samplesEpistemic) {
        samples.push([]);
        for (let xE of samplesAleatory) {
            samples[samples.length - 1].push(xA.concat(xE).concat(samplesDiscrete));
        }
    }

    // align parameter order with order of generated samples
    parameters = parametersEpistemic.concat(parametersAleatory).concat(parametersDiscrete);

    return {
        names: parameters.map(par => par.name),
        units: parameters.map(par => par.unit),
        values: samples,
    };
}