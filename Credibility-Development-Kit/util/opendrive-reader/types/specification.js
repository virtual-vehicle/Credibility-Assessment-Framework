/**
 * t_header
 * 
 * @version 1.6
 * 
 * @typedef {object} t_header
 * @property {t_header_attributes} attributes
 * @property {t_header_GeoReference} [geoReference]
 * @property {t_header_Offset} [offset]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road
 * @property {t_road_attributes} attributes
 * @property {t_road_link} [link] 
 * @property {t_road_type[]} type
 * @property {t_road_planView} planView 
 * @property {t_road_elevationProfile} [elevationProfile]
 * @property {t_road_lateralProfile} [lateralProfile]
 * @property {t_road_lanes} lanes
 * @property {t_road_objects} [objects]
 * @property {t_road_signals} [signals]
 * @property {t_road_surface} [surface]
 * @property {t_road_railroad} [railroad]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_junction
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction
 * @property {t_junction_attributes} attributes
 * @property {t_junction_connection[]} connection
 * @property {t_junction_priority[]} priority
 * @property {t_junction_controller[]} controller
 * @property {t_junction_surface} [surface]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality] 
 */

/**
 * t_controller
 * 
 * @version 1.6
 * 
 * @typedef {object} t_controller
 * @property {t_controller_attributes} attributes
 * @property {t_controller_control[]} control
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality] 
 */

/**
 * t_junctionGroup
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junctionGroup
 * @property {t_junctionGroup_attributes} attributes
 * @property {t_junctionGroup_junctionReference[]} junctionReference
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality] 
 */

/**
 * t_station
 * 
 * @version 1.6
 * 
 * @typedef {object} t_station
 * @property {t_station_attributes} attributes
 * @property {t_station_platform[]} platform
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality] 
 */

/**
 * t_header_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_header_attributes
 * @property {number} revMajor
 * @property {number} revMinor
 * @property {string} [name]
 * @property {string} [version]
 * @property {string} [date]
 * @property {number} [north]
 * @property {number} [south]
 * @property {number} [east]
 * @property {number} [west]
 * @property {string} [vendor]
 */

/**
 * t_controller_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_controller_attributes
 * @property {string} id
 * @property {string} [name]
 * @property {number} [sequence]
 */

/**
 * t_junction_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_attributes
 * @property {string} [name]
 * @property {string} id
 * @property {string} [type]
 */

/**
 * t_junctionGroup_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junctionGroup_attributes
 * @property {string} [name]
 * @property {string} id
 * @property {string} type
 */

/**
 * t_road_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_attributes
 * @property {string} [name]
 * @property {number} length
 * @property {number} id
 * @property {string} junction
 * @property {string} [rule]
 */

/**
 * t_station_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_station_attributes
 * @property {string} name
 * @property {string} id
 * @property {string} [type]
 */

/**
 * t_road_link
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_link
 * @property {t_road_link_predecessorSuccessor} [predecessor]
 * @property {t_road_link_predecessorSuccessor} [successor]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_link_predecessorSuccessor
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_link_predecessorSuccessor
 * @property {t_road_link_predecessorSuccessor_attributes} attributes 
 */

/**
 * t_road_link_predecessorSuccessor_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_link_predecessorSuccessor_attributes
 * @property {string} elementId
 * @property {string} [elementType]
 * @property {string} [contactPoint]
 * @property {number} [elementS]
 * @property {string} [elementDir]
 */

/**
 * t_road_type
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_type
 * @property {t_road_type_attributes} attributes
 * @property {t_road_type_speed} [speed]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_type_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_type_attributes
 * @property {number} s 
 * @property {string} type 
 * @property {string} [country]
 */

/**
 * t_road_type_speed
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_type_speed
 * @property {t_road_type_speed_attributes} attributes
 */

/**
 * t_road_type_speed_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_type_speed_attributes
 * @property {number} max
 * @property {string} [unit]
 */

/**
 * t_road_planView
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView
 * @property {t_road_planView_geometry[]} geometry
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_planView_geometry
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry
 * @property {t_road_planView_geometry_attributes} attributes
 * @property {t_road_planView_geometry_line} [line]
 * @property {t_road_planView_geometry_spiral} [spiral]
 * @property {t_road_planView_geometry_arc} [arc]
 * @property {t_road_planView_geometry_poly3} [poly3]
 * @property {t_road_planView_geometry_paramPoly3} [paramPoly3]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_planView_geometry_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_attributes
 * @property {number} s
 * @property {number} x
 * @property {number} y
 * @property {number} hdg
 * @property {number} length
 */

/**
 * t_road_planView_geometry_line
 * 
 * "A straight line is the simplest geometry element. It contains no further attributes.""
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_line
 */

/**
 * t_road_planView_geometry_spiral
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_spiral
 * @property {t_road_planView_geometry_spiral_attributes} attributes
 */

/**
 * t_road_planView_geometry_spiral_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_planView_geometry_spiral_attributes
 * @property {number} curvStart
 * @property {number} curvEnd
 */

