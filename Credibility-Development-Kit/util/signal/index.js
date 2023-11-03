const util = require("../util-common");
const mathjs = require("mathjs");
const schemas = require("./types/schemas");
const Types = require('./types/types');

 /**
 * @module util/signal
 */

 /**
 * @typedef {import('./types/types').History} History
 * @typedef {import('./types/types').Units} Units
 * @typedef {import('./types/types').CompareOptions} CompareOptions
 * @typedef {import('./types/types').ComparisonData} ComparisonData 
 * @typedef {import('./types/types').SignalConfig} SignalConfig
 */

const DEFAULT_TIME_UNIT = "s";
const DEFAULT_VALUES_UNIT = "-";

exports.DEFAULT_TIME_UNIT = "s";
exports.DEFAULT_VALUES_UNIT = "-";

// helper methods for arrays to find last index according to a condition
// based on current proposal: https://github.com/tc39/proposal-array-find-from-last
Array.prototype.findLastIndex = function (fn) {
    return this.length - 1 - [...this].reverse().findIndex(fn);
}

/**
 * @memberof util
 */ 

exports.Signal = class Signal {
    name;
    #units;
    #time;
    #values;
    #history;
    #precision;

    /**
     * Creates an instance of a Signal with specified time and value arrays that will be rounded to a given precision
     *
     * @author localhorst87
     * @constructor
     * @param {number[]} time An array of time points for each sample. Length must equal the value array's length
     * @param {number[]} values An array of values of the observed quantity for each sample. Length must equal the time array's length
     * @param {SignalConfig} config The configuration for the Signal instance 
     * @return {Signal} The instance of a Signal
     */
    constructor(time, values, config) {
        // is first argument is a Signal, return a deep copy of the Signal!
        if (time.constructor.name == "Signal") {
            let signalToCopy = time;
            this.name = signalToCopy.name;
            this.#time = signalToCopy.time;
            this.#values = signalToCopy.values;
            this.#units = signalToCopy.units;
            this.#precision = signalToCopy.precision;
            this.#history = signalToCopy.history;
            return;
        }
        else if (!values && !config && time.constructor.name != "Signal") {
            throw("if only one argument is given, the argument must be a Signal instance!");
        }
        else {  // interprete as tuple of time, value, configuration 
            let timeArray = time;
            
            // check arrays
            if (!Array.isArray(timeArray) || !Array.isArray(values))
                throw("time and value must be arrays");
            if (timeArray.length != values.length)
                throw("time and value array must be of same length");
            if (timeArray.length == 0 || values.length == 0)
                throw("time and value array must not be empty");

            // check config
            
            if (!util.isStructureValid(config, schemas.SIGNAL_CONFIG))
                throw("config is not valid");
            
            // check if units are given and supported
            if (config.unit_time) {
                if (!this.#isUnitValid(config.unit_time))
                    throw("Unit " + config.unit_time + " is unknown or not supported");
            }
            else {
                config.unit_time = DEFAULT_TIME_UNIT;
            }

            if (config.unit_values) {
                if (!this.#isUnitValid(config.unit_values))
                    throw("Unit " + config.unit_values + " is unknown or not supported");
            }
            else {
                config.unit_values = DEFAULT_VALUES_UNIT;
            }

            // description data
            this.name = config.name; // required
            this.#units = {
                time: config.unit_time,
                values: config.unit_values
            };
            this.#precision = config.precision ? config.precision : 6 // optional

            // values 
            this.#time = this.#applyPrecision(timeArray, this.#precision);
            this.#values = this.#applyPrecision(values, this.#precision);

            // meta-data
            this.#history = [];
            this.#addHistoryEntry("initialized signal");
        }
    }

    /**
     * Returns the time vector of the signal
     *
     * @author localhorst87
     * @return {number[]} time array
     */
    get time() {
        return [...this.#time];
    }

    /**
     * Returns the value vector of the signal
     *
     * @author localhorst87
     * @return {number[]} value array
     */
    get values() {
        return [...this.#values];
    }

    /**
     * Returns the value vector of the signal
     *
     * @author localhorst87
     * @return {Units} unit definition
     */
     get units() {
        return {...this.#units};
    }

    /**
     * Indicates the number of samples contained in the Signal instance
     *
     * @author localhorst87
     * @return {number} number of samples
     */
    get length() {
        return this.#time.length;
    }

    /**
     * Returns the precision of the Signal
     *
     * @author localhorst87
     * @return {number} configured precision
     */
    get precision() {
        return this.#precision;
    }

    /**
     * Returns the Signal history
     *
     * @author localhorst87
     * @return {History[]} the complete history of the Signal including all process steps
     */
    get history() {
        return [...this.#history];
    }

    /**
     * Indicates the time duration of the Signal instance (time difference between the last and first sample)
     *
     * @author localhorst87
     * @return {number} duration of the Signal instance (as the specified unit)
     */
    get duration() {
        let durationRaw = this.#time[this.length - 1] - this.#time[0];
        let durationPrecised = durationRaw.toPrecision(this.#precision); // returns a String
        return parseFloat(durationPrecised);
    }

    /**
     * Returns the time step size of the signal. Throws an error if Signal length 
     * is too short or if time steps are not equal
     *
     * @author localhorst87
     * @return {number} time step size
     */
    get timestep() {
        if (this.length < 2)
            throw("Signal length must be greater than 1 to identify step size");

        let timeDiff = this.#getTimeDiff();
        
        // check if all time steps are equal
        let stepSize = timeDiff[0];
        for (let dt of timeDiff) {
            if (dt != stepSize)
                throw("time steps are not equal");
            stepSize = dt;
        }

        return stepSize;
    }

    /**
     * Manually changes the value vector
     *
     * @author localhorst87
     * @param {number[]} newValues new (raw) value array
     */
    set values(newValues) {
        if (!Array.isArray(newValues))
            throw("values must be an array");
        if (newValues.length != this.length)
            throw("length must correspond to length of time vector");
        this.#values = this.#applyPrecision(newValues, this.#precision);
        this.#addHistoryEntry("manual change of values");
    }

    /**
     * Manually changes the time vector
     *
     * @author localhorst87
     * @param {number[]} newTime new (raw) time array
     */
    set time(newTime) {
        if (!Array.isArray(newTime))
        throw("values must be an array");
        if (newTime.length != this.length)
            throw("length must correspond to length of time vector");
        this.#time = this.#applyPrecision(newTime, this.#precision);
        this.#addHistoryEntry("manual change of time");
    }

    /**
     * Returns a JSON string of the Signal
     *
     * @author localhorst87
     * @param {boolean} [verbose=false] If set to true, details (precision and history) will be added
     * @return {string} A stringified JSON of the signal
    */
    print(verbose = false) {
        let jsonStruct = {
            name: this.name,
            length: this.length,
            time: this.#time,
            duration: this.duration,
            values: this.#values,
            unit_time: this.#units.time,
            unit_values: this.#units.values
        };
        if (verbose) {
            jsonStruct.precision = this.#precision;
            jsonStruct.history = this.#history;
        }
        
        return JSON.stringify(jsonStruct);
    }

    /**
     * Returns a deep copy of this Signal instance
     *
     * @author localhorst87
     * @return {Signal} step step to revert to. Must be an integer value 
     */    
    copy() {
        let copiedSignal = new Signal(this);
        return copiedSignal;
    }

    /**
     * Revert signal time and values to a specific step
     *
     * @author localhorst87
     * @param {number} step step to revert to. Must be an integer value > 0. Counting starts from 1 (not 0)
     */
    revert(step) {
        if (!step) {
            step = this.#history.length - 1; // if step not given, it just reverts to the last step
        }

        if (this.#history.length < step)
            throw("cannot revert to step " + step + " as signal has undergone only " + this.#history.length + " processing steps");
        
        // save current values by making deep copies
        const currentTime = [...this.#time];
        const currentValues = [...this.#values];
        const currentHistory = JSON.parse(JSON.stringify(this.#history));

        // revert to desired step
        this.#time = [...this.#history[step - 1].time];
        this.#values = [...this.#history[step - 1].values];
        this.#history = this.#history.slice(0, step);

        // make a deep copy of the reverted signal
        let revertedSignal = this.copy();

        // undo revertion on this instance to keep this instance as it is ...
        this.#time = currentTime;
        this.#values = currentValues;
        this.#history = currentHistory;

        // ... and return the reverted instance
        return revertedSignal;
    }

    /**
     * Slices Signal to a subset according to given time boundaries
     *
     * @author localhorst87
     * @param {number} startTime start time to slice signal
     * @param {number} endTime end time to slice signal
     * @param {boolean} [includeStartTime=true] if startTime exactly matches a given time point, 
     *                                          this time point will be included if set to true. 
     *                                          If set to false, it will be excluded.
     * @param {boolean} [includeEndTime=true]   if endTime exactly matches a given time point,
     *                                          this time point will be included if set to true. 
     *                                          If set to false, it will be excluded.
     * @return {Signal} resulting Signal after slicing
     */
    sliceToTime(startTime, endTime, includeStartTime=true, includeEndTime=true) {
        if (startTime == undefined)
            return this.copy(); // nothing to do

        // check argument types
        if (typeof(startTime) != "number" || typeof(endTime) != "number")
            throw("start and end time must be given as numbers");
        if (typeof(includeStartTime) != "boolean" || typeof(includeEndTime) != "boolean")
            throw("includeStartTime and includeEndTime must be boolean arguments");
        
        // logical check of arguments
        if (startTime > endTime)    
            throw("startTime must not be higher than endTime");
        if (startTime > this.#time[this.#time.length - 1])
            throw("start time is higher than last time value");
        if (endTime < this.#time[0])
            throw("end time is lower than first time value");

        let startPredicate, endPredicate;

        if (includeStartTime)
            startPredicate = (val) => val >= startTime;
        else
            startPredicate = (val) => val > startTime;

        if (includeEndTime)
            endPredicate = (val) => val <= endTime;
        else
            endPredicate = (val) => val < endTime;

        let startIdx = this.#time.findIndex(startPredicate);
        let endIdx = this.#time.findLastIndex(endPredicate);

        if (startIdx > endIdx)
            throw("slicing would result in empty vectors");

        this.#time = this.#time.slice(startIdx, endIdx + 1);
        this.#values = this.#values.slice(startIdx, endIdx + 1);

        this.#addHistoryEntry("sliced signal to chunk from " + String(this.#time[0]) + this.#units.time + " to " + String(this.#time[this.#time.length-1]) + this.#units.time);
    
        return this.#returnAndKeep();
    }

    /**
     * Slices Signal to a subset according to given indices
     *
     * @author localhorst87
     * @param {number} [startIdx] start index to slice signal. If not set, nothing will be done
     * @param {number} [endIdx] end index to slice signal. If not set, the subset will only be cut from 
     *                          the start index.
     * @param {boolean} [includeStartIdx=true] if set to true/false, the start index will be incorporated/
     *                                         will not be incorporated into the sliced subset.
     * @param {boolean} [includeEndIdx=false]  if set to true/false, the end index will be incorporated/
     *                                         will not be incorporated into the sliced subset.
     * @return {Signal} resulting Signal after slicing
     */
    sliceToIndex(startIdx, endIdx, includeStartIdx = true, includeEndIdx = false) {
        if (startIdx == undefined && endIdx == undefined)
            return this.copy(); // nothing to do
        if (endIdx == undefined)
            endIdx = this.length;
        
        if (typeof(startIdx) != "number" || typeof(endIdx) != "number")
            throw("start index and end index must be given as numeric types");
        if (typeof(includeStartIdx) != "boolean" || typeof(includeEndIdx) != "boolean")
            throw("includeStartIdx and includeEndIdx must be given as boolean types");
        if(!Number.isInteger(startIdx) || !Number.isInteger(endIdx))
            throw("start index and end index must be integer values");
        
        if (!includeStartIdx)
            startIdx++;
        if (includeEndIdx)
            endIdx++;
        
        let newTime = this.time.slice(startIdx, endIdx);
        let newValues = this.values.slice(startIdx, endIdx);

        if (newValues.length == 0)
            throw("combination of start index and end index would result in empty arrays");
        
        this.#time = newTime;
        this.#values = newValues;

        this.#addHistoryEntry("sliced signal to chunk from " + String(this.#time[0]) + this.#units.time + " to " + String(this.#time[this.#time.length-1]) + this.#units.time);
    
        return this.#returnAndKeep();
    }

    /**
     * converts the specified vector (time or values) into the specified unit, if possible.
     * Uses the MathJS API. Valid units according formulations can be found here:
     * https://mathjs.org/docs/datatypes/units.html
     * 
     * @author localhorst87
     * @param {string} vectorIdentifier must be either "time" or "values"
     * @param {string} targetUnitName target unit name according to MathJS Unit convention
     * @return {Signal} resulting Signal after conversion
     */
    convert(vectorIdentifier, targetUnitName) {
        // check if arguments are valid
        if (vectorIdentifier != "time" && vectorIdentifier != "values")
            throw("vectorIdentifier must be either \"time\" or \"values\"");
        if (typeof(targetUnitName) != "string")
            throw("target unit must be given as a string");
        if (!this.#isUnitValid(targetUnitName))
            throw("given unit " + targetUnitName + " is not supported");
        
        // check if conversion is possible
        let sourceUnitName = this.#units[vectorIdentifier];
        if (!this.#isConversionPossible(sourceUnitName, targetUnitName))
            throw("conversion not possible, as the physical unit base is not the same");

        if (vectorIdentifier == "time")
            this.#time = this.#convertArray(this.#time, sourceUnitName, targetUnitName, this.#precision);
        else
            this.#values = this.#convertArray(this.#values, sourceUnitName, targetUnitName, this.#precision);
        
        // adapt meta-data
        this.#units[vectorIdentifier] = targetUnitName;
        this.#addHistoryEntry("converted " + vectorIdentifier + " units to " + targetUnitName);

        return this.#returnAndKeep();
    }

    /**
     * Adds a plain number or another Signal instance to the values
     * If a plain number is used as argument, it is added to each value of this Signal (acts like an offset)
     * If another Signal instance is used as argument, its values are added element-wise to this Signal (time values remain the same)
     * 
     * For adding another signal, certain preconditions must be fulfilled
     *  1)  Physical unit base must correspond (e.g., adding an acceleration to a volume flow throws an error)
     *  2)  Duration of both signals must correspond
     * 
     * Take into account the following assumptions if adding another Signal
     *  1)  Time vector remains constant
     *  2)  If the sample rate of the Signal to add is different, it will be adjusted to the sample rate of this Signal instance
     *  3)  Units will be adjusted to the units of this Signal instance, if they are different (e.g. for velocity m/s and km/h)
     *  4)  Precision of this Signal instance will be used
     * 
     * @author localhorst87
     * @param {number | Signal} addable The number or Signal to add
     * @return {Signal} resulting Signal after addition
     */
    add(addable) {
        if (typeof(addable) == "number") {
            this.#addNumber(addable);
            this.#addHistoryEntry("applied offset +" + String(addable));
        }
        else if (addable instanceof Signal) {
            this.#addSignal(addable);
            this.#addHistoryEntry("added Signal " + addable.name)
        }
        else 
            throw("only plain numbers and Signal instances can be added");
        
        return this.#returnAndKeep();
    }

    /**
     * Subtracts a plain number or another Signal instance from the values
     * If a plain number is used as argument, it is subtracted from each value of this instance (acts like an offset)
     * If another Signal instance is used as argument, its values are subtracted element-wise from this instance (time values remain the same)
     * 
     * For subtracting another signal, certain preconditions must be fulfilled
     *  1)  Physical unit base must correspond (e.g., adding an acceleration to a volume flow throws an error)
     *  2)  Duration of both signals must correspond
     * 
     * Take into account the following assumptions if subtracting another Signal
     *  1)  Time vector remains constant
     *  2)  If the sample rate of the Signal to subtract is different, it will be adjusted to the sample rate of this Signal instance
     *  3)  Units will be adjusted to the units of this Signal instance, if they are different (e.g. for velocity m/s and km/h)
     *  4)  Precision of this Signal instance will be used
     * 
     * @author localhorst87
     * @param {number | Signal} subtractable The number or Signal to subtract
     * @return {Signal} resulting Signal after subtraction
     */
    subtract(subtractable) {
        if (typeof(subtractable) == "number") {
            this.#addNumber(-subtractable);
            this.#addHistoryEntry("applied offset -" + String(subtractable));
        }
        else if (subtractable instanceof Signal) {
            this.#addSignal(subtractable.multiply(-1));
            this.#addHistoryEntry("subtracted Signal " + subtractable.name)
        }
        else
            throw("only plain numbers and Signal instances can be subtracted");

        return this.#returnAndKeep();
    }

    /**
     * Multiplies a plain number or another Signal instance with the values
     * If a plain number is used as argument, it is multiplied with each value of this instance
     * If another Signal instance is used as argument, its values are multiplied element-wise with this instance (time values remain the same)
     * 
     * For multiplying two Signals, the duration of both signals must be equal
     * 
     * Take into account the following assumptions if multiplying two Signals
     *  1)  Time vector remains constant
     *  2)  If the sample rate of the Signal to multiply is different, it will be adjusted to the sample rate of this Signal instance
     *  3)  Precision of this Signal instance will be used
     * 
     * @author localhorst87
     * @param {number | Signal} multipliable The number or Signal to multiply
     * @param {string} [numberUnit] The unit of the multipliable, in case a single factor is used. If not given, factor is assumed as unitless.
     *                              numberUnit will be ignored, in case multipliable is a Signal instance.
     * @return {Signal} resulting Signal after multiplication
     */
    multiply(multipliable, numberUnit) {
        if (typeof(multipliable) == "number") {
            if (numberUnit) {
                if (typeof(numberUnit) != "string")
                    throw("unit must be given as a string");
                if (!this.#isUnitValid(numberUnit))
                    throw("Unit " + numberUnit + " is unknown or not supported");
            }
            else {
                numberUnit = "-";
            }

            this.#multiplyNumber(multipliable, numberUnit);
            this.#addHistoryEntry("multiplied Signal values with " + String(multipliable));
        }
        else if (multipliable instanceof Signal) {
            this.#multiplySignal(multipliable);
            this.#addHistoryEntry("multiplied Signal values with Signal " + multipliable.name);
        }
        else
            throw("only plain numbers and Signal instances can be multiplied");

        return this.#returnAndKeep();
    }

    /**
     * Divides the values of this Signal instance by a plain number or another Signal 
     * If a plain number is used as argument, each value of the values array of this instance is divided by the divisor
     * If another Signal instance is used as argument, the operation will be done element-wise
     * 
     * For dividing by a plain number, its value must be different from 0.
     *
     * For dividing two Signals, the duration of both signals must be equal
     * 
     * Take into account the following assumptions if multiplying two Signals
     *  1)  Values array must not contain any 0
     *  2)  Time vector remains constant
     *  3)  If the sample rate of the Signal to subtract is different, it will be adjusted to the sample rate of this Signal instance
     *  4)  Precision of this Signal instance will be used
     * 
     * @author localhorst87
     * @param {number | Signal} multipliable The number or Signal to multiply
     * @param {string} [numberUnit] The unit of the multipliable, in case a single factor is used. If not given, factor is assumed as unitless.
     *                              numberUnit will be ignored, in case multipliable is a Signal instance.
     * @return {Signal} resulting Signal after division
     */
    divide(dividable, numberUnit) {
        if (typeof(dividable) == "number") {
            if (numberUnit) {
                if (typeof(numberUnit) != "string")
                    throw("unit must be given as a string");
                if (!this.#isUnitValid(numberUnit))
                    throw("Unit " + numberUnit + " is unknown or not supported");
            }
            else {
                numberUnit = "-";
            }

            if (dividable == 0)
                throw("division by zero not allowed");

            this.#divideNumber(dividable, numberUnit);
            this.#addHistoryEntry("divided Signal values by " + String(dividable));
        }
        else if (dividable instanceof Signal) {
            this.#divideSignal(dividable);
            this.#addHistoryEntry("divided Signal values by Signal " + dividable.name);
        }
        else
            throw("only plain numbers and Signal instances can be multiplied");
        
        return this.#returnAndKeep();
    }

    /**
     * Interpolates the values to the given time array
     * 
     * The following conditions must be fulfilled:
     *  1)  The target time array must be monotonously increasing
     *  2)  All values of the target time array must be within the current time vector (no extrapolation)
     * 
     * The following assumptions are made upon interpolation
     *  1)  Precision will be kept
     *  2)  Only linear interpolation is supported currently
     * 
     * @author localhorst87
     * @param {number[]} targetTimeArray the new time array on where ineterpolation will be done
     * @param {string} [method=linear] interpolation method; currently only "linear" is supported
     * @return {Signal} resulting Signal after interpolation
     */
    interpolate(targetTimeArray, method = "linear") {
        if (typeof(method) !== "string")
            throw("method argument must be a string");
        if (method !== "linear")
            throw("only linear interpolation supported to date");
        if (!Array.isArray(targetTimeArray))
            throw("target time must be an array");
        if (targetTimeArray.length === 0)
            throw("target time vector must contain at least one value");
        if (targetTimeArray[0] < this.#time[0] || targetTimeArray[targetTimeArray.length - 1] > this.#time[this.length - 1])
            throw("target time array must contain only values inside the current time vector");

        for (let i = 1; i < targetTimeArray.length; i++) {
            if (targetTimeArray[i] - targetTimeArray[i-1] <= 0)
                throw("target time array must be monotonously increasing");
        }

        let interpolatedValues;

        if (method == "linear") {
            interpolatedValues = this.#interpolateLinear(targetTimeArray);
        }

        this.#time = this.#applyPrecision(targetTimeArray, this.#precision);
        this.#values = this.#applyPrecision(interpolatedValues, this.#precision);
        this.#addHistoryEntry("performed interpolation with new time vector [" + String(targetTimeArray[0]) + " , "
                                + String(targetTimeArray[1]) + " , ... , " + String(targetTimeArray[targetTimeArray.length-1]) + "]");
        
        return this.#returnAndKeep();
    }

    /**
     * Returns the corresponding value for the given time point. If the time does not match
     * any value exactly, linear interpolation will be used to determine the value.
     * 
     * @param {number} timePoint the time point for which the value is to be determined
     * @returns {number} the determined value
     */
    value(timePoint) {
        if (typeof(timePoint) !== "number")
            throw("time point must be given as number");
        if (timePoint < this.#time[0] || timePoint > this.#time[this.length - 1])
            throw("given time point is out of range");
        
        const interpolatedSignal = this.interpolate([timePoint]);

        return interpolatedSignal.values[0];
    }

    /**
     * Compares the values of this Signal instance to a plain number or another Signal instance.
     * This Signal instance will be on the left side of the operation.
     * 
     * In case a plain number is used as a reference, each value of the Signal will be checked against
     * the plain number.
     * In case another Signal is used as a reference, an element-wise comparison will be done.
     * 
     * The following operators are supported:
     *  <   less than value
     *  <=  less than or equal value
     *  ==  equal to value
     *  !=  unqueal to value
     *  >=  greater than or equal value
     *  >   greater than value
     *  
     * The comparison can be configured, via the options argument, which contains the following properties:
     *  comparison  -   either "absolute" or "relative". Default: "absolute"
     *                  If set to "relative", either a threshold or a tolerance must be defined.
     *                  If set to "absolute", the difference between the Signal instance and the reference 
     *                  will be compared to a threshold/tolerance: E.g., (val - ref) > 1.5
     *                  If set to "relative", the difference between the Signal instance and the reference,
     *                  related to the reference will be compared to a threshold/tolerance: 
     *                  E.g., |(val - ref)| / ref < 0.02
     *  threshold   -   usage for inequality comparisons. Must be a numeric value >= 0. Its value is assumed to be
     *                  given in the unit specified in the unit property. Default: 0
     *                  For further application, see the table
     *  tolerance   -   usage for equality and inequality comparisons. Must be a numeric value >= 0. Its value is 
     *                  assumed to be given in the unit specified in the unit property. Default: 0
     *                  For further application, see the table
     *  unit        -   The unit the single reference number, and/or the threshold/tolerance value is given in.
     *                  Default: Same Unit as specified for the signal values.
     *  precision   -   if reference is a plain number, a precision for it can be specified. Must be an integer
     *                  value > 0. Default: Same precision as specified for the Signal. If the precision is different
     *                  from the precision in the Signal instance, the minimum precision of both is applied for the
     *                  comparison (left side and right side). The same counts for the comparison of two Signals.
     *  reduce      -   if set to true, the function will return a boolean value that indicates if the comparison
     *                  is valid for each of the compared values. If set to false, a new Signal will be returned
     *                  with element-wise comparison results as values property.
     * 
     * Applied comparisons of operator and options combinations
     * 
     *  operator    |   threshold   |   tolerance   |   comparison  |           result  
     *   
     *      <                0              0             any           val - ref < 0
     *      <               >0              0           absolute        val - ref < -threshold
     *      <               >0              0           relative        (val - ref) / |ref| < -threshold
     *      <                0             >0           absolute        val - ref < tolerance
     *      <                0             >0           relative        (val - ref) / |ref| < tolerance
     *      <=               0              0             any           val - ref <= 0
     *      <=              >0              0           absolute        val - ref <= -threshold
     *      <=              >0              0           relative        (val - ref) / |ref| <= -threshold
     *      <=               0             >0           absolute        val - ref <= tolerance
     *      <=               0             >0           relative        (val - ref) / |ref| <= tolerance
     *      >                0              0             any           val - ref > 0
     *      >               >0              0           absolute        val - ref > threshold
     *      >               >0              0           relative        (val - ref) / |ref| > threshold
     *      >                0             >0           absolute        val - ref > -tolerance
     *      >                0             >0           relative        (val - ref) / |ref| > -tolerance
     *      >=               0              0             any           val - ref >= 0
     *      >=              >0              0           absolute        val - ref >= threshold
     *      >=              >0              0           relative        (val - ref) / |ref| >= threshold
     *      >=               0             >0           absolute        val - ref >= -tolerance
     *      >=               0             >0           relative        (val - ref) / |ref| >= -tolerance
     *      !=               0              0             any           val - ref != 0
     *      !=              >0              0           absolute        |val - ref| > threshold
     *      !=              >0              0           relative        |val - ref| / |ref| > threshold
     *      !=               0             >0           absolute        error
     *      !=               0             >0           relative        error
     *      ==               0              0             any           val - ref == 0
     *      ==              >0              0           absolute        error
     *      ==              >0              0           relative        error
     *      ==               0             >0           absolute        |val - ref| <= tolerance
     *      ==               0             >0           relative        |val - ref| / |ref| <= tolerance
     *      any             >0             >0             any           error
     * 
     * @author localhorst87
     * @param {string} operator the operator (<, <=, ==, !=, => or >) for the comparison
     * @param {number | Signal} reference the right-hand-side value/values for the comparison
     * @param {CompareOptions} [options] options that can be specified for the comparison
     * @return {Signal | boolean} returns a new Signal with 0/1 - values for element-wise comparison
     *                            or a boolean value for reduced comparison
     */
     compare(operator, reference, options = {}) {
        this.#checkComparisonArgumentTypes(operator, reference, options);        
        options = this.#alignCompareOptions(reference, options);
        this.#checkComparisonThresholds(operator, options);

        if (reference instanceof Signal)
            reference = this.#alignCompareSignals(reference);
        const comparisonData = this.#createComparisonData(operator, reference, options);
        const compareResult = this.#compareValues(comparisonData);

        return this.#createComparisonOutput(compareResult, reference, operator, options.reduce);
    }

    /**
     * Appendix function that can be used to return a new state of the Signal instance
     * after an operation as a new object, while keeping the state of the instance 
     * as it has been before the operation
     *
     * @author localhorst87
     * @private
     * @return {Signal} returns a copy of the instance
     */
    #returnAndKeep() {
        let newState = this.copy(); // new state of the object after operation
        this.#revertThis(); // set this instance back to state before operation
        return newState; // return the state of the instance after operation
    }

    /**
     * Reverts the signal time and values to a specific step.
     * Changes will affect on this instance!
     *
     * @author localhorst87
     * @private
     * @param {number} step step to revert to. Must be an integer value > 0. Counting starts from 1 (not 0)
     */
    #revertThis(step) {
        if (!step) {
            step = this.#history.length - 1; // if step not given, it just reverts to the last step
        }

        this.#time = [...this.#history[step - 1].time];
        this.#values = [...this.#history[step - 1].values];
        this.#history = this.#history.slice(0, step);
    }

    /**
     * Calculates the differences between two adjacent time values of the time vector
     *
     * @author localhorst87
     * @private
     * @return {number[]} The resulting vector
     */
    #getTimeDiff() {
        let rawDiff = this.time.slice(1).map((t, i) => t - this.time[i]);
        return this.#applyPrecision(rawDiff, this.#precision)
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
     * checks if a unit conversion is possible from physical point of view
     * e.g.: A conversion from m to inch is possible, as this is the same physical base
     * whereas a conversion from kg to m/s² is not possible, as the physical base is
     * distinct (mass <=/=> acceleration)
     *
     * @author localhorst87
     * @private
     * @param {string} sourceUnitName source unit name according to MathJS unit convention
     * @param {string} targetUnitName target unit name according to MathJS unit convention
     * @return {boolean} return true/false upon possible/impossible conversion
     */
    #isConversionPossible(sourceUnitName, targetUnitName) {
        let sourceUnit = mathjs.unit(sourceUnitName);
        let targetUnit = mathjs.unit(targetUnitName);

        return sourceUnit.equalBase(targetUnit);
    }

    /**
     * performs the calculation for unit conversion of the vector that has passed by reference
     *
     * @author localhorst87
     * @private
     * @param {number[]} sourceArray this.#time or this.#values array
     * @param {string} sourceUnitName verified source unit name
     * @param {string} targetUnitName verified target unit name
     * @param {number} precision precision ot apply after conversion
     * @return {number[]} converted value, rounded to specified precisions
     */
    #convertArray(sourceArray, sourceUnitName, targetUnitName, precision) {
        let targetVector = [];

        sourceArray.forEach((val) => {
            let convertedValue = this.#convertValue(val, sourceUnitName, targetUnitName, precision);
            targetVector.push(convertedValue);
        });

        return targetVector;
    }

    /**
     * Atomic unit conversion of a value from one unit to another. Validity of 
     * conversion pair must have been checked in advance
     *
     * @author localhorst87
     * @private
     * @param {number} numVal numerical value in source unit
     * @param {string} sourceUnitName verified source unit name
     * @param {string} targetUnitName verified target unit name
     * @param {number} precision precision ot apply after conversion
     * @return {number} converted value, rounded to specified precisions
     */
    #convertValue(numVal, sourceUnitName, targetUnitName, precision) {
        let unitValueSource = mathjs.unit(numVal, sourceUnitName); // Unit instance
        let convertedValue = unitValueSource.toNumber(targetUnitName); // number
        
        return this.#precise(convertedValue, precision);
    }
    
    /**
     * Helper method that creates a number array with the given precision
     *
     * @author localhorst87
     * @private
     * @param {number[]} input Raw number of number array
     * @param {number} precision target precision
     * @return {number[]} number of number array rounded to given precision
     */
    #applyPrecision(array, precision) {
        let output = [];
        array.forEach(val => {
            if (typeof(val) != "number") throw("arrays must contain numerical values only!");
            output.push(this.#precise(val, precision));
        });
        return output;
    }

    /**
     * Helper method, that applies precision to a single numeric value
     *
     * @author localhorst87
     * @private
     * @param {number} numVal raw numeric value
     * @param {number} precision target precision
     * @return {number} number with applied precision
     */
    #precise(numVal, precision) {
        return parseFloat(numVal.toPrecision(precision));
    }

    /**
     * Adds an offset to each value of the values array of this instance
     * 
     * @author localhorst87
     * @private
     * @param {number} offset value to add
     */
    #addNumber(offset) {
        let addedValues = [];
        this.#values.forEach(val => {
            addedValues.push(val + offset);
        });

        this.#values = this.#applyPrecision(addedValues, this.#precision);
    }
    
    /**
     * Adds the value array to the values array of this instance element-wise
     * Checks before if addition is possible
     *  1) by checking if units physical base correspond
     *  2) by checking if the duration corresponds
     * 
     * If the duration of the two signals are equal, but the sample rate is different,
     * an interpolation will be done for the external Signal instance
     * 
     * @author localhorst87
     * @private
     * @param {Signal} signal Signal which contains the values to add
     */
    #addSignal(signal) {
        if (this.#units.time != signal.units.time) {
            if (this.#isConversionPossible(this.#units.time, signal.units.time))
                signal.time = this.#convertArray(signal.time, signal.units.time, this.#units.time, this.#precision);
            else
                throw("Time units have different physical base. Can not add or subtract signals");
        }

        if (this.#units.values != signal.units.values) {
            if (this.#isConversionPossible(this.#units.values, signal.units.values))
                signal.values = this.#convertArray(signal.values, signal.units.values, this.#units.values, this.#precision);
            else
                throw("Value units have different physical base. Can not add or subtract signals");
        }

        if (this.duration != signal.duration)
            throw("Can not add or subtract two signals of different duration")

        if (this.length != signal.length)
            signal = this.#alignSignal(signal);

        let addedValues = [];
        for (let i = 0; i < this.length; i++) {
            addedValues.push(this.#values[i] + signal.values[i]);
        }

        this.#values = this.#applyPrecision(addedValues, this.#precision);
    }

    /**
     * Multiplies the values of this Signal instance with the given factor
     * 
     * @author localhorst87
     * @private
     * @param {number} factor Factor to multiply the values of this Signal instance
     * @param {string} [unitName] Physical unit of the factor. If not given, factor is consideres as unitless
     */
    #multiplyNumber(factor, unitName) {
        let multipliedValues = [];
        this.#values.forEach(val => {
            multipliedValues.push(val * factor); 
        });
        this.#values = this.#applyPrecision(multipliedValues, this.#precision);

        if (unitName != "-") {
            let multipliedUnit = mathjs.multiply(mathjs.unit(this.units.values), mathjs.unit(unitName));
            this.#units.values = multipliedUnit.toString();
        }
    }

    /**
     * Multiplies the values of the given signal with the values of this Signal instance element-wise
     * 
     * Checks before if multiplication is possible
     *  1) by checking if time units physical base correspond
     *  2) by checking if the duration corresponds
     * 
     * If the duration of the two signals are equal, but the sample rate is different,
     * an interpolation will be done for the external Signal instance
     * @author localhorst87
     * @private
     * @param {Signal} signal Signal which contains the values to multiply
     */
    #multiplySignal(signal) {
        if (this.#units.time != signal.units.time) {
            if (this.#isConversionPossible(this.#units.time, signal.units.time))
                signal.time = this.#convertArray(signal.time, signal.units.time, this.#units.time, this.#precision);
            else
                throw("time units have different physical base. Can not multiply signals");
        }

        if (this.duration != signal.duration)
            throw("can not multiply two signals of different duration")

        if (this.length != signal.length)
            signal = this.#alignSignal(signal);

        let multipliedValues = [];
        for (let i = 0; i < this.length; i++) {
            multipliedValues.push(this.#values[i] * signal.values[i]);
        }
    
        this.#values = this.#applyPrecision(multipliedValues, this.#precision);

        if (signal.units.values != "-") {
            let multipliedUnit = mathjs.multiply(mathjs.unit(this.units.values), mathjs.unit(signal.units.values));
            this.#units.values = multipliedUnit.toString();
        }
    }

    /**
     * Divides the values of this Signal instance by the given divisor
     * 
     * @author localhorst87
     * @private
     * @param {number} divisor Divisor that is applied to the values of this Signal instance
     * @param {string} [unitName] Physical unit of the divisor. If not given, factor is consideres as unitless
     */
    #divideNumber(divisor, unitName) {
        let dividedValues = [];
        this.#values.forEach(val => {
            dividedValues.push(val / divisor); 
        });
        this.#values = this.#applyPrecision(dividedValues, this.#precision);

        if (unitName != "-") {
            let dividedUnit = mathjs.divide(mathjs.unit(this.units.values), mathjs.unit(unitName));
            this.#units.values = dividedUnit.toString();
        }
    }

    /**
     * Divides the values of the this Signal instance by the values of the given signal element-wise
     * 
     * Checks before if division is possible
     *  1) by checking if time units physical base correspond
     *  2) by checking if the duration corresponds
     *  3) by checking if signal contains any 0 value
     * 
     * If the duration of the two signals are equal, but the sample rate is different,
     * an interpolation will be done for the external Signal instance
     * @author localhorst87
     * @private
     * @param {Signal} signal Signal which contains the values for division
     */
    #divideSignal(signal) {
        if (this.#units.time != signal.units.time) {
            if (this.#isConversionPossible(this.#units.time, signal.units.time))
                signal.time = this.#convertArray(signal.time, signal.units.time, this.#units.time, this.#precision);
            else
                throw("time units have different physical base. Can not divide signals");
        }

        if (this.duration != signal.duration)
            throw("can not divide two signals of different duration")

        if (this.length != signal.length)
            signal = this.#alignSignal(signal);

        let dividedValues = [];
        for (let i = 0; i < this.length; i++) {
            if (signal.values[i] == 0)
                throw("Divisor signal must not contain zero values")
            dividedValues.push(this.#values[i] / signal.values[i]);
        }
    
        this.#values = this.#applyPrecision(dividedValues, this.#precision);

        if (signal.units.values != "-") {
            let dividedUnit = mathjs.divide(mathjs.unit(this.units.values), mathjs.unit(signal.units.values));
            this.#units.values = dividedUnit.toString();
        }
    }

    /**
     * Adjusts a signal of same duration, but different sampling rate to the sample rate of this 
     * Signal instance
     *
     * @author localhorst87
     * @private
     * @param {Signal} signalToAlign signal to be adjusted
     * @return {Signal} adjusted signal
     */
    #alignSignal(signalToAlign) {
        let targetTimeArray = [];
        for (let i = 0; i < this.length; i++) {
            targetTimeArray.push(this.#time[i] + signalToAlign.time[0] - this.#time[0]);
        }
        targetTimeArray = this.#applyPrecision(targetTimeArray, this.#precision);

        return signalToAlign.interpolate(targetTimeArray);
    }

    /**
     * returns a linear interpolated value of the given time point
     *
     * @author localhorst87
     * @private
     * @param {number[]} targetTimeArray time values that shall be used for the interpolation
     * @return {number[]} interpolated values
     */
    #interpolateLinear(targetTimeArray) {
        let interpolatedValues = [];

        targetTimeArray.forEach(tNew => {
            let valueNew;            

            let idxPre = this.#time.findLastIndex(t => t <= tNew); // as boundaries and monotony have been checked, findLastIndex will never return -1
            idxPre = Math.min(idxPre, this.length - 2); // limit to second last index, in case t == tNew, to not cause invalid array index for post values
            let timePre = this.#time[idxPre];
            let timePost = this.#time[idxPre + 1];
            let valuePre = this.#values[idxPre];
            let valuePost = this.#values[idxPre + 1];
            
            valueNew = valuePre + (valuePost - valuePre) * (tNew - timePre) / (timePost - timePre);

            interpolatedValues.push(valueNew);
        });

        return interpolatedValues;
    }
    
    /**
     * Add an entry into the history of the Signal instance
     *
     * @author localhorst87
     * @private
     * @param {string} processing description of what has been done
     * @param {number[]} values new (raw) value array
     * @param {number[]} values new (raw) value array
     */
     #addHistoryEntry(processing) {
        let newEntry = {
            step: this.#history.length + 1,
            date: new Date(),
            time: [...this.#time],
            values: [...this.#values],
            processing: processing
        };

        this.#history.push(newEntry);
    }

    /**
     * checks if the high-level arguments of the compare function have valid types
     *
     * @author localhorst87
     * @private
     * @param {string} operator the operator (<, <=, ==, !=, => or >) for the comparison
     * @param {number | Signal} reference the right-hand-side value/values for the comparison
     * @param {CompareOptions} options raw options for the compare function 
     */
    #checkComparisonArgumentTypes(operator, reference, options) {
        if (typeof(operator) != "string")
            throw("operator must be a string");
        if (typeof(reference) != "number" && !(reference instanceof Signal))
            throw("reference must either be a single numerical value of another Signal instance");
        if (!util.isStructureValid(options, schemas.COMPARE_OPTIONS))
            throw("options properties are not valid according to the options schema specification");
    }

    /**
     * helper method to check and fill CompareOptions with default values if they are not set
     *
     * @author localhorst87
     * @private
     * @param {number | Signal} reference the right-hand-side value/values for the comparison
     * @param {CompareOptions} options raw options for the compare function 
     * @return {CompareOptions} returns options filled with default values, if not set
     */
    #alignCompareOptions(reference, options) {
        if (!options) // if options are not defined, it must be initialized to add properties
            options = {};
        
        if (!options.comparison)
            options.comparison = "absolute";
        else {
            if (options.comparison == "relative") {
                if (reference instanceof Signal) {
                    if (reference.values.includes(0))
                        throw("for relative comparison, reference is not allowed to contain any 0")
                }
                else {
                    if (reference == 0)
                        throw("for relative comparison, rerence is not allowed to be 0")
                }
            }
        }
        
        if (!options.threshold)
            options.threshold = 0;
        
        if (!options.tolerance)
            options.tolerance = 0;

        if (options.unit) {
            if (!this.#isUnitValid(options.unit))
                throw("Unit " + options.unit + " is unknown or not supported");
            if (reference instanceof Signal)
                if (options.tolerance == 0 && options.threshold == 0)
                    throw("If Unit is set on comparing two Signals, the given unit counts for the tolerance/threshold, but no tolerance or threshold is given here.");
        }
        else
            options.unit = this.#units.values;

        if (options.precision) {
            if (reference instanceof Signal)
                throw("Precision can only be set if reference is a number, but not a Signal instance");
            else {
                options.precision = Math.min(this.#precision, options.precision);
            }
        }
        else {
            if (reference instanceof Signal)
                options.precision = Math.min(this.#precision, reference.precision);
            else
                options.precision = this.#precision;
        }            
        
        if (!options.reduce)
            options.reduce = false;
        
        return options;
    }

    /**
     * checks if the threshold and tolerances are exclusively defined and if they are valid for specific operators
     *
     * @author localhorst87
     * @private
     * @param {string} operator the operator (<, <=, ==, !=, => or >) for the comparison
     * @param {CompareOptions} options raw options for the compare function 
     */
    #checkComparisonThresholds(operator, options) {
        if (options.threshold > 0 && options.tolerance > 0)
            throw("either threshold or tolerance can be defined, but not both at the same time");
        if (operator == "!=" && options.tolerance > 0)
            throw("Invalid combination: For the unequality operation, a threshold may be defined, but not a tolerance.")
        if (operator == "==" && options.threshold > 0)
            throw("Invalid combination: For the equality operations, a tolerance may be defined, but not a threshold.")
    }

    /**
     * aligns two Signals of different duration by adjusting their sampling frequency
     *
     * @author localhorst87
     * @private
     * @param {Signal} signal Signal to compare with
     * @return {Signal} aligned Signal
     */
    #alignCompareSignals(signal) {
        if (this.#units.time != signal.units.time) {
            if (this.#isConversionPossible(this.#units.time, signal.units.time))
                signal.time = this.#convertArray(signal.time, signal.units.time, this.#units.time, this.#precision);
            else
                throw("Time units have different physical base. Can not add or compare signals");
        }
        if (this.duration != signal.duration)
            throw("Can not compare two signals of different duration");
        if (this.length != signal.length)
            signal = this.#alignSignal(signal);

        return signal;
    }

    /**
     * Creates processed data that is ready to be used in a compare function
     *
     * @author localhorst87
     * @private
     * @param {string} operator the operator (<, <=, ==, !=, => or >) for the comparison
     * @param {number | Signal} reference the right-hand-side value/values for the comparison
     * @param {CompareOptions} options raw options for the compare function 
     * @return {ComparisonData} data ready-made to be compared
     */
    #createComparisonData(operator, reference, options) {
        let specifiedUnitName = options.unit;
        let targetUnitName = this.#units.values;

        let comparisonData = {
            operator: operator,
            comparison: options.comparison,
            lhsValues: this.#applyPrecision(this.#values, options.precision),
            rhsValues: [],
            tolerance: options.tolerance,
            threshold: options.threshold,
            precision: options.precision
        };

        if (reference instanceof Signal) {
            // check compliance of signal to reference signal and the thresholds units
            if (reference.units.values != targetUnitName) {
                if (this.#isConversionPossible(reference.units.values, targetUnitName)) {
                    reference = reference.convert("values", targetUnitName);
                }
                else
                    throw("Comparison not possible: Reference units are not compliant to units of this Signal");
            }

            comparisonData.rhsValues = this.#applyPrecision(reference.values, options.precision);

            if (specifiedUnitName != targetUnitName && options.comparison == "absolute") {
                if (this.#isConversionPossible(specifiedUnitName, targetUnitName)) {
                    comparisonData.threshold = this.#convertValue(options.threshold, specifiedUnitName, targetUnitName, options.precision);
                    comparisonData.tolerance = this.#convertValue(options.tolerance, specifiedUnitName, targetUnitName, options.precision);
                }
                else
                    throw("Comparison not possible: Reference units are not compliant to units of this Signal");
            }
        }
        else {
            // check compliance of signal to reference number and thresholds units
            if (specifiedUnitName != targetUnitName) {
                if (this.#isConversionPossible(specifiedUnitName, targetUnitName)) {
                    reference = this.#convertValue(reference, specifiedUnitName, targetUnitName, options.precision);
                    if (options.comparison == "absolute") {
                        comparisonData.threshold = this.#convertValue(options.threshold, specifiedUnitName, targetUnitName, options.precision);
                        comparisonData.tolerance = this.#convertValue(options.tolerance, specifiedUnitName, targetUnitName, options.precision);
                    }
                }
                else
                    throw("Comparison not possible: Reference units are not compliant to units of this Signal");
            }

            let referencePrecised = this.#precise(reference, options.precision);
            comparisonData.rhsValues = Array(this.length).fill(referencePrecised); // array of same length filled with ref value
        }

        return comparisonData;
    }

    /**
     * performs the actual comparison, based on the given comparison data, that contains
     * comparison (relative/absolute), LHS values, RHS values, tolerance/threshold, precision
     *
     * @author localhorst87
     * @private
     * @param {ComparisonData} comparisonData the processed data ready for the comparison
     * @return {number[]} returns an array of 0/1 values for each element-wise comparison
     */
    #compareValues(comparisonData) {
        let result = [];

        let compareFn = this.#getCompareFunction(comparisonData);
        for (let i = 0; i < this.length; i++) {
            result.push(compareFn(comparisonData.lhsValues[i], comparisonData.rhsValues[i]));
        }

        return result;
    }

    /**
     * Returns the function to be applied between each LHS and RHS value, based on the combination
     * of operator and comparison (relative/absolute) that is given in the ComparisonData
     *
     * @author localhorst87
     * @private
     * @param {ComparisonData} comparisonData the processed data ready for the comparison
     * @return {Function} returns the function to be applied for each element-wise comparison
     */
    #getCompareFunction(comparisonData) {
        // tolerance and threshold will never be >0 both at the same time.
        // Either tolerance or threshold will be 0, so it is enough implementing one function
        // containing threshold and tolerance and not distinguish which of the values is >0

        switch (comparisonData.operator) {
            case "<":
                if (comparisonData.comparison == "absolute") {
                    return (lhs, rhs) => {
                        const diff = this.#precise(lhs - rhs, comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        
                        return Number(diff < tolerance - threshold);
                    }
                }
                else if (comparisonData.comparison == "relative") {
                    return (lhs, rhs) => {
                        const div = this.#precise((lhs - rhs) / Math.abs(rhs), comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        
                        return Number(div < tolerance - threshold);
                    }
                }
            case "<=":
                if (comparisonData.comparison == "absolute") {
                    return (lhs, rhs) => {
                        const diff = this.#precise(lhs - rhs, comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);

                        return Number(diff <= tolerance - threshold);
                    }
                }
                else if (comparisonData.comparison == "relative") {
                    return (lhs, rhs) => {
                        const div = this.#precise((lhs - rhs) / Math.abs(rhs), comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        
                        return Number(div <= tolerance - threshold);
                    }
                }
            case ">":
                if (comparisonData.comparison == "absolute") {
                    return (lhs, rhs) => {
                        const diff = this.#precise(lhs - rhs, comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);

                        return Number(diff > threshold - tolerance);
                    }
                }
                else if (comparisonData.comparison == "relative") {
                    return (lhs, rhs) => {
                        const div = this.#precise((lhs - rhs) / Math.abs(rhs), comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        
                        return Number(div > threshold - tolerance);
                    }
                }
            case ">=":
                if (comparisonData.comparison == "absolute") {
                    return (lhs, rhs) => {
                        const diff = this.#precise(lhs - rhs, comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);

                        return Number(diff >= threshold - tolerance);
                    }
                }
                else if (comparisonData.comparison == "relative") {
                    return (lhs, rhs) => {
                        const div = this.#precise((lhs - rhs) / Math.abs(rhs), comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        
                        return Number(div >= threshold - tolerance);
                    }
                }
            case "!=":
                if (comparisonData.comparison == "absolute") {
                    return (lhs, rhs) => {
                        const diff = this.#precise(Math.abs(lhs - rhs), comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        return Number(diff > threshold);
                    }
                }
                else if (comparisonData.comparison == "relative") {
                    return (lhs, rhs) => {
                        const div = this.#precise(Math.abs((lhs - rhs) / rhs), comparisonData.precision);
                        const threshold = this.#precise(comparisonData.threshold, comparisonData.precision);
                        
                        return Number(div > threshold);
                    }
                }
            case "==":
                if (comparisonData.comparison == "absolute") {
                    return (lhs, rhs) => {
                        const diff = this.#precise(Math.abs(lhs - rhs), comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        return Number(diff <= tolerance);
                        
                    }
                }
                else if (comparisonData.comparison == "relative") {
                    return (lhs, rhs) => {
                        const div = this.#precise(Math.abs((lhs - rhs) / rhs), comparisonData.precision);
                        const tolerance = this.#precise(comparisonData.tolerance, comparisonData.precision);
                        return Number(div <= tolerance);
                    }
                }
            default:
                throw("operator " + operator + "is invalid. Allowed operations: <, <=, >=, >, != and ==");
        }
    }

    /**
     * Creates the output to be returned, based on 
     *
     * @author localhorst87
     * @private
     * @param {number[]} compareResult the result of the comparison (0/1 values) 
     * @param {Signal | number} reference the right-hand-side value/values for the comparison
     * @param {string} operator comparison operator between LHS and RHS values
     * @param {boolean} reduce if set to true, a boolean reduced value will be returned. If set
     *                         to false, a Signal with compareResult as values will be returned
     * @return {Signal | boolean} returns the function to be applied for each element-wise comparison
     */
    #createComparisonOutput(compareResult, reference, operator, reduce) {
        if (reduce)
            return compareResult.every((val) => val == 1);
        else {
            let comparedEntityName;
            if (reference instanceof Signal)
                comparedEntityName = reference.name;
            else
                comparedEntityName = String(reference);
            
            let resultSignalConfig = {
                name: "comparison result of " + this.name + " " + operator + " " + comparedEntityName,
                unit_time: this.#units.time,
                precision: this.#precision,
            };
            
            return new Signal(this.#time, compareResult, resultSignalConfig);
        }
    }
}