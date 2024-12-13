/**
 * @typedef {import('../types/specification').t_header} t_header
 * @typedef {import('../types/specification').t_road} t_road
 * @typedef {import('../types/specification').t_junction} t_junction
 * @typedef {import('../types/specification').t_controller} t_controller
 * @typedef {import('../types/specification').t_junctionGroup} t_junctionGroup
 * @typedef {import('../types/specification').t_station} t_station
 * @typedef {import('../types/specification').t_header_attributes} t_header_attributes
 * @typedef {import('../types/specification').t_controller_attributes} t_controller_attributes
 * @typedef {import('../types/specification').t_junction_attributes} t_junction_attributes
 * @typedef {import('../types/specification').t_junctionGroup_attributes} t_junctionGroup_attributes
 * @typedef {import('../types/specification').t_road_attributes} t_road_attributes
 * @typedef {import('../types/specification').t_station_attributes} t_station_attributes
 * @typedef {import('../types/specification').t_road_link} t_road_link
 * @typedef {import('../types/specification').t_road_link_predecessorSuccessor} t_road_link_predecessorSuccessor
 * @typedef {import('../types/specification').t_road_link_predecessorSuccessor_attributes} t_road_link_predecessorSuccessor_attributes
 * @typedef {import('../types/specification').t_road_type} t_road_type
 * @typedef {import('../types/specification').t_road_type_attributes} t_road_type_attributes
 * @typedef {import('../types/specification').t_road_type_speed} t_road_type_speed
 * @typedef {import('../types/specification').t_road_type_speed_attributes} t_road_type_speed_attributes
 * @typedef {import('../types/specification').t_road_planView} t_road_planView
 * @typedef {import('../types/specification').t_road_planView_geometry} t_road_planView_geometry
 * @typedef {import('../types/specification').t_road_planView_geometry_attributes} t_road_planView_geometry_attributes
 * @typedef {import('../types/specification').t_road_planView_geometry_line} t_road_planView_geometry_line
 * @typedef {import('../types/specification').t_road_planView_geometry_spiral} t_road_planView_geometry_spiral
 * @typedef {import('../types/specification').t_road_planView_geometry_spiral_attributes} t_road_planView_geometry_spiral_attributes
 * @typedef {import('../types/specification').t_road_planView_geometry_arc} t_road_planView_geometry_arc
 * @typedef {import('../types/specification').t_road_planView_geometry_arc_attributes} t_road_planView_geometry_arc_attributes
 * @typedef {import('../types/specification').t_road_planView_geometry_poly3} t_road_planView_geometry_poly3
 * @typedef {import('../types/specification').t_road_planView_geometry_poly3_attributes} t_road_planView_geometry_poly3_attributes
 * @typedef {import('../types/specification').t_road_planView_geometry_paramPoly3} t_road_planView_geometry_paramPoly3
 * @typedef {import('../types/specification').t_road_planView_geometry_paramPoly3_attributes} t_road_planView_geometry_paramPoly3_attributes
 * @typedef {import('../types/specification').t_road_elevationProfile} t_road_elevationProfile
 * @typedef {import('../types/specification').t_road_elevationProfile_elevation} t_road_elevationProfile_elevation
 * @typedef {import('../types/specification').t_road_elevationProfile_elevation_attributes} t_road_elevationProfile_elevation_attributes
 * @typedef {import('../types/specification').t_road_lateralProfile} t_road_lateralProfile
 * @typedef {import('../types/specification').t_road_lateralProfile_superelevation} t_road_lateralProfile_superelevation
 * @typedef {import('../types/specification').t_road_lateralProfile_superelevation_attributes} t_road_lateralProfile_superelevation_attributes
 * @typedef {import('../types/specification').t_road_lateralProfile_shape} t_road_lateralProfile_shape
 * @typedef {import('../types/specification').t_road_lateralProfile_shape_attributes} t_road_lateralProfile_shape_attributes
 * @typedef {import('../types/specification').t_road_lanes} t_road_lanes
 * @typedef {import('../types/specification').t_road_lanes_laneOffset} t_road_lanes_laneOffset
 * @typedef {import('../types/specification').t_road_lanes_laneOffset_attributes} t_road_lanes_laneOffset_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection} t_road_lanes_laneSection
 * @typedef {import('../types/specification').t_road_lanes_laneSection_attributes} t_road_lanes_laneSection_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_left} t_road_lanes_laneSection_left
 * @typedef {import('../types/specification').t_road_lanes_laneSection_center} t_road_lanes_laneSection_center
 * @typedef {import('../types/specification').t_road_lanes_laneSection_right} t_road_lanes_laneSection_right
 * @typedef {import('../types/specification').t_road_lanes_laneSection_left_lane} t_road_lanes_laneSection_left_lane
 * @typedef {import('../types/specification').t_road_lanes_laneSection_center_lane} t_road_lanes_laneSection_center_lane
 * @typedef {import('../types/specification').t_road_lanes_laneSection_right_lane} t_road_lanes_laneSection_right_lane
 * @typedef {import('../types/specification').t_road_lanes_laneSection_left_lane_attributes} t_road_lanes_laneSection_left_lane_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_center_lane_attributes} t_road_lanes_laneSection_center_lane_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_right_lane_attributes} t_road_lanes_laneSection_right_lane_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_link} t_road_lanes_laneSection_lcr_lane_link
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor} t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor_attributes} t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_border} t_road_lanes_laneSection_lr_lane_border
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_border_attributes} t_road_lanes_laneSection_lr_lane_border_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_width} t_road_lanes_laneSection_lr_lane_width
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_width_attributes} t_road_lanes_laneSection_lr_lane_width_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark} t_road_lanes_laneSection_lcr_lane_roadMark
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_attributes} t_road_lanes_laneSection_lcr_lane_roadMark_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_sway} t_road_lanes_laneSection_lcr_lane_roadMark_sway
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_sway_attributes} t_road_lanes_laneSection_lcr_lane_roadMark_sway_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_type} t_road_lanes_laneSection_lcr_lane_roadMark_type
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_type_attributes} t_road_lanes_laneSection_lcr_lane_roadMark_type_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_type_line} t_road_lanes_laneSection_lcr_lane_roadMark_type_line
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_type_line_attributes} t_road_lanes_laneSection_lcr_lane_roadMark_type_line_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_explicit} t_road_lanes_laneSection_lcr_lane_roadMark_explicit
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line} t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line_attributes} t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_material} t_road_lanes_laneSection_lr_lane_material
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_material_attributes} t_road_lanes_laneSection_lr_lane_material_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_speed} t_road_lanes_laneSection_lr_lane_speed
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_speed_attributes} t_road_lanes_laneSection_lr_lane_speed_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_access} t_road_lanes_laneSection_lr_lane_access
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_access_attributes} t_road_lanes_laneSection_lr_lane_access_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_height} t_road_lanes_laneSection_lr_lane_height
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_height_attributes} t_road_lanes_laneSection_lr_lane_height_attributes
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_rule} t_road_lanes_laneSection_lr_lane_rule
 * @typedef {import('../types/specification').t_road_lanes_laneSection_lr_lane_rule_attributes} t_road_lanes_laneSection_lr_lane_rule_attributes
 * @typedef {import('../types/specification').t_road_objects} t_road_objects
 * @typedef {import('../types/specification').t_road_objects_object} t_road_objects_object
 * @typedef {import('../types/specification').t_road_objects_object_attributes} t_road_objects_object_attributes
 * @typedef {import('../types/specification').t_road_objects_object_repeat} t_road_objects_object_repeat
 * @typedef {import('../types/specification').t_road_objects_object_repeat_attributes} t_road_objects_object_repeat_attributes
 * @typedef {import('../types/specification').t_road_objects_object_outlines_outline} t_road_objects_object_outlines_outline
 * @typedef {import('../types/specification').t_road_objects_object_outlines_outline_attributes} t_road_objects_object_outlines_outline_attributes
 * @typedef {import('../types/specification').t_road_objects_object_outlines_outline_cornerLocal} t_road_objects_object_outlines_outline_cornerLocal
 * @typedef {import('../types/specification').t_road_objects_object_outlines_outline_cornerLocal_attributes} t_road_objects_object_outlines_outline_cornerLocal_attributes
 * @typedef {import('../types/specification').t_road_objects_object_outlines_outline_cornerRoad} t_road_objects_object_outlines_outline_cornerRoad
 * @typedef {import('../types/specification').t_road_objects_object_outlines_outline_cornerRoad_attributes} t_road_objects_object_outlines_outline_cornerRoad_attributes
 * @typedef {import('../types/specification').t_road_objects_object_outlines} t_road_objects_object_outlines
 * @typedef {import('../types/specification').t_road_objects_object_material} t_road_objects_object_material
 * @typedef {import('../types/specification').t_road_objects_object_material_attributes} t_road_objects_object_material_attributes
 * @typedef {import('../types/specification').t_road_objects_object_laneValidity} t_road_objects_object_laneValidity
 * @typedef {import('../types/specification').t_road_objects_object_laneValidity_attributes} t_road_objects_object_laneValidity_attributes
 * @typedef {import('../types/specification').t_road_objects_object_parkingSpace} t_road_objects_object_parkingSpace
 * @typedef {import('../types/specification').t_road_objects_object_parkingSpace_attributes} t_road_objects_object_parkingSpace_attributes
 * @typedef {import('../types/specification').t_road_objects_object_markings} t_road_objects_object_markings
 * @typedef {import('../types/specification').t_road_objects_object_markings_marking} t_road_objects_object_markings_marking
 * @typedef {import('../types/specification').t_road_objects_object_markings_marking_attributes} t_road_objects_object_markings_marking_attributes
 * @typedef {import('../types/specification').t_road_objects_object_markings_marking_cornerReference} t_road_objects_object_markings_marking_cornerReference
 * @typedef {import('../types/specification').t_road_objects_object_markings_marking_cornerReference_attributes} t_road_objects_object_markings_marking_cornerReference_attributes
 * @typedef {import('../types/specification').t_road_objects_object_borders} t_road_objects_object_borders
 * @typedef {import('../types/specification').t_road_objects_object_borders_border} t_road_objects_object_borders_border
 * @typedef {import('../types/specification').t_road_objects_object_borders_border_attributes} t_road_objects_object_borders_border_attributes
 * @typedef {import('../types/specification').t_road_objects_objectReference} t_road_objects_objectReference
 * @typedef {import('../types/specification').t_road_objects_objectReference_attributes} t_road_objects_objectReference_attributes
 * @typedef {import('../types/specification').t_road_objects_tunnel} t_road_objects_tunnel
 * @typedef {import('../types/specification').t_road_objects_tunnel_attributes} t_road_objects_tunnel_attributes
 * @typedef {import('../types/specification').t_road_objects_bridge} t_road_objects_bridge
 * @typedef {import('../types/specification').t_road_objects_bridge_attributes} t_road_objects_bridge_attributes
 * @typedef {import('../types/specification').t_road_signals} t_road_signals
 * @typedef {import('../types/specification').t_road_signals_signal} t_road_signals_signal
 * @typedef {import('../types/specification').t_road_signals_signal_attributes} t_road_signals_signal_attributes
 * @typedef {import('../types/specification').t_road_signals_signal_dependency} t_road_signals_signal_dependency
 * @typedef {import('../types/specification').t_road_signals_signal_dependency_attributes} t_road_signals_signal_dependency_attributes
 * @typedef {import('../types/specification').t_road_signals_signal_reference} t_road_signals_signal_reference
 * @typedef {import('../types/specification').t_road_signals_signal_reference_attributes} t_road_signals_signal_reference_attributes
 * @typedef {import('../types/specification').t_road_signals_signal_positionRoad} t_road_signals_signal_positionRoad
 * @typedef {import('../types/specification').t_road_signals_signal_positionRoad_attributes} t_road_signals_signal_positionRoad_attributes
 * @typedef {import('../types/specification').t_road_signals_signal_positionInertial} t_road_signals_signal_positionInertial
 * @typedef {import('../types/specification').t_road_signals_signal_positionInertial_attributes} t_road_signals_signal_positionInertial_attributes
 * @typedef {import('../types/specification').t_road_signals_signalReference} t_road_signals_signalReference
 * @typedef {import('../types/specification').t_road_signals_signalReference_attributes} t_road_signals_signalReference_attributes
 * @typedef {import('../types/specification').t_road_surface} t_road_surface
 * @typedef {import('../types/specification').t_road_surface_CRG} t_road_surface_CRG
 * @typedef {import('../types/specification').t_road_surface_CRG_attributes} t_road_surface_CRG_attributes
 * @typedef {import('../types/specification').t_road_railroad} t_road_railroad
 * @typedef {import('../types/specification').t_road_railroad_switch} t_road_railroad_switch
 * @typedef {import('../types/specification').t_road_railroad_switch_attributes} t_road_railroad_switch_attributes
 * @typedef {import('../types/specification').t_road_railroad_switch_mainTrack} t_road_railroad_switch_mainTrack
 * @typedef {import('../types/specification').t_road_railroad_switch_mainTrack_attributes} t_road_railroad_switch_mainTrack_attributes
 * @typedef {import('../types/specification').t_road_railroad_switch_sideTrack} t_road_railroad_switch_sideTrack
 * @typedef {import('../types/specification').t_road_railroad_switch_sideTrack_attributes} t_road_railroad_switch_sideTrack_attributes
 * @typedef {import('../types/specification').t_road_railroad_switch_partner} t_road_railroad_switch_partner
 * @typedef {import('../types/specification').t_road_railroad_switch_partner_attributes} t_road_railroad_switch_partner_attributes
 * @typedef {import('../types/specification').t_junction_connection} t_junction_connection
 * @typedef {import('../types/specification').t_junction_connection_attributes} t_junction_connection_attributes
 * @typedef {import('../types/specification').t_junction_predecessorSuccessor} t_junction_predecessorSuccessor
 * @typedef {import('../types/specification').t_junction_predecessorSuccessor_attributes} t_junction_predecessorSuccessor_attributes
 * @typedef {import('../types/specification').t_junction_connection_laneLink} t_junction_connection_laneLink
 * @typedef {import('../types/specification').t_junction_connection_laneLink_attributes} t_junction_connection_laneLink_attributes
 * @typedef {import('../types/specification').t_junction_priority} t_junction_priority
 * @typedef {import('../types/specification').t_junction_priority_attributes} t_junction_priority_attributes
 * @typedef {import('../types/specification').t_junction_controller} t_junction_controller
 * @typedef {import('../types/specification').t_junction_controller_attributes} t_junction_controller_attributes
 * @typedef {import('../types/specification').t_junction_surface} t_junction_surface
 * @typedef {import('../types/specification').t_junction_surface_CRG} t_junction_surface_CRG
 * @typedef {import('../types/specification').t_junction_surface_CRG_attributes} t_junction_surface_CRG_attributes
 * @typedef {import('../types/specification').t_controller_control} t_controller_control
 * @typedef {import('../types/specification').t_controller_control_attributes} t_controller_control_attributes
 * @typedef {import('../types/specification').t_junctionGroup_junctionReference} t_junctionGroup_junctionReference
 * @typedef {import('../types/specification').t_junctionGroup_junctionReference_attributes} t_junctionGroup_junctionReference_attributes
 * @typedef {import('../types/specification').t_station_platform} t_station_platform
 * @typedef {import('../types/specification').t_station_platform_attributes} t_station_platform_attributes
 * @typedef {import('../types/specification').t_station_platform_segment} t_station_platform_segment
 * @typedef {import('../types/specification').t_station_platform_segment_attributes} t_station_platform_segment_attributes
 * @typedef {import('../types/specification').t_header_GeoReference} t_header_GeoReference
 * @typedef {import('../types/specification').t_header_Offset} t_header_Offset
 * @typedef {import('../types/specification').t_header_Offset_attributes} t_header_Offset_attributes
 * @typedef {import('../types/specification').t_include} t_include
 * @typedef {import('../types/specification').t_include_attributes} t_include_attributes
 * @typedef {import('../types/specification').t_userData} t_userData
 * @typedef {import('../types/specification').t_userData_attributes} t_userData_attributes
 * @typedef {import('../types/specification').t_dataQuality} t_dataQuality
 * @typedef {import('../types/specification').t_dataQuality_Error} t_dataQuality_Error
 * @typedef {import('../types/specification').t_dataQuality_Error_attributes} t_dataQuality_Error_attributes
 * @typedef {import('../types/specification').t_dataQuality_RawData} t_dataQuality_RawData
 * @typedef {import('../types/specification').t_dataQuality_RawData_attributes} t_dataQuality_RawData_attributes
 */