/**
 * t_road_planView_geometry_arc
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_arc
 * @property {t_road_planView_geometry_arc_attributes} attributes
 */

/**
 * t_road_planView_geometry_arc_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_arc_attributes
 * @property {number} curvature
 */

/**
 * t_road_planView_geometry_poly3
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_poly3
 * @property {t_road_planView_geometry_poly3_attributes} attributes
 */

/**
 * t_road_planView_geometry_poly3_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_poly3_attributes
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * t_road_planView_geometry_line_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_planView_geometry_line_attributes
 * @property 
 */

/**
 * t_road_planView_geometry_paramPoly3
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_paramPoly3
 * @property {t_road_planView_geometry_paramPoly3_attributes} attributes
 */

/**
 * t_road_planView_geometry_paramPoly3_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_planView_geometry_paramPoly3_attributes
 * @property {number} aU
 * @property {number} bU
 * @property {number} cU
 * @property {number} dU
 * @property {number} aV
 * @property {number} bV
 * @property {number} cV
 * @property {number} dV
 * @property {string} pRange
 */

/**
 * t_road_elevationProfile
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_elevationProfile
 * @property {t_road_elevationProfile_elevation[]} elevation
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_elevationProfile_elevation
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_elevationProfile_elevation
 * @property {t_road_elevationProfile_elevation_attributes} attributes
 */

/**
 * t_road_elevationProfile_elevation_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_elevationProfile_elevation_attributes
 * @property {number} s
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * t_road_lateralProfile
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lateralProfile
 * @property {t_road_lateralProfile_superelevation[]} superelevation
 * @property {t_road_lateralProfile_shape[]} shape
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lateralProfile_superelevation
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lateralProfile_superelevation
 * @property {t_road_lateralProfile_superelevation_attributes} attributes
 */

/**
 * t_road_lateralProfile_superelevation_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lateralProfile_superelevation_attributes
 * @property {number} s
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * t_road_lateralProfile_shape
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lateralProfile_shape
 * @property {t_road_lateralProfile_shape_attributes} attributes
 */

/**
 * t_road_lateralProfile_shape_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lateralProfile_shape_attributes
 * @property {number} s
 * @property {number} t
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * t_road_lanes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes
 * @property {t_road_lanes_laneOffset[]} laneOffset
 * @property {t_road_lanes_laneSection[]} laneSection
 */

/**
 * t_road_lanes_laneOffset
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneOffset
 * @property {t_road_lanes_laneOffset_attributes} attributes
 */

/**
 * t_road_lanes_laneOffset_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneOffset_attributes
 * @property {number} s
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * t_road_lanes_laneSection
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection
 * @property {t_road_lanes_laneSection_attributes} attributes
 * @property {t_road_lanes_laneSection_left} [left]
 * @property {t_road_lanes_laneSection_center} center
 * @property {t_road_lanes_laneSection_right} [right]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_attributes
 * 
 * @version
 * 
 * @typedef {object} t_road_lanes_laneSection_attributes
 * @property {number} s 
 * @property {boolean} [singleSide]
 */

/**
 * t_road_lanes_laneSection_left
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_left
 * @property {t_road_lanes_laneSection_left_lane[]} lane
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_center
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_center
 * @property {t_road_lanes_laneSection_center_lane[]} lane
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_right
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_right
 * @property {t_road_lanes_laneSection_right_lane[]} lane
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_left_lane
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_left_lane
 * @property {t_road_lanes_laneSection_left_lane_attributes} attributes
 * @property {t_road_lanes_laneSection_lcr_lane_link} [link]
 * @property {t_road_lanes_laneSection_lr_lane_border[]} border
 * @property {t_road_lanes_laneSection_lr_lane_width[]} width
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark[]} roadMark
 * @property {t_road_lanes_laneSection_lr_lane_material[]} material
 * @property {t_road_lanes_laneSection_lr_lane_speed[]} speed
 * @property {t_road_lanes_laneSection_lr_lane_access[]} access
 * @property {t_road_lanes_laneSection_lr_lane_height[]} height
 * @property {t_road_lanes_laneSection_lr_lane_rule[]} rule
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_center_lane
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_center_lane
 * @property {t_road_lanes_laneSection_center_attributes} attributes
 * @property {t_road_lanes_laneSection_lcr_lane_link} [link]
 * @property {t_road_lanes_laneSection_lr_lane_border[]} border
 * @property {t_road_lanes_laneSection_lr_lane_width[]} width
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark[]} roadMark
 * @property {t_road_lanes_laneSection_lr_lane_material[]} material
 * @property {t_road_lanes_laneSection_lr_lane_speed[]} speed
 * @property {t_road_lanes_laneSection_lr_lane_access[]} access
 * @property {t_road_lanes_laneSection_lr_lane_height[]} height
 * @property {t_road_lanes_laneSection_lr_lane_rule[]} rule
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_right_lane
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_right_lane
 * @property {t_road_lanes_laneSection_right_lane_attributes} attributes
 * @property {t_road_lanes_laneSection_lcr_lane_link} [link]
 * @property {t_road_lanes_laneSection_lr_lane_border[]} border
 * @property {t_road_lanes_laneSection_lr_lane_width[]} width
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark[]} roadMark
 * @property {t_road_lanes_laneSection_lr_lane_material[]} material
 * @property {t_road_lanes_laneSection_lr_lane_speed[]} speed
 * @property {t_road_lanes_laneSection_lr_lane_access[]} access
 * @property {t_road_lanes_laneSection_lr_lane_height[]} height
 * @property {t_road_lanes_laneSection_lr_lane_rule[]} rule
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_left_lane_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_left_lane_attributes
 * @property {number} id
 * @property {string} type 
 * @property {boolean} [level]
 */

