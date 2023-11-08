module.exports = {
    /**
     * @type {SsvParameterSet}
     */
}

/**
 * SsvParameterSet
 * 
 * @typedef {object} SsvParameterSet
 * @property {SsvParameterSetAttributes} attributes
 * @property {SsvParameters} Parameters
 * @property {SscEnumerations} [Enumerations]
 * @property {SscUnits} [Units]
 * @property {SscAnnotations} [Annotations]
 */

/**
 * SsvParameterSetAttributes
 * 
 * @typedef {object} SsvParameterSetAttributes
 * @property {string} version 
 * @property {string} name 
 * @property {string} [id]
 * @property {string} [description]
 * @property {string} [author]
 * @property {string} [fileversion]
 * @property {string} [copyright]
 * @property {string} [license]
 * @property {string} [generatingTool]
 * @property {string} [generationDateAndTime]
 */

/**
 * SsvParameters
 * 
 * @typedef {object} SsvParameters
 * @property {SsvParameter[]} Parameter
 */

/**
 * SsvParameter
 * 
 * @typedef {object} SsvParameter
 * @property {SsvParameterAttributes} attributes
 * @property {SsvReal} [Real]
 * @property {SsvInteger} [Integer]
 * @property {SsvBoolean} [Boolean]
 * @property {SsvString} [String]
 * @property {SsvEnumeration} [Enumeration]
 * @property {SsvBinary} [Binary]
 * @property {SscAnnotations} [Annotations]
 */

/**
 * SsvParameterAttributes
 * 
 * @typedef {object} SsvParameterAttributes
 * @property {string} name 
 * @property {string} [id]
 * @property {string} [description]
 */

/**
 * SsvReal
 * 
 * @typedef {object} SsvReal
 * @property {SsvRealAttributes} attributes
 */

/**
 * SsvRealAttributes
 * 
 * @typedef {object} SsvRealAttributes
 * @property {number} value
 * @property {string} [unit]
 */

/**
 * SsvInteger
 * 
 * @typedef {object} SsvInteger
 * @property {SsvIntegerAttributes} attributes
 */

/**
 * SsvIntegerAttributes
 * 
 * @typedef {object} SsvIntegerAttributes
 * @property {number} value
 */

/**
 * SsvBoolean
 * 
 * @typedef {object} SsvBoolean
 * @property {SsvBooleanAttributes} attributes
 */

/**
 * SsvBooleanAttributes
 * 
 * @typedef {object} SsvBooleanAttributes
 * @property {boolean} value
 */

/**
 * SsvString
 * 
 * @typedef {object} SsvString
 * @property {SsvStringAttributes} attributes
 */

/**
 * SsvStringAttributes
 * 
 * @typedef {object} SsvStringAttributes
 * @property {string} value
 */

/**
 * SsvEnumeration
 * 
 * @typedef {object} SsvEnumeration
 * @property {SsvEnumerationAttributes} attributes
 */

/**
 * SsvEnumerationAttributes
 * 
 * @typedef {object} SsvEnumerationAttributes
 * @property {string} value
 * @property {string} [name]
 */

/**
 * SsvBinary
 * 
 * @typedef {object} SsvBinary
 * @property {SsvBinaryAttributes} attributes
 */

/**
 * SsvBinaryAttributes
 * 
 * @typedef {object} SsvBinaryAttributes
 * @property {string} mime_type
 * @property {string} value
 */

/**
 * SscEnumerations
 * 
 * @typedef {object} SscEnumerations
 * @property {SscEnumeration[]} Enumeration
 */

/**
 * SscEnumeration
 * 
 * @typedef {object} SscEnumeration
 * @property {SscEnumerationAttributes} attributes
 * @property {SscItem[]} Item
 * @property {SscAnnotations} [Annotations]
 */

/**
 * SscEnumerationAttributes
 * 
 * @typedef {object} SscEnumerationAttributes
 * @property {string} name 
 * @property {string} [id]
 * @property {string} [description]
 */

/**
 * SscItem
 * 
 * @typedef {object} SscItem
 * @property {SscItemAttributes} attributes
 */

/**
 * SscItemAttributes
 * 
 * @typedef {object} SscItemAttributes
 * @property {string} name 
 * @property {number} value
 */

/**
 * SscUnits
 * 
 * @typedef {object} SscUnits
 * @property {SscUnit[]} Unit
 */

/**
 * SscUnit
 * 
 * @typedef {object} SscUnit
 * @property {SscUnitAttributes} attributes
 * @property {SscBaseUnit} BaseUnit
 * @property {SscAnnotations} [Annotations]
 */

/**
 * SscUnitAttributes
 * 
 * @typedef {object} SscUnitAttributes
 * @property {string} name 
 * @property {string} [id]
 * @property {string} [description]
 */

/**
 * SscBaseUnit
 * 
 * @typedef {object} SscBaseUnit
 * @property {SscBaseUnit} attributes
 */

/**
 * SscBaseUnitAttributes
 * 
 * @typedef {object} SscBaseUnitAttributes
 * @property {number} [kg]
 * @property {number} [m]
 * @property {number} [s]
 * @property {number} [A]
 * @property {number} [K]
 * @property {number} [mol]
 * @property {number} [cd]
 * @property {number} [rad]
 * @property {number} [factor]
 * @property {number} [offset]
 */

/**
 * SscAnnotations
 * 
 * @typedef {object} SscAnnotations
 * @property {SscAnnotation[]} Annotation
 */

/**
 * SscAnnotation
 * 
 * @typedef {object} SscAnnotation
 * @property {SscAnnotationAttributes} attributes
 * @property {object[]} content
 */

/**
 * SscAnnotationAttributes
 * 
 * @typedef {object} SscAnnotationAttributes
 * @property {string} type
 */