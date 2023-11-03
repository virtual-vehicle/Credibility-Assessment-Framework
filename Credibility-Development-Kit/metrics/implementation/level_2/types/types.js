// General

/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * 
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

/**
 * Measurement Type Definition
 * 
 * @typedef {Object} Measurement contains time and value arrays as well as a unit
 * @property {number[]} time
 * @property {number[]} values
 * @property {string} unit
 */

module.exports = {
    /**
     * @type {ResultLog}
     * @type {MeasurementCollection}
     * @type {Measurement}
     */
}