exports.extractHeader = extractHeader;
exports.extractRoads = extractRoads;
exports.extractJunction = extractJunction;
exports.extractJunctionGroup = extractJunctionGroup;
exports.extractController = extractController;
exports.extractStation = extractStation;
exports.extractInclude = extractInclude;
exports.extractUserData = extractUserData;
exports.extractDataQuality = extractDataQuality;

/**
 * For all top-level elements below the root element, there is an extract<ELEMENT_NAME> function that extracts these elements:
 * 
 * header, road, junction, junctionGroup, controller and station
 * 
 * For any element there is a transform<ELEMENT_NAME> function that transforms the raw parsed content to the target object
 */

/**
 * extracts the header element from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_header} transformed t_header objecty
 */
function extractHeader(root) {
    return transformHeader(root['header']);
}

/**
 * extracts all road elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_road[]} transformed t_road array
 */
function extractRoads(root) {
    return transformRoad(root['road']);
}

/**
 * extracts all junction elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_junction[]} transformed t_junction array
 */
function extractJunction(root) {
    return root['junction'] !== undefined ? transformJunction(root['junction']) : [];
}

/**
 * extracts all junctionGroup elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_junctionGroup[]} transformed t_junctionGroup array
 */
function extractJunctionGroup(root) {
    return root['junctionGroup'] !== undefined ? transformJunctionGroup(root['junction']) : [];
}

/**
 * extracts all controller elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_controller[]} transformed t_controller array
 */
function extractController(root) {
    return root['controller'] !== undefined ? transformController(root['controller']) : [];
}

/**
 * extracts all station elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_station[]} transformed t_station array
 */
function extractStation(root) {
    return root['station'] !== undefined ? transformStation(root['station']) : [];
}

/**
 * extracts all include elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_include[]} transformed t_include array
 */
function extractInclude(root) {
    return root['include'] !== undefined ? transformInclude(root['include']) : [];
}

/**
 * extracts all userData elements from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_userData[]} transformed t_userData array
 */
function extractUserData(root) {
    return root['userData'] !== undefined ? transformUserData(root['userData']) : []
}

/**
 * extracts the dataQuality element from the root element
 * 
 * @param {object} root raw-parsed parent
 * @returns {t_dataQuality[]} transformed t_dataQuality array
 */
function extractDataQuality(root) {
    return root['dataQuality'] !== undefined ? transformDataQuality(root['dataQuality']) : undefined;
}

/**
 * transforms the raw-parsed t_header object
 * 
 * @param {object} header raw-parsed t_header element
 * @returns {t_header} transformed t_header
 */
function transformHeader(header) {
    return {
        attributes: {
            revMajor: Number(header['@_revMajor']),
            revMinor: Number(header['@_revMinor']),
            name: header['@_name'],
            version: header['@_version'],
            date: header['@_date'],
            north: header['@_north'] !== undefined ? Number(header['@_north']) : undefined,
            south: header['@_south'] !== undefined ? Number(header['@_south']) : undefined,
            east: header['@_east'] !== undefined ? Number(header['@_east']) : undefined,
            west: header['@_west'] !== undefined ? Number(header['@_west']) : undefined,
            vendor: header['@_vendor']
        },
        geoReference: header['geoReference'] !== undefined ? transformHeaderGeoReference(header['geoReference']) : undefined,
        offset: header['offset'] !== undefined ? transformHeaderOffset(header['offset']) : undefined,
        include: header['include'] !== undefined ? transformInclude(header['include']) : [],
        userData: header['userData'] !== undefined ? transformUserData(header['userData']) : [],
        dataQuality: header['dataQuality'] !== undefined ? transformDataQuality(header['dataQuality']) : undefined,
    };
}

