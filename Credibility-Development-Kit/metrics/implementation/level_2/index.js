const convergency = require("./src/convergency/convergency");
const opendrive = require("./src/opendrive/opendrive");

/**
 * @typedef {import('./types/types').Measurement} Measurement
 * @typedef {import('./types/types').ResultLog} ResultLog
 * @typedef {import('./types/types').pose3d} pose3d
 * @typedef {import('./types/types').TargetObject} TargetObject
 * @typedef {import('./types/types').TargetSignal} TargetSignal
 * @typedef {import('./types/types').MapReference} MapReference
 * @typedef {import('./types/types').LineMarking} LineMarking
 */

/**
 * @module metrics/implementation/level_2
 */

/**
 * Verifies if the solution to the discretized equations approaching the continuum solution to the partial 
 * differential equations in the limit of decreasing element size.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase implementation
 * @step [integration]
 * @param {string} signalName the name of the signal to evaluate
 * @param {number | string} nSamples the number of equidistant samples to evaluate
 * @param {string} resultExact stringified Signal array as returned by a Signal adapter, like the openmcx-csv-adapter
 * @param {...string} resultDiscretized at least 2 stringified Signal arrays, as returned by a Signal adapter, like the openmcx-csv-adapter
 * @returns {ResultLog} result and logging information
 */
const checkConvergency = convergency.verifyConvergency;

/**
 * Verifies, if all transitions (for all lane boundaries) between connected roads are smooth enough, according to the given threshold.
 * 
 * Further, it will be checked, if the transitions between the single segments within the geometric definition of the road (i.e., between 
 * geometry elements, elevation elements, superelevation elemens and shape elements) are smooth enough, according to
 * the given allowed threshold.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [models]
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} offsetThreshold maximum allowed offset (as stringified {@link pose3d} object)
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveOffsets = opendrive.checkOffsets;

/**
 * Verifies if all references to roads, junctions and lanes inside roads and junctions 
 * are well-defined in the OpenDRIVE model
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [models]
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveReferences = opendrive.checkReferences;

/**
 * Verifies if the given OpenDRIVE road network is compatible with the given OpenSCENARIO scenario definition.
 * In detail, it will be checked if the initial conditions, given in the OpenSCENARIO file (like road ID and lane ID),
 * are compatible with the OpenDRIVE model.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [integration]
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} xoscString The string of the according OpenSCENARIO file
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveScenarioIntegration = opendrive.checkScenarioIntegration;

/**
 * Validates if the accuracy (the offset between map and reference world coordinate system) of the map is below a given
 * threshold, using reference objects and/or signals with well-known coordinates.
 * 
 * Precondition: The OpenDRIVE file must define a projection string in its header (cf. {@link https://proj.org/}), like
 * for example "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=-177308 +y_0=-5425923 +datum=WGS84 +units=m"
 *  
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkAccuracy('<?xml ...>', 0.20, '{"type":"signal","id":"5100141","coordinates":{"proj":"+proj=utm +zone=32 +ellps=WGS84 +units=m","north":52.2965355,"east":10.7193196}}', '{"type":"object","id":"4000050","coordinates":{"proj":"+proj=utm +zone=32 +ellps=WGS84 +units=m","north":52.622345,"east":11.2178422}}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdDistance maximum allowed offset in [m]
 * @param {...string} references stringified {@link MapReference}s of all reference objects and/or reference signals
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveAccuracy = opendrive.checkAccuracy;

/**
 * Validates if the required objects in objectList are contained in the map.
 * TargetObject.type must be one of the values, according to the specification: 
 * 
 * none, obstacle, pole, tree, vegetation, barrier, building, parkingSpace, patch,
 * railing, trafficIsland, crosswalk, streetLamp, gantry, roadMark
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveObjects('<?xml ...>', '{"type":"pole"}', '{"type":"barrier","subtype":"concrete"}', '{"type": "crosswalk"}')
 * @param {string} xodrString 
 * @param {...string} objectList stringified {@link TargetObject}s
 * @returns {ResultLog}
 */
const checkOpenDriveObjects = opendrive.checkObjectsAvailability;

/**
 * Validates if the required signals in signalList are contained in the map.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveObjects('<?xml ...>', '{"type":"209",subtype:"30"}', '{"type":"448"}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {...string} signalList stringified {@link TargetSignal}s
 * @returns {ResultLog}
 */
const checkOpenDriveSignals = opendrive.checkSignalAvailability;

/**
 * Validates if all required road types are available in the ODR
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveRoadTypes('<?xml ...>', 'motorway', 'rural')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {...string} requiredRoadTypes the names of the required road types, according to the ODR spec
 * @returns {ResultLog}
 */
const checkOpenDriveRoadTypes = opendrive.checkIncludedRoadTypes;

/**
 * Validates if all required lane types are available in the ODR
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveRoadTypes('<?xml ...>', 'driving', 'exit', 'entry')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {...string} requiredLaneTypes the names of the required lane types, according to the ODR spec
 * @returns {ResultLog}
 */
