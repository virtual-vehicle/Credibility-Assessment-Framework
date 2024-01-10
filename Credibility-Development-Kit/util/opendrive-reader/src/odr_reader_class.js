
const parser = require("./parser");
const extractors = require("./extractors");

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
 * @typedef {import('../types/specification').t_road_objects_object} t_road_objects_object
 * @typedef {import('../types/specification').t_road_signals_signal} t_road_signals_signal
 * @typedef {import('../types/internal').internal_pose3d} internal_pose3d
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
     * The function will return undefined, if the road does not exist.
     * 
     * @param {string} id the road or junction ID
     * @param {string} type specifies, if id refers to a road ID or a junction ID, must be either "road", "junction",
     *                      "object", or "signal"
     * @returns {t_road[] | undefined}
     */
    getRoad(id, type) {
        if (type === "road")
            return [this.#getRoadByRoadId(id)];
        else if (type === "junction")
            return this.#getRoadByJunctionId(id);
        else if (type === "object")
            return this.#getRoadByObjectId(id);
        else if (type === "signal")
            return this.#getRoadBySignalId(id);
        else {
            console.log("type keyword " + type + " unknown");
            return undefined;
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
     * 
     * @param {string} junctionId 
     * @returns {t_junction | undefined}
     */
    getJunction(junctionId) {
        return this.#getJunction(junctionId);
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
            console.log("The road with the given ID is not defined for the given spline length");
            return undefined;
        }
       
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

        return this.#getPose(road, s, t);
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
     * 
     * @param {t_road} road 
     * @param {number} s 
     * @param {number} t 
     * @returns {internal_pose3d}
     */
    #getPose(road, s, t) {
        const parametersPlanView = this.#getPlanViewParameters(road, s);
        const parametersElevation = this.#getElevationProfileParameters(road, s);
        const parametersSuperElevation = this.#getSuperElevationParameters(road, s);
        const parametersShape = this.#getLateralShapeParameters(road, s);

        const x = this.#x(parametersPlanView, s, t);
        const y = this.#y(parametersPlanView, s, t);
        const z = this.#z(parametersElevation, parametersShape, parametersSuperElevation, s, t);
        const heading = this.#hdg(parametersPlanView, s);
        const pitch = this.#pitch(parametersElevation, parametersShape, parametersSuperElevation, s, t);
        const roll = this.#roll(parametersSuperElevation, parametersShape, s, t);

        return {
            x: x,
            y: y,
            z: z,
            heading: heading,
            pitch: pitch,
            roll: roll
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
        if (road === undefined)
            console.log("The ODR does not have a road with the given ID");

        return road;
    }

    /**
     * @param {string} junctionId 
     * @returns {t_road[]}
     */
    #getRoadByJunctionId(junctionId) {
        const roads = this.#roads.filter(road => road.attributes.junction == junctionId);
        if (roads.length == 0)
            console.log("The ODR does not have a road with the given junction");

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
        if (junction === undefined)
            console.log("The ODR does not have a junction with the given ID");

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
     * @returns {internal_geometry_parameters_paramPoly3} 
     */
    #getPlanViewParameters(road, s) {
        const geometry = road.planView.geometry.findLast(geometry => s >= geometry.attributes.s);

        return this.#getParamPoly3Parameters(geometry);
    }

    /**
     * @param {t_road_planView_geometry} geometry
     * @returns {internal_geometry_parameters_paramPoly3 | undefined}
     */
    #getParamPoly3Parameters(geometry) {
        return {
            init: geometry.attributes,
            parameters: geometry.paramPoly3.attributes
        };
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
    #x(parameters, s, t = 0) {
        const xOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.x : 0;
        const phi0 = this.#cosRotation(parameters);
        const phi = this.#hdg(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#u(parameters, p);
        const v = this.#v(parameters, p);

        return xOffset + parameters.init.x + u * Math.cos(phi0) - v * Math.sin(phi0) - t * Math.sin(phi);
    }
    
    /**
     * get global y-coordinate of local paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} s
     * @returns {number}
     */
    #y(parameters, s, t = 0) {
        const yOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.y : 0;
        const phi0 = this.#cosRotation(parameters);
        const phi = this.#hdg(parameters, s);
        const p = s - parameters.init.s;
        const u = this.#u(parameters, p);
        const v = this.#v(parameters, p);

        return yOffset + parameters.init.y + u * Math.sin(phi0) + v * Math.cos(phi0) + t * Math.cos(phi);
    }

    /**
     * get global z-coordinate of local elevation polynom
     * 
     * @param {t_road_elevationProfile_elevation_attributes} parametersElevation
     * @param {t_road_lateralProfile_shape_attributes[]} parametersShapes
     * @param {t_road_lateralProfile_superelevation_attributes} parametersSuperElevation
     * @param {number} s 
     * @returns {number}
     */
    #z(parametersElevation, parametersShapes, parametersSuperElevation, s, t = 0) {
        const zOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.z : 0;
        const zShape = parametersShapes.length > 0 ? this.#hShape(parametersShapes, s, t) : 0;
        const zElevation = this.#hElevation(parametersElevation, s);
        const zSuperElevation = this.#hSuperElevation(parametersSuperElevation, s, t);

        return zOffset + zShape + zElevation + zSuperElevation;
    }

    /**
     * get global heading of paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} s
     * @returns {number}
     */
    #hdg(parameters, s) {
        const hdgOffset = this.#header.offset !== undefined ? this.#header.offset.attributes.hdg : 0;
        const p = s - parameters.init.s;
        
        const dUdp = parameters.parameters.bU + 2 * parameters.parameters.cU * p + 3 * parameters.parameters.dU * Math.pow(p, 2);
        const dVdp = parameters.parameters.bV + 2 * parameters.parameters.cV * p + 3 * parameters.parameters.dV * Math.pow(p, 2);
        
        return hdgOffset + parameters.init.hdg + Math.atan(dVdp/dUdp);
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
    #u(parameters, p) {
        return parameters.parameters.aU + parameters.parameters.bU * p + parameters.parameters.cU * Math.pow(p, 2) + parameters.parameters.dU * Math.pow(p, 3);
    }
    
    /**
     * get local v-coordinate of paramPoly3 spline
     * 
     * @param {internal_geometry_parameters_paramPoly3} parameters 
     * @param {number} p
     * @returns {number}
     */
    #v(parameters, p) {
        return parameters.parameters.aV + parameters.parameters.bV * p + parameters.parameters.cV * Math.pow(p, 2) + parameters.parameters.dV * Math.pow(p, 3);
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
    #cosRotation(parameters) {
        return Math.atan(parameters.parameters.bV/parameters.parameters.bU) + parameters.init.hdg;
    }

    
}