const { OdrReader } = require('../../../../../util/opendrive-reader');
const helper = require('./opendrive_helpers');
const osc_helper = require('./openscenario_helpers');
const req_helper = require('./opendrive_requirement_helpers');
const proj4 = require('proj4');

exports.checkOffsets = checkOffsets;
exports.checkReferences = checkReferences;
exports.checkObjectsAvailability = checkObjectsAvailability;
exports.checkSignalAvailability = checkSignalAvailability;
exports.checkAccuracy = checkAccuracy;
exports.checkScenarioIntegration = checkScenarioIntegration;
exports.checkDrivingLaneWidthRange = checkDrivingLaneWidthRange;
exports.checkElevationRange = checkElevationRange;
exports.checkCurveRadiusRange = checkCurveRadiusRange;
exports.checkRoadLength = checkRoadLength;
exports.checkNumberOfDrivingLanes = checkNumberOfDrivingLanes;
exports.checkIncludedLaneTypes = checkIncludedLaneTypes;
exports.checkIncludedRoadTypes = checkIncludedRoadTypes;
exports.checkIncludedLaneMarkingTypes = checkIncludedLaneMarkingTypes;
exports.checkTractionRange = checkTractionRange;
exports.checkTrafficRule = checkTrafficRule;

/**
 * @typedef {import('../../types/types').TargetObject} TargetObject
 * @typedef {import('../../types/types').TargetSignal} TargetSignal
 * @typedef {import('../../types/types').MapReference} MapReference
 * @typedef {import('../../types/types').LineMarking} LineMarking
 * @typedef {import('../../types/types').pose3d} pose3d
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

/**
 * Checks, if the transitions (for all lane boundaries) between connected roads are smooth enough,
 * according to the given threshold.
 * 
 * Further, it will be checked, if the transitions between the single segments within the geometric definition of the road (i.e., between 
 * geometry elements, elevation elements, superelevation elemens and shape elements) are smooth enough, according to
 * the given allowed threshold.
 * 
 * @param {string} xodrString 
 * @param {string} offsetThreshold maximum allowed offset (as stringified {@link pose3d} object)
 * @returns {ResultLog}
 */
