/**
 * @typedef {import('./specification').t_road_planView_geometry_attributes} t_road_planView_geometry_attributes
 * @typedef {import('./specification').t_road_planView_geometry_paramPoly3_attributes} t_road_planView_geometry_paramPoly3_attributes
 * @typedef {import('./specification').t_road_planView_geometry_arc_attributes} t_road_planView_geometry_arc_attributes
 * @typedef {import('./specification').t_road_planView_geometry_spiral_attributes} t_road_planView_geometry_spiral_attributes
 * @typedef {import('./specification').t_road_lanes_laneSection_lr_lane_height_attributes} t_road_lanes_laneSection_lr_lane_height_attributes
 */

/**
 * internal_geometry_parameters_paramPoly3
 * 
 * @typedef {object} internal_geometry_parameters_paramPoly3
 * @property {t_road_planView_geometry_attributes} init
 * @property {t_road_planView_geometry_paramPoly3_attributes} parameters
 */

/**
 * internal_lane_height
 * @typedef {object} internal_lane_height
 * @property {t_road_lanes_laneSection_lr_lane_height_attributes} laneHeightAttributes
 * @property {number} tInner
 * @property {number} tOuter
 */

/**
 * internal_geometry_parameters_arc
 * 
 * @typedef {object} internal_geometry_parameters_arc
 * @property {t_road_planView_geometry_attributes} init
 * @property {t_road_planView_geometry_arc_attributes} parameters
 */

/**
 * internal_geometry_parameters_spiral
 * 
 * @typedef {object} internal_geometry_parameters_spiral
 * @property {t_road_planView_geometry_attributes} init
 * @property {t_road_planView_geometry_spiral_attributes} parameters
 */

/**
 * internal_pose3d 
 * 
 * @typedef {object} internal_pose3d
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} heading
 * @property {number} pitch
 * @property {number} roll
 */

/**
 * internal_sectionLaneIds
 * 
 * @typedef {object} internal_sectionLaneIds
 * @property {number} start
 * @property {number} end
 * @property {number[]} laneIds
 */

/**
 * internal_position
 * 
 * @typedef {object} internal_position
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * internal_roadMark
 * 
 * @typedef {object} internal_roadMark
 * @property {internal_position} position
 * @property {number} width
 * @property {string} color
 * @property {number} height
 * @property {string} type
 * @property {string} roadId
 * @property {number} sectionIdx
 * @property {number} laneId
 * @property {number} lateralOffset
 */

module.exports = {
    /**
     * @type {internal_geometry_parameters_paramPoly3}
     * @type {internal_geometry_parameters_arc}
     * @type {internal_geometry_parameters_spiral}
     * @type {internal_pose3d}
     * @type {internal_lane_height}
     * @type {internal_sectionLaneIds}
     * @type {internal_roadMark}
     */
}