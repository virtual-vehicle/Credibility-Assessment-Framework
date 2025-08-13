const { OdrReader } = require('opendrive-reader');
const req_helper = require('./opendrive_requirement_helpers');
const proj4 = require('proj4');

exports.checkObjectsAvailability = checkObjectsAvailability;
exports.checkSignalAvailability = checkSignalAvailability;
exports.checkAccuracy = checkAccuracy;
exports.checkPrecision = checkPrecision;
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
exports.checkStraightLength = checkStraightLength;
exports.checkDrivingLaneVariability = checkDrivingLaneVariability;

/**
 * @typedef {import('../../types/types').TargetObject} TargetObject
 * @typedef {import('../../types/types').TargetSignal} TargetSignal
 * @typedef {import('../../types/types').MapReference} MapReference
 * @typedef {import('../../types/types').LineMarking} LineMarking
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

/**
 * Checks if the required objects in objectList are contained in the map.
 * TargetObject.type must be one of the values, according to the specification: 
 * 
 * none, obstacle, pole, tree, vegetation, barrier, building, parkingSpace, patch,
 * railing, trafficIsland, crosswalk, streetLamp, gantry, roadMark
 * 
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {...string} objectList stringified {@link TargetObject}s
 * @returns {ResultLog}
 */
function checkObjectsAvailability(xodrString, roadSelection, ...objectList) {
    try {
        objectList = objectList.map(obj => JSON.parse(obj));
    }
    catch (err) {
        return {
            result: false,
            log: "objectList can not be JSON-parsed."
        };
    }

    try {
        roadSelection = JSON.parse(roadSelection);
    }
    catch (err) {
        return {
            result: false,
            log: "roadSelection can not be JSON-parsed."
        };
    }

    let odrReader = new OdrReader(xodrString);
    
    let roads = [];
    if (roadSelection !== undefined) {
        for (let roadId of roadSelection) {
            let extractedRoads = odrReader.getRoad(roadId, "road");
            if (extractedRoads.length > 0)
                roads.push(...extractedRoads);
        }
    }
    else {
        roads = odrReader.getAllRoads();
    }

    let result = true;
    let log = "";

    for (let targetObj of objectList) {
        let objFound = false;

        for (let road of roads) {
            if (road.objects === undefined)
                continue;

            if (targetObj.type.toLowerCase() === "bridge" || targetObj.type.toLowerCase() === "tunnel") {
                if (road.objects[targetObj.type.toLowerCase()] !== undefined) {
                    objFound = true;
                    break;
                }
            }
            else {
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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {...string} signalList stringified {@link TargetSignal}s
 * @returns {ResultLog}
 */
function checkSignalAvailability(xodrString, roadSelection, ...signalList) {
    try {
        signalList = signalList.map(sig => JSON.parse(sig));
    }
    catch (err) {
        return {
            result: false,
            log: "signalList can not be JSON-parsed."
        };
    }

    try {
        roadSelection = JSON.parse(roadSelection);
    }
    catch (err) {
        return {
            result: false,
            log: "roadSelection can not be JSON-parsed."
        };
    }

    let odrReader = new OdrReader(xodrString);

    let roads = [];
    if (roadSelection !== undefined) {
        for (let roadId of roadSelection) {
            let extractedRoads = odrReader.getRoad(roadId, "road");
            if (extractedRoads.length > 0)
                roads.push(...extractedRoads);
        }
    }
    else {
        roads = odrReader.getAllRoads();
    }

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
 * Checks the accuracy (absolute exactness) of the map w.r.t. a global coordinate system.
 * 
 * In specific, the absolute position of reference objects/signals in the global coordinate system
 * will be checked against the actual position, given with coordinates.
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
            result: false,
            log: "references can not be JSON-parsed"
        };
    }

    thresholdDistance = Number(thresholdDistance);

    let odrReader = new OdrReader(xodrString);
    let proj = odrReader.getHeader().geoReference.geoReference;

    let result = true;
    let log = "";

    for (let reference of references) {
        let projectionReference = proj4(reference.coordinates.proj, [reference.coordinates.east, reference.coordinates.north]);
        let projectionMap;
        let road;

        if (reference.type == "object") {
            let object = odrReader.getObject(reference.id);
            road = odrReader.getRoad(reference.id, "object");
            if (road.length > 0) {
                road = road[0];
                let objectPose = odrReader.getPose(road.attributes.id, object.attributes.s, object.attributes.t);
                projectionMap = proj4(proj, reference.coordinates.proj, [objectPose.x, objectPose.y]);
            }
        }
        else if (reference.type == "signal") {
            let signal = odrReader.getSignal(reference.id);
            road = odrReader.getRoad(reference.id, "signal");
            if (road.length > 0) {
                road = road[0];
                let signalPose = odrReader.getPose(road.attributes.id, signal.attributes.s, signal.attributes.t);
                projectionMap = proj4(proj, reference.coordinates.proj, [signalPose.x, signalPose.y]);
            }
        }

        if (road.length == 0) {
            return {
                result: false,
                log: "Error: Could not identify the associated road to " + reference.type + " with ID " + reference.id
            };
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
 * Checks the precision (relative exactness) of the map.
 * 
 * In specific, the relative distance of reference objects/signals towards each other will be checked
 * against the actual relative distance of well-known reference objects
 * 
 * @param {string} xodrString 
 * @param {string | number} thresholdDistance maximum allowed precision error [m]
 * @param {...string} references stringified {@link MapReference}s of all reference objects/signals
 * @returns {ResultLog}
 */
function checkPrecision(xodrString, thresholdDistance, ...references) {
    try {
        references = references.map(ref => JSON.parse(ref));
    }
    catch (err) {
        return {
            result: false,
            log: "references can not be JSON-parsed"
        };
    }

    if (references.length < 2) {
        return {
            result: false,
            log: "At least 2 references required"
        };
    }

    thresholdDistance = Number(thresholdDistance);

    let odrReader = new OdrReader(xodrString);
    let proj = odrReader.getHeader().geoReference.geoReference;
    
    let result = true;
    let log = "";

    let projectionsReference = [];
    let projectionsMap = [];
    let road;

    for (let reference of references) {
        projectionsReference.push(proj4(reference.coordinates.proj, [reference.coordinates.east, reference.coordinates.north]));

        if (reference.type == "object") {
            let object = odrReader.getObject(reference.id);
            road = odrReader.getRoad(reference.id, "object");
            if (road.length > 0) {
                road = road[0];
                let objectPose = odrReader.getPose(road.attributes.id, object.attributes.s, object.attributes.t);
                projectionsMap.push(proj4(proj, reference.coordinates.proj, [objectPose.x, objectPose.y]));
            }
        }
        else if (reference.type == "signal") {
            let signal = odrReader.getSignal(reference.id);
            road = odrReader.getRoad(reference.id, "signal");
            if (road.length > 0) {
                road = road[0];
                let signalPose = odrReader.getPose(road.attributes.id, signal.attributes.s, signal.attributes.t);
                projectionsMap.push(proj4(proj, reference.coordinates.proj, [signalPose.x, signalPose.y]));
            }
        }

        if (road.length == 0) {
            return {
                result: false,
                log: "Error: Could not identify the associated road to " + reference.type + " with ID " + reference.id
            };   
        }
    }

    // compare each object/signal to all other object/signals
    for (let i = 0; i < references.length - 1; i++) {
        for (let j = i + 1; j < references.length; j++) {
            // get the distance of two objects using the reference coordinates and the map positions
            // then compare these distances to the threshold
            // example: we use two objects. The distance to each other using the reference coordinates is 1.73 m,
            // the distance of the objects using the map position is 1.68 m, so the precision error is 0.05 m
            let distanceReference = Math.sqrt(Math.pow(projectionsReference[i][0] - projectionsReference[j][0], 2), Math.pow(projectionsReference[i][1] - projectionsReference[j][1], 2));
            let distanceMap = Math.sqrt(Math.pow(projectionsMap[i][0] - projectionsMap[j][0], 2), Math.pow(projectionsMap[i][1] - projectionsMap[j][1], 2));
            let precisionError = Math.abs(distanceReference - distanceMap);
            
            if (precisionError > thresholdDistance) {
                result = false;
                log += `The precision error between the references with ID ${references[i]} and ${references[j]} is ${precisionError} m (threshold is ${thresholdDistance} m). `;
            }
        }
    }

    if (result == true)
    log = "The positions of all references in the map fulfill the required precision of the map."

    return {
        result: result,
        log: log.trim()
    };    
}

/**
 * Checks if all widths of driving lanes in the map fulfill the given thresholds
 * 
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin minimum allowed lane width in [m]
 * @param {string | number} [thresholdMax] maximum allowed lane width in [m]
 * @returns {ResultLog}
 */
function checkDrivingLaneWidthRange(xodrString, roadSelection, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = thresholdMax !== undefined ? Number(thresholdMax) : Infinity;
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads
    
    const laneWidths = req_helper.getDrivingLaneWidthRange(odrReader, roadIds);

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
 * Checks if the variability of the lane width
 * 
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} variabilityMin minimum required lane width variability in [m]
 * @param {string | number} [variabilityMax] maximum allowed lane width variability in [m]
 * @returns {ResultLog}
 */
function checkDrivingLaneVariability(xodrString, roadSelection, variabilityMin, variabilityMax) {
    variabilityMin = Number(variabilityMin);
    variabilityMax = variabilityMax !== undefined ? Number(variabilityMax) : Infinity;
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads
    
    const laneWidths = req_helper.getDrivingLaneWidthRange(odrReader, roadIds);
    const variability = Math.abs(laneWidths[1] - laneWidths[0]);
    
    if (variability >= variabilityMin && variability <= variabilityMax) {
        return {
            result: true,
            log: "The lanes of the map fulfill the required variability for at least one lane."
        };
    }
    else {
        return {
            result: false,
            log: `The lane width variability must be within ${variabilityMin} and ${variabilityMax} m, but is evaluated to be ${variability} m.`
        };
    }
}

/**
 * Checks if all road elevations are within the allowed range
 * 
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin minimum allowed elevation, e.g. -0.02
 * @param {string | number} thresholdMax maximum allowed elevation, e.g. 0.02
 * @param {string} [thresholdsUnit] The unit of the given threshold. Must be either "rad", "deg", or "%". Default: "rad"
 * @returns {ResultLog}
 */
function checkElevationRange(xodrString, roadSelection, thresholdMin, thresholdMax, thresholdsUnit="rad") {
    thresholdMin = Number(thresholdMin);
    thresholdMax = Number(thresholdMax);
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const elevations = req_helper.getElevationRange(odrReader, thresholdsUnit, roadIds);

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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin minimum allowed curve radius in [m], e.g. 50
 * @param {string | number} [thresholdMax] minimum allowed curve radius in [m]. If undefined, it will be set to infinity
 * @returns {ResultLog}
 */
function checkCurveRadiusRange(xodrString, roadSelection, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = thresholdMax !== undefined ? Number(thresholdMax) : Infinity;
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const radii = req_helper.getCurveRadiusRange(odrReader, roadIds);

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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} minLength the required length of the road in [m]
 * @returns {ResultLog}
 */
function checkRoadLength(xodrString, roadSelection, minLength) {
    minLength = Number(minLength);
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const length = req_helper.getRoadLength(odrReader, roadIds);

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
 * Checks if the longest straight of all given roads is sufficiently long.
 * 
 * A straight is defined as the longest coherent road where the curve radius does not 
 * drop below the given radius threshold
 * 
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} curveRadiusThreshold the minimum radius to consider a road a straight 
 * @param {string | number} minLength the minimum required length of a straight, given in [m] (quality criterion)
 * @returns {ResultLog}
 */
function checkStraightLength(xodrString, roadSelection, curveRadiusThreshold, minLength) {
    curveRadiusThreshold = Number(curveRadiusThreshold);
    minLength = Number(minLength);

    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const maxStraightLength = req_helper.getMaximumStraightLength(odrReader, curveRadiusThreshold, roadIds);

    if (maxStraightLength >= minLength) {
        return {
            result: true,
            log: `The map cotains at least one road with a straight of at least ${minLength} m.`
        };
    }
    else {
        return {
            result: false,
            log: `The map must contain at least one straight of at least ${minLength} m, but the longest straight of all roads is ${maxStraightLength} m.`
        };
    }    
}

/**
 * Checks if the number of lanes of each road is within the given range
 * 
 * @param {string} xodrString 
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin minimum number of allowed driving lanes
 * @param {string | number} [thresholdMax] maximum number of allowed driving lanes
 * @returns {ResultLog}
 */
function checkNumberOfDrivingLanes(xodrString, roadSelection, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = thresholdMax !== undefined ? Number(thresholdMax) : Infinity;
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const nDrivingLanes = req_helper.getDrivingLaneRange(odrReader, roadIds);

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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {...string} requiredLaneTypes the names of the required lane types, according to the ODR spec
 * @returns {ResultLog}
 */
function checkIncludedLaneTypes(xodrString, roadSelection, ...requiredLaneTypes) {
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const availableLaneTypes = req_helper.getAvailableLaneTypes(odrReader, roadIds);

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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {...string} requiredRoadTypes the names of the required road types, according to the ODR spec
 * @returns {ResultLog}
 */
function checkIncludedRoadTypes(xodrString, roadSelection, ...requiredRoadTypes) {
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {...string} requiredMarkingTypes the required lane marking types as stringified {@link LineMarking}s
 * @returns {ResultLog}
 */
function checkIncludedLaneMarkingTypes(xodrString, roadSelection, ...requiredMarkingTypes) {
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

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const availableMarkingTypes = req_helper.getAvailableLaneMarkingTypes(odrReader, roadIds);

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
 * @param {string} roadSelection stringified array of roadIds that need to be considered for the check. If
 *                               the array is empty, all roads in the map will be checked
 * @param {string | number} thresholdMin the minimum allowed traction
 * @param {string | number} thresholdMax the maximum allowed traction
 * @returns {ResultLog}
 */
function checkTractionRange(xodrString, roadSelection, thresholdMin, thresholdMax) {
    thresholdMin = Number(thresholdMin);
    thresholdMax = Number(thresholdMax);
    let odrReader = new OdrReader(xodrString);

    roadSelection = JSON.parse(roadSelection);
    let roadIds;
    if (roadSelection.length > 0)
        roadIds = roadSelection;
        // if no road seletion defined, let roadIds undefined to check ALL roads

    const tractionRange = req_helper.getTractionRange(odrReader, roadIds);

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