/**
 * t_road_lanes_laneSection_center_lane_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_center_lane_attributes
 * @property {number} id
 * @property {string} type
 * @property {boolean} [level]
 */

/**
 * t_road_lanes_laneSection_right_lane_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_right_lane_attributes
 * @property {number} id
 * @property {string} type 
 * @property {boolean} [level]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_link
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_link
 * @property {t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor[]} predecessor
 * @property {t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor[]} successor
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor
 * @property {t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor_attributes
 * @property {number} id
 */

/**
 * t_road_lanes_laneSection_lr_lane_border
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_border
 * @property {t_road_lanes_laneSection_lr_lane_border_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_border_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_border_attributes
 * @property {number} sOffset
 * @property {number} a 
 * @property {number} b 
 * @property {number} c 
 * @property {number} d
 */

/**
 * t_road_lanes_laneSection_lr_lane_width
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_width
 * @property {t_road_lanes_laneSection_lr_lane_width_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_width_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_width_attributes
 * @property {number} sOffset
 * @property {number} a 
 * @property {number} b 
 * @property {number} c 
 * @property {number} d
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_attributes} attributes
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_sway[]} sway
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_type} [type]
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_explicit} [explicit]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_attributes
 * @property {number} sOffset
 * @property {string} type
 * @property {string} [weight]
 * @property {string} color
 * @property {string} [material]
 * @property {number} [width]
 * @property {string} [laneChange]
 * @property {number} [height]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_sway
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_sway
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_sway_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_sway_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_sway_attributes
 * @property {number} ds
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {number} d
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_type
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_type
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_type_attributes} attributes
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_type_line[]} line
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_type_attributes
 * 
 * @version 1.6
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_type_attributes
 * @property {string} name 
 * @property {number} width
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_type_line
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_type_line
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_type_line_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_type_line_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_type_line_attributes
 * @property {number} length
 * @property {number} space
 * @property {number} tOffset
 * @property {number} sOffset
 * @property {string} [rule]
 * @property {number} [width]
 * @property {string} [color]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_explicit
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_explicit
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line[]} line
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line
 * @property {t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line_attributes
 * @property {number} length
 * @property {number} tOffset
 * @property {number} sOffset
 * @property {string} [rule]
 * @property {string} [width]
 */

/**
 * t_road_lanes_laneSection_lr_lane_material
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_material
 * @property {t_road_lanes_laneSection_lr_lane_material_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_material_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_material_attributes
 * @property {number} sOffset
 * @property {string} [surface]
 * @property {number} friction
 * @property {number} [roughness]
 */

/**
 * t_road_lanes_laneSection_lr_lane_speed
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_speed
 * @property {t_road_lanes_laneSection_lr_lane_speed_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_speed_attributes
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_speed_attributes
 * @property {number} sOffset
 * @property {number} max
 * @property {string} [unit]
 */

/**
 * t_road_lanes_laneSection_lr_lane_access
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_access
 * @property {t_road_lanes_laneSection_lr_lane_access_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_access_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_access_attributes
 * @property {number} sOffset
 * @property {string} [rule]
 * @property {string} restriction
 */

/**
 * t_road_lanes_laneSection_lr_lane_height
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_height
 * @property {t_road_lanes_laneSection_lr_lane_height_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_height_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_height_attributes
 * @property {number} sOffset
 * @property {number} inner
 * @property {number} outer
 */

/**
 * t_road_lanes_laneSection_lr_lane_rule
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_rule
 * @property {t_road_lanes_laneSection_lr_lane_rule_attributes} attributes
 */

/**
 * t_road_lanes_laneSection_lr_lane_rule_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_lanes_laneSection_lr_lane_rule_attributes
 * @property {number} sOffset
 * @property {string} value
 */

/**
 * t_road_objects
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects
 * @property {t_road_objects_object[]} object
 * @property {t_road_objects_objectReference[]} objectReference
 * @property {t_road_objects_tunnel[]} tunnel
 * @property {t_road_objects_bridge[]} bridge
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object
 * @property {t_road_objects_object_attributes} attributes
 * @property {t_road_objects_object_repeat[]} repeat
 * @property {t_road_objects_object_outlines_outline} [outline]
 * @property {t_road_objects_object_outlines} [outlines]
 * @property {t_road_objects_object_material[]} material
 * @property {t_road_objects_object_laneValidity[]} validity
 * @property {t_road_objects_object_parkingSpace} [parkingSpace]
 * @property {t_road_objects_object_markings} [markings]
 * @property {t_road_objects_object_borders} [borders]
 */