/**
 * transforms the raw-parsed t_header_GeoReference element
 * 
 * @param {object} geoReference raw-parsed t_header_GeoReference object
 * @returns {t_header_GeoReference} transformed t_header_GeoReference
 */
function transformHeaderGeoReference(geoReference) {
    let geoReferenceContent;

    // mixed content is allowed according to the spec, so for correct extraction it must be distinguish at this point
    if (typeof(geoReference == "string")) {
        // no mixed-content, geo reference is given immediately as content in geoReference element
        geoReferenceContent = geoReference;
    }
    else if (geoReference['#text'] !== undefined) {
        // mixed content -> geo reference can be found in child element "#text"
        geoReferenceContent = geoReference['#text'];
    }
    // else: geoReference given via included file -> leave geoReferenceContent undefined, as it is an optional element
    
    return {
        geoReference: geoReferenceContent,
        include: geoReference['include'] !== undefined ? transformInclude(geoReference['include']) : [],
        userData: geoReference['userData'] !== undefined ? transformUserdata(geoReference['userData']) : [],
        dataQuality: geoReference['dataQuality'] !== undefined ? transformDataQuality(geoReference['dataQuality']) : undefined
    };
}

/**
 * transforms the raw-parsed t_header_Offset element 
 * 
 * @param {object} offset raw-parsed t_header_Offset object
 * @returns {t_header_Offset} transformed t_header_Offset
 */
function transformHeaderOffset(offset) {
    return {
        attributes: {
            x: Number(offset['@_x']),
            y: Number(offset['@_y']),
            z: Number(offset['@_z']),
            hdg: Number(offset['@_hdg'])
        },
        include: offset['include'] !== undefined ? transformInclude(offset['include']) : [],
        userData: offset['userData'] !== undefined ? transformUserData(offset['userData']) : [],
        dataQuality: offset['dataQuality'] !== undefined ? transformDataQuality(offset['dataQuality']) : undefined,
    };
}

/**
 * transforms the raw-parsed t_include array
 * 
 * @param {object[]} includes raw-parsed t_include array
 * @returns {t_include[]} transformed t_include array
 */
function transformInclude(includes) {
    let transformedIncludes = [];
    for (let include of includes) {
        transformedIncludes.push({
            attributes: {
                file: include['@_file']
            }
        });
    }

    return transformedIncludes;
}

/**
 * transforms the raw-parsed t_userData array
 * @param {object} userDatas 
 * @returns {t_userData[]} transformed t_userData array
 */
function transformUserData(userDatas) {
    let transformedUserDatas = [];
    for (let userData of userDatas) {
        transformedUserDatas.push({
            attributes: {
                code: userData['@_code'],
                value: userData['@_value']
            },
            content: pruneObject(userData, ['@_code', '@_value'])
        });
    }

    return transformedUserDatas;
}

/**
 * transforms a raw-parsed t_dataQuality element
 * 
 * @param {object} dataQuality raw-parsed t_dataQuality object
 * @returns {t_dataQuality} transformed t_dataQuality
 */
function transformDataQuality(dataQuality) {
    return {
        error: dataQuality['error'] !== undefined ? transformDataQualityError(dataQuality['error']) : undefined,
        rawData: dataQuality['rawData'] !== undefined ? transformDataQualityRawData(dataQuality['rawData']) : undefined,
    };
}

/**
 * transforms a raw-parsed t_dataQuality_Error element
 * 
 * @param {object} dataQualityError raw-parsed t_dataQuality_Error object
 * @returns {t_dataQuality_Error} transformed t_dataQuality_Error
 */
function transformDataQualityError(dataQualityError) {
    return {
        attributes: {
            xyAbsolute: Number(dataQualityError['@_xyAbsolute']),
            zAbsolute: Number(dataQualityError['@_zAbsolute']),
            xyRelative: Number(dataQualityError['@_xyRelative']),
            zRelative: Number(dataQualityError['@_zRelative']),
        }
    };
}

/**
 * transforms a raw-parsed t_dataQuality_RawData element
 * 
 * @param {object} dataQualityRawData raw-parsed t_dataQuality_RawData object
 * @returns {t_dataQuality_RawData} transformed t_dataQuality_RawData
 */
function transformDataQualityRawData(dataQualityRawData) {
    return {
        attributes: {
            date: dataQualityRawData['@_date'],
            source: dataQualityRawData['@_source'],
            sourceComment: dataQualityRawData['@_sourceComment'],
            postProcessing: dataQualityRawData['@_postProcessing'],
            postProcessingComment: dataQualityRawData['@_postProcessingComment']
        }
    };
}

/**
 * transforms the raw-parsed t_road array
 * 
 * @param {object[]} roads raw-parsed t_road array
 * @returns {t_road[]} transformed t_road array
 */
function transformRoad(roads) {
    let transformedRoads = [];

    for (let road of roads) {
        transformedRoads.push({
            attributes: {
                name: road['@_name'],
                length: Number(road['@_length']),
                id: road['@_id'],
                junction: road['@_junction'],
                rule: road['@_rule']
            },
            link: road['link'] !== undefined ? transformRoadLink(road['link']) : undefined,
            type: road['type'] !== undefined ? transformRoadType(road['type']) : [],
            planView: transformRoadPlanView(road['planView']),
            elevationProfile: road['elevationProfile'] !== undefined ? transformRoadElevationProfile(road['elevationProfile']) : undefined,
            lateralProfile: road['lateralProfile'] !== undefined ? transformRoadLateralProfile(road['lateralProfile']) : undefined,
            lanes: road['lanes'] !== undefined ? transformRoadLanes(road['lanes']) : undefined,
            objects: road['objects'] !== undefined ? transformRoadObjects(road['objects']) : undefined,
            signals: road['signals'] !== undefined ? transformRoadSignals(road['signals']) : undefined,
            surface: road['surface'] !== undefined ? transformRoadSurface(road['surface']) : undefined,
            railroad: road['railroad'] !== undefined ? transformRoadRailroad(road['railroad']) : undefined,
            include: road['include'] !== undefined ? transformInclude(road['include']) : [],
            userData: road['userData'] !== undefined ? transformUserData(road['userData']) : [],
            dataQuality: road['dataQuality'] !== undefined ? transformDataQuality(road['dataQuality']) : undefined,
        });
    }

    return transformedRoads;     
}

/**
 * transforms a raw-parsed t_road_link element
 * 
 * @param {object} link raw-parsed t_road_link object
 * @returns {t_road_link} transformed t_road_link
 */
function transformRoadLink(link) {
    return {
        predecessor: link['predecessor'] !== undefined ? transformPredecessorSuccessor(link['predecessor'][0]) : undefined,
        successor: link['successor'] !== undefined ? transformPredecessorSuccessor(link['successor'][0]) : undefined,
        include: link['include'] !== undefined ? transformInclude(link['include']) : [],
        userData: link['userData'] !== undefined ? transformUserData(link['userData']) : [],
        dataQuality: link['dataQuality'] !== undefined ? transformDataQuality(link['dataQuality']) : undefined,
    };
}

/**
 * transforms a raw-parsed t_road_link_predecessorSuccessor element
 * 
 * @param {object} predecessorSuccessor raw-parsed t_road_link_predecessorSuccessor object
 * @returns {t_road_link_predecessorSuccessor} transformed t_road_link_predecessorSuccessor
 */
function transformPredecessorSuccessor(predecessorSuccessor) {
    return {
        attributes: {
            elementId: predecessorSuccessor['@_elementId'],
            elementType: predecessorSuccessor['@_elementType'],
            contactPoint: predecessorSuccessor['@_contactPoint'],
            elementS: predecessorSuccessor['@_elementS'] !== undefined ? Number(predecessorSuccessor['elementS']) : undefined,
            elementDir: predecessorSuccessor['@_elementDir']
        }
    };
}

/**
 * transforms a raw-parsed t_road_type element
 * 
 * @param {object} roadType raw-parsed road object
 * @returns {t_road_type} transformed t_road_type
 */
function transformRoadType(roadTypes) {
    let transformedRoadTypes = [];

    for (let roadType of roadTypes) {
        transformedRoadTypes.push({
            attributes: {
                s: Number(roadType['@_s']),
                type: roadType['@_type'],
                country: roadType['@_country']
            },
            speed: roadType['speed'] !== undefined ? transformRoadTypeSpeed(roadType['speed']) : undefined,
            include: roadType['include'] !== undefined ? transformInclude(roadType['include']) : [],
            userData: roadType['userData'] !== undefined ? transformUserData(roadType['userData']) : [],
            dataQuality: roadType['dataQuality'] !== undefined ? transformDataQuality(roadType['dataQuality']) : undefined,
        });
    }

    return transformedRoadTypes;
}

/**
 * transforms a raw-parsed t_road_type_speed element
 * 
 * @param {object} speed raw-parsed t_road_type_speed object
 * @returns {t_road_type_speed} transformed t_road_type_speed
 */
function transformRoadTypeSpeed(speed) {
    let max;
    if (typeof(speed['@_max']) == "string") {
        if (max == "no limit")
            max = Infinity;
    }
    else {
        max = Number(speed['@_max']);
    }

    return {
        attributes: {
            max: max,
            unit: speed['@_unit']
        }
    };
}

/**
 * transforms a raw-parsed t_road_type_speed element
 * 
 * @param {object} planView raw-parsed t_road_planView object
 * @returns {t_road_planView} transformed t_road_planView
 */
