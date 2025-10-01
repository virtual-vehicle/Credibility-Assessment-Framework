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

/**
 * Parameter Modification Type Definition
 * 
 * @typedef {Object} ParameterModification
 * @property {Object} modified_parameter 
 * @property {string} modified_parameter.name 
 * @property {string} modified_parameter.model_reference 
 * @property {string} modified_parameter.action 
 * @property {Object} [modified_parameter.modification]
 * @property {number} modified_parameter.modification.value
 * @property {string} [modified_parameter.modification.unit]
 * @property {Object} influenced_variable
 * @property {string} influenced_variable.name
 * @property {string} influenced_variable.model_reference
 * @property {string} influenced_variable.expectation
 * @property {string} influenced_variable.reference_point
 * @property {string} influenced_variable.comparison
 * @property {Object} [influenced_variable.threshold]
 * @property {number} influenced_variable.threshold.value
 * @property {string} [influenced_variable.threshold.unit]
 * @property {Object} [influenced_variable.tolerance]
 * @property {number} influenced_variable.tolerance.value
 * @property {string} [influenced_variable.tolerance.unit]
 */
 
/**
 * MeasurementCollection Type Definition
 * 
 * @typedef {Object} MeasurementCollection contains an arbitrary number of Measurement 
 *                                         objects for reference and variation
 * @property {Object.<string, Measurement>} reference
 * @property {Object.<string, Measurement>} variation
 */

/**
 * Measurement Type Definition
 * 
 * @typedef {Object} Measurement contains time and value arrays as well as a unit
 * @property {number[]} time
 * @property {number[]} values
 * @property {string} unit
 */

/**
 * SignalTuple Type Definition
 * 
 * @typedef {Object} SignalTuple a tuple of reference and variation Signals 
 * @property {Signal} reference reference signal 
 * @property {Signal} variation variation signal of the same quantity
 */

/**
 * CuttingIndices Type Definition
 * 
 * @typedef {Object} CuttingIndices start and end index for cutting Signals
 * @property {number} start start index
 * @property {number} end end index (not to be included)
 */

/**
 * @typedef {Object} CompareOptions
 * @property {string} [comparison] decides on either "absolute" or "relative" comparison
 * @property {number} [threshold] threshold on unequality operations (must be >= 0)
 * @property {number} [tolerance] tolerance on equality operations (must be >= 0)
 * @property {string} [unit] phsyical unit, if a plain number will be the reference
 * @property {number} [precision] precision to apply, if a plain number will be the reference (must be an integer > 0)
 * @property {boolean} [reduce] if set to true, a boolean will be returned for the compare function, stating if comparison is true for each element-wise comparison
 */

module.exports = {
    /**
     * @type {ResultLog}
     * @type {SystemStructure}
     * @type {SystemElement}
     * @type {Connector}
     * @type {Connection}
     * @type {MeasurementCollection}
     * @type {Measurement}
     * @type {SignalTuple}
     * @type {CuttingIndices}
     * @type {CompareOptions}
     */
}