/**
 * t_road_objects_object_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_attributes
 * @property {number} t
 * @property {number} zOffset
 * @property {string} [type]
 * @property {number} [validLength]
 * @property {string} [orientation]
 * @property {string} [subtype]
 * @property {string} [dynamic]
 * @property {number} [hdg]
 * @property {string} [name]
 * @property {number} [pitch]
 * @property {string} id
 * @property {number} roll
 * @property {number} height
 * @property {number} [s]
 * @property {number} length
 * @property {number} width
 * @property {number} radius
 */

/**
 * t_road_objects_object_repeat
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_repeat
 * @property {t_road_objects_object_repeat_attributes} attributes
 */

/**
 * t_road_objects_object_repeat_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_repeat_attributes
 * @property {number} s
 * @property {number} length
 * @property {number} distance
 * @property {number} tStart
 * @property {number} tEnd
 * @property {number} heightStart
 * @property {number} heightEnd
 * @property {number} zOffsetStart
 * @property {number} zOffsetEnd
 * @property {number} [widthStart]
 * @property {number} [widthEnd]
 * @property {number} [lengthStart]
 * @property {number} [lengthEnd]
 * @property {number} [radiusStart]
 * @property {number} [radiusEnd]
 */

/**
 * t_road_objects_object_outlines_outline
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines_outline
 * @property {t_road_objects_object_outlines_outline_attributes} attributes
 * @property {t_road_objects_object_outlines_outline_cornerRoad} [cornerRoad]
 * @property {t_road_objects_object_outlines_outline_cornerLocal} [cornerLocal]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object_outlines_outline_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines_outline_attributes
 * @property {number} [id]
 * @property {string} [fillType]
 * @property {boolean} [outer]
 * @property {boolean} [closed]
 * @property {string} [laneType]
 */

/**
 * t_road_objects_object_outlines_outline_cornerLocal
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines_outline_cornerLocal
 * @property {t_road_objects_object_outlines_outline_cornerLocal_attributes} attributes
 */

/**
 * t_road_objects_object_outlines_outline_cornerLocal_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines_outline_cornerLocal_attributes
 * @property {number} u
 * @property {number} v
 * @property {number} z
 * @property {number} height
 * @property {number} [id]
 */

/**
 * t_road_objects_object_outlines_outline_cornerRoad
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines_outline_cornerRoad
 * @property {t_road_objects_object_outlines_outline_cornerRoad_attributes} attributes
 */

/**
 * t_road_objects_object_outlines_outline_cornerRoad_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines_outline_cornerRoad_attributes
 * @property {number} s
 * @property {number} t
 * @property {number} dz
 * @property {number} height
 * @property {number} [id]
 */

/**
 * t_road_objects_object_outlines
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_outlines
 * @property {t_road_objects_object_outlines_outline[]} outline
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object_material
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_material
 * @property {t_road_objects_object_material_attributes} attributes
 */

/**
 * t_road_objects_object_material_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_material_attributes
 * @property {string} [surface]
 * @property {number} [friction]
 * @property {number} [roughness]
 */

/**
 * t_road_objects_object_laneValidity
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_laneValidity
 * @property {t_road_objects_object_laneValidity_attributes} attributes
 */

/**
 * t_road_objects_object_laneValidity_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_laneValidity_attributes
 * @property {number} fromLane
 * @property {number} toLane
 */

/**
 * t_road_objects_object_parkingSpace
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_parkingSpace
 * @property {t_road_objects_object_parkingSpace_attributes} attributes
 */

/**
 * t_road_objects_object_parkingSpace_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_parkingSpace_attributes
 * @property {string} access
 * @property {string} [restrictions]
 */

/**
 * t_road_objects_object_markings
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_markings
 * @property {t_road_objects_object_markings_marking[]} marking
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object_markings_marking
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_markings_marking
 * @property {t_road_objects_object_markings_marking_attributes} attributes
 * @property {t_road_objects_object_markings_marking_cornerReference} cornerReference
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object_markings_marking_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_markings_marking_attributes
 * @property {string} side
 * @property {string} [weight]
 * @property {number} [width]
 * @property {string} color
 * @property {number} [zOffset]
 * @property {number} spaceLength
 * @property {number} lineLength
 * @property {number} startOffset
 * @property {number} stopOffset
 */

/**
 * t_road_objects_object_markings_marking_cornerReference
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_markings_marking_cornerReference
 * @property {t_road_objects_object_markings_marking_cornerReference_attributes} attributes
 */

/**
 * t_road_objects_object_markings_marking_cornerReference_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_markings_marking_cornerReference_attributes
 * @property {number} id
 */