const checkOpenDriveLaneTypes = opendrive.checkIncludedLaneTypes;

/**
 * Validates if all required lane marking types are included in the ODR
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveLaneMarkingTypes('<?xml ...>', '{"type":"solid","color":"white","weight":"standard"}', '{"type":"broken","color":"white","weight":"standard"}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {...string} requiredMarkingTypes the required lane marking types as stringified {@link LineMarking}s
 * @returns {ResultLog}
 */
const checkOpenDriveLaneMarkingTypes = opendrive.checkIncludedLaneMarkingTypes;

/**
 * Validates if the added length of all roads is sufficient
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveLaneMarkingTypes('<?xml ...>', 6000)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} minLength the required length of the road in [m]
 * @returns {ResultLog}
 */
const checkOpenDriveRoadLength = opendrive.checkRoadLength;

/**
 * Validates if the traffic rule (left-hand or right-hand traffic) complies with the expected rule
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveTrafficRule('<?xml ...>', 'RHT')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} requiredTrafficRule expected traffic rule ('LHT' or 'RHT' for left-hand/right-hand traffic)
 * @returns {ResultLog}
 */
const checkOpenDriveTrafficRule = opendrive.checkTrafficRule;

/**
 * Validates if the curve radii of all roads are within the given range
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveCurveRadii('<?xml ...>', 25)
 * checkOpenDriveCurveRadii('<?xml ...>', 200, 1000)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdMin minimum allowed curve radius in [m].
 * @param {string | number} [thresholdMax] minimum allowed curve radius in [m]. If undefined, it will be set to infinity
 * @returns {ResultLog}
 */
const checkOpenDriveCurveRadii = opendrive.checkCurveRadiusRange;

/**
 * Validates if all road elevations are within the allowed range
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveElevations('<?xml ...>', -0.02, 0.02)
 * checkOpenDriveElevations('<?xml ...>', -3, 10, 'deg')
 * checkOpenDriveElevations('<?xml ...>', 0, 10, 'deg')
 * checkOpenDriveElevations('<?xml ...>', -5, 5, '%')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdMin minimum allowed elevation
 * @param {string | number} thresholdMax maximum allowed elevation
 * @param {string} [thresholdsUnit] The unit of the given threshold. Must be either "rad", "deg", or "%". 
 *                                  If undefined, it will be set to "rad" by default
 * @returns {ResultLog}
 */
const checkOpenDriveElevations = opendrive.checkElevationRange;

/**
 * Validates if the width of all driving lanes in the map are within the given range
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveLaneWidths('<?xml ...>', 3.10, 4.50)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdMin minimum allowed lane width in [m]
 * @param {string | number} thresholdMax maximum allowed lane width in [m]
 * @returns {ResultLog}
 */
const checkOpenDriveLaneWidths = opendrive.checkDrivingLaneWidthRange;

/**
 * Validates if the traction of all roads is within the required range
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveTractions('<?xml ...>', 0.8, 1.1)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdMin the minimum allowed traction
 * @param {string | number} thresholdMax the maximum allowed traction
 * @returns {ResultLog}
 */
const checkOpenDriveTractions = opendrive.checkTractionRange;

/**
 * Validates if the number of lanes of each road is within the given range
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step []
 * @example
 * checkOpenDriveDrivingLanesQuantity('<?xml ...>', 2, 2)
 * checkOpenDriveDrivingLanesQuantity('<?xml ...>', 2, 4)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdMin minimum number of allowed driving lanes
 * @param {string | number} thresholdMax maximum number of allowed driving lanes
 * @returns {ResultLog}
 */
const checkOpenDriveDrivingLanesQuantity = opendrive.checkNumberOfDrivingLanes;

exports.checkConvergency = checkConvergency;
exports.checkOpenDriveOffsets = checkOpenDriveOffsets;
exports.checkOpenDriveReferences = checkOpenDriveReferences;
exports.checkOpenDriveScenarioIntegration = checkOpenDriveScenarioIntegration;
exports.checkOpenDriveAccuracy = checkOpenDriveAccuracy;
exports.checkOpenDriveObjects = checkOpenDriveObjects;
exports.checkOpenDriveSignals = checkOpenDriveSignals;
exports.checkOpenDriveRoadTypes = checkOpenDriveRoadTypes;
exports.checkOpenDriveLaneTypes = checkOpenDriveLaneTypes;
exports.checkOpenDriveLaneMarkingTypes = checkOpenDriveLaneMarkingTypes;
exports.checkOpenDriveRoadLength = checkOpenDriveRoadLength;
exports.checkOpenDriveTrafficRule = checkOpenDriveTrafficRule;
exports.checkOpenDriveCurveRadii = checkOpenDriveCurveRadii;
exports.checkOpenDriveElevations = checkOpenDriveElevations;
exports.checkOpenDriveLaneWidths = checkOpenDriveLaneWidths;
exports.checkOpenDriveTractions = checkOpenDriveTractions;
exports.checkOpenDriveDrivingLanesQuantity = checkOpenDriveDrivingLanesQuantity;