function transformRoadPlanView(planView) {
    return {
        geometry: planView['geometry'] !== undefined ? transformRoadPlanViewGeometry(planView['geometry']) : [],
        include: planView['include'] !== undefined ? transformInclude(planView['include']) : [],
        userData: planView['userData'] !== undefined ? transformUserData(planView['userData']) : [],
        dataQuality: planView['dataQuality'] !== undefined ? transformDataQuality(planView['dataQuality']) : undefined,
    };
}

/**
 * transforms a raw-parsed t_road_planView_geometry element
 * 
 * @param {object} geometries raw-parsed t_road_planView_geometry array
 * @returns {t_road_planView_geometry} transformed t_road_planView_geometry array
 */
function transformRoadPlanViewGeometry(geometries) {
    let transformedGeometries = [];

    for (let geometry of geometries) {
        transformedGeometries.push({
            attributes: {
                s: Number(geometry['@_s']),
                x: Number(geometry['@_x']),
                y: Number(geometry['@_y']),
                hdg: Number(geometry['@_hdg']),
                length: Number(geometry['@_length'])
            },
            line: geometry['line'] !== undefined ? transformRoadPlanViewGeometryLine(geometry['line'][0]) : undefined,
            spiral: geometry['spiral'] !== undefined ? transformRoadPlanViewGeometrySpiral(geometry['spiral']) : undefined,
            arc: geometry['arc'] !== undefined ? transformRoadPlanViewGeometryArc(geometry['arc']) : undefined,
            poly3: geometry['poly3'] !== undefined ? transformRoadPlanViewGeometryPoly3(geometry['poly3']) : undefined,
            paramPoly3: geometry['paramPoly3'] !== undefined ? transformRoadPlanViewGeometryParamPoly3(geometry['paramPoly3']) : undefined,
            include: geometry['include'] !== undefined ? transformInclude(geometry['include']) : [],
            userData: geometry['userData'] !== undefined ? transformUserData(geometry['userData']) : [],
            dataQuality: geometry['dataQuality'] !== undefined ? transformDataQuality(geometry['dataQuality']) : undefined,
        })
        // note: any element called "line" always is parsed as array, although the "line" in "planView" is not an array, therefore the index accessor is used
    }

    return transformedGeometries;
}

function transformRoadPlanViewGeometryLine(line) {
    return {};
}

function transformRoadPlanViewGeometrySpiral(spiral) {
    return {
        attributes: {
            curvStart: Number(spiral['@_curvStart']),
            curvEnd: Number(spiral['@_curvEnd']),
        }
    };
}

function transformRoadPlanViewGeometryArc(arc) {
    return {
        attributes: {
            curvature: Number(arc['@_curvature'])
        }
    };
}

function transformRoadPlanViewGeometryPoly3(poly3) {
    return {
        attributes: {
            a: Number(poly3['@_a']),
            b: Number(poly3['@_b']),
            c: Number(poly3['@_c']),
            d: Number(poly3['@_d']),
        }
    };
}

function transformRoadPlanViewGeometryParamPoly3(paramPoly3) {
    return {
        attributes: {
            aU: Number(paramPoly3['@_aU']),
            bU: Number(paramPoly3['@_bU']),
            cU: Number(paramPoly3['@_cU']),
            dU: Number(paramPoly3['@_dU']),
            aV: Number(paramPoly3['@_aV']),
            bV: Number(paramPoly3['@_bV']),
            cV: Number(paramPoly3['@_cV']),
            dV: Number(paramPoly3['@_dV']),
            pRange: paramPoly3['@_pRange']
        }
    };
}

function transformRoadElevationProfile(elevationProfile) {
    return {
        elevation: elevationProfile['elevation'] !== undefined ? transformRoadElevationProfileElevation(elevationProfile['elevation']) : [],
        include: elevationProfile['include'] !== undefined ? transformInclude(elevationProfile['include']) : [],
        userData: elevationProfile['userData'] !== undefined ? transformUserData(elevationProfile['userData']) : [],
        dataQuality: elevationProfile['dataQuality'] !== undefined ? transformDataQuality(elevationProfile['dataQuality']) : undefined,
    }
}

function transformRoadElevationProfileElevation(elevations) {
    let transformedElevations = [];

    for (let elevation of elevations) {
        transformedElevations.push({
            attributes: {
                s: Number(elevation['@_s']),
                a: Number(elevation['@_a']),
                b: Number(elevation['@_b']),
                c: Number(elevation['@_c']),
                d: Number(elevation['@_d'])
            }
        });
    }

    return transformedElevations;
}

function transformRoadLateralProfile(lateralProfile) {
    return {
        superelevation: lateralProfile['superelevation'] !== undefined ? transformRoadLateralProfileSuperelevation(lateralProfile['superelevation']) : [],
        shape: lateralProfile['shape'] !== undefined ? transformRoadLateralProfileShape(lateralProfile['shape']) : [],
        include: lateralProfile['include'] !== undefined ? transformInclude(lateralProfile['include']) : [],
        userData: lateralProfile['userData'] !== undefined ? transformUserData(lateralProfile['userData']) : [],
        dataQuality: lateralProfile['dataQuality'] !== undefined ? transformDataQuality(lateralProfile['dataQuality']) : undefined,
    }
}

function transformRoadLateralProfileSuperelevation(superelevations) {
    let transformedSuperelevations = [];

    for (let superelevation of superelevations) {
        transformedSuperelevations.push({
            attributes: {
                s: Number(superelevation['@_s']),
                a: Number(superelevation['@_a']),
                b: Number(superelevation['@_b']),
                c: Number(superelevation['@_c']),
                d: Number(superelevation['@_d'])
            }
        });
    }

    return transformedSuperelevations;
}

function transformRoadLateralProfileShape(shapes) {
    let transformedShapes = [];

    for (let shape of shapes) {
        transformedShapes.push({
            attributes: {
                s: Number(shape['@_s']),
                t: Number(shape['@_t']),
                a: Number(shape['@_a']),
                b: Number(shape['@_b']),
                c: Number(shape['@_c']),
                d: Number(shape['@_d'])
            }
        });
    }

    return transformedShapes;
}

function transformRoadLanes(lanes) {
    return {
        laneOffset: lanes['laneOffset'] !== undefined ? transformRoadLanesLaneOffset(lanes['laneOffset']) : [],
        laneSection: lanes['laneSection'] !== undefined ? transformRoadLanesLaneSection(lanes['laneSection']) : []
    };
}

function transformRoadLanesLaneOffset(laneOffsets) {
    let transformedLaneOffsets = [];

    for (let laneOffset of laneOffsets) {
        transformedLaneOffsets.push({
            attributes: {
                s: Number(laneOffset['@_s']),
                a: Number(laneOffset['@_a']),
                b: Number(laneOffset['@_b']),
                c: Number(laneOffset['@_c']),
                d: Number(laneOffset['@_d'])
            }
        });
    }
    
    return transformedLaneOffsets;
}

function transformRoadLanesLaneSection(laneSections) {
    let transformedLaneSections = [];

    for (let laneSection of laneSections) {
        transformedLaneSections.push({
            attributes: {
                s: Number(laneSection['@_s']),
                singleSide: laneSection['@_singleSide'] !== undefined ? Boolean(laneSection['@_singleSide']) : undefined,
            },
            left: laneSection['left'] !== undefined ? transformRoadLanesLanesSectionLeftCenterRight(laneSection['left']) : undefined,
            center: transformRoadLanesLanesSectionLeftCenterRight(laneSection['center']),
            right: laneSection['right'] !== undefined ? transformRoadLanesLanesSectionLeftCenterRight(laneSection['right']) : undefined,
            include: laneSection['include'] !== undefined ? transformInclude(laneSection['include']) : [],
            userData: laneSection['userData'] !== undefined ? transformUserData(laneSection['userData']) : [],
            dataQuality: laneSection['dataQuality'] !== undefined ? transformDataQuality(laneSection['dataQuality']) : undefined,
        })
    }

    return transformedLaneSections;
}

function transformRoadLanesLanesSectionLeftCenterRight(section) {
    return {
        lane: transformRoadLanesLaneLeftCenterRightLane(section['lane']),
        include: section['include'] !== undefined ? transformInclude(section['include']) : [],
        userData: section['userData'] !== undefined ? transformUserData(section['userData']) : [],
        dataQuality: section['dataQuality'] !== undefined ? transformDataQuality(section['dataQuality']) : undefined,
    };
}

function transformRoadLanesLaneLeftCenterRightLane(lanes) {
    let transformedLanes = [];

    for (let lane of lanes) {
        transformedLanes.push({
            attributes: {
                id: Number(lane['@_id']),
                type: lane['@_type'],
                level: lane['@_level'] !== undefined ? Boolean(lane['@_level']) : undefined
            },
            link: lane['link'] !== undefined ? transformRoadLanesLaneSectionLcrLaneLink(lane['link']) : undefined,
            border: lane['border'] !== undefined ? transformRoadLanesLaneSectionLrLaneBorder(lane['border']) : [],
            width: lane['width'] !== undefined ? transformRoadLanesLaneSectionLrLaneWidth(lane['width']) : [],
            roadMark: lane['roadMark'] !== undefined ? transformRoadLanesLaneSectionLcrRoadMark(lane['roadMark']) : [],
            material: lane['material'] !== undefined ? transformRoadLanesLaneSectionLrLaneMaterial(lane['material']) : [],
            speed: lane['speed'] !== undefined ? transformRoadLanesLaneSectionLrLaneSpeed(lane['speed']) : [],
            access: lane['access'] !== undefined ? transformRoadLanesLaneSectionLrLaneAccess(lane['access']) : [],
            height: lane['height'] !== undefined ? transformRoadLanesLaneSectionLrLaneHeight(lane['height']) : [],
            rule: lane['rule'] !== undefined ? transformRoadLanesLaneSectionLrLaneRule(lane['rule']) : [],
            include: lane['include'] !== undefined ? transformInclude(lane['include']) : [],
            userData: lane['userData'] !== undefined ? transformUserData(lane['userData']) : [],
            dataQuality: lane['dataQuality'] !== undefined ? transformDataQuality(lane['dataQuality']) : undefined,
        });
    }
    
    return transformedLanes;
}

