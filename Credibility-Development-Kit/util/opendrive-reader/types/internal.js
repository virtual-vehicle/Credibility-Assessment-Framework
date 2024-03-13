/**
 * @typedef {import('./specification').t_road_planView_geometry_attributes} t_road_planView_geometry_attributes
 * @typedef {import('./specification').t_road_planView_geometry_paramPoly3_attributes} t_road_planView_geometry_paramPoly3_attributes
 * @typedef {import('./specification').t_road_planView_geometry_arc_attributes} t_road_planView_geometry_arc_attributes
 * @typedef {import('./specification').t_road_planView_geometry_spiral_attributes} t_road_planView_geometry_spiral_attributes
 */

/**
 * internal_geometry_parameters_paramPoly3
 * 
 * @typedef {object} internal_geometry_parameters_paramPoly3
 * @property {t_road_planView_geometry_attributes} init
 * @property {t_road_planView_geometry_paramPoly3_attributes} parameters
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

module.exports = {
    /**
     * @type {internal_geometry_parameters_paramPoly3}
     * @type {internal_geometry_parameters_arc}
     * @type {internal_geometry_parameters_spiral}
     * @type {internal_pose3d}
     */
}