const { OdrReader } = require('../../../../../util/opendrive-reader');
const lanelink_helpers = require('./opendrive_lanelink_helpers');

/**
 * @typedef {import('../../types/types').pose3d} pose3d
 * @typedef {import('../../types/types').t_road} t_road
 * @typedef {import('../../types/types').t_road_planView} t_road_planView
 * @typedef {import('../../types/types').t_junction} t_junction
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

exports.checkGeometryTransitions = checkGeometryTransitions;
exports.checkElevationTransitions = checkElevationTransitions;
exports.checkShapeTransitions = checkShapeTransitions;
exports.checkSuperElevationTransitions = checkSuperElevationTransitions;
exports.checkPoseOffsetsSuccessingRoad = checkPoseOffsetsSuccessingRoad;
exports.checkPoseOffsetsPredecessingRoad = checkPoseOffsetsPredecessingRoad;
exports.checkJunctionRefs = checkJunctionRefs;
exports.checkRoadLinkRefs = checkRoadLinkRefs;
exports.checkLaneSectionRefs = checkLaneSectionRefs;
exports.extractGeometryModelingApproaches = extractGeometryModelingApproaches;

/**
 * Helper methods for arrays to make array unique, using shallow equality
 */
Array.prototype.unique = function () {
    return this.filter((val, i, self) => self.indexOf(val) === i);
}

const eps = 1e-6;
const GEOMETRIES = ['line', 'spiral', 'arc', 'poly3', 'paramPoly3'];

/**
 * @param {OdrReader} odrReader 
 * @param {t_road} road 
 * @param {t_road} successingRoad 
 * @param {pose3d} thresholdPose
 * @returns {ResultLog}
 */