function transformRoadLanesLaneSectionLcrLaneLink(link) {
    return {
        predecessor: link['predecessor'] !== undefined ? transformRoadLanesLaneSectionLcrLaneLinkPredecessorSuccessor(link['predecessor']) : [],
        successor: link['successor'] !== undefined ? transformRoadLanesLaneSectionLcrLaneLinkPredecessorSuccessor(link['successor']) : [],
        include: link['include'] !== undefined ? transformInclude(link['include']) : [],
        userData: link['userData'] !== undefined ? transformUserData(link['userData']) : [],
        dataQuality: link['dataQuality'] !== undefined ? transformDataQuality(link['dataQuality']) : undefined,
    }
}

function transformRoadLanesLaneSectionLcrLaneLinkPredecessorSuccessor(predecessorSuccessors) {
    let transformedPredecessorSuccessors = [];

    for (let predecessorSuccessor of predecessorSuccessors) {
        transformedPredecessorSuccessors.push({
            attributes: {
                id: Number(predecessorSuccessor['@_id'])
            }
        });
    }

    return transformedPredecessorSuccessors;
}

function transformRoadLanesLaneSectionLrLaneBorder(borders) {
    let transformedBorders = [];

    for (let border of borders) {
        transformedBorders.push({
            attributes: {
                sOffset: Number(border['@_sOffset']),
                a: Number(border['@_a']),
                b: Number(border['@_b']),
                c: Number(border['@_c']),
                d: Number(border['@_d']),
            }
        });
    }

    return transformedBorders;
}

function transformRoadLanesLaneSectionLrLaneWidth(widths) {
    let transformedWidths = [];

    for (let width of widths) {
        transformedWidths.push({
            attributes: {
                sOffset: Number(width['@_sOffset']),
                a: Number(width['@_a']),
                b: Number(width['@_b']),
                c: Number(width['@_c']),
                d: Number(width['@_d']),
            }
        });
    }

    return transformedWidths;
}

function transformRoadLanesLaneSectionLcrRoadMark(roadMarks) {
    let transformedRoadMarks = [];

    for (let roadMark of roadMarks) {        
        transformedRoadMarks.push({
            attributes: {
                sOffset: Number(roadMark['@_sOffset']),
                type: roadMark['@_type'],
                weight: roadMark['@_weight'],
                color: roadMark['@_color'],
                material: roadMark['@_material'],
                width: roadMark['@_width'] !== undefined ? Number(roadMark['@_width']) : undefined,
                laneChange: roadMark['@_laneChange'],
                height: roadMark['@_height'] !== undefined ? Number(roadMark['@_height']) : undefined,
            },
            sway: roadMark['sway'] !== undefined ? transformRoadLanesLaneSectionLcrLaneRoadMarkSway(roadMark['sway']) : [],
            type: roadMark['type'] !== undefined ? transformRoadLanesLaneSectionLcrLaneRoadMarkType(roadMark['type'][0]) : undefined,
            explicit: roadMark['explicit'] !== undefined ? transformRoadLanesLaneSectionLcrLaneRoadMarkExplicit(roadMark['explicit']) : undefined,
            include: roadMark['include'] !== undefined ? transformInclude(roadMark['include']) : [],
            userData: roadMark['userData'] !== undefined ? transformUserData(roadMark['userData']) : [],
            dataQuality: roadMark['dataQuality'] !== undefined ? transformDataQuality(roadMark['dataQuality']) : undefined,
            // note: any element called "type" always is parsed as array, although the "type" in "roadMark" is not an array, therefore the index accessor is used
        })
    }

    return transformedRoadMarks;
}

function transformRoadLanesLaneSectionLcrLaneRoadMarkSway(sways) {
    let transformedSways = [];

    for (let sway of sways) {
        transformedSways.push({
            attributes: {
                ds: Number(sway['@_ds']),
                a: Number(sway['@_a']),
                b: Number(sway['@_b']),
                c: Number(sway['@_c']),
                d: Number(sway['@_d'])
            }
        });
    }

    return transformedSways;
}

function transformRoadLanesLaneSectionLcrLaneRoadMarkType(type) {
    return {
        attributes: {
            name: type['@_name'],
            width: Number(type['@_width'])
        },
        line: type['line'] !== undefined ? transformRoadLanesLaneSectionLcrLaneRoadMarkTypeLine(type['line']) : [],
        include: type['include'] !== undefined ? transformInclude(type['include']) : [],
        userData: type['userData'] !== undefined ? transformUserData(type['userData']) : [],
        dataQuality: type['dataQuality'] !== undefined ? transformDataQuality(type['dataQuality']) : undefined,

    }
}

function transformRoadLanesLaneSectionLcrLaneRoadMarkTypeLine(lines) {
    let transformedLines = [];

    for (let line of lines) {
        transformedLines.push({
            attributes: {
                length: Number(line['@_length']),
                space: Number(line['@_space']),
                tOffset: Number(line['@_tOffset']),
                sOffset: Number(line['@_sOffset']),
                rule: line['@_rule'],
                width: line['@_width'] !== undefined ? Number(line['@_width']) : undefined,
                color: line['@_color']
            }
        });
    }

    return transformedLines;
}

function transformRoadLanesLaneSectionLcrLaneRoadMarkExplicit(explicit) {
    return {
        line: explicit['line'] !== undefined ? transformRoadLanesLaneSectionLcrLaneRoadMarkExplicitLine(explicit['line']) : [],
        include: explicit['include'] !== undefined ? transformInclude(explicit['include']) : [],
        userData: explicit['userData'] !== undefined ? transformUserData(explicit['userData']) : [],
        dataQuality: explicit['dataQuality'] !== undefined ? transformDataQuality(explicit['dataQuality']) : undefined,
    };
}

function transformRoadLanesLaneSectionLcrLaneRoadMarkExplicitLine(lines) {
    let transformedLines = [];

    for (let line of lines) {
        transformedLines.push({
            attributes: {
                length: Number(line['@_length']),
                tOffset: Number(line['@_tOffset']),
                sOffset: Number(line['@_sOffset']),
                rule: line['@_rule'],
                width: line['@_width']
            }
        });
    }

    return transformedLines;
}

function transformRoadLanesLaneSectionLrLaneMaterial(materials) {
    let transformedMaterials = [];

    for (let material of materials) {
        transformedMaterials.push({
            attributes: {
                sOffset: Number(material['@_sOffset']),
                surface: material['@_surface'],
                friction: Number(material['@_friction']),
                roughness: material['@_roughness'] !== undefined ? Number(material['@_roughness']) : undefined
            }
        });
    }

    return transformedMaterials;
}

function transformRoadLanesLaneSectionLrLaneSpeed(speeds) {
    let transformedSpeeds = [];

    for (let speed of speeds) {
        transformedSpeeds.push({
            attributes: {
                sOffset: Number(speed['@_sOffset']),
                max: Number(speed['@_max']),
                unit: speed['@_unit']
            }
        });
    }
    
    return transformedSpeeds;
}

function transformRoadLanesLaneSectionLrLaneAccess(accesses) {
    let transformedAccesses = [];

    for (let access of accesses) {
        transformedAccesses.push({
            attributes: {
                sOffset: Number(access['@_sOffset']),
                rule: access['@_rule'],
                restriction: access['@_restriction']
            }
        });
    }

    return transformedAccesses;
}

function transformRoadLanesLaneSectionLrLaneHeight(heights) {
    let transformedHeights = [];

    for (let height of heights) {
        transformedHeights.push({
            attributes: {
                sOffset: Number(height['@_sOffset']),
                inner: Number(height['@_inner']),
                outer: Number(height['@_outer'])
            }
        });
    }    

    return transformedHeights;   
}

function transformRoadLanesLaneSectionLrLaneRule(rules) {
    let transformedRules = [];

    for (let rule of rules) {
        transformedRules.push({
            attributes: {
                sOffset: Number(rule['@_sOffset']),
                value: rule['@_value']
            }
        });
    }    

    return transformedRules;   
}

function transformRoadObjects(objects) {
    return {
        object: objects['object'] !== undefined ? transformRoadObjectsObject(objects['object']) : [],
        objectReference: objects['objectReference'] !== undefined ? transformRoadObjectsObjectReference(objects['objectReference']) : [],
        tunnel: objects['tunnel'] !== undefined ? transformRoadObjectsTunnel(objects['tunnel']) : [],
        bridge: objects['bridge'] !== undefined ? transformRoadObjectsBridge(objects['bridge']) : [], 
        include: objects['include'] !== undefined ? transformInclude(objects['include']) : [],
        userData: objects['userData'] !== undefined ? transformUserData(objects['userData']) : [],
        dataQuality: objects['dataQuality'] !== undefined ? transformDataQuality(objects['dataQuality']) : undefined,
    }
}

