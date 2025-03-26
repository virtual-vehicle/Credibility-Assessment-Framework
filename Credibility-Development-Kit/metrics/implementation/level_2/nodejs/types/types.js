/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * 
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

/**
 * LaneTransitions
 * 
 * @typedef {object} LaneTransition
 * @property {number[][]} transitions list of all lane transitions [from, to]
 * @property {string} direction must be either "same" (-->|-->), "opposing" (-->|<--) or "diverging" (<--|-->)
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
 * @typedef {object} Coordinates
 * @property {string} proj projection string, according to https://proj.org/
 * @property {number} north decimal north coordinates w.r.t. the projection
 * @property {number} east decimal east coordinates w.r.t. the projection
 */

/**
 * @typedef {object} MapLocation
 * @property {string} roadId
 * @property {string} laneId
 * @property {number} [s]
 * @property {number} [offset]
 */

/**
 * @typedef {object} LineMarking
 * @property {string} type
 * @property {string} color 
 * @property {string} weight
 */

/**
 * @typedef {object} OscParameterSet
 * @property {string[]} parameters
 * @property {string[]} values
 */

/**
 * ODR Reader's internal_3dpose
 * 
 * @typedef {import('../../../../util/opendrive-reader/types/internal').internal_pose3d} pose3d
 * @typedef {import('../../../../util/opendrive-reader/types/specification').t_road} t_road
 * @typedef {import('../../../../util/opendrive-reader/types/specification').t_road_planView} t_road_planView
 * @typedef {import('../../../../util/opendrive-reader/types/specification').t_junction} t_junction
 */

module.exports = {
/**
 * @type {ResultLog}
 * @type {LaneTransitions}
 * @type {pose3d}
 * @type {t_road}
 * @type {t_road_planView}
 * @type {t_junction}
 * @type {TargetObject}
 * @type {TargetSignal}
 * @type {MapReference}
 * @type {MapLocation}
 * @type {LineMarking}
 * @type {OscParameterSet}
 */
}