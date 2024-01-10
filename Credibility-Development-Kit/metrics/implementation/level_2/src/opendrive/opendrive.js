const { OdrReader } = require('../../../../../util/opendrive-reader');
const helper = require('./opendrive_helpers');
const osc_helper = require('./openscenario_helpers');

exports.checkOffsets = checkOffsets;
exports.checkReferences = checkReferences;
exports.checkScenarioIntegration = checkScenarioIntegration;

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