function transformRoadObjectsObject(objects) {
    let transformedObjects = [];

    for (let object of objects) {
        transformedObjects.push({
            attributes: {
                t: object['@_t'] !== undefined ? Number(object['@_t']) : undefined,
                zOffset: object['@_zOffset'] !== undefined ? Number(object['@_zOffset']) : undefined,
                type: object['@_type'],
                validLength: object['@_validLength'] !== undefined ? Number(object['@_validLength']) : undefined,
                orientation: object['@_orientation'],
                subtype: object['@_subtype'],
                dynamic: object['@_dynamic'],
                hdg: object['@_hdg'] !== undefined ? Number(object['@_hdg']) : undefined,
                name: object['@_name'],
                pitch: object['@_pitch'] !== undefined ? Number(object['@_pitch']) : undefined,
                id: object['@_id'],
                roll: object['@_roll'] !== undefined ? Number(object['@_roll']) : undefined,
                height: object['@_height'] !== undefined ? Number(object['@_height']) : undefined,
                s: object['@_s'] !== undefined ? Number(object['@_s']) : undefined,
                length: object['@_length'] !== undefined ? Number(object['@_length']) : undefined,
                width: object['@_width'] !== undefined ? Number(object['@_width']) : undefined,
                radius: object['@_radius'] !== undefined ? Number(object['@_radius']) : undefined
            },
            repeat: object['repeat'] !== undefined ? transformRoadObjectsObjectRepeat(object['repeat']) : [],
            outline: object['outline'] !== undefined ? transformRoadObjectsObjectOutlinesOutline(object['outline']) : undefined,
            outlines: object['outlines'] !== undefined ? transformRoadObjectsObjectOutlines(object['outlines']) : undefined,
            material: object['material'] !== undefined ? transformRoadObjectsObjectMaterial(object['material']) : [],
            validity: object['validity'] !== undefined ? transformRoadObjectsObjectLaneValidity(object['validity']) : [],
            parkingSpace: object['parkingSpace'] !== undefined ? transformRoadObjectsParkingSpace(object['parkingSpace']) : undefined,
            markings: object['markings'] !== undefined ? transformRoadObjectsMarkings(object['markings']) : undefined,
            borders: object['borders'] !== undefined ? transformRoadObjectsBorders(object['borders']) : undefined
        });
    }

    return transformedObjects;
}

function transformRoadObjectsObjectRepeat(repeats) {
    let transformedRepeats = [];

    for (let repeat of repeats) {
        transformedRepeats.push({
            s: Number(repeat['@_s']),
            length: Number(repeat['@_length']),
            distance: Number(repeat['@_distance']),
            tStart: Number(repeat['@_tStart']),
            tEnd: Number(repeat['@_tEnd']),
            heightStart: Number(repeat['@_heightStart']),
            heightEnd: Number(repeat['@_heightEnd']),
            zOffsetStart: Number(repeat['@_zOffsetStart']),
            zOffsetEnd: Number(repeat['@_zOffsetEnd']),
            widthStart: repeat['@_widthStart'] !== undefined ? Number(repeat['@_widthStart']) : undefined,
            widthEnd: repeat['@_widthEnd'] !== undefined ? Number(repeat['@_widthEnd']) : undefined,
            lengthStart: repeat['@_lengthStart'] !== undefined ? Number(repeat['@_lengthStart']) : undefined,
            lengthEnd: repeat['@_lengthEnd'] !== undefined ? Number(repeat['@_lengthEnd']) : undefined,
            radiusStart: repeat['@_radiusStart'] !== undefined ? Number(repeat['@_radiusStart']) : undefined,
            radiusEnd: repeat['@_radiusEnd'] !== undefined ? Number(repeat['@_radiusEnd']) : undefined
        });
    }

    return transformedRepeats;
}

function transformRoadObjectsObjectOutlinesOutline(outline) {
    return {
        attributes: {
            id: outline['@_id'] !== undefined ? Number(outline['@_id']) : undefined,
            fillType: outline['@_fillType'],
            outer: outline['@_outer'] !== undefined ? Boolean(outline['@_outer']) : undefined,
            closed: outline['@_closed'] !== undefined ? Boolean(outline['@_closed']) : undefined,
            laneType: outline['@_laneType']
        },
        cornerRoad: outline['cornerRoad'] !== undefined ? transformRoadObjectsObjectOutlinesOutlineCornerRoad(outline['cornerRoad']) : undefined,
        cornerLocal: outline['cornerLocal'] !== undefined ? transformRoadObjectsObjectOutlinesOutlineCornerLocal(outline['cornerLocal']) : undefined,
        include: outline['include'] !== undefined ? transformInclude(outline['include']) : [],
        userData: outline['userData'] !== undefined ? transformUserData(outline['userData']) : [],
        dataQuality: outline['dataQuality'] !== undefined ? transformDataQuality(outline['dataQuality']) : undefined
    };
}

function transformRoadObjectsObjectOutlinesOutlineCornerRoad(cornerRoad) {
    return {
        attributes: {
            s: Number(cornerRoad['@_s']),
            t: Number(cornerRoad['@_t']),
            dz: Number(cornerRoad['@_dz']),
            height: Number(cornerRoad['@_height']),
            id: cornerRoad['@_id'] !== undefined ? Number(cornerRoad['@_']) : undefined
        }
    };
}

function transformRoadObjectsObjectOutlinesOutlineCornerLocal(cornerLocal) {
    return {
        attributes: {
            u: Number(cornerLocal['@_u']),
            v: Number(cornerLocal['@_v']),
            z: Number(cornerLocal['@_z']),
            height: Number(cornerLocal['@_height']),
            id: cornerLocal['@_id'] !== undefined ? Number(cornerLocal['@_id']) : undefined
        }
    };
}

function transformRoadObjectsObjectOutlines(outlines) {
    let transformedOutlines = [];

    for (let outline of outlines) {
        transformedOutlines.push(transformRoadObjectsObjectOutlinesOutline(outline));
    }

    return {
        outline: transformedOutlines,
        include: outlines['include'] !== undefined ? transformInclude(outlines['include']) : [],
        userData: outlines['userData'] !== undefined ? transformUserData(outlines['userData']) : [],
        dataQuality: objoutlinesects['dataQuality'] !== undefined ? transformDataQuality(outlines['dataQuality']) : undefined,
    };
}

function transformRoadObjectsObjectMaterial(materials) {
    let transformedMaterials = [];

    for (let material of materials) {
        transformedMaterials.push({
            attributes: {
                surface: material['@_surface'],
                friction: material['@_friction'] !== undefined ? Number(material['@_friction']) : undefined,
                roughness: material['@_roughness'] !== undefined ? Number(material['@_roughness']) : undefined
            }
        });
    }

    return transformedMaterials;
}

function transformRoadObjectsObjectLaneValidity(validities) {
    let transformedValidities = [];

    for (let validity of validities) {
        transformedValidities.push({
            attributes: {
                fromLane: Number(validity['@_fromLane']),
                toLane: Number(validity['@_toLane'])
            }
        });
    }

    return transformedValidities;
}

function transformRoadObjectsParkingSpace(parkingSpace) {
    return {
        attributes: {
            access: parkingSpace['@_access'],
            restrictions: parkingSpace['@_restrictions'],
        }
    };
}

function transformRoadObjectsMarkings(markings) {
    return {
        marking: markings['marking'] !== undefined ? transformRoadObjectsMarkingsMarking(markings['marking']) : [],
        include: markings['include'] !== undefined ? transformInclude(markings['include']) : [],
        userData: markings['userData'] !== undefined ? transformUserData(markings['userData']) : [],
        dataQuality: markings['dataQuality'] !== undefined ? transformDataQuality(markings['dataQuality']) : undefined,
    };
}

function transformRoadObjectsMarkingsMarking(markings) {
    let transformedMarkings = [];

    for (let marking of markings) {
        transformedMarkings.push({
            attributes: {
                side: marking['@_side'],
                weight: marking['@_weight'],
                width: marking['@_width'] !== undefined ? Number(marking['@_width']) : undefined,
                color: marking['@_color'],
                zOffset: marking['@_zOffset'] !== undefined ? Number(marking['@_zOffset']) : undefined,
                spaceLength: marking['@_spaceLength'] !== undefined ? Number(marking['@_spaceLength']) : undefined,
                lineLength: marking['@_lineLength'] !== undefined ? Number(marking['@_lineLength']) : undefined,
                startOffset: marking['@_startOffset'] !== undefined ? Number(marking['@_startOffset']) : undefined,
                stopOffset: marking['@_stopOffset'] !== undefined ? Number(marking['@_stopOffset']) : undefined
            },
            cornerReference: transformRoadObjectsMarkingsMarkingCornerReference(marking['cornerReference']),
            include: marking['include'] !== undefined ? transformInclude(marking['include']) : [],
            userData: marking['userData'] !== undefined ? transformUserData(marking['userData']) : [],
            dataQuality: marking['dataQuality'] !== undefined ? transformDataQuality(marking['dataQuality']) : undefined
        });
    }

    return transformedMarkings;
}

function transformRoadObjectsMarkingsMarkingCornerReference(cornerReference) {
    return {
        attributes: {
            id: Number(cornerReference['@_id'])
        }
    };
}

function transformRoadObjectsBorders(borders) {
    return {
        border: borders['border'] !== undefined ? transformRoadObjectsBordersBorder(borders['border']) : [],
        include: borders['include'] !== undefined ? transformInclude(borders['include']) : [],
        userData: borders['userData'] !== undefined ? transformUserData(borders['userData']) : [],
        dataQuality: borders['dataQuality'] !== undefined ? transformDataQuality(borders['dataQuality']) : undefined,
    };
}

function transformRoadObjectsBordersBorder(borders) {
    let transformedBorders = [];

    for (let border of borders) {
        transformedBorders.push({
            attributes: {
                width: border['@_width'] !== undefined ? Number(border['@_width']) : undefined,
                type: border['@_type'],
                outlineId: border['@_outlineId'] !== undefined ? Number(border['@_outlineId']) : undefined,
                useCompleteOutline: border['@_useCompleteOutline'] !== undefined ? Boolean(border['@_useCompleteOutline']) : undefined
            },
            cornerReference: transformRoadObjectsMarkingsMarkingCornerReference(border['cornerReference']),
            include: border['include'] !== undefined ? transformInclude(border['include']) : [],
            userData: border['userData'] !== undefined ? transformUserData(border['userData']) : [],
            dataQuality: border['dataQuality'] !== undefined ? transformDataQuality(border['dataQuality']) : undefined,
        });
    }

    return transformedBorders;
}

