
const parser = require("./parser");
const extractors = require("./extractors");
const util = require("util-common");

const ROOT_ELEMENT = "OpenDRIVE";

/**
 * @typedef {import('../types/specification').t_header} t_header
 * @typedef {import('../types/specification').t_road} t_road
 * @typedef {import('../types/specification').t_road_planView_geometry } t_road_planView_geometry
 * @typedef {import('../types/specification').t_junction} t_junction
 * @typedef {import('../types/specification').t_controller} t_controller
 * @typedef {import('../types/specification').t_junctionGroup} t_junctionGroup
 * @typedef {import('../types/specification').t_station} t_station
 * @typedef {import('../types/specification').t_include} t_include
 * @typedef {import('../types/specification').t_userData} t_userData
 * @typedef {import('../types/specification').t_dataQuality} t_dataQuality
 * @typedef {import('../types/internal').internal_geometry_parameters_paramPoly3} internal_geometry_parameters_paramPoly3
 * @typedef {import('../types/internal').internal_geometry_parameters_arc} internal_geometry_parameters_arc
 * @typedef {import('../types/internal').internal_geometry_parameters_spiral} internal_geometry_parameters_spiral
 * @typedef {import('../types/specification').t_road_elevationProfile_elevation} t_road_elevationProfile_elevation 
 * @typedef {import('../types/specification').t_road_elevationProfile_elevation_attributes} t_road_elevationProfile_elevation_attributes
 * @typedef {import('../types/specification').t_road_lateralProfile_superelevation_attributes} t_road_lateralProfile_superelevation_attributes
 * @typedef {import('../types/specification').t_road_lateralProfile_shape_attributes} t_road_lateralProfile_shape_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_left_lane} t_road_lanes_laneSection_left_lane
 * @typedef {import('../types/specification').t_road_lanes_laneSection_center_lane} t_road_lanes_laneSection_center_lane
 * @typedef {import('../types/specification').t_road_lanes_laneSection_right_lane} t_road_lanes_laneSection_right_lane
 * @typedef {import('../types/specification').t_road_lanes_laneOffset_attributes} t_road_lanes_laneOffset_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection} t_road_lanes_laneSection
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_width_attributes} t_road_lanes_laneSection_lr_lane_width_attributes
 * @typedef {import("../types/specification").t_road_lanes_laneSection_lr_lane_height_attributes} t_road_lanes_laneSection_lr_lane_height_attributes
 * @typedef {import("../types/specification").t_road_lanes_laneSection_lcr_lane_roadMark} t_road_lanes_laneSection_lcr_lane_roadMark
 * @typedef {import("../types/specification").t_road_lanes_laneSection_lcr_lane_roadMark_type_line} t_road_lanes_laneSection_lcr_lane_roadMark_type_line
 * @typedef {import('../types/specification').t_road_objects_object} t_road_objects_object
 * @typedef {import('../types/specification').t_road_signals_signal} t_road_signals_signal
 * @typedef {import('../types/internal').internal_pose3d} internal_pose3d
 * @typedef {import('../types/internal').internal_lane_height} internal_lane_height
 * @typedef {import('../types/internal').internal_sectionLaneIds} internal_sectionLaneIds
 * @typedef {import('../types/internal').internal_roadMark} internal_roadMark
 */

// helper methods for arrays to find last index according to a condition
// based on current proposal: https://github.com/tc39/proposal-array-find-from-last
Array.prototype.findLastIndex = function (fn) {
    return this.length - 1 - [...this].reverse().findIndex(fn);
}

Array.prototype.findLast = function (fn) {
    const lastIdx = this.findLastIndex(fn);
    return lastIdx < this.length ? this[lastIdx] : undefined;
}

