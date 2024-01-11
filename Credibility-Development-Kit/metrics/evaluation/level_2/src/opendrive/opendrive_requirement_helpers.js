const { OdrReader } = require('../../../../../util/opendrive-reader');

exports.getRoadLength = getRoadLength;
exports.getDrivingLaneWidthRange = getDrivingLaneWidthRange;
exports.getElevationRange = getElevationRange;
exports.getCurveRadiusRange = getCurveRadiusRange;
exports.getDrivingLaneRange = getDrivingLaneRange;
exports.getAvailableLaneTypes = getAvailableLaneTypes;
exports.getAvailableLaneMarkingTypes = getAvailableLaneMarkingTypes;
exports.getAvailableRoadTypes = getAvailableRoadTypes;
exports.getAvailableSpeedLimits = getAvailableSpeedLimits;
exports.getTractionRange = getTractionRange;
exports.getTrafficRule = getTrafficRule;

/**
 * @typedef {import('../../types/types').LineMarking} LineMarking
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

/**
 * Helper methods for arrays to make array unique, using shallow equality
 */
Array.prototype.unique = function () {
    return this.filter((val, i, self) => self.indexOf(val) === i);
}

/**
 * Helper methods for arrays to make array unique, using deep equality 
 */
Array.prototype.deepUnique = function () {
    return this
        .map(val => JSON.stringify(val))
        .filter((val, i, self) => self.indexOf(val) === i)
        .map(val => JSON.parse(val));
}

/**
 * Returns the minimum and maximum available width of all driving lanes in the
 * map
 * 
 * @param {OdrReader} odrReader 
 * @returns {number[]} [min width, max width] of all roads in the map
 */
function getDrivingLaneWidthRange(odrReader) {
    let wMin = Infinity; // [m]
    let wMax = 0; // [m]
    const ds = 1.0; // [m]

    let roads = odrReader.getAllRoads();

    for (let road of roads) {
        for (let ls = 0; ls < road.lanes.laneSection.length - 1; ls++) {
            let currentLaneSection = road.lanes.laneSection[ls];
            let nextLaneSection = road.lanes.laneSection[ls+1];

            for (let s = currentLaneSection.attributes.s; s < nextLaneSection.attributes.s - ds; s += ds) {
                let lanes = [];

                if (currentLaneSection.left !== undefined) 
                    lanes.push(...currentLaneSection.left.lane.filter(lane => lane.attributes.type == "driving"));
                if (currentLaneSection.right !== undefined)
                    lanes.push(...currentLaneSection.right.lane.filter(lane => lane.attributes.type == "driving"));                
                    
                for (let lane of lanes) {
                    let width = odrReader.getLaneWidth(road.attributes.id, lane.attributes.id, s);
                    wMin = width < wMin ? width : wMin;
                    wMax = width > wMax ? width : wMax;
                }
            }
        }
    }

    return [wMin, wMax];
}

/**
 * Return the minimum and maximum elevation of the reference line of all roads 
 * in the map
 * 
 * @param {OdrReader} odrReader 
 * @param {string} unit unit of the elevation ("rad", "deg", or "%")
 * @returns {number[]} [min elevation, max elevation] of all roads in the map
 */
function getElevationRange(odrReader, unit="rad") {
    let eMin = 0; // [rad]
    let eMax = 0; // [rad]
    const ds = 1.0; // [m]

    let roads = odrReader.getAllRoads();

    for (let road of roads) {
        for (let s = 0; s < road.attributes.length - ds; s += ds) {
            let pose = odrReader.getReferenceLinePose(road.attributes.id, s);
            eMin = pose.pitch < eMin ? pose.pitch : eMin;
            eMax = pose.pitch > eMax ? pose.pitch : eMax;
        }
    }

    if (unit == "%")
        return [100*Math.tan(eMin), 100*Math.tan(eMax)];
    else if (unit == "deg")
        return [eMin * 180/Math.PI, eMax * 180/Math.PI];
    else if (unit == "rad")
        return [eMin, eMax];
    else 
        throw("unit " + unit + " is not suppurted");
}