function transformRoadObjectsObjectReference(objectReferences) {
    let transformedObjectReferences = [];

    for (let objectReference of objectReferences) {
        transformedObjectReferences.push({
            attributes: {
                s: Number(objectReference['@_s']),
                t: Number(objectReference['@_t']),
                id: objectReference['@_id'],
                zOffset: objectReference['@_zOffset'] !== undefined ? Number(objectReference['@_zOffset']) : undefined,
                validLength: objectReference['@_validLength'] !== undefined ? Number(objectReference['@_validLength']) : undefined,
                orientation: objectReference['@_orientation']
            },
            validity: objectReference['validity'] !== undefined ? transformRoadObjectsObjectLaneValidity(objectReference['validity']) : [],
            include: objectReference['include'] !== undefined ? transformInclude(objectReference['include']) : [],
            userData: objectReference['userData'] !== undefined ? transformUserData(objectReference['userData']) : [],
            dataQuality: objectReference['dataQuality'] !== undefined ? transformDataQuality(objectReference['dataQuality']) : undefined,
        });
    }

    return transformedObjectReferences;
}

function transformRoadObjectsTunnel(tunnels) {
    let transformedTunnels = [];

    for (let tunnel of tunnels) {
        transformedTunnels.push({
            attributes: {
                s: Number(tunnel['@_s']),
                length: Number(tunnel['@_length']),
                name: tunnel['@_name'],
                id: tunnel['@_id'],
                type: tunnel['@_type'],
                lighting: tunnel['@_lighting'] !== undefined ? Number(tunnel['@_lighting']) : undefined,
                daylight: tunnel['@_daylight'] !== undefined ? Number(tunnel['@_daylight']) : undefined,
            },
            validity: tunnel['validity'] !== undefined ? transformRoadObjectsObjectLaneValidity(tunnel['validity']) : [],
            include: tunnel['include'] !== undefined ? transformInclude(tunnel['include']) : [],
            userData: tunnel['userData'] !== undefined ? transformUserData(tunnel['userData']) : [],
            dataQuality: tunnel['dataQuality'] !== undefined ? transformDataQuality(tunnel['dataQuality']) : undefined,
        });
    }

    return transformedTunnels;
}

function transformRoadObjectsBridge(bridges) {
    let transformedBridges = [];

    for (let bridge of bridges) {
        transformedBridges.push({
            attributes: {
                s: Number(bridge['@_s']),
                length: Number(bridge['@_length']),
                name: bridge['@_name'],
                id: bridge['@_id'],
                type: bridge['@_type'],
            },
            validity: bridge['validity'] !== undefined ? transformRoadObjectsObjectLaneValidity(bridge['validity']) : [],
            include: bridge['include'] !== undefined ? transformInclude(bridge['include']) : [],
            userData: bridge['userData'] !== undefined ? transformUserData(bridge['userData']) : [],
            dataQuality: bridge['dataQuality'] !== undefined ? transformDataQuality(bridge['dataQuality']) : undefined,
        });
    }

    return transformedBridges;
}

function transformRoadSignals(signals) {
    return {
        signal: signals['signal'] !== undefined ? transformRoadSignalsSignal(signals['signal']) : [],
        signalReference: signals['signalReference'] !== undefined ? transformRoadSignalsSignalReference(signals['signalReference']) : [],
        include: signals['include'] !== undefined ? transformInclude(signals['include']) : [],
        userData: signals['userData'] !== undefined ? transformUserData(signals['userData']) : [],
        dataQuality: signals['dataQuality'] !== undefined ? transformDataQuality(signals['dataQuality']) : undefined,
    };
}

function transformRoadSignalsSignal(signals) {
    let transformedSignals = [];

    for (let signal of signals) {
        transformedSignals.push({
            attributes: {
                s: Number(signal['@_s']),
                t: Number(signal['@_t']),
                id: signal['@_id'],
                name: signal['@_name'],
                dynamic: signal['@_dynamic'],
                orientation: signal['@_orientation'],
                zOffset: Number(signal['@_zOffset']),
                country: signal['@_country'],
                countryRevision: signal['@_countryRevision'],
                type: signal['@_type'],
                subtype: signal['@_subtype'],
                value: signal['@_value'] !== undefined ? Number(signal['@_value']) : undefined,
                unit: signal['@_unit'],
                height: signal['@_height'] !== undefined ? Number(signal['@_height']) : undefined,
                width: signal['@_width'] !== undefined ? Number(signal['@_width']) : undefined,
                text: signal['@_text'],
                hOffset: signal['@_hOffset'] !== undefined ? Number(signal['@_hOffset']) : undefined,
                pitch: signal['@_pitch'] !== undefined ? Number(signal['@_pitch']) : undefined,
                roll: signal['@_roll'] !== undefined ? Number(signal['@_roll']) : undefined,
            },
            validity: signal['validity'] !== undefined ? transformRoadObjectsObjectLaneValidity(signal['validity']) : [],
            dependency: signal['dependency'] !== undefined ? transformRoadSignalsSignalDependency(signal['dependency']) : [],
            reference: signal['reference'] !== undefined ? transformRoadSignalsSignalReference(signal['reference']) : [],
            positionRoad: signal['positionRoad'] !== undefined ? transformRoadSignalsSignalPositionRoad(signal['positionRoad']) : undefined,
            positionInertial: signal['positionInertial'] !== undefined ? transformRoadSignalsSignalPositionInertial(signal['positionInertial']) : undefined,
            include: signal['include'] !== undefined ? transformInclude(signal['include']) : [],
            userData: signal['userData'] !== undefined ? transformUserData(signal['userData']) : [],
            dataQuality: signal['dataQuality'] !== undefined ? transformDataQuality(signal['dataQuality']) : undefined
        });
    }

    return transformedSignals;
}

function transformRoadSignalsSignalDependency(dependencies) {
    let transformedDependencies = [];

    for (let dependency of dependencies) {
        transformedDependencies.push({
            attributes: {
                id: dependency['@_id'],
                type: dependency['@_type']
            }
        });
    }

    return transformedDependencies;
}

function transformRoadSignalsSignalReference(references) {
    let transformedReferences = [];

    for (let reference of references) {
        transformedReferences.push({
            attributes: {
                elementType: reference['@_elementType'],
                elementId: reference['@_elementId'],
                type: reference['@_type']
            }
        });
    }

    return transformedReferences;
}

function transformRoadSignalsSignalPositionRoad(positionRoad) {
    return {
        attributes: {
            roadId: positionRoad['@_roadId'],
            s: Number(positionRoad['@_s']),
            t: Number(positionRoad['@_t']),
            zOffset: Number(positionRoad['@_zOffset']),
            hOffset: Number(positionRoad['@_hOffset']),
            pitch: positionRoad['@_pitch'] !== undefined ? Number(positionRoad['@_pitch']) : undefined,
            roll: positionRoad['@_roll'] !== undefined ? Number(positionRoad['@_roll']) : undefined
        }
    };
}

function transformRoadSignalsSignalPositionInertial(positionInertial) {
    return {
        attributes: {
            x: Number(positionInertial['@_x']),
            y: Number(positionInertial['@_y']),
            z: Number(positionInertial['@_z']),
            hdg: Number(positionInertial['@_hdg']),
            pitch: positionInertial['@_pitch'] !== undefined ? Number(positionInertial['@_pitch']) : undefined,
            roll: positionInertial['@_roll'] !== undefined ? Number(positionInertial['@_roll']) : undefined
        }
    };
}

function transformRoadSignalsSignalReference(signalReferences) {
    let transformedSignalReferences = [];

    for (let signalReference of signalReferences) {
        transformedSignalReferences.push({
            attributes: {
                s: Number(signalReference['@_s']),
                t: Number(signalReference['@_t']),
                id: signalReference['@_id'],
                orientation: signalReference['@_orientation']
            },
            validity: signalReference['validity'] !== undefined ? transformRoadObjectsObjectLaneValidity(signalReference['validity']) : [],
            include: signalReference['include'] !== undefined ? transformInclude(signalReference['include']) : [],
            userData: signalReference['userData'] !== undefined ? transformUserData(signalReference['userData']) : [],
            dataQuality: signalReference['dataQuality'] !== undefined ? transformDataQuality(signalReference['dataQuality']) : undefined,
        });
    }

    return transformedSignalReferences;
}

function transformRoadSurface(surface) {
    return {
        CRG: surface['CRG'] !== undefined ? transformRoadSurfaceCrg(surface['CRG']) : [],
        include: surface['include'] !== undefined ? transformInclude(surface['include']) : [],
        userData: surface['userData'] !== undefined ? transformUserData(surface['userData']) : [],
        dataQuality: surface['dataQuality'] !== undefined ? transformDataQuality(surface['dataQuality']) : undefined,
    }
}

function transformRoadSurfaceCrg(crgs) {
    let transformedCrgs = [];

    for (let crg of crgs) {
        transformedCrgs.push({
            attributes: {
                file: crg['@_file'],
                sStart: Number(crg['@_sStart']),
                sEnd: Number(crg['@_sEnd']),
                orientation: crg['@_orientation'],
                mode: crg['@_mode'],
                purpose: crg['@_purpose'],
                sOffset: crg['@_sOffset'] !== undefined ? Number(crg['@_sOffset']) : undefined,
                tOffset: crg['@_tOffset'] !== undefined ? Number(crg['@_tOffset']) : undefined,
                zOffset: crg['@_zOffset'] !== undefined ? Number(crg['@_zOffset']) : undefined,
                zScale: crg['@_zScale'] !== undefined ? Number(crg['@_zScale']) : undefined,
                hOffset: crg['@_hOffset'] !== undefined ? Number(crg['@_hOffset']) : undefined
            }
        });
    }

    return transformedCrgs;
}

function transformRoadRailroad(railroad) {
    return {
        switch: transformRoadRailroadSwitch(railroad['swtich']),
        include: railroad['include'] !== undefined ? transformInclude(railroad['include']) : [],
        userData: railroad['userData'] !== undefined ? transformUserData(railroad['userData']) : [],
        dataQuality: railroad['dataQuality'] !== undefined ? transformDataQuality(railroad['dataQuality']) : undefined,
    }
}

