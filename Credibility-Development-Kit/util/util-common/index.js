const Ajv = require("ajv");
const ajv = new Ajv({$data: true, allErrors: true})
require("ajv-keywords")(ajv);

exports.isStructureValid = isStructureValid
exports.roundToDigit = roundToDigit;
exports.getLsd = getLsd;
exports.roundToInterval = roundToInterval;
exports.floorToInterval = floorToInterval;
exports.ceilToInterval = ceilToInterval;
exports.mod = mod;

const PRECISION = 15;

/**
 * Validates if the passed object fulfills the given JSON schema
 * 
 * @author  localhorst87
 * @function
 * @param   {Object} obj    The object to be validated 
 * @param   {Object} schema The schema the object is validated against
 * @return  {Boolean}       returns true if the object fulfills the schema
*/
function isStructureValid(obj, schema) {
    const validate = ajv.compile(schema);
    return validate(obj);
}

/**
 * Applies the given significant digits to the number
 * 
 * @author localhorst87
 * @function 
 * @param {number} value value to apply precision to
 * @param {number} precision significant digits
 * @returns {number} value with given significant digits
 */
function precise(value, precision) {
    return parseFloat(value.toPrecision(precision));
}

/**
 * Rounds a value to a given digit.
 * The function is valid for fast floating point arithmetic,
 * up to a precision of 15 digits.
 * 
 * digit > 0:   digit after decimal point
 * 
 * digit == 0:  round to integer
 * 
 * digit < 0:   digit before decimal point
 * 
 * @author localhorst87
 * @function
 * @param {number} value value to round
 * @param {number} digit the digit to round to
 * @param {Function} [roundFn=Math.round] round function, Math.round by default
 * @returns {number} rounded value
 */
function roundToDigit(value, digit, roundFn = Math.round) {
    if (typeof(value) !== "number")
        throw("value must be numerical");
    if (typeof(digit) !== "number")
        throw("digit must be numerical");
    if (!Number.isInteger(digit))
        throw("digit must be an integer");
    if (roundFn !== Math.round && roundFn !== Math.ceil && roundFn !== Math.floor)
        throw("only Math.round, Math.ceil and Math.floor allowed as roundFn");
    
    const tenPower = Math.pow(10, digit);
    const roundedValue = roundFn(value * tenPower) / tenPower;

    return precise(roundedValue, PRECISION);
}

/**
 * Returns the least significant digit of the number.
 * 
 * This function is valid for numbers up to a precision
 * of 15 (numbers with 15 digits without leading or trailing 
 * zeroes)
 * 
 * lsd > 0:   digit after decimal point
 * 
 * lsd <= 0:  digit before decimal point
 * 
 * @author localhorst87
 * @function
 * @param {number} value 
 * @returns {number} least significant digit
 */
function getLsd(value) {
    if (typeof(value) !== "number")
        throw("value must be numeric");
    
    if (value === 0)
        return 0;
    
    value = precise(value, PRECISION);
    
    let lsd = 0;  

    if (Number.isInteger(value)) {
        while(value - roundToDigit(value, --lsd, Math.round) == 0) continue;
        lsd += 1;
    }
    else
        while(value - roundToDigit(value, ++lsd, Math.round) !== 0) continue;
    
    return lsd;
}

/**
 * Rounds a number to the nearest number that
 * can be divided by the given interval
 * 
 * @author localhorst87
 * @function 
 * @param {number} value raw numeric value
 * @param {number} interval interval to round to
 * @returns {number} number with applied interval
 */
function roundToInterval(value, interval) {
    if (typeof(value) !== "number")
        throw("value must be a number");
    if (typeof(interval) !== "number")
        throw("interval must be a number");
    if (interval <= 0)
        throw("interval must be > 0");
    
    const lsd = Math.max(getLsd(interval), getLsd(value));
    const remainder = roundToDigit(mod(value, interval), lsd); // use round to digit to avoid floating point errors

    if (value >= 0)
        return remainder < interval/2 ? roundToDigit(value - remainder, lsd) : roundToDigit(value - remainder + interval, lsd);
    else 
        return Math.abs(remainder) <= interval/2 ? roundToDigit(value - remainder, lsd) : roundToDigit(value - remainder - interval, lsd);
}

/**
 * Floors a number to the nearest number that
 * can be divided by the given interval
 * 
 * @author localhorst87
 * @function 
 * @param {number} value raw numeric value
 * @param {number} interval interval to round to
 * @returns {number} number with applied interval
 */
function floorToInterval(value, interval) {
    if (typeof(value) !== "number")
        throw("value must be a number");
    if (typeof(interval) !== "number")
        throw("interval must be a number");
    if (interval <= 0)
        throw("interval must be > 0");

    const lsd = Math.max(getLsd(interval), getLsd(value));
    const remainder = roundToDigit(mod(value, interval), lsd); // use round to digit to avoid floating point errors

    if (value >= 0)
        return roundToDigit(value - remainder, lsd);
    else
        return Math.abs(remainder) > 0 ? roundToDigit(value - remainder - interval, lsd) : value;
}

/**
 * Ceils a number to the nearest number that
 * can be divided by the given interval
 * 
 * @author localhorst87
 * @function 
 * @param {number} value raw numeric value
 * @param {number} interval interval to round to
 * @returns {number} number with applied interval
 */
 function ceilToInterval(value, interval) {
    if (typeof(value) !== "number")
        throw("value must be a number");
    if (typeof(interval) !== "number")
        throw("interval must be a number");
    if (interval <= 0)
        throw("interval must be > 0");

    const lsd = Math.max(getLsd(interval), getLsd(value));
    const remainder = roundToDigit(mod(value, interval), lsd); // use round to digit to avoid floating point errors

    if (value >= 0)
        return remainder > 0 ? roundToDigit(value - remainder + interval, lsd) : value;
    else
        return roundToDigit(value - remainder, lsd);
}

/**
 * floating-point safe modulo operator
 * 
 * @author localhorst87
 * @function
 * @param {number} value 
 * @param {number} divisor 
 * @returns {number} remainder of value / divisor
 */
function mod(value, divisor) {
    if (typeof(value) !== "number")
        throw("value must be numeric");
    if (typeof(divisor) !== "number")
        throw("divisor must be numeric");
    
    const lsd = Math.max(getLsd(value), getLsd(divisor));
    const remainderPower = (value * Math.pow(10, lsd)) % (divisor * Math.pow(10, lsd));

    return remainderPower / Math.pow(10, lsd);
}