/**
 * Returns the minimum and maximum curve radius of all roads in the map
 * 
 * @param {OdrReader} odrReader 
 * @returns {number[]} [min radius, max radius] of all roads in the map
 */
function getCurveRadiusRange(odrReader) {
    let rMin = Infinity; // [m]
    let rMax = 0; // [m]
    const ds = 1.0; // [m]
    const eps = 0.01; // [m]

    let roads = odrReader.getAllRoads();

    for (let road of roads) {
        for (let s = 0; s < road.attributes.length - ds; s += ds) {
            let pose1 = odrReader.getReferenceLinePose(road.attributes.id, s);
            let pose2 = odrReader.getReferenceLinePose(road.attributes.id, s + eps);
            let r = Math.abs(eps / (pose2.heading - pose1.heading));
            
            rMin = r < rMin ? r : rMin;
            rMax = r > rMax ? r : rMax;
        }
    }

    return [rMin, rMax];
}

/**
 * Return the cumulated length of all available roads in the map
 * 
 * @param {OdrReader} odrReader 
 * @returns {number} the sum of all road lengths in the map
 */
function getRoadLength(odrReader) {
    let length = 0;
    let roads = odrReader.getAllRoads();

    for (let road of roads)
        length += Number(road.attributes.length);

    return length;
}

/**
 * Return the minimum and maximum available number of driving lanes per 
 * driving direction, for all sections where driving lanes are available
 * (minimum is therefore always >= 1)
 * 
 * @param {OdrReader} odrReader
 * @returns {number[]} [min number of lanes, max number of lanes] of all roads in the map
 */
function getDrivingLaneRange(odrReader) {
    let nLanesMax = 0;
    let nLanesMin = Infinity;

    let roads = odrReader.getAllRoads();

    for (let road of roads) {
        for (let laneSection of road.lanes.laneSection) {
            if (laneSection.left !== undefined) {
                let nLanes = laneSection.left.lane.filter(lane => lane.attributes.type == "driving").length;
                if (nLanes > 0) {
                    nLanesMax = nLanes > nLanesMax ? nLanes : nLanesMax;
                    nLanesMin = nLanes < nLanesMin ? nLanes : nLanesMin;
                }
            }
            if (laneSection.right !== undefined) {
                let nLanes = laneSection.right.lane.filter(lane => lane.attributes.type == "driving").length;
                if (nLanes > 0) {
                    nLanesMax = nLanes > nLanesMax ? nLanes : nLanesMax;
                    nLanesMin = nLanes < nLanesMin ? nLanes : nLanesMin;
                }
            }
        }
    }

    return [nLanesMin, nLanesMax];    
}

/**
 * Returns the available lane types of all roads in the map
 * 
 * @param {OdrReader} odrReader
 * @returns {string[]}
 */
function getAvailableLaneTypes(odrReader) {
    let roads = odrReader.getAllRoads();
    let laneTypes = [];

    for (let road of roads) {
        for (let laneSection of road.lanes.laneSection) {
            if (laneSection.left !== undefined) {
                laneTypes.push(...laneSection.left.lane.map(lane => lane.attributes.type));
            }
            if (laneSection.right !== undefined) {
                laneTypes.push(...laneSection.right.lane.map(lane => lane.attributes.type));
            }
        }
    }

    return laneTypes.unique();
}

/**
 * Returns all available line marking in the map
 * 
 * Notice: In the first implementation, only the standard roadMark types via 
 * attributes of t_road_lanes_laneSection_lcr_lane_roadMark are considered
 * 
 * @param {OdrReader} odrReader
 * @returns {LineMarking[]} all line marking types
 */