/**
 * t_road_objects_object_borders
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_borders
 * @property {t_road_objects_object_borders_border[]} border
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object_borders_border
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_borders_border
 * @property {t_road_objects_object_borders_border_attributes} attributes
 * @property {t_road_objects_object_markings_marking_cornerReference} cornerReference
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_object_borders_border_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_object_borders_border_attributes
 * @property {number} width
 * @property {string} type
 * @property {number} outlineId
 * @property {boolean} [useCompleteOutline]
 */

/**
 * t_road_objects_objectReference
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_objectReference
 * @property {t_road_objects_objectReference_attributes} attributes
 * @property {t_road_objects_object_laneValidity[]} validity
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_objectReference_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_objectReference_attributes
 * @property {number} s
 * @property {number} t
 * @property {string} id
 * @property {number} [zOffset]
 * @property {number} [validLength]
 * @property {string} orientation
 */

/**
 * t_road_objects_tunnel
 * 
 * @version 1.6
 * 
 * @typedef {object}
 * @property {t_road_objects_tunnel_attributes} attributes
 * @property {t_road_objects_object_laneValidity[]} validity
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_tunnel_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_tunnel_attributes
 * @property {number} s
 * @property {number} length
 * @property {string} [name]
 * @property {string} id
 * @property {string} type
 * @property {number} [lighting]
 * @property {number} [daylight]
 */

/**
 * t_road_objects_bridge
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_bridge
 * @property {t_road_objects_bridge_attributes} attributes
 * @property {t_road_objects_object_laneValidity[]} validity
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_objects_bridge_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_objects_bridge_attributes
 * @property {number} s
 * @property {number} length
 * @property {string} [name]
 * @property {string} id
 * @property {string} type
 */

/**
 * t_road_signals
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals
 * @property {t_road_signals_signal[]} signal
 * @property {t_road_signals_signalReference[]} signalReference
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_signals_signal
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal
 * @property {t_road_signals_signal_attributes} attributes
 * @property {t_road_objects_object_laneValidity[]} validity
 * @property {t_road_signals_signal_dependency[]} dependency
 * @property {t_road_signals_signal_reference[]} reference
 * @property {t_road_signals_signal_positionRoad} [positionRoad]
 * @property {t_road_signals_signal_positionInertial} [positionInertial]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_signals_signal_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_attributes
 * @property {number} s
 * @property {number} t
 * @property {string} id
 * @property {string} [name]
 * @property {string} dynamic
 * @property {string} orientation
 * @property {number} zOffset
 * @property {string} [country]
 * @property {string} [countryRevision]
 * @property {string} type
 * @property {string} subtype
 * @property {number} [value]
 * @property {string} [unit]
 * @property {number} [height]
 * @property {number} [width]
 * @property {string} [text]
 * @property {number} [hOffset]
 * @property {number} [pitch]
 * @property {number} [roll]
 */

/**
 * t_road_signals_signal_dependency
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_dependency
 * @property {t_road_signals_signal_dependency_attributes} attributes
 */

/**
 * t_road_signals_signal_dependency_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_dependency_attributes
 * @property {string} id
 * @property {string} [type]
 */

/**
 * t_road_signals_signal_reference
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_reference
 * @property {t_road_signals_signal_reference_attributes} attributes
 */

/**
 * t_road_signals_signal_reference_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_reference_attributes
 * @property {string} elementType
 * @property {string} elementId
 * @property {string} [type]
 */

/**
 * t_road_signals_signal_positionRoad
 * 
 * @version 1.6 
 * 
 * @typedef {object} t_road_signals_signal_positionRoad
 * @property {t_road_signals_signal_positionRoad_attributes} attributes
 */

/**
 * t_road_signals_signal_positionRoad_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_positionRoad_attributes
 * @property {string} roadId
 * @property {number} s
 * @property {number} t
 * @property {number} zOffset
 * @property {number} hOffset
 * @property {number} [pitch]
 * @property {number} [roll]
 */

/**
 * t_road_signals_signal_positionInertial
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_positionInertial
 * @property {t_road_signals_signal_positionInertial_attributes} attributes
 */

/**
 * t_road_signals_signal_positionInertial_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signal_positionInertial_attributes
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} hdg
 * @property {number} [pitch]
 * @property {number} [roll]
 */

/**
 * t_road_signals_signalReference
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signalReference
 * @property {t_road_signals_signalReference_attributes} attributes
 * @property {t_road_objects_object_laneValidity[]} validity
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_signals_signalReference_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_signals_signalReference_attributes
 * @property {number} s
 * @property {number} t
 * @property {string} id
 * @property {string} orientation
 */

/**
 * t_road_surface
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_surface
 * @property {t_road_surface_CRG[]} CRG
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_surface_CRG
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_surface_CRG
 * @property {t_road_surface_CRG_attributes} attributes
 */

/**
 * t_road_surface_CRG_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_surface_CRG_attributes
 * @property {string} file
 * @property {number} sStart
 * @property {number} sEnd
 * @property {string} orientation
 * @property {string} mode
 * @property {string} [purpose]
 * @property {number} [sOffset]
 * @property {number} [tOffset]
 * @property {number} [zOffset]
 * @property {number} [zScale]
 * @property {number} [hOffset]
 */