exports.OdrReader = class OdrReader {
    /**
     * The raw parsed ODR file, parsed by fast-xml-parser
     * 
     * @private 
     * @type {object}
     */
    #odrRawParsed;

    /**
     * Transformed header of the ODR
     * 
     * @private 
     * @type {t_header}
     */
    #header;

    /**
     * Transformed roads of the ODR
     * 
     * @private 
     * @type {t_road[]}
     */
    #roads;

    /**
     * Transformed junctions of the ODR
     * 
     * @private 
     * @type {t_junction[]}
     */
    #junctions;
    
    /**
     * Transformed junctionGroups of the ODR
     * 
     * @private 
     * @type {t_junctionGroup[]}
     */
    #junctionGroups;

    /**
     * Transformed controllers of the ODR
     * 
     * @private 
     * @type {t_controller[]}
     */
    #controllers;

    /**
     * Transformed stations of the ODR
     * 
     * @private 
     * @type {t_station[]}
     */
    #stations;

    /**
     * Transformed top-level include elements of the ODR
     * 
     * @private 
     * @type {t_include[]}
     */
    #includes;

    /**
     * Transformed top-level userData elements of the ODR
     * 
     * @private 
     * @type {t_userData[]}
     */
    #userData;

    /**
     * Transformed top-level dataQuality element of the ODR
     * 
     * @private 
     * @type {t_dataQuality}
     */
    #dataQuality;

    /**
     * Creates an object to access any element inside an [OpenDRIVE file](https://www.asam.net/standards/detail/opendrive/).
     * To use it, the string of the ODR file must be handed over on initialization of the odrReader.
     * 
     * Currently supported version: 1.6
     * 
     * @param {string} odrString the stringified *.xodr file
     */
    constructor(xodrString = "") {
        if (xodrString !== "") {
            this.#odrRawParsed = parser.parseOpendrive(xodrString);
            this.#header = extractors.extractHeader(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#roads = extractors.extractRoads(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#junctions = extractors.extractJunction(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#junctionGroups = extractors.extractJunctionGroup(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#controllers = extractors.extractController(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#stations = extractors.extractStation(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#includes = extractors.extractInclude(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#userData = extractors.extractUserData(this.#odrRawParsed[ROOT_ELEMENT]);
            this.#dataQuality = extractors.extractDataQuality(this.#odrRawParsed[ROOT_ELEMENT]);
        }
    }
    
    getHeader() {
        return this.#header;
    }

    /**
     * Returns the road with the given road or all roads with the given junction ID.
     * 
     * If you want to get the road by the road ID, then type must be "road".
     * 
     * If you want to get the road by a junction ID, then type must be "junction".
     * 
     * If you want to get the road by a object ID, then type must be "object".
     * 
     * If you want to get the road by a signal ID, then type must be "signal".
     * 
     * @param {string} id the road or junction ID
     * @param {string} type specifies, if id refers to a road ID or a junction ID, must be either "road", "junction",
     *                      "object", or "signal"
     * @returns {t_road[]}
     */
    getRoad(id, type) {
        let road;

        if (type === "road") {
            road = this.#getRoadByRoadId(id);
            return road !== undefined ? [road] : [];
        }
        else if (type === "junction") {
            return this.#getRoadByJunctionId(id);
        }
        else if (type === "object") {
            road = this.#getRoadByObjectId(id);
            return road !== undefined ? [road] : [];
        }
        else if (type === "signal") {
            road = this.#getRoadBySignalId(id);
            return road !== undefined ? [road] : [];
        }
        else {
            return [];
        }
    }

    /**
     * Returns all the road of the ODR
     * 
     * @returns {t_road[]}
     */
    getAllRoads() {
        return this.#roads;
    }

    /**
     * Returns all predecessing roads of the road with the given road ID.
     * 
     * If no predecessing roads are existing, an empty array will be returned.
     * 
     * If no road with the given ID exists, undefined will be returned.      
     * 
     * @param {string} roadId 
     * @returns {t_road[] | undefined}
     */
    getPredecessingRoads(roadId) {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return undefined;

        if (road.link === undefined)
            return [];

        if (road.link.predecessor === undefined)
            return [];

        const id = road.link.predecessor.attributes.elementId;
        let type = road.link.predecessor.attributes.elementType;

        if (type === "junction") {
            return this.#roads
                .filter(road => road.attributes.junction === id)
                .filter(road => road.link.successor.attributes.elementId === roadId);
        } 
        else
            return [this.#getRoadByRoadId(id)];      
    }

    /**
     * Returns all successing roads of the road with the given road ID.
     * 
     * If no successing roads are existing, an empty array will be returned.
     * 
     * If no road with the given ID exists, undefined will be returned.      
     * 
     * @param {string} roadId 
     * @returns {t_road[] | undefined}
     */
    getSuccessingRoads(roadId) {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return undefined;

        if (road.link === undefined)
            return [];

        if (road.link.successor === undefined)
            return [];

        const id = road.link.successor.attributes.elementId;
        let type = road.link.successor.attributes.elementType;

        if (type === "junction")
            return this.#roads
                .filter(road => road.attributes.junction === id)
                .filter(road => road.link.predecessor.attributes.elementId === roadId);
        else
            return [this.#getRoadByRoadId(id)];                
    }
    
    /**
     * Returns the junction with the given junction ID
     * 
     * @param {string} junctionId 
     * @returns {t_junction | undefined}
     */
    getJunction(junctionId) {
        return this.#getJunction(junctionId);
    }

    /**
     * Returns all available junctions
     * 
     * @returns {t_junction[]}
     */
    getAllJunctions() {
        return this.#junctions;
    }

    /**
     * Returns the pose of the reference line at the desired road length s
     * 
     * @param {string} roadId 
     * @param {number} s 
     * @returns {internal_pose3d}
     */
    getReferenceLinePose(roadId, s) {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return undefined;

        if (s < 0 || s > road.attributes.length) {
            console.log("The road with the given ID is not defined for the given spline length");
            return undefined;
        }

        return this.#getPose(road, s, 0);
    }
    
    /**
     * Returns the pose of a lane boundary.
     * 
     * If leftOrRight is not defined, the pose of the right lane boundary will be returned.
     * 
     * If leftOrRight is defined to "left", the pose of the left lane boundary will be returned.
     * 
     * @param {string} roadId 
     * @param {number} laneId 
     * @param {number} s 
     * @param {string} leftOrRight
     * @returns {internal_pose3d}
     */
    getLaneBoundaryPose(roadId, laneId, s, leftOrRight = "right") {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return undefined;

        if (s < 0 || s > road.attributes.length) {
            console.log(`The road with ID ${roadId} is not defined for the given spline length ${s}`);
            return undefined;
        }
       
        const t = this.#getLaneBoundaryTCoordinate(road, laneId, s, leftOrRight);

        return this.#getPose(road, s, t);
    }

    /**
     * Get lane mark points of the specified lane section
     * 
     * Each point has a ID to enable allocation to its lane according to the follwing schema:
     * <road ID>_<laneSection index>_<lane ID>_<road mark index>_<line index>
     * 
     * Note: In most cases, you will only have one road mark per lane (except for a lane within a road cross section, 
     * multiple road mark elements may be defined) and only one line (except for double lines like "broken solid").
     * 
     * @param {string} roadId 
     * @param {number} sStart 
     * @param {number} sEnd 
     * @param {number} ds 
     * @param {number} laneId 
     * @returns {internal_roadMark[]}
     */
    getLaneMarkingPoints(roadId, sStart, sEnd, ds, laneId) {
        let road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return [];

        if (sStart < 0 || sStart > road.attributes.length) {
            console.log("The road with the given ID is not defined for the given sStart");
            return [];
        }
        if (sEnd < 0 || sEnd > road.attributes.length) {
            console.log("The road with the given ID is not defined for the given sEnd");
            return [];
        }
        if (ds == 0) {
            console.log("ds must not be equal to 0");
            return [];
        }
        if (ds < 0) {
            ds = -ds;
        }
        if (sStart > sEnd) {
            let sTemp = sStart;
            sStart = sEnd;
            sEnd = sTemp;
        }

        let points = [];

        for (let s = sStart; s < sEnd; s += ds) {
            let laneSection = this.#getLaneSection(road, s);
            let idxLaneSection = road.lanes.laneSection.findIndex(ls => ls.attributes.s == laneSection.attributes.s);
            let lane = this.#getLane(laneSection, laneId);

            if (lane === undefined)
                continue;

            let iRoadMark = 0;
            for (let roadMark of lane.roadMark) {
                let newPoints = this.#getRoadMarkPoints(roadId, lane.attributes.id, roadMark, s, idxLaneSection);
                points.push(...newPoints);
            }
        }

        return points;
    }

    /**
     * Returns the width of a lane.
     * 
     * @param {string} roadId 
     * @param {number} laneId 
     * @param {number} s
     * @returns {number} width in [m]
     */
    getLaneWidth(roadId, laneId, s) {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return undefined;

        if (s < 0 || s > road.attributes.length) {
            console.log("The road with the given ID is not defined for the given spline length");
            return undefined;
        }

        const laneSection = this.#getLaneSection(road, s);
        const sOffset = s - laneSection.attributes.s;

        let lane = this.#getLane(laneSection, laneId);
        let laneWidthParameters = this.#getLaneWidthParameters(lane, sOffset);

        return this.#width(laneWidthParameters, sOffset);
    }

    /**
     * Returns any arbitrary pose of a road, by referencing to s and t
     * 
     * @param {string} roadId 
     * @param {number} s 
     * @param {number} t 
     * @returns {internal_pose3d}
     */
    getPose(roadId, s, t) {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return undefined;

        if (s < 0 || s > road.attributes.length) {
            console.log("The road with the given ID is not defined for the given spline length");
            return undefined;
        }

        return this.#getPose(road, s, t);
    }

    /**
     * Returns the object with the given ID or undefined if the object does not
     * exist.
     * 
     * @param {string} id 
     * @returns {t_road_objects_object | undefined}
     */
    getObject(id) {
        let object;

        for (let road of this.#roads) {
            if (road.objects !== undefined) {
                object = road.objects.object.find(obj => obj.attributes.id == id);
                if (object !== undefined)
                    break;
            }
            else
                continue;
        }

        return object;
    }

    /**
     * Returns the signal with the given ID or undefined if the signal does not
     * exist.
     * 
     * @param {string} id 
     * @returns {t_road_signals_signal | undefined}
     */
    getSignal(id) {
        let signal;

        for (let road of this.#roads) {
            if (road.signals !== undefined) {
                signal = road.signals.signal.find(signal => signal.attributes.id == id);
                if (signal !== undefined)
                    break;
            }
            else
                continue;
        }

        return signal;
    }

    /**
     * Get all the driving lane IDs of a specific lane section
     * 
     * @param {t_road | string} road 
     * @param {number} s 
     * @returns {number[]} all available driving lane IDs of the lane section
     */
    getDrivingLaneIds(road, s) {
        if (typeof(road) == "string") {
            road = this.#getRoadByRoadId(road);
            if (road === undefined)
                return [];
        }

        let laneIds = [];

        const laneSection = this.#getLaneSection(road, s);

        if (laneSection.left !== undefined) {
            laneIds.push(...laneSection.left.lane.filter(lane => lane.attributes.type === "driving").map(lane => lane.attributes.id));
        }

        if (laneSection.right !== undefined) {
            laneIds.push(...laneSection.right.lane.filter(lane => lane.attributes.type === "driving").map(lane => lane.attributes.id));
        }

        return laneIds.sort((a, b) => a - b);
    }

    /**
     * Get the lane of the road at the specified point with the specified lane ID
     * 
     * @param {t_road | string} road road or road ID
     * @param {number} s
     * @param {number} laneId 
     * @returns {t_road_lanes_laneSection_left_lane | t_road_lanes_laneSection_center_lane | t_road_lanes_laneSection_right_lane | undefined}
     */
    getLane(road, s, laneId) {
        if (typeof(road) == "string") {
            road = this.#getRoadByRoadId(road);
            if (road === undefined)
                return [];
        }

        const laneSection = this.#getLaneSection(road, s);

        if (laneSection === undefined)
            return undefined;

        const availableLaneIds = this.#getAvailableLaneIds(laneSection);

        if (!availableLaneIds.includes(laneId)) {
            return undefined;
        }

        if (laneId > 0) 
            return laneSection.left.lane.find(lane => lane.attributes.id == laneId);
        else if (laneId < 0)
            return laneSection.right.lane.find(lane => lane.attributes.id == laneId);
        else
            return laneSection.center.lane;
    }

    /**
     * Returns the lane IDs of each laneSection
     * 
     * @param {t_road | string} road road or road ID
     * @returns {internal_sectionLaneIds[]}
     */
    getLaneIdsOfLaneSegments(road) {
        if (typeof(road) == "string") {
            road = this.#getRoadByRoadId(road);
            if (road === undefined)
                return [];
        }

        let laneIdsOfSection = [];

        const laneSections = road.lanes.laneSection;

        for (let i = 0; i < laneSections.length; i++) {
            let laneIds = this.#getAvailableLaneIds(laneSections[i]);
            laneIdsOfSection.push({
                start: laneSections[i].attributes.s,
                end: i < laneSections.length - 1 ? laneSections[i+1].attributes.s : road.attributes.length,
                laneIds: laneIds
            });
        }

        return laneIdsOfSection;
    }

    /**
     * Returns all lane IDs of the given road at the specified point road length s
     * 
     * @param {t_road | string} road road or road ID
     * @param {number} s 
     * @returns {number[]}
     */
    getLaneIds(road, s) {
        if (typeof(road) == "string") {
            road = this.#getRoadByRoadId(road);
            if (road === undefined)
                return [];
        }

        let laneIds = [];

        const laneSection = this.#getLaneSection(road, s);

        if (laneSection.left !== undefined) {
            laneIds.push(...laneSection.left.lane.map(lane => lane.attributes.id));
        }

        if (laneSection.right !== undefined) {
            laneIds.push(...laneSection.right.lane.map(lane => lane.attributes.id));
        }

        return laneIds.sort((a, b) => a - b);
    }

    /**
     * 
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} t 
     * @returns {internal_pose3d}
     */
    #getPose(road, s, t) {
        const modelingApproach = this.#getPlanViewModelingApproach(road, s);
        const parametersElevation = this.#getElevationProfileParameters(road, s);
        const parametersSuperElevation = this.#getSuperElevationParameters(road, s);
        const parametersShape = this.#getLateralShapeParameters(road, s);
        const laneHeightParameters = this.#getLaneHeightParameters(road, s, t);

        var parametersPlanView;
        var pose;

        switch (modelingApproach) {
            case "paramPoly3":
                parametersPlanView = this.#getParamPoly3Parameters(road, s);
                pose = this.#getPoseParamPoly3(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, laneHeightParameters, s, t);
                break;
            case "line":
                parametersPlanView = this.#getLineParameters(road, s);
                // line is interpreted as paramPoly3 parameters
                pose = this.#getPoseParamPoly3(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, laneHeightParameters, s, t);
                break;
            case "arc":
                parametersPlanView = this.#getArcParameters(road, s);
                pose = this.#getPoseArc(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, laneHeightParameters, s, t);
                break;
            case "spiral":
                parametersPlanView = this.#getSpiralParameters(road, s);
                pose = this.#getPoseSpiral(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, laneHeightParameters, s, t);
                break;
            case "poly3":
                throw("cubic polynoms are not supported");
        }

        return pose;
    }

    /**
     * @param {internal_geometry_parameters_paramPoly3} parametersPlanView 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShape
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {internal_lane_height} parametersLaneHeight
     * @param {number} s
     * @param {number} t
     * @returns {internal_pose3d} 
     */
    #getPoseParamPoly3(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, parametersLaneHeight, s, t) {
        return {
            x: this.#xParamPoly3(parametersPlanView, s, t),
            y: this.#yParamPoly3(parametersPlanView, s, t),
            z: this.#z(parametersElevation, parametersShape, parametersSuperElevation, parametersLaneHeight, s, t),
            heading: this.#hdgParamPoly3(parametersPlanView, s),
            pitch: this.#pitch(parametersElevation, parametersShape, parametersSuperElevation, s, t),
            roll: this.#roll(parametersSuperElevation, parametersShape, s, t)
        };
    }

    /**
     * @param {internal_geometry_parameters_arc} parametersPlanView 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShape
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {internal_lane_height} parametersLaneHeight
     * @param {number} s 
     * @param {number} t 
     * @returns {internal_pose3d} 
     */
    #getPoseArc(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, parametersLaneHeight, s, t) {
        return {
            x: this.#xArc(parametersPlanView, s, t),
            y: this.#yArc(parametersPlanView, s, t),
            z: this.#z(parametersElevation, parametersShape, parametersSuperElevation, parametersLaneHeight, s, t),
            heading: this.#hdgArc(parametersPlanView, s),
            pitch: this.#pitch(parametersElevation, parametersShape, parametersSuperElevation, s, t),
            roll: this.#roll(parametersSuperElevation, parametersShape, s, t)
        };
    }

    /**
     * @param {internal_geometry_parameters_spiral} parametersPlanView 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShape
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {internal_lane_height} parametersLaneHeight
     * @param {number} s 
     * @param {number} t 
     * @returns {internal_pose3d} 
     */
    #getPoseSpiral(parametersPlanView, parametersElevation, parametersShape, parametersSuperElevation, parametersLaneHeight, s, t) {
        return {
            x: this.#xSpiral(parametersPlanView, s, t),
            y: this.#ySpiral(parametersPlanView, s, t),
            z: this.#z(parametersElevation, parametersShape, parametersSuperElevation, parametersLaneHeight, s, t),
            heading: this.#hdgSpiral(parametersPlanView, s),
            pitch: this.#pitch(parametersElevation, parametersShape, parametersSuperElevation, s, t),
            roll: this.#roll(parametersSuperElevation, parametersShape, s, t)
        };
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @returns {t_road_lanes_laneSection}
     */
    #getLaneSection(road, s) {
        const laneSection = road.lanes.laneSection.findLast(laneSection => s >= laneSection.attributes.s);

        if (laneSection === undefined)
            console.log("For the road with ID " + road.attributes.id + " there is no laneSection for the given length of the reference line");
    
        return laneSection;
    }

    /**
     * @param {t_road_lanes_laneSection} laneSection 
     * @param {number} laneId
     * @returns {t_road_lanes_laneSection_left_lane | t_road_lanes_laneSection_center_lane | t_road_lanes_laneSection_right_lane}
     */
    #getLane(laneSection, laneId) {
        let lane;

        if (laneId < 0)
            lane = laneSection.right.lane.find(lane => lane.attributes.id == laneId);
        else if (laneId > 0)
            lane = laneSection.left.lane.find(lane => lane.attributes.id == laneId);
        else
            lane = laneSection.center.lane[0];

        return lane;
    }

    /**
     * @param {string} id 
     * @returns {t_road | undefined}
     */
    #getRoadByRoadId(id) {
        const road = this.#roads.find(road => road.attributes.id == id);
        
        return road;
    }

    /**
     * @param {string} junctionId 
     * @returns {t_road[]}
     */
    #getRoadByJunctionId(junctionId) {
        const roads = this.#roads.filter(road => road.attributes.junction == junctionId);

        return roads;
    }

    /**
     * @param {string} objectId 
     * @returns {t_road | undefined}
     */
    #getRoadByObjectId(objectId) {
        let correspondingRoad;

        for (let road of this.#roads) {
            if (road.objects !== undefined) {
                if (road.objects.object.find(obj => obj.attributes.id == objectId) !== undefined) {
                    correspondingRoad = road;
                    break;
                }
            }
            else
                continue;
        }

        return correspondingRoad;
    }

    /**
     * @param {string} signalId 
     * @returns {t_road | undefined}
     */
    #getRoadBySignalId(signalId) {
        let correspondingRoad;

        for (let road of this.#roads) {
            if (road.signals !== undefined) {
                if (road.signals.signal.find(signal => signal.attributes.id == signalId) !== undefined) {
                    correspondingRoad = road;
                    break;
                }
            }
            else
                continue;
        }

        return correspondingRoad;
    }

    /**
     * 
     * @param {string} id 
     * @returns {t_junction | undefined}
     */
    #getJunction(id) {
        const junction = this.#junctions.find(junction => junction.attributes.id === id);

        return junction;
    }

    /**
     * @param {t_road} road 
     * @param {number} s
     * @returns {t_road_elevationProfile_elevation_attributes} 
     */
    #getElevationProfileParameters(road, s) {
        if (road.elevationProfile === undefined) {
            return {
                s: s,
                a: 0,
                b: 0,
                c: 0,
                d: 0,
            };
        }
        
        const elevation = road.elevationProfile.elevation.findLast(elevation => s >= elevation.attributes.s);

        return elevation.attributes;
    }

    /**
     * @param {t_road_lanes_laneSection_left_lane | t_road_lanes_laneSection_center_lane | t_road_lanes_laneSection_right_lane} lane 
     * @param {number} sOffset
     * @returns {t_road_lanes_laneSection_lr_lane_width_attributes}
     */
    #getLaneWidthParameters(lane, sOffset) {
        if (lane.width.length == 0) {
            return {
                sOffset: sOffset,
                a: 0,
                b: 0,
                c: 0,
                d: 0
            };
        }

        const laneWidth = lane.width.findLast(width => sOffset >= width.attributes.sOffset);

        return laneWidth.attributes;
    }

    /**
     * 
     * @param {t_road} road 
     * @param {number} s 
     * @returns {t_road_lateralProfile_superelevation_attributes}
     */
    #getSuperElevationParameters(road, s) {
        let parameters = {
            s: s,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        };

        if (road.lateralProfile !== undefined) {
            if (road.lateralProfile.superelevation.length > 0) {
                const superElevation = road.lateralProfile.superelevation.findLast(elevation => s >= elevation.attributes.s);
                parameters = superElevation.attributes;
            }
        }

        return parameters;
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} t
     * @returns {t_road_lateralProfile_shape_attributes[]}
     */
    #getLateralShapeParameters(road, s, t = 0) {
        if (road.lateralProfile === undefined) 
            return [];
        
        if (road.lateralProfile.shape.length == 0)
            return [];

        const idxLast = road.lateralProfile.shape.findLastIndex(shape => shape.attributes.s <= s);
        const idxNext = road.lateralProfile.shape.findIndex(shape => shape.attributes.s > s);
        
        // get all shape elements with the same s
        const shapesGroup = road.lateralProfile.shape.filter(shape => shape.attributes.s == road.lateralProfile.shape[idxLast].attributes.s);
        const shapesGroupNext = road.lateralProfile.shape.filter(shape => shape.attributes.s == road.lateralProfile.shape[idxNext].attributes.s);

        let idxShape, idxShapeNext;
        if (t < 0) {
            idxShape = shapesGroup.findIndex(shape => shape.attributes.t > t);
            idxShapeNext = shapesGroupNext.findIndex(shape => shape.attributes.t > t);
        }
        else {
            idxShape = shapesGroup.findLastIndex(shape => shape.attributes.t < t);
            idxShapeNext = shapesGroupNext.findLastIndex(shape => shape.attributes.t < t);
        }

        return [road.lateralProfile.shape[idxShape].attributes, road.lateralProfile.shape[idxShapeNext].attributes];
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} t 
     * @returns {internal_lane_height}
     */
    #getLaneHeightParameters(road, s, t = 0) {
        const lane = this.#getLaneByT(road, s, t);
        let laneHeightAttributes;

        if (lane.height.length > 0) {
            const idxHeightEl = lane.height.findLastIndex(height => s >= height.attributes.sOffset);
            laneHeightAttributes = lane.height[idxHeightEl].attributes;
        }
        else {
            laneHeightAttributes = {
                sOffset: 0,
                inner: 0,
                outer: 0
            };
        }

        

        const tValues = this.#getLaneBoundaries(road, s, lane.attributes.id);

        return {
            laneHeightAttributes: laneHeightAttributes,
            tInner: tValues.inner,
            tOuter: tValues.outer
        };
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} laneId 
     * @returns 
     */
    #getLaneBoundaries(road, s, laneId) {
        const tLaneBoundaries = this.#getLaneBoundaryTValues(road, s);
        const laneSection = this.#getLaneSection(road, s);
        let laneIds = this.#getAvailableLaneIds(laneSection);
        laneIds.splice(laneIds.indexOf(0), 1); // removes the 0, for easier handling
        
        if (laneId < 0)
            return {
                outer: tLaneBoundaries[laneIds.indexOf(laneId)],
                inner: tLaneBoundaries[laneIds.indexOf(laneId) + 1]
            };
        else
            return {
                inner: tLaneBoundaries[laneIds.indexOf(laneId)],
                outer: tLaneBoundaries[laneIds.indexOf(laneId) + 1]
            };
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} t 
     * @returns {t_road_lanes_laneSection_left_lane | t_road_lanes_laneSection_right_lane}
     */
    #getLaneByT(road, s, t) {
        const laneId = this.#getLaneIdByT(road, s, t);
        const laneSection = this.#getLaneSection(road, s);

        if (laneId > 0) {
            return laneSection.left.lane.find(lane => lane.attributes.id == laneId);
        }
        else {
            return laneSection.right.lane.find(lane => lane.attributes.id == laneId);
        }
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #getLaneIdByT(road, s, t) {
        const laneSection = this.#getLaneSection(road, s);
        let laneIds = this.#getAvailableLaneIds(laneSection);
        laneIds.splice(laneIds.indexOf(0), 1); // removes the 0, for easier handling
        const tLaneBoundaries = this.#getLaneBoundaryTValues(road, s);

        let idxLaneId = Math.min(tLaneBoundaries.findLastIndex(tLb => util.roundToDigit(t, 3) >= util.roundToDigit(tLb, 3)), laneIds.length - 1);

        return laneIds[idxLaneId];
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @returns {number[]}
     */
    #getLaneBoundaryTValues(road, s) {
        let tValues = [];

        const laneSection = this.#getLaneSection(road, s);
        const sOffset = s - laneSection.attributes.s;
        const parametersLaneOffset = this.#getLaneOffsetParameters(road, s);
        const tOffset = this.#tLaneOffset(parametersLaneOffset, s);

        const laneIds = this.#getAvailableLaneIds(laneSection);
        const laneIdMin = Math.min(...laneIds);
        const laneIdMax = Math.max(...laneIds);

        let lane, laneWidthParameters;

        let width = 0;
        // get right-hand boundary
        if (laneIdMin < 0) {
            for (let id = -1; id >= laneIdMin; id--) {
                lane = this.#getLane(laneSection, id);
                laneWidthParameters = this.#getLaneWidthParameters(lane, sOffset);
                width -= this.#width(laneWidthParameters, sOffset);
                tValues.push(width);
            }
        }

        tValues.push(0); // center-line = lh boundary of -1 resp. rh boundary of 1

        width = 0;
        // get left-hand boundary
        if (laneIdMax > 0) {
            for (let id = 1; id <= laneIdMax; id++) {
                lane = this.#getLane(laneSection, id);
                laneWidthParameters = this.#getLaneWidthParameters(lane, sOffset);
                width += this.#width(laneWidthParameters, sOffset);
                tValues.push(width);
            }
        }

        tValues = tValues.map(t => t + tOffset);
        tValues.sort((a, b) => a - b);

        return tValues;
    }

    /**
     * @param {string} roadId
     * @param {laneId} laneId
     * @param {t_road_lanes_laneSection_lcr_lane_roadMark} roadMark 
     * @param {number} s 
     * @param {string} baseId
     * @param {internal_roadMark[]}
     */
    #getRoadMarkPoints(roadId, laneId, roadMark, s, sectionIdx) {
        const road = this.#getRoadByRoadId(roadId);
        if (road === undefined)
            return [];
        if (s < roadMark.attributes.sOffset)
            return [];

        const laneSection = this.#getLaneSection(road, s);

        let roadMarkPoints = []; // in case of "broken solid" etc. more than one road mark may be be returned

        if (roadMark.type === undefined) {
            roadMarkPoints.push(this.#getSimpleRoadMarkPoint(road, laneId, roadMark, s, sectionIdx));
        }
        else {
            for (let roadMarkLine of roadMark.type.line) {
                let point = this.#getComplexRoadMarkPoint(road, laneId, roadMark, roadMarkLine, s, laneSection.attributes.s, sectionIdx);
                if (point !== undefined) {
                    roadMarkPoints.push(point);
                }
            }
        }

        return roadMarkPoints;
    }

    /**
     * @param {t_road} road
     * @param {number} laneId
     * @param {t_road_lanes_laneSection_lcr_lane_roadMark} roadMark 
     * @param {number} s 
     * @param {number} sectionIdx
     * @returns {internal_roadMark}
     */
    #getSimpleRoadMarkPoint(road, laneId, roadMark, s, sectionIdx) {
        // the roadMark element always reflects the RIGHT lane boundary for lane IDs < 0 and LEFT lane boundary for lane IDs > 0
        let laneBoundaryPose;

        if (laneId > 0) {
            laneBoundaryPose = this.getLaneBoundaryPose(road.attributes.id, laneId, s, "left");
        }
        else if (laneId < 0) {
            laneBoundaryPose = this.getLaneBoundaryPose(road.attributes.id, laneId, s, "right");
        }
        else {
            laneBoundaryPose = this.getLaneBoundaryPose(road.attributes.id, laneId, s);
        }

        return {
            position: {
                x: laneBoundaryPose.x,
                y: laneBoundaryPose.y,
                z: laneBoundaryPose.z
            },
            width: roadMark.attributes.width,
            color: roadMark.attributes.color,
            height: roadMark.attributes.height !== undefined ? roadMark.attributes.height : 0,
            type: roadMark.attributes.type,
            roadId: road.attributes.id,
            sectionIdx: sectionIdx,
            laneId: laneId,
            lateralOffset: 0
        };
    }

    /**
     * @param {t_road} road
     * @param {number} laneId 
     * @param {t_road_lanes_laneSection_lcr_lane_roadMark} roadMark 
     * @param {t_road_lanes_laneSection_lcr_lane_roadMark_type_line} roadMarkLine
     * @param {number} s 
     * @param {number} sLaneSection
     * @param {number} sectionIdx
     * @returns {internal_roadMark | undefined}
     */
    #getComplexRoadMarkPoint(road, laneId, roadMark, roadMarkLine, s, sLaneSection, sectionIdx) {
        // the roadMark element always reflects the RIGHT lane boundary for lane IDs < 0 and LEFT lane boundary for lane IDs > 0
        let side = laneId > 0 ? "left" : "right";
        const t = this.#getLaneBoundaryTCoordinate(road, laneId, s, side);
        const tLine = t + roadMarkLine.attributes.tOffset;

        const lineStart = sLaneSection + roadMark.attributes.sOffset + roadMarkLine.attributes.sOffset;
        const segmentLength = roadMarkLine.attributes.length + roadMarkLine.attributes.space; // length of line + space
        const distanceToLineStart = s - lineStart;
        const positionOnSegment = distanceToLineStart % segmentLength;

        if (positionOnSegment > roadMarkLine.attributes.length) // s is located in the space between the lines 
            return undefined;

        const laneMarkingPose = this.#getPose(road, s, tLine);

        var type;

        switch (roadMark.attributes.type) {
            case "solid solid":
                type = "solid";
                break;
            case "broken broken":
                type = "broken";
                break;
            case "solid broken":
                type = roadMarkLine.attributes.space > 0 ? "broken" : "solid";
            case "broken solid":
                type = roadMarkLine.attributes.space > 0 ? "broken" : "solid";
            default:
                type = roadMark.attributes.type;
        }

        return {
            position: {
                x: laneMarkingPose.x,
                y: laneMarkingPose.y,
                z: laneMarkingPose.z
            },
            width: roadMarkLine.attributes.width !== undefined ? roadMarkLine.attributes.width : roadMark.attributes.width,
            color: roadMarkLine.attributes.color !== undefined ? roadMarkLine.attributes.color : roadMark.attributes.color,
            height: roadMark.attributes.height !== undefined ? roadMark.attributes.height : 0, 
            type: type,
            roadId: road.attributes.id,
            sectionIdx: sectionIdx,
            laneId: laneId,
            lateralOffset: roadMarkLine.attributes.tOffset
        };
    }

    /**
     * @param {t_road_lanes_laneSection} laneSection 
     * @returns {number[]} available lane IDs
     */
    #getAvailableLaneIds(laneSection) {
        let laneIds = [0];

        if (laneSection.left !== undefined) {
            for (let lane of laneSection.left.lane)
                laneIds.push(lane.attributes.id);
        }
        
        if (laneSection.right !== undefined) {
            for (let lane of laneSection.right.lane)
                laneIds.push(lane.attributes.id);
        }

        laneIds.sort((a, b) => a - b);

        return laneIds;        
    }

    /**
     * @param {t_road} road 
     * @param {number} s
     * @returns {string}
     */
    #getPlanViewModelingApproach(road, s) {
        const geometry = road.planView.geometry.findLast(geometry => s >= geometry.attributes.s);

        if (geometry.line !== undefined) {
            return "line";
        }
        else if (geometry.spiral !== undefined) {
            return "spiral";
        }
        else if (geometry.arc !== undefined) {
            return "arc";
        }
        else if (geometry.poly3 !== undefined) {
            return "poly3";
        }
        else if (geometry.paramPoly3 !== undefined) {
            return "paramPoly3";
        }
        else {
            return "unknown";
        }
    }

    /**
     * @param {t_road} road 
     * @param {number} s
     * @returns {internal_geometry_parameters_paramPoly3}
     */
    #getParamPoly3Parameters(road, s) {
        const geometry = road.planView.geometry.findLast(geometry => s >= geometry.attributes.s);
        const parameters = geometry.paramPoly3.attributes;

        return {
            init: geometry.attributes,
            parameters: parameters
        };
    }

    /**
     * Easy workaround: Interprete as paramPoly3 parameters!
     * 
     * @param {t_road} road 
     * @param {number} s
     * @returns {internal_geometry_parameters_paramPoly3}
     */
    #getLineParameters(road, s) {
        const geometry = road.planView.geometry.findLast(geometry => s >= geometry.attributes.s);
        const parameters = {
            aU: 0,
            bU: 1,
            cU: 0,
            dU: 0,
            aV: 0,
            bV: 0,
            cV: 0,
            dV: 0,
            pRange: "arcLength"
        };
        
        return {
            init: geometry.attributes,
            parameters: parameters
        };
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @returns {internal_geometry_parameters_arc}
     */
    #getArcParameters(road ,s) {
        const geometry = road.planView.geometry.findLast(geometry => s >= geometry.attributes.s);
        const parameters = geometry.arc.attributes;

        return {
            init: geometry.attributes,
            parameters: parameters
        };
    }

    /**
     * @param {t_road} road 
     * @param {number} s 
     * @returns {internal_geometry_parameters_spiral}
     */
    #getSpiralParameters(road, s) {
        const geometry = road.planView.geometry.findLast(geometry => s >= geometry.attributes.s);
        const parameters = geometry.spiral.attributes;

        return {
            init: geometry.attributes,
            parameters: parameters
        }
    }

    /**
     * 
     * @param {t_road} road 
     * @param {number} s 
     * @returns {t_road_lanes_laneOffset_attributes}
     */
    #getLaneOffsetParameters(road, s) {
        if (road.lanes.laneOffset.length == 0) {
            return {
                s: s,
                a: 0,
                b: 0,
                c: 0,
                d: 0
            };
        }

        const laneOffset = road.lanes.laneOffset.findLast(laneOffset => s >= laneOffset.attributes.s);

        return laneOffset.attributes;
    }

    /**
     * get global x-coordinate of local paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} s
     * @returns {number}
     */
    #xParamPoly3(parameters, s, t = 0) {
        const xOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.x : 0;
        const phi0 = this.#cosRotationParamPoly3(parameters);
        const phi = this.#hdgParamPoly3(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#uParamPoly3(parameters, p);
        const v = this.#vParamPoly3(parameters, p);

        return xOffset + parameters.init.x + u * Math.cos(phi0) - v * Math.sin(phi0) - t * Math.sin(phi);
    }
    
    /**
     * get global y-coordinate of local paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} s
     * @returns {number}
     */
    #yParamPoly3(parameters, s, t = 0) {
        const yOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.y : 0;
        const phi0 = this.#cosRotationParamPoly3(parameters);
        const phi = this.#hdgParamPoly3(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#uParamPoly3(parameters, p);
        const v = this.#vParamPoly3(parameters, p);

        return yOffset + parameters.init.y + u * Math.sin(phi0) + v * Math.cos(phi0) + t * Math.cos(phi);
    }

    /**
     * get global x-coordinate of local arc spline
     * 
     * @param {internal_geometry_parameters_arc} parameters 
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #xArc(parameters, s, t = 0) {
        const xOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.x : 0;
        const phi0 = parameters.init.hdg;
        const phi = this.#hdgArc(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#uArc(parameters, p);
        const v = this.#vArc(parameters, p);

        return xOffset + parameters.init.x + u * Math.cos(phi0) - v * Math.sin(phi0) - t * Math.sin(phi);
    }

    /**
     * get global y-coordinate of local arc spline
     * 
     * @param {internal_geometry_parameters_arc} parameters 
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #yArc(parameters, s, t = 0) {
        const yOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.y : 0;
        const phi0 = parameters.init.hdg;
        const phi = this.#hdgArc(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#uArc(parameters, p);
        const v = this.#vArc(parameters, p);

        return yOffset + parameters.init.y + u * Math.sin(phi0) + v * Math.cos(phi0) + t * Math.cos(phi);
    }

    /**
     * get global x-coordinate of local spiral
     * 
     * @param {internal_geometry_parameters_spiral} parameters 
     * @param {number} s 
     * @param {number} t 
     * @returns 
     */
    #xSpiral(parameters, s, t = 0) {
        const xOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.x : 0;
        const phi0 = parameters.init.hdg;
        const phi = this.#hdgSpiral(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#uSpiral(parameters, p);
        const v = this.#vSpiral(parameters, p);

        return xOffset + parameters.init.x + u * Math.cos(phi0) - v * Math.sin(phi0) - t * Math.sin(phi);
    }

    /**
     * get global y-coordinate of local spiral
     * 
     * @param {internal_geometry_parameters_arc} parameters 
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #ySpiral(parameters, s, t = 0) {
        const yOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.y : 0;
        const phi0 = parameters.init.hdg;
        const phi = this.#hdgSpiral(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#uSpiral(parameters, p);
        const v = this.#vSpiral(parameters, p);

        return yOffset + parameters.init.y + u * Math.sin(phi0) + v * Math.cos(phi0) + t * Math.cos(phi);
    } 

    /**
     * get global z-coordinate of local elevation polynom
     * 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {internal_lane_height} parametersLaneHeight
     * @param {number} s 
     * @returns {number}
     */
    #z(parametersElevation, parametersShapes, parametersSuperElevation, parametersLaneHeight, s, t = 0) {
        const zOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.z : 0;
        const zShape = parametersShapes.length > 0 ? this.#hShape(parametersShapes, s, t) : 0;
        const zElevation = this.#hElevation(parametersElevation, s);
        const zSuperElevation = this.#hSuperElevation(parametersSuperElevation, s, t);
        const zLaneHeight = this.#hLaneHeight(parametersLaneHeight, t);

        return zOffset + zShape + zElevation + zSuperElevation + zLaneHeight;
    }

    /**
     * get global heading of paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} s
     * @returns {number}
     */
    #hdgParamPoly3(parameters, s) {
        const hdgOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.hdg : 0;
        const p = s - parameters.init.s;
        
        const dUdp = parameters.parameters.bU + 2 * parameters.parameters.cU * p + 3 * parameters.parameters.dU * Math.pow(p, 2);
        const dVdp = parameters.parameters.bV + 2 * parameters.parameters.cV * p + 3 * parameters.parameters.dV * Math.pow(p, 2);
        
        let hdg = hdgOffset + parameters.init.hdg + Math.atan(dVdp/dUdp);
        return this.#capAngle(hdg);
    }

    /**
     * @param {internal_geometry_parameters_arc} parameters 
     * @param {number} s 
     * @returns 
     */
    #hdgArc(parameters, s) {
        const hdgOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.hdg : 0;
        const p = s - parameters.init.s;

        let hdg = hdgOffset + parameters.init.hdg + p * parameters.parameters.curvature;

        return this.#capAngle(hdg);
    }

    /**
     * @param {internal_geometry_parameters_spiral} parameters 
     * @param {number} s 
     * @returns 
     */
    #hdgSpiral(parameters, s) {
        const hdgOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.hdg : 0;
        const p = s - parameters.init.s;
        const curvGradient = (parameters.parameters.curvEnd - parameters.parameters.curvStart) / parameters.init.length;

        let hdg = hdgOffset + parameters.init.hdg + parameters.parameters.curvStart * p + curvGradient / 2 * Math.pow(p, 2);

        return this.#capAngle(hdg);
    }

    /**
     * get pitch value from given parameters and global s-coordinate
     * 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation 
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {number} s 
     * @returns {number}
     */
    #pitch(parametersElevation, parametersShapes, parametersSuperElevation, s, t = 0) {
        const pitchElevation = this.#pitchElevation(parametersElevation, s, t);
        const pitchShape = parametersShapes.length > 0 ? this.#pitchShape(parametersShapes, s, t) : 0;
        const pitchSuperElevation = this.#pitchSuperElevation(parametersSuperElevation, s, t);

        return pitchElevation + pitchShape + pitchSuperElevation;
    }

    /**
     * get roll value from given lateral profile and global s-coordinate
     * 
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {number} s
     * @returns {number}
     */
    #roll(parametersSuperElevation, parametersShapes, s, t = 0) {
        const ds = s - parametersSuperElevation.s;
        const rollSuperElevation = parametersSuperElevation.a + parametersSuperElevation.b * ds + parametersSuperElevation.c * Math.pow(ds, 2) + parametersSuperElevation.d * Math.pow(ds, 3);
        const rollShapes = parametersShapes.length > 0 ? this.#rollShape(parametersShapes, s, t) : 0;
        
        return rollSuperElevation + rollShapes;
    }

    /**
     * get local u-coordinate of paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} p
     * @returns {number}
     */
    #uParamPoly3(parameters, p) {
        return parameters.parameters.aU + parameters.parameters.bU * p + parameters.parameters.cU * Math.pow(p, 2) + parameters.parameters.dU * Math.pow(p, 3);
    }
    
    /**
     * get local v-coordinate of paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} p
     * @returns {number}
     */
    #vParamPoly3(parameters, p) {
        return parameters.parameters.aV + parameters.parameters.bV * p + parameters.parameters.cV * Math.pow(p, 2) + parameters.parameters.dV * Math.pow(p, 3);
    }

    /**
     * get u-coordinate of local arc COS
     * @param {internal_geometry_parameters_arc} parameters 
     * @param {number} p 
     */
    #uArc(parameters, p) {
        return Math.sin(parameters.parameters.curvature * p) / parameters.parameters.curvature;
    }

    /**
     * get v-coordinate of local arc COS
     * @param {internal_geometry_parameters_arc} parameters 
     * @param {number} p 
     */
    #vArc(parameters, p) {
        return (1 - Math.cos(parameters.parameters.curvature * p)) / parameters.parameters.curvature;
    }

    /**
     * get u-coordinate of local spiral COS
     * @param {internal_geometry_parameters_spiral} parameters 
     * @param {number} p 
     */
    #uSpiral(parameters, p) {
        const curvatureStart = parameters.parameters.curvStart;
        const curvatureP = this.#curvatureSpiral(parameters, p);
        const curvGradient = (parameters.parameters.curvEnd - parameters.parameters.curvStart) / parameters.init.length;

        // identify length of an arc from curvatore 0 to start curvature
        // and length of the arc from curvature 0 to curvature at length p
        const LStart = curvatureStart / curvGradient;
        const LP = curvatureP / curvGradient;

        // calculate local u and v of spiral from curvature 0 to start curvature 
        // and from curvature 0 to curvature at length p with easy approximation formula
        const uStart = this.#approximateSpiralU(LStart, curvatureStart, 1e-6, 50);
        let uP = this.#approximateSpiralU(LP, curvatureP, 1e-6, 50);
        const vStart = this.#approximateSpiralV(LStart, curvatureStart, 1e-6, 50);
        let vP = this.#approximateSpiralV(LP, curvatureP, 1e-6, 50);

        // as the easy approximation formula calculates the solution of a clothoide that starts 
        // with curvature zero at the origin of the COS, we need to shift the arc so that the start
        // point is aligned with the origin of the COS (subtract and rotate)
        let hdgStart = curvGradient / 2 * Math.pow(LStart, 2);
        uP -= uStart;
        vP -= vStart;
        uP = Math.cos(-hdgStart) * uP - Math.sin(-hdgStart) * vP;

        return uP;
    }

    /**
     * get v-coordinate of local spiral COS
     * @param {internal_geometry_parameters_spiral} parameters 
     * @param {number} p 
     */
    #vSpiral(parameters, p) {
        const curvatureStart = parameters.parameters.curvStart;
        const curvatureP = this.#curvatureSpiral(parameters, p);
        const curvGradient = (parameters.parameters.curvEnd - parameters.parameters.curvStart) / parameters.init.length;

        // identify length of an arc from curvatore 0 to start curvature
        // and length of the arc from curvature 0 to curvature at length p
        const LStart = curvatureStart / curvGradient;
        const LP = curvatureP / curvGradient;

        // calculate local u and v of spiral from curvature 0 to start curvature 
        // and from curvature 0 to curvature at length p with easy approximation formula
        const uStart = this.#approximateSpiralU(LStart, curvatureStart, 1e-6, 50);
        let uP = this.#approximateSpiralU(LP, curvatureP, 1e-6, 50);
        const vStart = this.#approximateSpiralV(LStart, curvatureStart, 1e-6, 50);
        let vP = this.#approximateSpiralV(LP, curvatureP, 1e-6, 50);

        // as the easy approximation formula calculates the solution of a clothoide that starts 
        // with curvature zero at the origin of the COS, we need to shift the arc so that the start
        // point is aligned with the origin of the COS (subtract and rotate)
        let hdgStart = curvGradient / 2 * Math.pow(LStart, 2);
        uP -= uStart;
        vP -= vStart;
        vP = Math.sin(-hdgStart) * uP + Math.cos(-hdgStart) * vP;

        return vP;
    }

    #approximateSpiralU(L, curvature, eps, maxIterations) {
        const T = 1/2 * L * curvature;

        let u = 0;
        let i = 0;
        while (i < maxIterations) {
            let newTaylorPolynomial = L * Math.pow(T, 2 * i) / util.factorialize(2 * i) / (4 * i + 1);
            u += i % 2 == 0 ? newTaylorPolynomial : -newTaylorPolynomial;

            if (newTaylorPolynomial < eps) break;
            i++;
        }

        return u;
    }

    #approximateSpiralV(L, curvature, eps, maxIterations) {
        const T = 1/2 * L * curvature;

        let v = 0;
        let i = 0;        
        while (i < maxIterations) {
            let newTaylorPolynomial = L * Math.pow(T, 2 * i + 1) / util.factorialize(2 * i + 1) / (4 * i + 3);
            v += i % 2 == 0 ? newTaylorPolynomial : -newTaylorPolynomial;

            if (newTaylorPolynomial < eps) break;
            i++;
        }

        return v;
    }

    /**
     * get the curvature of a spiral at a specific point
     * @param {internal_geometry_parameters_spiral} parameters 
     * @param {number} p 
     */
    #curvatureSpiral(parameters, p) {
        const curvGradient = (parameters.parameters.curvEnd - parameters.parameters.curvStart) / parameters.init.length;

        return parameters.parameters.curvStart + curvGradient * p;
    }

    /**
     * get the height from a shape profile at a specific point
     * 
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #hShape(parametersShapes, s, t = 0) {
        const dt1 = t - parametersShapes[0].t;
        const dt2 = t - parametersShapes[1].t;
        const s1 = parametersShapes[0].s;
        const s2 = parametersShapes[1].s;
        const h1 = parametersShapes[0].a + parametersShapes[0].b * dt1 + parametersShapes[0].c * Math.pow(dt1, 2) + parametersShapes[0].d * Math.pow(dt1, 3);
        const h2 = parametersShapes[1].a + parametersShapes[1].b * dt2 + parametersShapes[1].c * Math.pow(dt2, 2) + parametersShapes[1].d * Math.pow(dt2, 3);
        
        return h1 + (h2 - h1) * (s - s1) / (s2 - s1);
    }

    /**
     * get the height from the elevation profile
     * 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation
     * @param {number} s 
     * @returns {number}
     */
    #hElevation(parametersElevation, s) {
        const ds = s - parametersElevation.s;

        return parametersElevation.a + parametersElevation.b * ds + parametersElevation.c * Math.pow(ds, 2) + parametersElevation.d * Math.pow(ds, 3);
    }

    /**
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {number} s 
     * @param {number} t
     * @returns {number} 
     */
    #hSuperElevation(parametersSuperElevation, s, t = 0) {
        const ds = s - parametersSuperElevation.s;
        const roll = parametersSuperElevation.a + parametersSuperElevation.b * ds + parametersSuperElevation.c * Math.pow(ds, 2) + parametersSuperElevation.d * Math.pow(ds, 3);
        
        return Math.sin(roll) * t;
    }

    /**
     * @param {internal_lane_height} parametersLaneHeight 
     * @param {number} s 
     * @param {number} t 
     */
    #hLaneHeight(parametersLaneHeight, t) {
        return parametersLaneHeight.laneHeightAttributes.inner + (t - parametersLaneHeight.tInner)*(parametersLaneHeight.laneHeightAttributes.outer - parametersLaneHeight.laneHeightAttributes.inner)/(parametersLaneHeight.tOuter - parametersLaneHeight.tInner);
    }

    /**
     * roll = atan(dh/dt)
     * 
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #rollShape(parametersShapes, s, t = 0) {
        const dt1 = t - parametersShapes[0].t;
        const dt2 = t - parametersShapes[1].t;
        const s1 = parametersShapes[0].s;
        const s2 = parametersShapes[1].s;
        const dhdt1 = parametersShapes[0].b + 2 * parametersShapes[0].c * dt1 + 3 * parametersShapes[0].d * Math.pow(dt1, 2);
        const dhdt2 = parametersShapes[1].b + 2 * parametersShapes[1].c * dt2 + 3 * parametersShapes[1].d * Math.pow(dt2, 2);
        const dhdtInterp = dhdt1 + (dhdt2 - dhdt1) * (s - s1) / (s2 - s1);

        return Math.atan(dhdtInterp);
    }

    /**
     * get pitch value from given parameters and global s-coordinate
     * the pitch of the elevation is calculated as atan(dh/ds)
     * 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation 
     * @param {number} s 
     * @returns {number}
     */
    #pitchElevation(parametersElevation, s) {
        const ds = s - parametersElevation.s;
        const dhds = parametersElevation.b + 2 * parametersElevation.c * ds + 3 * parametersElevation.d * Math.pow(ds, 2);

        return Math.atan(dhds);
    }

    /**
     * pitch = atan(dh/ds)
     * 
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #pitchShape(parametersShapes, s, t) {
        const dt1 = t - parametersShapes[0].t;
        const dt2 = t - parametersShapes[1].t;
        const s1 = parametersShapes[0].s;
        const s2 = parametersShapes[1].s;
        const h1 = parametersShapes[0].a + parametersShapes[0].b * dt1 + parametersShapes[0].c * Math.pow(dt1, 2) + parametersShapes[0].d * Math.pow(dt1, 3);
        const h2 = parametersShapes[1].a + parametersShapes[1].b * dt2 + parametersShapes[1].c * Math.pow(dt2, 2) + parametersShapes[1].d * Math.pow(dt2, 3);
        const dhds = (h2 - h1) / (s2 - s1);

        return Math.atan(dhds);
    }

    /**
     * 
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation 
     * @param {number} s 
     * @param {number} t 
     * @returns {number}
     */
    #pitchSuperElevation(parametersSuperElevation, s, t) {
        const ds = s - parametersSuperElevation.s;
        const roll = parametersSuperElevation.a + parametersSuperElevation.b * ds + parametersSuperElevation.c * Math.pow(ds, 2) + parametersSuperElevation.d * Math.pow(ds, 3);
        const dRollds = parametersSuperElevation.b + 2 * parametersSuperElevation.c * ds + 3 * parametersSuperElevation.d * Math.pow(ds, 2);
        const dhds = dRollds * Math.cos(roll) * t;

        return Math.atan(dhds);
    }

    /**
     * get lane offset in t-direction (perpendicular to s)
     * 
     * @param {t_road_lanes_laneOffset_attributes} parameters 
     * @param {number} s 
     */
    #tLaneOffset(parameters, s) {
        const ds = s - parameters.s;

        return parameters.a + parameters.b * ds + parameters.c * Math.pow(ds, 2) + parameters.d * Math.pow(ds, 3);
    }

    /**
     * 
     * @param {t_road_lanes_laneSection_lr_lane_width_attributes} parameters 
     * @param {number} sOffset 
     */
    #width(parameters, sOffset) {
        const ds = sOffset - parameters.sOffset;
        return parameters.a + parameters.b * ds + parameters.c * Math.pow(ds, 2) + parameters.d * Math.pow(ds, 3);
    }

    /**
     * calculates the rotation of the local spline coordinate system of a paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @returns {number}
     */
    #cosRotationParamPoly3(parameters) {
        return Math.atan(parameters.parameters.bV/parameters.parameters.bU) + parameters.init.hdg;
    }

    /**
     * caps an angle to -pi...+pi
     * @param {number} angle 
     * @returns {number}
     */
    #capAngle(angle) {
        // reduce multiples of 360°
        angle = angle % (2 * Math.PI);

        // cap to -180°...180°
        if (angle > Math.PI) {
            angle = angle - 2 * Math.PI;
        }
        else if (angle < -Math.PI) {
            angle = 2 * Math.PI + angle;
        }

        return angle;
    }

    /**
     * Identify the lateral coordinate t of a lane boundary
     * 
     * @param {t_road} road 
     * @param {number} laneId 
     * @param {number} s 
     * @param {string} leftOrRight 
     * @returns {number}
     */
    #getLaneBoundaryTCoordinate(road, laneId, s, leftOrRight) {
        const laneSection = this.#getLaneSection(road, s);
        const sOffset = s - laneSection.attributes.s;
        const parametersLaneOffset = this.#getLaneOffsetParameters(road, s);
        const tOffset = this.#tLaneOffset(parametersLaneOffset, s);

        let t, lane, laneWidthParameters;
        let width = 0;
        if (laneId < 0) {
            for (let id = laneId; id <= -1; id++) {
                lane = this.#getLane(laneSection, id);
                laneWidthParameters = this.#getLaneWidthParameters(lane, sOffset);
                // if left boundary is requested, don't add the width of the requested lane
                width += (leftOrRight == "left" && id == laneId) ? 0 : this.#width(laneWidthParameters, sOffset);
            }
            t = tOffset - width;
        }
        else if (laneId > 0) {
            for (let id = laneId; id >= 1; id--) {
                lane = this.#getLane(laneSection, id);
                laneWidthParameters = this.#getLaneWidthParameters(lane, sOffset);
                // if left boundary is requested, don't add the width of the requested lane
                width += (leftOrRight == "left" && id == laneId) ? 0 : this.#width(laneWidthParameters, sOffset);
            }
            t = tOffset + width;
        }
        else 
            t = tOffset;

        return t;
    }

    /**
     * 
     * @param {internal_pose3d} pose 
     * @param {number} height 
     * @returns {internal_pose3d} 
     */
    #addHeight(pose, height) {
        const dx = height * Math.cos(pose.heading)*Math.sin(pose.pitch)*Math.cos(pose.roll) + Math.sin(pose.heading)*Math.sin(pose.roll);
        const dy = height * Math.sin(pose.heading)*Math.sin(pose.pitch)*Math.cos(pose.roll) - Math.cos(pose.heading)*Math.sin(pose.roll);
        const dz = height * Math.cos(pose.pitch)*Math.cos(pose.roll);

        pose.x += dx;
        pose.y += dy;
        pose.z += dz;

        return pose;
    }    
}