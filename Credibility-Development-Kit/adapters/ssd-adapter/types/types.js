// General

/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * 
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

/**
 * Wraps up information to define a system model (elements, connectors, connections)
 * 
 * @typedef {object} SystemStructure
 * @property {SystemElement[]} elements     The list of all available elements of the system model 
 * @property {Connector[]} connectors       The list of all connectors of the elements of the system model
 * @property {Connection[]} connections     The list of all connections between the elements of the system model
 */

/**
 * TElementInfo from SSD
 * 
 * @typedef {Object} TElementInfo
 * @property {string}   name        The unique name of the TElement within the subsystem
 * @property {string}   type        "System" or "Component"
 * @property {string}   source      The reference to the element (e.g. the path to an FMU). Will be an empty string, if the element is a system
 * @property {Object}   tree        The underlying structure of this TElement
 * @property {string[]} subsystem   The pedigree of the subsystems the TElement is enclosed
 * @property {number}   layer       The number of the layer the TEement is located
 */

/**
 * Represents an element of a SystemStructure object, which can be a component or a sub-system
 * 
 * @typedef {object} SystemElement
 * @property {string} name          The name of the component/sub-system
 * @property {string} type          Type of the element. Must be "System" or "Component"
 * @property {string} source        The path to the source file. Can be empty, if type == "System"
 * @property {string[]} subsystem   The hierarchy of top-level systems, where this element is placed
 */

/**
 * Represents a connector of a SystemStructure object
 * 
 * @typedef {object} Connector
 * @property {string} name          The name of the connector
 * @property {string} element       The element the connector belongs to 
 * @property {string[]} subsystem   The hierarchy of top-level systems, where the element of the connector is placed
 * @property {string} kind          The kind of the connector. Must be "input", "output", "inout", "paramter", or "calculatedParameter"
 * @property {string} type          The data type of the connector. Must be "Real", "Integer", "Boolean", "String", or "Enumeration"
 */

/**
 * Represents a connection of a SystemStructure object
 * 
 * @typedef {object} Connection
 * @property {string[]} subsystem       The hierarchy of top-level systems, where the connection is placed inside 
 * @property {string} element_start     The element where the connection starts from
 * @property {string} name_start        The connector where the connection starts from 
 * @property {string} element_end       The element where the connection ends 
 * @property {string} name_end          The connector where the connection ends
 */


module.exports = {
    /**
     * @type {ResultLog}
     * @type {SystemStructure}
     * @type {SystemElement}
     * @type {TElementInfo}
     * @type {Connector}
     * @type {Connection}
     */
}