/**
 * t_road_railroad
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad
 * @property {t_road_railroad_switch} switch
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_railroad_switch
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch
 * @property {t_road_railroad_switch_attributes} attributes
 * @property {t_road_railroad_switch_mainTrack} mainTrack
 * @property {t_road_railroad_switch_sideTrack} sideTrack
 * @property {t_road_railroad_switch_partner} [partner]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_railroad_switch_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_attributes
 * @property {string} name
 * @property {string} id
 * @property {string} position
 */

/**
 * t_road_railroad_switch_mainTrack
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_mainTrack
 * @property {t_road_railroad_switch_mainTrack_attributes} attributes 
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_railroad_switch_mainTrack_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_mainTrack_attributes
 * @property {string} id
 * @property {number} s
 * @property {string} dir
 */

/**
 * t_road_railroad_switch_sideTrack
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_sideTrack
 * @property {t_road_railroad_switch_sideTrack_attributes} attributes 
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_railroad_switch_sideTrack_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_sideTrack_attributes
 * @property {string} id
 * @property {number} s
 * @property {string} dir
 */

/**
 * t_road_railroad_switch_partner
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_partner
 * @property {t_road_railroad_switch_partner_attributes} attributes 
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_road_railroad_switch_partner_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_road_railroad_switch_partner_attributes
 * @property {string} [name]
 * @property {string} id
 */

/**
 * t_junction_connection
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_connection
 * @property {t_junction_connection_attributes} attributes 
 * @property {t_junction_predecessorSuccessor} [predecessor]
 * @property {t_junction_predecessorSuccessor} [successor]
 * @property {t_junction_connection_laneLink[]} laneLink
 */

/**
 * t_junction_connection_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_connection_attributes
 * @property {string} id
 * @property {string} [type]
 * @property {string} [incomingRoad]
 * @property {string} [connectingRoad]
 * @property {string} [contactPoint]
 */

/**
 * t_junction_predecessorSuccessor
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_predecessorSuccessor
 * @property {t_junction_predecessorSuccessor_attributes} attributes 
 */

/**
 * t_junction_predecessorSuccessor_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_predecessorSuccessor_attributes
 * @property {string} elementType
 * @property {string} elementId
 * @property {number} elementS
 * @property {string} elementDir
 */

/**
 * t_junction_connection_laneLink
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_connection_laneLink
 * @property {t_junction_connection_laneLink_attributes} attributes 
 */

/**
 * t_junction_connection_laneLink_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_connection_laneLink_attributes
 * @property {number} from
 * @property {number} to
 */

/**
 * t_junction_priority
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_priority
 * @property {t_junction_priority_attributes} attributes
 */

/**
 * t_junction_priority_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_priority_attributes
 * @property {string} [high]
 * @property {string} [low]
 */

/**
 * t_junction_controller
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_controller
 * @property {t_junction_controller_attributes} attributes 
 */

/**
 * t_junction_controller_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_controller_attributes
 * @property {string} id
 * @property {string} [type]
 * @property {number} [sequence]
 */

/**
 * t_junction_surface
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_surface
 * @property {t_junction_surface_CRG} CRG
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_junction_surface_CRG
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_surface_CRG
 * @property {t_junction_surface_CRG_attributes} attributes 
 */

/**
 * t_junction_surface_CRG_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junction_surface_CRG_attributes
 * @property {string} file
 * @property {string} mode
 * @property {string} [purpose]
 * @property {number} [zOffset]
 * @property {number} [zScale]
 */

/**
 * t_controller_control
 * 
 * @version 1.6
 * 
 * @typedef {object} t_controller_control
 * @property {t_controller_control_attributes} attributes 
 */

/**
 * t_controller_control_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_controller_control_attributes
 * @property {string} signalId
 * @property {string} [type]
 */

/**
 * t_junctionGroup_junctionReference
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junctionGroup_junctionReference
 * @property {t_junctionGroup_junctionReference_attributes} attributes 
 */

/**
 * t_junctionGroup_junctionReference_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_junctionGroup_junctionReference_attributes
 * @property {string} junction
 */

/**
 * t_station_platform
 * 
 * @version 1.6
 * 
 * @typedef {object} t_station_platform
 * @property {t_station_platform_attributes} attributes
 * @property {t_station_platform_segment[]} segment
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality]
 */

/**
 * t_station_platform_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_station_platform_attributes
 * @property {string} [name] 
 * @property {string} id 
 */

/**
 * t_station_platform_segment
 * 
 * @version 1.6
 * 
 * @typedef {object} t_station_platform_segment
 * @property {t_station_platform_segment_attributes} attributes 
 */

/**
 * t_station_platform_segment_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_station_platform_segment_attributes
 * @property {string} roadId
 * @property {number} sStart
 * @property {number} sEnd
 * @property {string} side
 */

/**
 * t_header_GeoReference
 * 
 * @version 1.6
 * 
 * @typedef {object} t_header_GeoReference
 * @property {string} [geoReference]
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality] 
 */