function transformRoadRailroadSwitch(rrSwitch) {
    return {
        attributes: {
            name: rrSwitch['@_name'],
            id: rrSwitch['@_id'],
            position: rrSwitch['@_position']
        },
        mainTrack: transformRoadRailroadSwitchMainSideTrack(rrSwitch['mainTrack']),
        sideTrack: transformRoadRailroadSwitchMainSideTrack(rrSwitch['sideTrack']),
        partner: transformRoadRailroadSwitchPartner(rrSwitch['partner']),
        include: rrSwitch['include'] !== undefined ? transformInclude(rrSwitch['include']) : [],
        userData: rrSwitch['userData'] !== undefined ? transformUserData(rrSwitch['userData']) : [],
        dataQuality: rrSwitch['dataQuality'] !== undefined ? transformDataQuality(rrSwitch['dataQuality']) : undefined,
    };
}

function transformRoadRailroadSwitchMainSideTrack(track) {
    return {
        attributes: {
            id: track['@_id'],
            s: Number(track['@_s']),
            dir: track['@_dir']
        },
        include: track['include'] !== undefined ? transformInclude(track['include']) : [],
        userData: track['userData'] !== undefined ? transformUserData(track['userData']) : [],
        dataQuality: track['dataQuality'] !== undefined ? transformDataQuality(track['dataQuality']) : undefined,
    };
}

function transformRoadRailroadSwitchPartner(partner) {
    return {
        attributes: {
            name: partner['@_name'],
            id: partner['@_id']
        },
        include: partner['include'] !== undefined ? transformInclude(partner['include']) : [],
        userData: partner['userData'] !== undefined ? transformUserData(partner['userData']) : [],
        dataQuality: partner['dataQuality'] !== undefined ? transformDataQuality(partner['dataQuality']) : undefined,
    };
}

function transformJunction(junctions) {
    let transformedJunctions = [];

    for (let junction of junctions) {
        transformedJunctions.push({
            attributes: {
                name: junction['@_name'],
                id: junction['@_id'],
                type: junction['@_type']
            },
            connection: junction['connection'] !== undefined ? transformJunctionConnection(junction['connection']) : [],
            priority: junction['priority'] !== undefined ? transformJunctionPriority(junction['priority']) : [],
            controller: junction['controller'] !== undefined ? transformJunctionController(junction['controller']) : [],
            surface: junction['surface'] !== undefined ? transformJunctionSurface(junction['surface']) : undefined,
            include: junction['include'] !== undefined ? transformInclude(junction['include']) : [],
            userData: junction['userData'] !== undefined ? transformUserData(junction['userData']) : [],
            dataQuality: junction['dataQuality'] !== undefined ? transformDataQuality(junction['dataQuality']) : undefined,
        });
    }
    return transformedJunctions;
}

function transformJunctionConnection(connections) {
    let transformedConnections = [];

    for (let connection of connections) {
        transformedConnections.push({
            attributes: {
                id: connection['@_id'],
                type: connection['@_type'],
                incomingRoad: connection['@_incomingRoad'],
                connectingRoad: connection['@_connectingRoad'],
                contactPoint: connection['@_contactPoint']
            },
            predecessor: connection['predecessor'] !== undefined ? transformJunctionPredecessorSuccessor(connection['predecessor']) : undefined,
            successor: connection['successor'] !== undefined ? transformJunctionPredecessorSuccessor(connection['successor']) : undefined,
            laneLink: connection['laneLink'] !== undefined ? transformJunctionConnectionLaneLink(connection['laneLink']) : [],
        })
    }

    return transformedConnections;
}

function transformJunctionPredecessorSuccessor(predecessorSuccessor) {
    return {
        attributes: {
            elementType: predecessorSuccessor['@_elementType'],
            elementId: predecessorSuccessor['@_elementId'],
            elementS: Number(predecessorSuccessor['@_elementS']),
            elementDir: predecessorSuccessor['@_elementDir']
        }
    };
}

function transformJunctionConnectionLaneLink(laneLinks) {
    let transformedLaneLinks = [];

    for (let laneLink of laneLinks) {
        transformedLaneLinks.push({
            attributes: {
                from: Number(laneLink['@_from']),
                to:  Number(laneLink['@_to']),
            }
        });
    }

    return transformedLaneLinks;
}

function transformJunctionPriority(priorities) {
    let transformedPriorities = [];

    for (let priority of priorities) {
        transformedPriorities.push({
            high: priority['@_high'],
            low: priority['@_low']
        });
    }

    return transformedPriorities;
}

function transformJunctionController(controllers) {
    let transformedControllers = [];

    for (let controller of controllers) {
        transformedControllers.push({
            attributes: {
                id: controller['@_id'],
                type: controller['@_type'],
                sequence: controller['@_sequence'] !== undefined ? Number(controller['@_sequence']) : undefined,
            }
        })
    }

    return transformedControllers;
}

function transformJunctionSurface(surface) {
    return {
        CRG: transformJunctionSurfaceCRG(surface['CRG']),
        include: surface['include'] !== undefined ? transformInclude(surface['include']) : [],
        userData: surface['userData'] !== undefined ? transformUserData(surface['userData']) : [],
        dataQuality: surface['dataQuality'] !== undefined ? transformDataQuality(surface['dataQuality']) : undefined,
    };
}

function transformJunctionSurfaceCRG(crg) {
    return {
        attributes: {
            file: crg['@_file'],
            mode: crg['@_mode'],
            purpose: crg['@_purpose'],
            zOffset: crg['@_zOffset'] !== undefined ? Number(crg['@_zOffset']) : undefined,
            zScale: crg['@_zScale'] !== undefined ? Number(crg['@_zScale']) : undefined
        }
    };
}

function transformJunctionGroup(junctionGroups) {
    let transformedJunctionGroups = [];

    for (let junctionGroup of junctionGroups) {
        transformedJunctionGroups.push({
            attributes: {
                name: junctionGroup['@_name'],
                id: junctionGroup['@_id'],
                type: junctionGroup['@_type']
            },
            junctionReference: junctionGroup['junctionReference'] !== undefined ? transformJunctionGroupJunctionReference(junctionGroup['junctionReference']) : [],
            include: junctionGroup['include'] !== undefined ? transformInclude(junctionGroup['include']) : [],
            userData: junctionGroup['userData'] !== undefined ? transformUserData(junctionGroup['userData']) : [],
            dataQuality: junctionGroup['dataQuality'] !== undefined ? transformDataQuality(junctionGroup['dataQuality']) : undefined,
        });
    }

    return transformedJunctionGroups;
}

function transformJunctionGroupJunctionReference(junctionReferences) {
    let transformedJunctionReferences = [];

    for (let junctionReference of junctionReferences) {
        transformedJunctionReferences.push({
            attributes: {
                junction: junctionReference['@_junction']
            }
        });
    }

    return transformedJunctionReferences;
}

function transformController(controllers) {
    let transformedControllers = [];

    for (let controller of controllers) {
        transformedControllers.push({
            attributes: {
                id: controller['@_id'],
                name: controller['@_name'],
                sequence: controller['@_sequence'] !== undefined ? Number(controller['@_sequence']) : []
            },
            control: controller['control'] !== undefined ? transformControllerControl(controller['control']) : [],
            include: controller['include'] !== undefined ? transformInclude(controller['include']) : [],
            userData: controller['userData'] !== undefined ? transformUserData(controller['userData']) : [],
            dataQuality: controller['dataQuality'] !== undefined ? transformDataQuality(controller['dataQuality']) : undefined,
        })
    }

    return transformedControllers;
}

function transformControllerControl(controls) {
    let transformedControls = [];

    for (let control of controls) {
        transformedControls.push({
            attributes: {
                signalId: control['@_signalId'],
                type: control['@_type']
            }
        });
    }

    return transformedControls;
}

function transformStation(stations) {
    let transformedStations = [];

    for (let station of stations) {
        transformedStations.push({
            attributes: {
                name: station['@_name'],
                id: station['@_id'],
                type: station['@_type']
            },
            platform: station['platform'] !== undefined ? transformStationPlatform(station['platform']) : [],
            include: station['include'] !== undefined ? transformInclude(station['include']) : [],
            userData: station['userData'] !== undefined ? transformUserData(station['userData']) : [],
            dataQuality: station['dataQuality'] !== undefined ? transformDataQuality(station['dataQuality']) : undefined,
        });
    }

    return transformedStations;
}

function transformStationPlatform(platforms) {
    let transformedPlatforms = [];

    for (let platform of platforms) {
        transformedPlatforms.push({
            attributes: {  
                name: platform['@_name'],
                id: platform['@_id']
            },
            segment: platform['segment'] !== undefined ? transformStationPlatformSegment(platform['segment']) : [],
            include: platform['include'] !== undefined ? transformInclude(platform['include']) : [],
            userData: platform['userData'] !== undefined ? transformUserData(platform['userData']) : [],
            dataQuality: platform['dataQuality'] !== undefined ? transformDataQuality(platform['dataQuality']) : undefined,
        });
    }

    return transformedPlatforms;
}

function transformStationPlatformSegment(segments) {
    let transformedSegments = [];

    for (let segment of segments) {
        transformedSegments.push({
            attributes: {  
                roadId: segment['@_roadId'],
                sStart: Number(segment['@_sStart']),
                sEnd: Number(segment['@_sEnd']),
                side: segment['@_side']
            }
        });
    }

    return transformedSegments;
}

/**
 * Prunes an object, which means it deletes all the attributes from the object
 * that names are given in keysToDelete
 * 
 * @param {object} objectToPrune 
 * @param {string[]} keysToDelete 
 * @returns {object} the pruned object
 */
function pruneObject(objectToPrune, keysToDelete) {
    let prunedObject = {};

    for (let key of Object.keys(objectToPrune)) {
        if (!keysToDelete.includes(key))
            prunedObject[key] = objectToPrune[key];
    }

    return prunedObject;
}