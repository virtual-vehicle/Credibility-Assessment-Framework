const opendrive = require("../check_opendrive_syntax/src/opendrive");

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * @module metrics/implementation/level_1
 */

/**
 * Static code check, if the given OpenDRIVE map is XML conformant and fulfills the given XML 
 * schema definition
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain Automotive
 * @modeltypes OpenDRIVE road network models
 * @level 1
 * @phase implementation
 * @step [models]
 * @param {string} opendrive The OpenDRIVE map as a string
 * @param {string} xsdSchemaPath The path to the OpenDRIVE XSD schema definition
 * @return {ResultLog} returns true/false and a log upon valid/invalid behaviour
 */
const checkOpenDriveSyntax = opendrive.checkOpenDriveSyntax;

exports.checkOpenDriveSyntax = checkOpenDriveSyntax;