function getAvailableLaneMarkingTypes(odrReader) {
    let roads = odrReader.getAllRoads();
    let laneMarkingTypes = [];

    for (let road of roads) {
        for (let laneSection of road.lanes.laneSection) {
            let allLanes = [...laneSection.center.lane];
            if (laneSection.left !== undefined) 
                allLanes.push(...laneSection.left.lane)
            if (laneSection.right !== undefined)
                allLanes.push(...laneSection.right.lane)

            for (let lane of allLanes) {
                for (let roadMark of lane.roadMark) {
                    laneMarkingTypes.push({
                        type: roadMark.attributes.type,
                        color: roadMark.attributes.color,
                        weight: roadMark.attributes.weight
                    });
                }
            }
        }
    }

    return laneMarkingTypes.deepUnique();
}

/**
 * Returns all available road types in the map
 * 
 * @param {OdrReader} odrReader 
 * @returns {string[]}
 */
function getAvailableRoadTypes(odrReader) {
    let roads = odrReader.getAllRoads();
    let types = [];

    for (let road of roads) {
        for (let type of road.type) {
            types.push(type.attributes.type);
        }
    }

    return types.unique();
}

/**
 * Returns all available speed limits of all roads in the map
 * 
 * @param {OdrReader} odrReader 
 * @param {boolean} includeSignals if set to true, the speed limits of signals are considered, too
 * @returns {string[]} all available speed limits, including number and unit, e.g. "120 km/h"
 */
function getAvailableSpeedLimits(odrReader, includeSignals=true) {
    let roads = odrReader.getAllRoads();
    let limits = [];

    for (let road of roads) {
        // first, search in the road type definition
        let roadTypeWithSpeedLimit = road.type.filter(type => type.speed !== undefined);
        limits.push(...roadTypeWithSpeedLimit.map(type => String(type.speed.attributes.max) + " " + type.speed.attributes.unit));
        
        // second, search in the lanes
        for (let laneSection of road.lanes.laneSection) {
            let speedLimits = [];

            if (laneSection.left !== undefined)
                speedLimits.push(...laneSection.left.lane.filter(lane => lane.speed.length > 0).map(lane => lane.speed).flat());
            if (laneSection.right !== undefined)
                speedLimits.push(...laneSection.right.lane.filter(lane => lane.speed.length > 0).map(lane => lane.speed).flat());

            if (speedLimits.length > 0) {
                limits.push(...speedLimits.map(limit => String(limit.attributes.max) + " " + limit.attributes.unit));
            }
        }

        // third, search in the signals
        if (includeSignals === true && road.signals !== undefined) {
            let speedLimitSignals = road.signals.signal.filter(signal => signal.attributes.type == "274" && signal.attributes.value !== undefined);
            limits.push(...speedLimitSignals.map(signal => String(signal.attributes.value) + " " + signal.attributes.unit));
        }
    }

    return limits.unique();
}

/**
 * Returns the minimum and maximum available traction values of all roads
 * 
 * @param {OdrReader} odrReader 
 * @returns {number[]} [min traction, max traction]
 */
function getTractionRange(odrReader) {
    let roads = odrReader.getAllRoads();
    let fMin = Infinity;
    let fMax = 0;

    for (let road of roads) {
        for (let laneSection of road.lanes.laneSection) {
            let frictions = [];

            if (laneSection.left !== undefined) {
                frictions.push(...laneSection.left.lane
                    .map(lane => lane.material)
                    .flat()
                    .map(material => material.attributes.friction));
            }
            if (laneSection.right !== undefined) {
                frictions.push(...laneSection.right.lane
                    .map(lane => lane.material)
                    .flat()
                    .map(material => material.attributes.friction));
            }

            fMin = Math.min(...frictions) < fMin ? Math.min(...frictions) : fMin;
            fMax = Math.max(...frictions) > fMax ? Math.max(...frictions) : fMax;
        }    
    }

    return [fMin, fMax];
}

/**
 * Returns the traffic rule (right- or left-hand-traffic), if available
 * 
 * @param {OdrReader} odrReader 
 * @returns {string} "RHT" or "LHT"
 */
function getTrafficRule(odrReader) {
    let roads = odrReader.getAllRoads();
    let roadsWithRule = roads.filter(road => road.attributes.rule !== undefined);

    if (roadsWithRule.length == 0)
        return "RHT";
    else {
        return roadsWithRule[0].attributes.rule;
    }    
}