const convergency = require("./src/convergency/convergency");
const opendrive = require("./src/opendrive/opendrive");

/**
 * @typedef {import('./types/types').Measurement} Measurement
 * @typedef {import('./types/types').ResultLog} ResultLog
 * @typedef {import('./types/types').pose3d} pose3d
 * @typedef {import('./types/types').TargetObject} TargetObject
 * @typedef {import('./types/types').TargetSignal} TargetSignal
 * @typedef {import('./types/types').MapReference} MapReference
 * @typedef {import('./types/types').LineMarking} LineMarking
 */

/**
 * @module metrics/implementation/level_2
 */

/**
 * Verifies if the solution to the discretized equations approaching the continuum solution to the partial 
 * differential equations in the limit of decreasing element size.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 2
 * @phase implementation
 * @step [integration]
 * @param {string} signalName the name of the signal to evaluate
 * @param {number | string} nSamples the number of equidistant samples to evaluate
 * @param {string} resultExact stringified Signal array as returned by a Signal adapter, like the openmcx-csv-adapter
 * @param {...string} resultDiscretized at least 2 stringified Signal arrays, as returned by a Signal adapter, like the openmcx-csv-adapter
 * @returns {ResultLog} result and logging information
 */
const checkConvergency = convergency.verifyConvergency;

/**
 * Verifies, if all transitions (for all lane boundaries) between connected roads are smooth enough, according to the given threshold.
 * 
 * Further, it will be checked, if the transitions between the single segments within the geometric definition of the road (i.e., between 
 * geometry elements, elevation elements, superelevation elemens and shape elements) are smooth enough, according to
 * the given allowed threshold.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [models]
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {string} offsetThreshold maximum allowed offset (as stringified {@link pose3d} object)
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveOffsets = opendrive.checkOffsets;

/**
 * Verifies if all references to roads, junctions and lanes inside roads and junctions 
 * are well-defined in the OpenDRIVE model
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [models]
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveReferences = opendrive.checkReferences;

/**
 * Verifies if the given OpenDRIVE road network is compatible with the given OpenSCENARIO scenario definition.
 * In detail, it will be checked if the initial conditions, given in the OpenSCENARIO file (like road ID and lane ID),
 * are compatible with the OpenDRIVE model.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [integration]
 * @param {string} xodrPath the path of the OpenDRIVE file to be examined
 * @param {string} xoscPath The path of the according OpenSCENARIO or OpenSCENARIO parameter variation file
 * @returns {ResultLog} result and logging information
 */
const checkOpenDriveScenarioIntegration = opendrive.checkScenarioIntegration;

/**
 * Verifies if only those modeling approaches for the road planView geometries are used, as defined.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models 
 * @level 2
 * @phase implementation
 * @step [models]
 * @example checkPlanViewModelingApproach('<?xml version=...', 'parampoly3', 'spiral', 'line')
 * @param {string} xodrString the string of the OpenDRIVE file to be examined
 * @param {...string} allowedGeometries the list of allowed geometries (case-insensitive)
 * @returns {ResultLog} result and logging information
 */
const checkOpenDrivePlanViewModelingApproach = opendrive.checkPlanViewModelingApproach;

exports.checkConvergency = checkConvergency;
exports.checkOpenDriveOffsets = checkOpenDriveOffsets;
exports.checkOpenDriveReferences = checkOpenDriveReferences;
exports.checkOpenDriveScenarioIntegration = checkOpenDriveScenarioIntegration;
exports.checkOpenDrivePlanViewModelingApproach = checkOpenDrivePlanViewModelingApproach;