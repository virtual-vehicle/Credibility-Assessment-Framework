const time_domain_metrics = require('./src/time_domain');
const opendrive = require("./src/opendrive/opendrive");

/**
 * @module metrics/evaluation/level_2
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks if the mean absolute error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * MAE = 1/n * sum[1:n](|reference - experiment|)
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @param {string} experimentResults stringified Signal array of simulation experiment results, as returned by a Signal
 *                                   adapter, like the openmcx-csv-adapter
 * @param {string} referenceResults stringified Signal array of reference results (e.g., measurements), as returned by a
 *                                  Signal adapter, like the openmcx-csv-adapter
 * @param {string} signalNameExperiment the name of the signal to evaluate from experiment
 * @param {string} signalNameReference the name of the signal to evaluate from reference
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the MAE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkMeanAbsoluteError = time_domain_metrics.checkMae;

/**
 * Checks if the mean squared error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * MSE = 1/n * sum[1:n](reference - experiment)²
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @param {string} experimentResults stringified Signal array of simulation experiment results, as returned by a Signal
 *                                   adapter, like the openmcx-csv-adapter
 * @param {string} referenceResults stringified Signal array of reference results (e.g., measurements), as returned by a
 *                                  Signal adapter, like the openmcx-csv-adapter
 * @param {string} signalNameExperiment the name of the signal to evaluate from experiment
 * @param {string} signalNameReference the name of the signal to evaluate from reference
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the MSE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkMeanSquaredError = time_domain_metrics.checkMse;

/**
 * Checks if the root mean squared error w.r.t. the time-domain between two signals does not exceed the given threshold
 * 
 * RMSE = sqrt(1/n * sum[1:n](reference - experiment)²)
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @param {string} experimentResults stringified Signal array of simulation experiment results, as returned by a Signal
 *                                   adapter, like the openmcx-csv-adapter
 * @param {string} referenceResults stringified Signal array of reference results (e.g., measurements), as returned by a
 *                                  Signal adapter, like the openmcx-csv-adapter
 * @param {string} signalNameExperiment the name of the signal to evaluate from experiment
 * @param {string} signalNameReference the name of the signal to evaluate from reference
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the RMSE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkRootMeanSquaredError = time_domain_metrics.checkRmse;

/**
 * Checks if the mean absolute percent error w.r.t. the time-domain between two signals does not exceed the given 
 * threshold
 * 
 * MAPE = 100/n * sum[1:n](|reference - experiment|/|reference|)
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @param {string} experimentResults stringified Signal array of simulation experiment results, as returned by a Signal
 *                                   adapter, like the openmcx-csv-adapter
 * @param {string} referenceResults stringified Signal array of reference results (e.g., measurements), as returned by a
 *                                  Signal adapter, like the openmcx-csv-adapter
 * @param {string} signalNameExperiment the name of the signal to evaluate from experiment
 * @param {string} signalNameReference the name of the signal to evaluate from reference
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the MAPE must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkMeanAbsolutePercentError = time_domain_metrics.checkMape;

/**
 * Checks if Theils Inequality Coefficient w.r.t. the time-domain between two signals does not exceed the given 
 * threshold
 * 
 * TIC = RMSE(reference, experiment) / (RMS(reference) + RMS(experiment))
 * 
 * The experiment and reference results must be synchronized w.r.t. time to guarantee correct evaluation
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @param {string} experimentResults stringified Signal array of simulation experiment results, as returned by a Signal
 *                                   adapter, like the openmcx-csv-adapter
 * @param {string} referenceResults stringified Signal array of reference results (e.g., measurements), as returned by a
 *                                  Signal adapter, like the openmcx-csv-adapter
 * @param {string} signalNameExperiment the name of the signal to evaluate from experiment
 * @param {string} signalNameReference the name of the signal to evaluate from reference
 * @param {number | string} evaluationTimeStart the time point in the results where the evaluation should start
 * @param {number | string} evaluationTimeEnd the time point in the results where the evaluation should end
 * @param {number | string} threshold the threshold the TIC must not exceed
 * @returns {ResultLog} result and logging information
 */
const checkTheilsInequalityCoefficient = time_domain_metrics.checkTic;

/**
 * Checks the accuracy (absolute exactness) of the map w.r.t. a global coordinate system.
 * 
 * In specific, the absolute position of reference objects/signals in the global coordinate system
 * will be checked against the actual position, given with coordinates.
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
 * @step [evaluate]
 * @example
 * checkOpenDriveAccuracy('<?xml ...>', 0.20, '{"type":"signal","id":"5100141","coordinates":{"proj":"+proj=utm +zone=32 +ellps=WGS84 +units=m","north":52.2965355,"east":10.7193196}}', '{"type":"object","id":"4000050","coordinates":{"proj":"+proj=utm +zone=32 +ellps=WGS84 +units=m","north":52.622345,"east":11.2178422}}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdDistance maximum allowed offset in [m]
 * @param {...string} references stringified {@link MapReference}s of all reference objects and/or reference signals
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveAccuracy = opendrive.checkAccuracy;

/**
 * Checks the precision (relative exactness) of the map.
 * 
 * In specific, the relative distance of reference objects/signals towards each other will be checked
 * against the actual relative distance of well-known reference objects
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
 * @step [evaluate]
 * @example
 * checkOpenDrivePrecision('<?xml ...>', 0.20, '{"type":"signal","id":"5100141","coordinates":{"proj":"+proj=utm +zone=32 +ellps=WGS84 +units=m","north":52.2965355,"east":10.7193196}}', '{"type":"object","id":"4000050","coordinates":{"proj":"+proj=utm +zone=32 +ellps=WGS84 +units=m","north":52.622345,"east":11.2178422}}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string | number} thresholdDistance maximum allowed offset in [m]
 * @param {...string} references stringified {@link MapReference}s of all reference objects and/or reference signals
 * @returns {ResultLog} result and logging information
 */