/**
 * t_header_Offset
 * 
 * @version 1.6
 * 
 * @typedef {object} t_header_Offset
 * @property {t_header_Offset_attributes} attributes
 * @property {t_include[]} include
 * @property {t_userData[]} userData
 * @property {t_dataQuality} [dataQuality] 
 */

/**
 * t_header_Offset_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_header_Offset_attributes
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} hdg
 */

/**
 * t_include
 * 
 * @version 1.6
 * 
 * @typedef {object} t_include
 * @property {t_include_attributes} attributes
 */

/**
 * t_include_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_include_attributes
 * @property {string} file
 */

/**
 * t_userData
 * 
 * @version 1.6
 * 
 * @typedef {object} t_userData
 * @property {t_userData_attributes} attributes
 * @property {object} content 
 */

/**
 * t_userData_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_userData_attributes
 * @property {string} code 
 * @property {string} [value] 
 */

/**
 * t_dataQuality
 * 
 * @version 1.6
 * 
 * @typedef {object} t_dataQuality
 * @property {t_dataQuality_Error} [error]
 * @property {t_dataQuality_RawData} [rawData]
 */

/**
 * t_dataQuality_Error
 * 
 * @version 1.6
 * 
 * @typedef {object} t_dataQuality_Error
 * @property {t_dataQuality_Error_attributes} attributes
 */

/**
 * t_dataQuality_Error_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_dataQuality_Error_attributes
 * @property {number} xyAbsolute
 * @property {number} zAbsolute
 * @property {number} xyRelative
 * @property {number} zRelative
 */

/**
 * t_dataQuality_RawData
 * 
 * @version 1.6
 * 
 * @typedef {object} t_dataQuality_RawData
 * @property {t_dataQuality_RawData_attributes} attributes
 */

/**
 * t_dataQuality_RawData_attributes
 * 
 * @version 1.6
 * 
 * @typedef {object} t_dataQuality_RawData_attributes
 * @property {string} date
 * @property {string} source
 * @property {string} [sourceComment]
 * @property {string} postProcessing
 * @property {string} [postProcessingComment]
 */

