const { OdrReader } = require('opendrive-reader');
const fs = require('fs');
const path = require('path');
const helper = require('./opendrive_helpers');
const osc_helper = require('./openscenario_helpers');

exports.checkOffsets = checkOffsets;
exports.checkReferences = checkReferences;
exports.checkScenarioIntegration = checkScenarioIntegration;
exports.checkPlanViewModelingApproach = checkPlanViewModelingApproach;

/**
 * @typedef {import('../../types/types').TargetObject} TargetObject
 * @typedef {import('../../types/types').TargetSignal} TargetSignal
 * @typedef {import('../../types/types').MapReference} MapReference
 * @typedef {import('../../types/types').LineMarking} LineMarking
 * @typedef {import('../../types/types').pose3d} pose3d
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

Array.prototype.unique = function () {
    return this.filter((val, i, self) => self.indexOf(val) === i);
}

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
 * @param {string} [roadSelection] list of road IDs that shall be considered.
 *                                 If left undefined, all available roads will be considered
 * @returns {ResultLog}
 */
function checkOffsets(xodrString, offsetThreshold, roadSelection) {
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

    resultLog = checkRoadTransitions(xodrString, offsetThreshold, roadSelection);
    result = result && resultLog.result;
    log += resultLog.log;

    resultLog = checkRoadInternalReferenceLineTransitions(xodrString, offsetThreshold, roadSelection);
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
 * @param {string} [roadSelection] list of road IDs that shall be considered.
 *                                 If left undefined, all available roads will be considered
 * @returns {ResultLog}
 */
function checkRoadTransitions(xodrString, offsetThreshold, roadSelection) {
    let odrReader = new OdrReader(xodrString);
    
    let roads = [];
    if (roadSelection !== undefined) {
        roadSelection = JSON.parse(roadSelection);
        for (let roadId of roadSelection) {
            let extractedRoads = odrReader.getRoad(roadId, "road");
            if (extractedRoads.length > 0)
                roads.push(...extractedRoads);
        }
    }
    else {
        roads = odrReader.getAllRoads();
    }

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

    if (result === true) {
        log = "All road transitions are in the expected deviation range."
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
 * @param {string} [roadSelection] list of road IDs that shall be considered.
 *                                 If left undefined, all available roads will be considered
 * @returns {ResultLog}
 */
function checkRoadInternalReferenceLineTransitions(xodrString, offsetThreshold, roadSelection) {
    let result = true;
    let log = "";

    let odrReader = new OdrReader(xodrString);

    let roadIds = [];

    if (roadSelection !== undefined)
        roadIds = JSON.parse(roadSelection);
    else
        roadIds = odrReader.getAllRoads().map(road => road.attributes.id);

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
 * @param {string} [roadSelection] list of road IDs that shall be considered.
 *                                 If left undefined, all available roads will be considered
 * @returns {ResultLog}
 */
function checkReferences(xodrString, roadSelection) {
    let odrReader = new OdrReader(xodrString);

    let roads = [];
    let junctionIds = [];

    if (roadSelection !== undefined) {
        roadSelection = JSON.parse(roadSelection);
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

    for (let road of roads) {
        if (road.link === undefined)
            continue;

        if (road.attributes.junction !== "-1") {
            junctionIds.push(road.attributes.junction);
        }

        let resultLogRoadLinks = helper.checkRoadLinkRefs(odrReader, road);
        result = result && resultLogRoadLinks.result;
        log += resultLogRoadLinks.log;

        let resultLogLaneSections = helper.checkLaneSectionRefs(odrReader, road);
        result = result && resultLogLaneSections.result;
        log += resultLogLaneSections.log;
    }

    junctionIds = junctionIds.unique();
    
    for (let junctionId of junctionIds) {
        let junction = odrReader.getJunction(junctionId);
        let resultLogJunction = helper.checkJunctionRefs(odrReader, junction);

        result = result && resultLogJunction.result;
        log += resultLogJunction.log;
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
function checkScenarioIntegration(xodrPath, xoscPath) {
    let result = true;
    let log = "";

    const xodrString = fs.readFileSync(xodrPath, 'utf-8');
    const xoscString = fs.readFileSync(xoscPath, 'utf-8');

    let odrReader = new OdrReader(xodrString);

    let scenariosToCheck;

    if (osc_helper.isParameterDistributionFile(osc_helper.parseOpenscenario(xoscString))) {
        // if a parameter distribution file is handed over, generate concrete scenarios from it and check each scenario
        const parameterVariationFileParsed = osc_helper.parseOpenscenario(xoscString);

        let basePath = path.dirname(xoscPath);
        const oscTemplateString = osc_helper.getXoscTemplateFromDistributionFile(parameterVariationFileParsed, basePath);
        const parameterSets = osc_helper.getParameterSets(parameterVariationFileParsed);
        scenariosToCheck = osc_helper.integrateParameters(oscTemplateString, parameterSets);
    }
    else {
        // if a single concrete scenario file is used, check only this
        scenariosToCheck = [xoscString];
    }

    for (let scenarioToCheck of scenariosToCheck) {
        let openScenarioParsed = osc_helper.parseOpenscenario(scenarioToCheck);

        let initialPositions = osc_helper.getInitialPositions(openScenarioParsed);

        for (let initPosition of initialPositions) {
            let road = odrReader.getRoad(initPosition.roadId, "road");
            if (road.length > 0) {
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
 * @param {string} xodrString 
 * @param {...string} allowedGeometries 
 */
function checkPlanViewModelingApproach(xodrString, ...allowedGeometries) {
    let odrReader = new OdrReader(xodrString);
    const roads = odrReader.getAllRoads();

    let result = true;
    let log = "";

    allowedGeometries = allowedGeometries.map(geometry => geometry.toLocaleLowerCase());

    for (let road of roads) {
        let availableGeometries = helper.extractGeometryModelingApproaches(road).map(geometry => geometry.toLocaleLowerCase());
        for (let geometry of availableGeometries) {
            if (!allowedGeometries.includes(geometry)) {
                result = false;
                log += `The road with ID ${road.attributes.id} contains a (by definition not-allowed) ${geometry} section in the planView. `
            }
        }
    }

    if (result == true) {
        log = "All roads contain only allowed geometry elements."
    }

    return {
        result: result,
        log: log.trim()
    };
}