function checkPoseOffsetsSuccessingRoad(odrReader, road, successingRoad, thresholdPose) {
    let result = true;
    let log = "";

    let direction = lanelink_helpers.getRoadDirections(road, successingRoad, odrReader); // "same", "opposing" or "unknown"
    if (direction == "unknown")
        direction = lanelink_helpers.getRoadDirections(successingRoad, road, odrReader);
    const linkType = lanelink_helpers.getLaneLinkMethodSuccessing(road, successingRoad, odrReader); // "implicite", "lane_section_linking", "junction_linking"

    let laneIdPairs;
    
    if (linkType == "implicite")
        laneIdPairs = lanelink_helpers.getLaneLinksRoadToSuccessingRoadImplicite(road, successingRoad, odrReader);
    else if (linkType == "lane_section_linking")
        laneIdPairs = lanelink_helpers.getLaneLinksRoadToSuccessingRoadSection(road, successingRoad);
    else 
        laneIdPairs = lanelink_helpers.getLaneLinksRoadToSuccessingRoadJunction(road, successingRoad, odrReader);

    for (let laneId of laneIdPairs) {
        let poseFirstBoundary, poseOtherBoundary, poseSuccFirstBoundary, poseSuccOtherBoundary;

        if (direction == "same") {
            // reference lines are pointing in same direction
            // ----->|----->
            poseFirstBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[0], road.attributes.length, "left");
            poseOtherBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[0], road.attributes.length, "right");
            poseSuccFirstBoundary = odrReader.getLaneBoundaryPose(successingRoad.attributes.id, laneId[1], 0, "left");
            poseSuccOtherBoundary = odrReader.getLaneBoundaryPose(successingRoad.attributes.id, laneId[1], 0, "right");
        }
        else {
            // reference lines are pointing in oppposite direction
            // ----->|<-----
            poseFirstBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[0], road.attributes.length, "left");
            poseOtherBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[0], road.attributes.length, "right");
            poseSuccFirstBoundary = odrReader.getLaneBoundaryPose(successingRoad.attributes.id, laneId[1], successingRoad.attributes.length, "right");
            poseSuccOtherBoundary = odrReader.getLaneBoundaryPose(successingRoad.attributes.id, laneId[1], successingRoad.attributes.length, "left");
        }
        
        let diffPoseFirst = subtractPose(poseFirstBoundary, poseSuccFirstBoundary, true);
        let diffPoseOther = subtractPose(poseOtherBoundary, poseSuccOtherBoundary, true);

        if (comparePose(diffPoseFirst, "<=", thresholdPose) === false || comparePose(diffPoseOther, "<=", thresholdPose) === false) {
            result = false;
            log += `Offset in road transition greater than allowed threshold (for transition from road ${road.attributes.id}, lane ${laneId[0]} to road ${successingRoad.attributes.id}, , lane ${laneId[1]}). `
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * @param {OdrReader} odrReader 
 * @param {t_road} road 
 * @param {t_road} predecessingRoad 
 * @param {pose3d} thresholdPose
 * @returns {ResultLog}
 */
function checkPoseOffsetsPredecessingRoad(odrReader, road, predecessingRoad, thresholdPose) {
    let result = true;
    let log = "";

    let direction = lanelink_helpers.getRoadDirections(road, predecessingRoad, odrReader); // "same", "diverging" or "unknown"
    if (direction == "unknown")
        direction = lanelink_helpers.getRoadDirections(predecessingRoad, road, odrReader);

    const linkType = lanelink_helpers.getLaneLinkMethodPredecessing(road, predecessingRoad, odrReader); // "implicite", "lane_section_linking", "junction_linking"

    let laneIdPairs;

    if (linkType == "implicite")
        laneIdPairs = lanelink_helpers.getLaneLinksPredecessingRoadToRoadImplicite(road, predecessingRoad, odrReader);
    else if (linkType == "lane_section_linking")
        laneIdPairs = lanelink_helpers.getLaneLinksPredecessingRoadToRoadSection(road, predecessingRoad);
    else 
        laneIdPairs = lanelink_helpers.getLaneLinksPredecessingRoadToRoadJunction(road, predecessingRoad, odrReader);

    for (let laneId of laneIdPairs) {
        let poseFirstBoundary, poseOtherBoundary, posePreFirstBoundary, posePreOtherBoundary;

        if (direction == "same") {
            // reference lines are pointing in same direction
            // ----->|----->
            posePreFirstBoundary = odrReader.getLaneBoundaryPose(predecessingRoad.attributes.id, laneId[0], predecessingRoad.attributes.length, "left");
            posePreOtherBoundary = odrReader.getLaneBoundaryPose(predecessingRoad.attributes.id, laneId[0], predecessingRoad.attributes.length, "right");
            poseFirstBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[1], 0, "left");
            poseOtherBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[1], 0, "right");
        }
        else {
            // reference lines are pointing in diverging direction
            // <-----|----->
            posePreFirstBoundary = odrReader.getLaneBoundaryPose(predecessingRoad.attributes.id, laneId[0], 0, "right");
            posePreOtherBoundary = odrReader.getLaneBoundaryPose(predecessingRoad.attributes.id, laneId[0], 0, "left");
            poseFirstBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[1], 0, "left");
            poseOtherBoundary = odrReader.getLaneBoundaryPose(road.attributes.id, laneId[1], 0, "right");
        }
        
        let diffPoseFirst = subtractPose(poseFirstBoundary, posePreFirstBoundary, true);
        let diffPoseOther = subtractPose(poseOtherBoundary, posePreOtherBoundary, true);

        if (comparePose(diffPoseFirst, "<=", thresholdPose) === false || comparePose(diffPoseOther, "<=", thresholdPose) === false) {
            result = false;
            log += `Offset in road transition greater than allowed threshold (for transition from road ${predecessingRoad.attributes.id}, lane ${laneId[0]} to road ${road.attributes.id}, lane ${laneId[1]}). `
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * @param {OdrReader} odrReader
 * @param {t_road_planView} planView 
 * @param {number} thresholdDistance
 * @param {number} thresholdHeading
 * @returns {ResultLog}
 */
function checkGeometryTransitions(odrReader, roadId, thresholdPose) {
    let road = odrReader.getRoad(roadId, "road");

    if (road === undefined) {
        return {
            result: false,
            log: "road with ID " + roadId + " does not exist."
        }
    }
    else {
        road = road[0];
    }

    if (road.planView.geometry.length < 2)
        return {
            result: true,
            log: ""
        };

    let result = true;
    let log = "";    

    for (let i = 1; i < road.planView.geometry.length - 1; i++) {

        // get end pose of the previous geometry element
        let sStartPre = road.planView.geometry[i-1].attributes.s;
        let lengthPre = road.planView.geometry[i-1].attributes.length;
        let sEndPre = sStartPre + lengthPre - eps; // make sure parameters are not from the next geometry segment
        let lastPosePre = odrReader.getReferenceLinePose(roadId, sEndPre);

        // get start pose of the current geometry element
        let sStartCurr = road.planView.geometry[i].attributes.s;
        let firstPoseCurr = odrReader.getReferenceLinePose(roadId, sStartCurr);

        let diffPose = subtractPose(lastPosePre, firstPoseCurr, true);

        if (comparePose(diffPose, "<=", thresholdPose) === false) {
            result = false;
            log += `Offset of reference line in geometry transition greater than allowed threshold (for road ${roadId} at point s=${sStartCurr}). `
        }        
    }

    return {
        result: result,
        log: log
    };
}

/**
 * @param {OdrReader} odrReader 
 * @param {string} roadId 
 * @param {pose3d} thresholdPose 
 * @returns {ResultLog}
 */
function checkElevationTransitions(odrReader, roadId, thresholdPose) {
    const road = odrReader.getRoad(roadId, "road");

    if (road.elevationProfile === undefined) 
        return {
            result: true,
            log: ""
        };

    if (road.elevationProfile.elevation.length < 2)
        return {
            result: true,
            log: ""
        };

    let result = true;
    let log = "";

    for (let i = 1; i < road.elevationProfile.elevation.length - 1; i++) {

        let sStartCurr = road.elevationProfile.elevation[i].attributes.s;
        let firstPoseCurr = odrReader.getReferenceLinePose(roadId, sStartCurr);

        let sEndPre = sStartCurr - eps;
        lastPosePre = odrReader.getReferenceLinePose(roadId, sEndPre);

        let diffPose = subtractPose(lastPosePre, firstPoseCurr, true);
        
        if (comparePose(diffPose, "<=", thresholdPose) === false) {
            result = false;
            log += `Offset of reference line in elevation transition greater than allowed threshold (for road ${roadId} at point s=${sStartCurr}). `
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * 
 * @param {OdrReader} odrReader 
 * @param {string} roadId 
 * @param {pose3d} thresholdPose 
 * @returns {ResultLog}
 */
function checkSuperElevationTransitions(odrReader, roadId, thresholdPose) {
    const road = odrReader.getRoad(roadId, "road");

    if (road.lateralProfile === undefined)
        return {
            result: true,
            log: ""
        };

    if (road.lateralProfile.superelevation.length < 2)
        return {
            result: true,
            log: ""
        };
    
    let result = true;
    let log = "";

    for (let i = 1; i < road.lateralProfile.superlevation; i++) {
        let sStartCurr = road.lateralProfile.superlevation[i].attributes.s;
        let firstPoseCurr = odrReader.getReferenceLinePose(roadId, sStartCurr);

        let sEndPre = sStartCurr - eps;
        lastPosePre = odrReader.getReferenceLinePose(roadId, sEndPre);

        let diffPose = subtractPose(lastPosePre, firstPoseCurr, true);

        if (comparePose(diffPose, "<=", thresholdPose) === false) {
            result = false;
            log += `Offset of reference line in superelevation transition greater than allowed threshold (for road ${roadId} at point s=${sStartCurr}). `
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * 
 * @param {OdrReader} odrReader 
 * @param {string} roadId 
 * @param {pose3d} thresholdPose 
 * @returns {ResultLog}
 */
function checkShapeTransitions(odrReader, roadId, thresholdPose) {
    const road = odrReader.getRoad(roadId, "road");

    if (road.lateralProfile === undefined)
        return {
            result: true,
            log: ""
        };

    for (let i = 1; i < road.lateralProfile.shape.length; i++) {
        let sStartCurr = road.lateralProfile.shape[i].attributes.s;
        let firstPoseCurr = odrReader.getReferenceLinePose(roadId, sStartCurr);

        let sEndPre = sStartCurr - eps;
        lastPosePre = odrReader.getReferenceLinePose(roadId, sEndPre);

        let diffPose = subtractPose(lastPosePre, firstPoseCurr, true);

        if (comparePose(diffPose, "<=", thresholdPose) === false) {
            result = false;
            log += `Offset of reference line in shape transition greater than allowed threshold (for road ${roadId} at point s=${sStartCurr}). `
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * @param {OdrReader} odrReader 
 * @param {t_road} road 
 * @returns {ResultLog}
 */
function checkJunctionRefs(odrReader, road) {
    let result = true;
    let log = "";

    if (road.attributes.junction !== "-1") {
        // check if junction exists
        let junction = odrReader.getJunction(road.attributes.junction);
        if (junction === undefined) {
            result = false;
            log += "Junction with ID " + road.attributes.junction + " is not defined, although referenced in road with ID " + road.attributes.id + ". ";
        }
        else {
            // check if incomingRoad and connectingRoad exist
            for (let connection of junction.connection) {
                let roadToCheck;

                if (connection.attributes.incomingRoad !== undefined) {
                    roadToCheck = odrReader.getRoad(connection.attributes.incomingRoad, "road");
                    if (roadToCheck.includes(undefined)) {
                        result = false;
                        log += "Road with ID " + connection.attributes.incomingRoad + " is not defined, although referenced in junction with ID " + junction.attributes.id + ". ";
                    }
                    else {
                        // check if referenced lanes exist in incomingRoad
                        for (let link of connection.laneLink) {
                            laneSection = roadToCheck[0].lanes.laneSection[roadToCheck[0].lanes.laneSection.length - 1];
                            if (link.attributes.from > 0) {
                                if (laneSection.left.lane.find(lane => lane.attributes.id === link.attributes.from) === undefined) {
                                    result = false;
                                    log += "Lane with ID " + link.attributes.from + " in road with ID " + roadToCheck[0].attributes.id + " is not defined in at least one lane section, although referenced in junction with ID " + junction.attributes.id + ". ";
                                }
                            }
                            else {
                                if (laneSection.right.lane.find(lane => lane.attributes.id === link.attributes.from) === undefined) {
                                    result = false;
                                    log += "Lane with ID " + link.attributes.from + " in road with ID " + roadToCheck[0].attributes.id + " is not defined in at least one lane section, although referenced in junction with ID " + junction.attributes.id + ". ";
                                }
                            }                                                                  
                        }
                    }
                }

                if (connection.attributes.connectingRoad !== undefined) {
                    roadToCheck = odrReader.getRoad(connection.attributes.connectingRoad, "road");
                    if (roadToCheck.includes(undefined)) {
                        result = false;
                        log += "Road with ID " + connection.attributes.connectingRoad + " is not defined, although referenced in junction with ID " + junction.attributes.id + ". ";
                    }
                    else {
                        // check if referenced lanes exist in connectingRoad
                        for (let link of connection.laneLink) {
                            laneSection = connection.attributes.contactPoint === "end" ? roadToCheck[0].lanes.laneSection[roadToCheck[0].lanes.laneSection.length - 1] : roadToCheck[0].lanes.laneSection[0];
                            if (link.attributes.to > 0) {
                                if (laneSection.left.lane.find(lane => lane.attributes.id === link.attributes.to) === undefined) {
                                    result = false;
                                    log += "Lane with ID " + link.attributes.to + "in road with ID " + roadToCheck[0].attributes.id + " is not defined in at least one lane section, although referenced in junction with ID " + junction.attributes.id + ". ";
                                }
                            }
                            else {
                                if (laneSection.right.lane.find(lane => lane.attributes.id === link.attributes.to) === undefined) {
                                    result = false;
                                    log += "Lane with ID " + link.attributes.to + "in road with ID " + roadToCheck[0].attributes.id + " is not defined in at least one lane section, although referenced in junction with ID " + junction.attributes.id + ". ";
                                }
                            }                                    
                        }
                    }
                }

                if (connection.predecessor !== undefined) {
                    roadToCheck = odrReader.getRoad(connection.predecessor.attributes.elementId, "road");
                    if (roadToCheck === undefined) {
                        result = false;
                        log += "Road with ID " + connection.predecessor.attributes.elementId + " is not defined, although referenced in junction with ID " + junction.attributes.id + ". ";
                    }
                }

                if (connection.successor !== undefined) {
                    roadToCheck = odrReader.getRoad(connection.successor.attributes.elementId, "road");
                    if (roadToCheck === undefined) {
                        result = false;
                        log += "Road with ID " + connection.successor.attributes.elementId + " is not defined, although referenced in junction with ID " + junction.attributes.id + ". ";
                    }
                }
            }
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * @param {OdrReader} odrReader
 * @param {t_road} road
 * @returns {ResultLog}
 */
function checkRoadLinkRefs(odrReader, road) {
    let result = true;
    let log = "";

    if (road.link.predecessor !== undefined) {
        if (road.link.predecessor.attributes.elementType === "junction") {
            let junctionId = road.link.predecessor.attributes.elementId;
            if (odrReader.getJunction(junctionId) === undefined) {
                result = false;
                log += "Junction with ID " + junctionId + " is not defined, although referenced in road with ID " + road.attributes.id + ". ";
            }
        }
    }

    if (road.link.successor !== undefined) {
        if (road.link.successor.attributes.elementType === "junction") {
            let junctionId = road.link.successor.attributes.elementId;
            if (odrReader.getJunction(junctionId) === undefined) {
                result = false;
                log += "Junction with ID " + junctionId + " is not defined, although referenced in road with ID " + road.attributes.id + ". "; 
            }
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * @param {OdrReader} odrReader
 * @param {t_road} road
 * @returns {ResultLog}
 */
function checkLaneSectionRefs(odrReader, road) {
    let result = true;
    let log = "";

    for (let i = 0; i < road.lanes.laneSection.length; i++) {
        if (road.lanes.laneSection[i].left !== undefined) {
            for (let lane of road.lanes.laneSection[i].left.lane) {
                if (lane.link !== undefined) {
                    if (lane.link.predecessor !== undefined) {
                        if (i > 0) {
                            // 2nd to last laneSection
                            for (let predecessor of lane.link.predecessor) {
                                if (road.lanes.laneSection[i-1].left.lane.find(lane => lane.attributes.id === predecessor.attributes.id) === undefined) {
                                    result = false;
                                    log += "Lane with ID " + predecessor.attributes.id + " in road with ID " + road.attributes.id + " is not defined in at least one lane section, although referenced in another lane as predecessor.";
                                }
                            }
                        }
                        else {
                            // first laneSection
                            let predecessingRoads = odrReader.getPredecessingRoads(road.attributes.id);
                            for (let predecessingLane of lane.link.predecessor) {
                                let side = predecessingLane.attributes.id > 0 ? "left" : "right";
                                let laneFound = false;
                                let currentRoadId;
                                for (let predecessingRoad of predecessingRoads) {
                                    let lastLaneSection = predecessingRoad.lanes.laneSection[predecessingRoad.lanes.laneSection.length - 1];
                                    currentRoadId = predecessingRoad.attributes.id;
                                    if (lastLaneSection[side].lane.find(lane => lane.attributes.id === predecessingLane.attributes.id) !== undefined) {
                                        laneFound = true;
                                        break;
                                    }
                                }
                                if (laneFound == false) {
                                    result = false;
                                    log += "Lane with ID " + predecessingLane.attributes.id + " in road with ID " + currentRoadId + " is not defined in the last lane section, although referenced in the successing road as predecessing lane.";
                                }
                            } 
                        }
                    }

                    if (lane.link.successor !== undefined) {
                        if (i < road.lanes.laneSection.length - 1) {
                            // first to pen-ultimate laneSection
                            for (let successor of lane.link.successor) {
                                if (road.lanes.laneSection[i+1].left.lane.find(lane => lane.attributes.id === successor.attributes.id) === undefined) {
                                    result = false;
                                    log += "Lane with ID " + successor.attributes.id + " in road with ID " + road.attributes.id + " is not defined in at least one lane section, although referenced in another lane as successor.";
                                }
                            }
                        }
                        else {
                            // last laneSection
                            let successingRoads = odrReader.getSuccessingRoads(road.attributes.id);
                            for (let successingLane of lane.link.successor) {
                                let side = successingLane.attributes.id > 0 ? "left" : "right";
                                let laneFound = false;
                                let currentRoadId;
                                for (let successingRoad of successingRoads) {
                                    let firstLaneSection = successingRoad.lanes.laneSection[0];
                                    currentRoadId = successingRoad.attributes.id;
                                    if (firstLaneSection[side].lane.find(lane => lane.attributes.id === successingLane.attributes.id) !== undefined) {
                                        laneFound = true;
                                        break;
                                    }
                                }
                                if (laneFound == false) {
                                    result = false;
                                    log += "Lane with ID " + successingLane.attributes.id + " in road with ID " + currentRoadId + " is not defined in the first lane section, although referenced in the predecessing road as successing lane.";
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return {
        result: result,
        log: log
    };
}

/**
 * Subtracts two pose3d objects
 * 
 * @param {pose3d} pose1 
 * @param {pose3d} pose2 
 * @param {boolean} [abs] if set to true, the absolute difference is generated for each property
 * @returns {pose3d}
 */
function subtractPose(pose1, pose2, abs = false) {
    return {
        x: abs === true ? Math.abs(pose1.x - pose2.x) : pose1.x - pose2.x,
        y: abs === true ? Math.abs(pose1.y - pose2.y) : pose1.y - pose2.y,
        z: abs === true ? Math.abs(pose1.z - pose2.z) : pose1.z - pose2.z,
        heading: abs === true ? Math.abs(pose1.heading - pose2.heading) : pose1.heading - pose2.heading,
        pitch: abs === true ? Math.abs(pose1.pitch - pose2.pitch) : pose1.pitch - pose2.pitch,
        roll: abs === true ? Math.abs(pose1.roll - pose2.roll) : pose1.roll - pose2.roll
    };
}

/**
 * Performs the operation pose1.x <operator> pose2.x && pose1.y <operator> pose2.y && ... && pose1.roll <operator> pose2.roll
 * 
 * <operator> may be '<', '<=', '==', '!=', '>=' or '>'
 * @param {pose3d} pose1 
 * @param {string} operator 
 * @param {pose3d} pose2 
 * @returns {boolean}
 */
function comparePose(pose1, operator, pose2) {
    return eval(pose1.x + operator + pose2.x) 
        && eval(pose1.y + operator + pose2.y)
        && eval(pose1.z + operator + pose2.z)
        && eval(pose1.heading + operator + pose2.heading)
        && eval(pose1.pitch + operator + pose2.pitch)
        && eval(pose1.roll + operator + pose2.roll);
}

/**
 * Extracts all geometries that are used to model the plan view of the road
 * 
 * @param {t_road} road 
 * @returns {string[]}
 */
function extractGeometryModelingApproaches(road) {
    let approaches = [];

    for (let geometry of road.planView.geometry) {
        for (let geometryApproach of GEOMETRIES) {
            if (geometry[geometryApproach] !== undefined)
                approaches.push(geometryApproach);
        }
    }

    return approaches.unique();
}