module.exports = {
    /**
     * @type {t_header}
     * @type {t_road}
     * @type {t_junction}
     * @type {t_controller}
     * @type {t_junctionGroup}
     * @type {t_station}
     * @type {t_header_attributes}
     * @type {t_controller_attributes}
     * @type {t_junction_attributes}
     * @type {t_junctionGroup_attributes}
     * @type {t_road_attributes}
     * @type {t_station_attributes}
     * @type {t_road_link}
     * @type {t_road_link_predecessorSuccessor}
     * @type {t_road_link_predecessorSuccessor_attributes}
     * @type {t_road_type}
     * @type {t_road_type_attributes}
     * @type {t_road_type_speed}
     * @type {t_road_type_speed_attributes}
     * @type {t_road_planView}
     * @type {t_road_planView_geometry}
     * @type {t_road_planView_geometry_attributes}
     * @type {t_road_planView_geometry_line}
     * @type {t_road_planView_geometry_spiral}
     * @type {t_road_planView_geometry_spiral_attributes}
     * @type {t_road_planView_geometry_arc}
     * @type {t_road_planView_geometry_arc_attributes}
     * @type {t_road_planView_geometry_poly3}
     * @type {t_road_planView_geometry_poly3_attributes}
     * @type {t_road_planView_geometry_paramPoly3}
     * @type {t_road_planView_geometry_paramPoly3_attributes}
     * @type {t_road_elevationProfile}
     * @type {t_road_elevationProfile_elevation}
     * @type {t_road_elevationProfile_elevation_attributes}
     * @type {t_road_lateralProfile}
     * @type {t_road_lateralProfile_superelevation}
     * @type {t_road_lateralProfile_superelevation_attributes}
     * @type {t_road_lateralProfile_shape}
     * @type {t_road_lateralProfile_shape_attributes}
     * @type {t_road_lanes}
     * @type {t_road_lanes_laneOffset}
     * @type {t_road_lanes_laneOffset_attributes}
     * @type {t_road_lanes_laneSection}
     * @type {t_road_lanes_laneSection_attributes}
     * @type {t_road_lanes_laneSection_left}
     * @type {t_road_lanes_laneSection_center}
     * @type {t_road_lanes_laneSection_right}
     * @type {t_road_lanes_laneSection_left_lane}
     * @type {t_road_lanes_laneSection_center_lane}
     * @type {t_road_lanes_laneSection_right_lane}
     * @type {t_road_lanes_laneSection_left_lane_attributes}
     * @type {t_road_lanes_laneSection_center_lane_attributes}
     * @type {t_road_lanes_laneSection_right_lane_attributes}
     * @type {t_road_lanes_laneSection_lcr_lane_link}
     * @type {t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor}
     * @type {t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_border}
     * @type {t_road_lanes_laneSection_lr_lane_border_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_width}
     * @type {t_road_lanes_laneSection_lr_lane_width_attributes}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_attributes}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_sway}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_sway_attributes}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_type}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_type_attributes}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_type_line}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_type_line_attributes}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_explicit}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line}
     * @type {t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_material}
     * @type {t_road_lanes_laneSection_lr_lane_material_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_speed}
     * @type {t_road_lanes_laneSection_lr_lane_speed_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_access}
     * @type {t_road_lanes_laneSection_lr_lane_access_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_height}
     * @type {t_road_lanes_laneSection_lr_lane_height_attributes}
     * @type {t_road_lanes_laneSection_lr_lane_rule}
     * @type {t_road_lanes_laneSection_lr_lane_rule_attributes}
     * @type {t_road_objects}
     * @type {t_road_objects_object}
     * @type {t_road_objects_object_attributes}
     * @type {t_road_objects_object_repeat}
     * @type {t_road_objects_object_repeat_attributes}
     * @type {t_road_objects_object_outlines_outline}
     * @type {t_road_objects_object_outlines_outline_attributes}
     * @type {t_road_objects_object_outlines_outline_cornerLocal}
     * @type {t_road_objects_object_outlines_outline_cornerLocal_attributes}
     * @type {t_road_objects_object_outlines_outline_cornerRoad}
     * @type {t_road_objects_object_outlines_outline_cornerRoad_attributes}
     * @type {t_road_objects_object_outlines}
     * @type {t_road_objects_object_material}
     * @type {t_road_objects_object_material_attributes}
     * @type {t_road_objects_object_laneValidity}
     * @type {t_road_objects_object_laneValidity_attributes}
     * @type {t_road_objects_object_parkingSpace}
     * @type {t_road_objects_object_parkingSpace_attributes}
     * @type {t_road_objects_object_markings}
     * @type {t_road_objects_object_markings_marking}
     * @type {t_road_objects_object_markings_marking_attributes}
     * @type {t_road_objects_object_markings_marking_cornerReference}
     * @type {t_road_objects_object_markings_marking_cornerReference_attributes}
     * @type {t_road_objects_object_borders}
     * @type {t_road_objects_object_borders_border}
     * @type {t_road_objects_object_borders_border_attributes}
     * @type {t_road_objects_objectReference}
     * @type {t_road_objects_objectReference_attributes}
     * @type {t_road_objects_tunnel}
     * @type {t_road_objects_tunnel_attributes}
     * @type {t_road_objects_bridge}
     * @type {t_road_objects_bridge_attributes}
     * @type {t_road_signals}
     * @type {t_road_signals_signal}
     * @type {t_road_signals_signal_attributes}
     * @type {t_road_signals_signal_dependency}
     * @type {t_road_signals_signal_dependency_attributes}
     * @type {t_road_signals_signal_reference}
     * @type {t_road_signals_signal_reference_attributes}
     * @type {t_road_signals_signal_positionRoad}
     * @type {t_road_signals_signal_positionRoad_attributes}
     * @type {t_road_signals_signal_positionInertial}
     * @type {t_road_signals_signal_positionInertial_attributes}
     * @type {t_road_signals_signalReference}
     * @type {t_road_signals_signalReference_attributes}
     * @type {t_road_surface}
     * @type {t_road_surface_CRG}
     * @type {t_road_surface_CRG_attributes}
     * @type {t_road_railroad}
     * @type {t_road_railroad_switch}
     * @type {t_road_railroad_switch_attributes}
     * @type {t_road_railroad_switch_mainTrack}
     * @type {t_road_railroad_switch_mainTrack_attributes}
     * @type {t_road_railroad_switch_sideTrack}
     * @type {t_road_railroad_switch_sideTrack_attributes}
     * @type {t_road_railroad_switch_partner}
     * @type {t_road_railroad_switch_partner_attributes}
     * @type {t_junction_connection}
     * @type {t_junction_connection_attributes}
     * @type {t_junction_predecessorSuccessor}
     * @type {t_junction_predecessorSuccessor_attributes}
     * @type {t_junction_connection_laneLink}
     * @type {t_junction_connection_laneLink_attributes}
     * @type {t_junction_priority}
     * @type {t_junction_priority_attributes}
     * @type {t_junction_controller}
     * @type {t_junction_controller_attributes}
     * @type {t_junction_surface}
     * @type {t_junction_surface_CRG}
     * @type {t_junction_surface_CRG_attributes}
     * @type {t_controller_control}
     * @type {t_controller_control_attributes}
     * @type {t_junctionGroup_junctionReference}
     * @type {t_junctionGroup_junctionReference_attributes}
     * @type {t_station_platform}
     * @type {t_station_platform_attributes}
     * @type {t_station_platform_segment}
     * @type {t_station_platform_segment_attributes}
     * @type {t_header_GeoReference}
     * @type {t_header_Offset}
     * @type {t_header_Offset_attributes}
     * @type {t_include}
     * @type {t_include_attributes}
     * @type {t_userData}
     * @type {t_userData_attributes}
     * @type {t_dataQuality}
     * @type {t_dataQuality_Error}
     * @type {t_dataQuality_Error_attributes}
     * @type {t_dataQuality_RawData}
     * @type {t_dataQuality_RawData_attributes}
     */
}