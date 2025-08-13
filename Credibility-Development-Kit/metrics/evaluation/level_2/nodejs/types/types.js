const { Signal } = require("../../../../util/signal");

/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * 
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

/**
 * TargetObject
 * 
 * @typedef {object} TargetObject 
 * @property {string} type 
 * @property {string} [subtype]
 */
 
/** 
 * TargetSignal
 * 
 * @typedef {object} TargetSignal
 * @property {string} type
 * @property {string} [subtype]
 */

/**
 * MapReference
 * 
 * An object or signal in the map that is used as a reference, e.g. for checking
 * the accuracy of the map with respect to a global COS
 * 
 * @typedef {object} MapReference
 * @property {string} type must be either "object" or "signal"
 * @property {string} id id of the object or signal in the ODR
 * @property {Coordinates} coordinates the coordinates of the reference
 */

/**
 * Coordinates
 * 
 * @typedef {object} Coordinates
 * @property {string} proj projection string, according to https://proj.org/
 * @property {number} north decimal north coordinates w.r.t. the projection
 * @property {number} east decimal east coordinates w.r.t. the projection
 */

/**
 * LineMarking
 * 
 * @typedef {object} LineMarking
 * @property {string} type
 * @property {string} color 
 * @property {string} weight
 */

module.exports = {
    /**
     * @type {ResultLog}
     * @type {MeasurementCollection}
     * @type {Measurement}
     * @type {SignalsCollection}
     * @type {TargetObject}
     * @type {TargetSignal}
     * @type {MapReference}
     * @type {LineMarking}
     */
}