const checkOpenDrivePrecision = opendrive.checkPrecision;

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
 * @step [evaluate]
 * @example
 * checkOpenDriveObjects('<?xml ...>', '["1001", "1002"]', '{"type":"pole"}', '{"type":"barrier","subtype":"concrete"}', '{"type": "crosswalk"}')
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveSignals('<?xml ...>', '[]', {"type":"209",subtype:"30"}', '{"type":"448"}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveRoadTypes('<?xml ...>', '["1001", "1002"]', 'motorway', 'rural')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveRoadTypes('<?xml ...>', '["1001", "1002"]', 'driving', 'exit', 'entry')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveLaneMarkingTypes('<?xml ...>', '["1001", "1002"]', '{"type":"solid","color":"white","weight":"standard"}', '{"type":"broken","color":"white","weight":"standard"}')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveLaneMarkingTypes('<?xml ...>', '["1001", "1002"]', 6000)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
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
 * @step [evaluate]
 * @example
 * checkOpenDriveCurveRadii('<?xml ...>', '["1001", "1002"]', 25)
 * checkOpenDriveCurveRadii('<?xml ...>', '[]', 200, 1000)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveElevations('<?xml ...>', '[]', -0.02, 0.02)
 * checkOpenDriveElevations('<?xml ...>', '["1001", "1002"]', -3, 10, 'deg')
 * checkOpenDriveElevations('<?xml ...>', '[]', 0, 10, 'deg')
 * checkOpenDriveElevations('<?xml ...>', '[]'  -5, 5, '%')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveLaneWidths('<?xml ...>', '["1001", "1002"]', 3.10, 4.50)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin minimum allowed lane width in [m]
 * @param {string | number} [thresholdMax] maximum allowed lane width in [m]
 * @returns {ResultLog}
 */
const checkOpenDriveLaneWidths = opendrive.checkDrivingLaneWidthRange;

/**
 * Validates if the variability (the maximum observed width minus the minimum observed width) of the driving lanes is
 * within the expected range.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @example
 * checkOpenDriveLaneVariability('<?xml ...>', '["1001", "1002"]', 0.20, 0.70)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} variabilityMin minimum required lane width variability in [m]
 * @param {string | number} [variabilityMax] maximum allowed lane width variability in [m]
 * @returns {ResultLog}
 */
const checkOpenDriveLaneVariability = opendrive.checkDrivingLaneVariability;

/**
 * Validates if the the map contains at least one straight which is longer than the given value.
 * 
 * A straight is defined as the longest coherent road where the curve radius does not 
 * drop below the given radius threshold in curveRadiusThreshold
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase evaluation
 * @step [evaluate]
 * @example
 * checkOpenDriveStraightLength('<?xml ...>', '["1001", "1002"]', 5000, 750)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} curveRadiusThreshold the minimum curve radius to consider a road a straight in [m] 
 * @param {string | number} minLength the minimum required length of a straight, given in [m] (quality criterion)
 * @returns {ResultLog}
 */
const checkOpenDriveStraightLength = opendrive.checkStraightLength;

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
 * @step [evaluate]
 * @example
 * checkOpenDriveTractions('<?xml ...>', '["1001", "1002"]', 0.8, 1.1)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
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
 * @step [evaluate]
 * @example
 * checkOpenDriveDrivingLanesQuantity('<?xml ...>', '[]', 2, 2)
 * checkOpenDriveDrivingLanesQuantity('<?xml ...>', '["1001", "1002"]', 2, 4)
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin minimum number of allowed driving lanes
 * @param {string | number} [thresholdMax] maximum number of allowed driving lanes
 * @returns {ResultLog}
 */
const checkOpenDriveDrivingLanesQuantity = opendrive.checkNumberOfDrivingLanes;

exports.checkMeanAbsoluteError = checkMeanAbsoluteError;
exports.checkMeanSquaredError = checkMeanSquaredError;
exports.checkRootMeanSquaredError = checkRootMeanSquaredError;
exports.checkMeanAbsolutePercentError = checkMeanAbsolutePercentError;
exports.checkTheilsInequalityCoefficient = checkTheilsInequalityCoefficient;
exports.checkOpenDriveAccuracy = checkOpenDriveAccuracy;
exports.checkOpenDrivePrecision = checkOpenDrivePrecision;
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
exports.checkOpenDriveLaneVariability = checkOpenDriveLaneVariability;
exports.checkOpenDriveStraightLength = checkOpenDriveStraightLength;