function checkOffsets(xodrString, offsetThreshold) {
    try {
        offsetThreshold = JSON.parse(offsetThreshold);
    }
    catch (err) {
        return {
            result: false,
            log: "offsetThreshold can not be JSON-parsed."
        };
    }

    let result = true;
    let log = "";

    let resultLog;

    resultLog = checkRoadTransitions(xodrString, offsetThreshold);
    result = result && resultLog.result;
    log += resultLog.log;

    resultLog = checkRoadInternalReferenceLineTransitions(xodrString, offsetThreshold);
    result = result && resultLog.result;
    log += resultLog.log;

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks, if the transitions (for all lane boundaries) between connected roads are smooth enough,
 * according to the given threshold.
 * 
 * @param {string} xodrString 
 * @param {pose3d} offsetThreshold 
 * @returns {ResultLog}
 */
function checkRoadTransitions(xodrString, offsetThreshold) {
    let odrReader = new OdrReader(xodrString);
    const roads = odrReader.getAllRoads();

    result = true;
    log = "";

    for (let currentRoad of roads) {
        let predecessingRoads = odrReader.getPredecessingRoads(currentRoad.attributes.id);
        let successingRoads = odrReader.getSuccessingRoads(currentRoad.attributes.id);

        for (let predecessingRoad of predecessingRoads) {
            let resultLog = helper.checkPoseOffsetsPredecessingRoad(odrReader, currentRoad, predecessingRoad, offsetThreshold);
            result = result && resultLog.result;
            log += resultLog.log;
        }

        for (let successingRoad of successingRoads) {
            let resultLog = helper.checkPoseOffsetsSuccessingRoad(odrReader, currentRoad, successingRoad, offsetThreshold);
            result = result && resultLog.result;
            log += resultLog.log;
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * Checks, if the transitions between the single segments within the geometric definition of the road (i.e., between 
 * geometry elements, elevation elements, superelevation elemens and shape elements) are smooth enough, according to
 * the given allowed threshold
 * 
 * @param {string} xodrString 
 * @param {pose3d} offsetThreshold 
 * @returns {ResultLog}
 */
function checkRoadInternalReferenceLineTransitions(xodrString, offsetThreshold) {
    let result = true;
    let log = "";

    let odrReader = new OdrReader(xodrString);
    const roadIds = odrReader.getAllRoads().map(road => road.attributes.id);

    let resultLog;

    for (let roadId of roadIds) {
        resultLog = helper.checkGeometryTransitions(odrReader, roadId, offsetThreshold);
        result = result && resultLog.result;
        log += resultLog.log;

        resultLog = helper.checkElevationTransitions(odrReader, roadId, offsetThreshold);
        result = result && resultLog.result;
        log += resultLog.log;

        resultLog = helper.checkSuperElevationTransitions(odrReader, roadId, offsetThreshold);
        result = result && resultLog.result;
        log += resultLog.log;

        resultLog = helper.checkShapeTransitions(odrReader, roadId, offsetThreshold);    
        result = result && resultLog.result;
        log += resultLog.log; 
    }

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if all references to roads, junctions and lanes inside roads and junctions 
 * are well-defined in the XODR model
 * 
 * @param {string} xodrString 
 * @returns {ResultLog}
 */
function checkReferences(xodrString) {
    let odrReader = new OdrReader(xodrString);
    const roads = odrReader.getAllRoads();

    let result = true;
    let log = "";

    for (let road of roads) {
        if (road.link === undefined)
            continue;

        let resultLogJunction = helper.checkJunctionRefs(odrReader, road);
        result = result && resultLogJunction.result;
        log += resultLogJunction.log;

        let resultLogRoadLinks = helper.checkRoadLinkRefs(odrReader, road);
        result = result && resultLogRoadLinks.result;
        log += resultLogRoadLinks.log;

        let resultLogLaneSections = helper.checkLaneSectionRefs(odrReader, road);
        result = result && resultLogLaneSections.result;
        log += resultLogLaneSections.log;
    }

    if (result === true)
        log = "Map is complete. All referenced roads, junctions and lanes are defined."

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if the required objects in objectList are contained in the map.
 * TargetObject.type must be one of the values, according to the specification: 
 * 
 * none, obstacle, pole, tree, vegetation, barrier, building, parkingSpace, patch,
 * railing, trafficIsland, crosswalk, streetLamp, gantry, roadMark
 * 
 * @param {string} xodrString 
 * @param {...string} objectList stringified {@link TargetObject}s
 * @returns {ResultLog}
 */
function checkObjectsAvailability(xodrString, ...objectList) {
    try {
        objectList = objectList.map(obj => JSON.parse(obj));
    }
    catch (err) {
        return {
            result: false,
            log: "objectList can not be JSON-parsed."
        }
    }

    let odrReader = new OdrReader(xodrString);
    const roads = odrReader.getAllRoads();

    let result = true;
    let log = "";

    for (let targetObj of objectList) {
        let objFound = false;

        for (let road of roads) {
            if (road.objects === undefined)
                continue;

            let searchPredicate;
            if (targetObj.subtype !== undefined)
                searchPredicate = (obj) => obj.attributes.type === targetObj.type && obj.attributes.subtype === targetObj.subtype;
            else
                searchPredicate = (obj) => obj.attributes.type === targetObj.type;

            if (road.objects.object.find(searchPredicate) !== undefined) {
                objFound = true;
                break;
            }
        }

        if (objFound == false) {
            result = false;
            if (targetObj.subtype !== undefined)
                log += "Map does not contain objects of type " + targetObj.type + " and sub type " + targetObj.subtype + ", although required. ";
            else
                log += "Map does not contain objects of type " + targetObj.type + ", although required. ";            
        }
    }

    if (result == true)
        log = "Map contains all required objects."

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if the required signals in signalList are contained in the map.
 * 
 * @param {string} xodrString 
 * @param {...string} signalList stringified {@link TargetSignal}s
 * @returns {ResultLog}
 */
function checkSignalAvailability(xodrString, ...signalList) {
    try {
        signalList = signalList.map(sig => JSON.parse(sig));
    }
    catch (err) {
        return {
            result: false,
            log: "signalList can not be JSON-parsed."
        }
    }

    let odrReader = new OdrReader(xodrString);
    const roads = odrReader.getAllRoads();

    let result = true;
    let log = "";

    for (let targetSignal of signalList) {
        let signalFound = false;

        for (let road of roads) {
            if (road.signals === undefined)
                continue;

            let searchPredicate;
            if (targetSignal.subtype !== undefined)
                searchPredicate = (signal) => signal.attributes.type === targetSignal.type && signal.attributes.subtype === targetSignal.subtype;
            else
                searchPredicate = (signal) => signal.attributes.type === targetSignal.type;

            if (road.signals.signal.find(searchPredicate) !== undefined) {
                signalFound = true;
                break;
            }
        }

        if (signalFound == false) {
            result = false;
            if (targetSignal.subtype !== undefined)
                log += "Map does not contain signals of type " + targetSignal.type + " and sub type " + targetSignal.subtype + ", although required. ";
            else
                log += "Map does not contain signals of type " + targetSignal.type + ", although required. ";            
        }
    }

    if (result == true)
        log = "Map contains all required signals."

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if the position of reference objects / signals fulfills the given
 * accuracy w.r.t. a global coordinate system
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdDistance maximum allowed offset in [m]
 * @param {...string} references stringified {@link MapReference}s of all reference objects/signals
 * @returns {ResultLog}
 */
function checkAccuracy(xodrString, thresholdDistance, ...references) {
    try {
        references = references.map(ref => JSON.parse(ref));
    }
    catch (err) {
        return {
            result: result,
            log: "references can not be JSON-parsed"
        };
    }

    threshold = Number(threshold);

    let odrReader = new OdrReader(xodrString);
    let proj = odrReader.getHeader().geoReference.geoReference;
    let result = true;
    let log = "";

    for (let reference of references) {
        let projectionReference = proj4(reference.coordinates.proj, [reference.coordinates.east, reference.coordinates.north]);
        let projectionMap;

        if (reference.type == "object") {
            let object = odrReader.getObject(reference.id);
            let road = odrReader.getRoad(reference.id, "object");
            let objectPose = odrReader.getPose(road.attributes.id, object.attributes.s, object.attributes.t);
            projectionMap = proj4(proj, reference.coordinates.proj, [objectPose.x, objectPose.y]);
        }
        else if (reference.type == "signal") {
            let signal = odrReader.getSignal(reference.id);
            let road = odrReader.getRoad(reference.id, "signal");
            let signalPose = odrReader.getPose(road.attributes.id, signal.attributes.s, signal.attributes.t);
            projectionMap = proj4(proj, reference.coordinates.proj, [signalPose.x, signalPose.y]);
        }

        let distance = Math.sqrt(Math.pow(projectionMap[0] - projectionReference[0], 2), Math.pow(projectionMap[1] - projectionReference[1], 2));

        if (distance > thresholdDistance) {
            result = false;
            log += "The distance of the reference " + reference.type + " with ID " + reference.id
                 + " in the map to its actual position in the world coordinate system is greater than the allowed threshold (distance is "
                 + Math.round(1e3*distance)/1e3 + " m, threshold is " + thresholdDistance + " m). ";
        }
    }

    if (result == true)
        log = "All references in the map fulfill the required accuracy of the map."

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if the initial conditions, given in the scenario are compatible with
 * the map.
 * 
 * @param {string} xodrString 
 * @param {string} xoscString 
 * @returns {ResultLog}
 */
function checkScenarioIntegration(xodrString, xoscString) {
    let result = true;
    let log = "";

    let odrReader = new OdrReader(xodrString);
    let openScenarioParsed = osc_helper.parseOpenscenario(xoscString);
    let initialPositions = osc_helper.getInitialPositions(openScenarioParsed);

    for (let initPosition of initialPositions) {
        let road = odrReader.getRoad(initPosition.roadId, "road");
        if (road[0] !== undefined) {
            let laneFound = false;

            for (let laneSection of road[0].lanes.laneSection) {
                if (initPosition.laneId > 0) {
                    if (laneSection.left !== undefined) {
                        if (laneSection.left.lane.find(lane => lane.attributes.id == initPosition.laneId) !== undefined) {
                            laneFound = true;
                            break;
                        }                            
                    }
                }
                else if (initPosition.laneId < 0) {
                    if (laneSection.right !== undefined) {
                        if (laneSection.right.lane.find(lane => lane.attributes.id == initPosition.laneId) !== undefined) {
                            laneFound = true;
                            break;
                        }                            
                    }
                }
            }

            if (laneFound === false) {
                result = false;
                let newlog = "The lane with ID " + initPosition.laneId + " in the road with ID " + initPosition.roadId + " does not exist, but it is referenced in the target scenario. "
                if (!log.includes(newlog.trim()))
                    log += newlog;
            }
        }
        else {
            result = false;
            let newlog = "The road with ID " + initPosition.roadId + " could not be found in the map, but it is referenced in the target scenario. ";
            if (!log.includes(newlog.trim()))
                log += newlog;
        }
    }

    if (result == true) {
        log = "The initial positions of the target scenario are compatible with the map."
    }

    return {
        result: result,
        log: log.trim()
    };  
}

/**
 * Checks if all widths of driving lanes in the map fulfill the given thresholds
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdMin minimum allowed lane width in [m]
 * @param {string | number} thresholdMax maximum allowed lane width in [m]
 * @returns {ResultLog}
 */
function checkDrivingLaneWidthRange(xodrString, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = Number(thresholdMax);
    let odrReader = new OdrReader(xodrString)
    
    const laneWidths = req_helper.getDrivingLaneWidthRange(odrReader);

    if (laneWidths[0] >= thresholdMin && laneWidths[1] <= thresholdMax) {
        return {
            result: true,
            log: "All lane widths are within the allowed range"
        };
    }
    else {
        return {
            result: false,
            log: `The lane width must be within ${thresholdMin} and ${thresholdMax} m, but is evaluated to be between ${laneWidths[0]} and ${laneWidths[1]} m.`
        };
    }
}

/**
 * Checks if all road elevations are within the allowed range
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdMin minimum allowed elevation, e.g. -0.02
 * @param {string | number} thresholdMax maximum allowed elevation, e.g. 0.02
 * @param {string} [thresholdsUnit] The unit of the given threshold. Must be either "rad", "deg", or "%". Default: "rad"
 * @returns {ResultLog}
 */
function checkElevationRange(xodrString, thresholdMin, thresholdMax, thresholdsUnit="rad") {
    thresholdMin = Number(thresholdMin);
    thresholdMax = Number(thresholdMax);
    let odrReader = new OdrReader(xodrString);

    const elevations = req_helper.getElevationRange(odrReader, thresholdsUnit);

    if (elevations[0] >= thresholdMin && elevations[1] <= thresholdMax) {
        return {
            result: true,
            log: "All road elevations are within the allowed range"
        };
    }
    else {
        return {
            result: false,
            log: `The road elevation must be within ${thresholdMin} and ${thresholdMax} ${thresholdsUnit}, but is evaluated to be between ${elevations[0]} and ${elevations[1]} ${thresholdsUnit}.`
        };
    }
}

/**
 * Checks if the curve radii of all roads are within the given range
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdMin minimum allowed curve radius in [m], e.g. 50
 * @param {string | number} [thresholdMax] minimum allowed curve radius in [m]. If undefined, it will be set to infinity
 * @returns {ResultLog}
 */
function checkCurveRadiusRange(xodrString, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = thresholdMax !== undefined ? Number(thresholdMax) : Infinity;
    let odrReader = new OdrReader(xodrString);

    const radii = req_helper.getCurveRadiusRange(odrReader);

    if (radii[0] >= thresholdMin && radii[1] <= thresholdMax) {
        return {
            result: true,
            log: "All curve radii are within the allowed range"
        };
    }
    else {
        return {
            result: false,
            log: `All curve radii must be within ${thresholdMin} and ${thresholdMax} m, but are evaluated to be between ${radii[0]} and ${radii[1]} m.`
        };
    }
}

/**
 * Checks if the added length of all roads is sufficient
 * 
 * @param {string} xodrString 
 * @param {string | number} minLength the required length of the road in [m]
 * @returns {ResultLog}
 */
function checkRoadLength(xodrString, minLength) {
    minLength = Number(minLength);
    let odrReader = new OdrReader(xodrString);

    const length = req_helper.getRoadLength(odrReader);

    if (length >= minLength) {
        return {
            result: true,
            log: "The road length is sufficient."
        };
    }
    else {
        return {
            result: false,
            log: `The length of the road must be at least ${minLength} m, but is evaluated to be ${length} m.`
        };
    }
}

/**
 * Checks if the number of lanes of each road is within the given range
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdMin minimum number of allowed driving lanes
 * @param {string | number} thresholdMax maximum number of allowed driving lanes
 * @returns {ResultLog}
 */
function checkNumberOfDrivingLanes(xodrString, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = Number(thresholdMax);
    let odrReader = new OdrReader(xodrString);

    const nDrivingLanes = req_helper.getDrivingLaneRange(odrReader);

    if (nDrivingLanes[0] >= thresholdMin && nDrivingLanes[1] <= thresholdMax) {
        return {
            result: true,
            log: "All driving lanes are within the allowed range"
        };
    }
    else {
        return {
            result: false,
            log: `The number of driving lanes must be at least ${thresholdMin} and maximum ${thresholdMax}, but are evaluated to be ${nDrivingLanes[0]} to ${nDrivingLanes[1]}.`
        };
    }
}

/**
 * Checks if all required lane types are available in the ODR
 * 
 * @param {string} xodrString 
 * @param {...string} requiredLaneTypes the names of the required lane types, according to the ODR spec
 * @returns {ResultLog}
 */
function checkIncludedLaneTypes(xodrString, ...requiredLaneTypes) {
    let odrReader = new OdrReader(xodrString);
    const availableLaneTypes = req_helper.getAvailableLaneTypes(odrReader);

    let result = true;
    let log = "";

    for (let requiredType of requiredLaneTypes) {
        if (!availableLaneTypes.includes(requiredType)) {
            result = false;
            log +=  `Lane type ${requiredType} is missing. `;
        }
    }

    if (result == true) {
        log = "All required lane types are available in the ODR."
    }

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if all required road types are available in the ODR
 * 
 * @param {string} xodrString 
 * @param {...string} requiredRoadTypes the names of the required road types, according to the ODR spec
 * @returns {ResultLog}
 */
function checkIncludedRoadTypes(xodrString, ...requiredRoadTypes) {
    let odrReader = new OdrReader(xodrString);
    const availableRoadTypes = req_helper.getAvailableRoadTypes(odrReader);

    let result = true;
    let log = "";

    for (let requiredType of requiredRoadTypes) {
        if (!availableRoadTypes.includes(requiredType)) {
            result = false;
            log += `Road type ${requiredType} is missing. `;
        }
    }

    if (result == true) {
        log = "All required road types are available in the ODR."
    }

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if all required lane marking types are included in the ODR
 * 
 * @param {string} xodrString 
 * @param {...string} requiredMarkingTypes the required lane marking types as stringified {@link LineMarking}s
 * @returns {ResultLog}
 */
function checkIncludedLaneMarkingTypes(xodrString, ...requiredMarkingTypes) {
    try {
        requiredMarkingTypes = requiredMarkingTypes.map(mt => JSON.parse(mt));
    }
    catch (err) {
        return {
            result: false,
            log: "requiredMarkingTypes can not be JSON-parsed."
        }
    }

    let odrReader = new OdrReader(xodrString);
    const availableMarkingTypes = req_helper.getAvailableLaneMarkingTypes(odrReader);

    let result = true;
    let log = "";

    for (let requiredType of requiredMarkingTypes) {
        const stringifiedMarkingTypes = availableMarkingTypes.map(markingType => JSON.stringify(markingType));
        if (!stringifiedMarkingTypes.includes(JSON.stringify(requiredType))) {
            result = false;
            log += `Marking type (${requiredType.type}, ${requiredType.color}, ${requiredType.weight}) is missing. `;
        }
    }

    if (result == true) {
        log = "All required marking types are available in the ODR."
    }

    return {
        result: result,
        log: log.trim()
    };
}

/**
 * Checks if the traction of all roads is within the required range
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdMin the minimum allowed traction
 * @param {string | number} thresholdMax the maximum allowed traction
 * @returns {ResultLog}
 */
function checkTractionRange(xodrString, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = Number(thresholdMax);
    let odrReader = new OdrReader(xodrString);

    const tractionRange = req_helper.getTractionRange(odrReader);

    if (tractionRange[0] >= thresholdMin && tractionRange[1] <= thresholdMax) {
        return {
            result: true,
            log: "The traction of all roads are within the allowed range"
        };
    }
    else {
        return {
            result: false,
            log: `The traction of all roads must be within ${thresholdMin} and ${thresholdMax}, but is evaluated to be between ${tractionRange[0]} and ${tractionRange[1]}.`
        };
    }
}

/**
 * Checks if the traffic rule (left-hand or right-hand traffic) complies with the expected rule
 * 
 * @param {string} xodrString 
 * @param {string} requiredTrafficRule 
 * @returns {ResultLog}
 */
function checkTrafficRule(xodrString, requiredTrafficRule) {
    let odrReader = new OdrReader(xodrString);
    const trafficRule = req_helper.getTrafficRule(odrReader);

    if (trafficRule === requiredTrafficRule) {
        return {
            result: true,
            log: "The traffic rule complies with the required traffic rule."
        };
    }
    else {
        return {
            result: false,
            log: `The traffic rule is expected to be ${requiredTrafficRule} but is evaluated to be ${trafficRule}`
        };
    }
}