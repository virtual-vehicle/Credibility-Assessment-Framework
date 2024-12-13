/**
 * CredibilityType
 * 
 * Defines the enclosing root element to signal that the following elements serve as input for a credibility assessment
 * 
 * @typedef {object} CredibilityType
 * @property {ProcessingType[]} Processing
 * @property {EvidenceType[]} Evidence All enclosing elements that define collections of metrics for a specific credibility level
 */

/**
 * EvidenceType
 * 
 * This element is used to collect metrics that serve as evidence for fulfilling a specific credibility level
 * 
 * @typedef {object} EvidenceType
 * @property {MetricType[]} Metric All metrics to be used
 * @property {EvidenceTypeAttributes} attributes
 */

/**
 * EvidenceTypeAttributes
 * 
 * @typedef {object} EvidenceTypeAttributes
 * @property {number} level
 */

/**
 * MetricType
 * 
 * This element is used to indicate that a metric from the Credibility Development Kit is used as supporting evidence 
 * for the corresponding credibility level.
 * 
 * @typedef {object} MetricType
 * @property {TestType[]} Test All Test executions of a concrete Metric
 * @property {MetricTypeAttributes} attributes 
 */

/**
 * MetricTypecAttributes
 * 
 * @typedef {object} MetricTypeAttributes
 * @property {string} packageUri
 * @property {string} function 
 */

/**
 * TestType
 * 
 * @typedef {object} TestType 
 * @property {FunctionArgumentType[]} FunctionArgument Defines the sources to use for the function arguments
 * @property {TestTypeAttributes} attributes
 */

/**
 * TestTypeAttributes
 * 
 * @typedef {object} TestTypeAttributes
 * @property {string} id This mandatory attribute specifies a unique identification of a test execution
 */

/**
 * FunctionArgumentType
 * 
 * This element is used to map a file to a function argument of the function that has been defined in a parent element
 * 
 * @typedef {object} FunctionArgumentType
 * @property {FunctionArgumentTypeAttributes} attributes
 */

/**
 * CommandLineInputType
 * 
 * @typedef {object} CommandLineInputType
 * @property {CommandLineInputTypeAttributes} attributes
 */

/**
 * CommandLineInputTypeAttributes
 * 
 * @typedef {object} CommandLineInputTypeAttributes
 * @property {string} flag
 * @property {string} [argument]
 * @property {string} [type]
 */

/**
 * FunctionArgumentTypeAttributes
 * 
 * @typedef {object} FunctionArgumentTypeAttributes
 * @property {string} name This mandatory attribute specifies the name of the argument as used in the target function 
 * @property {string} method This mandatory attribute specifies if the input content it fed inline via the "content" attribute or by means of a specified file source
 * @property {string} type This mandatory attribute specifies the MIME type of the file that shall be used as a 
 *                         function argument. The file type must be convertible to a string, i.e. no binary data
 *                         should be used.                
 * @property {string} [source] This attribute indicates the source of the file that shall be used as a function argument as an URI (cf. RFC 3986).  
 * @property {string} [content] content inline instead of by a file         
 */

/**
 * ProcessingType
 * 
 * @typedef {object} ProcessingType
 * @property {ProcessingTypeAttributes} attributes
 * @property {SimpleProcessingType} [SimpleProcessing]
 * @property {ComlexProcessingType} [ComplexProcessing]
 * @property {ProcessingPrerequisitesType[]} Prerequisites
 * @property {InputsType} [Inputs]
 * @property {OutputsType} [Outputs]
 */

/**
 * ProcessingTypeAttributes
 * 
 * @typedef {object} ProcessingTypeAttributes
 * @property {string} [description]
 */

/**
 * SimpleProcessingType
 * 
 * @typedef {object} SimpleProcessingType
 * @property {SimpleProcessingTypeAttributes} attributes
 */

/**
 * SimpleProcessingTypeAttributes
 * 
 * @typedef {object} SimpleProcessingTypeAttributes
 * @property {string} packageUri
 * @property {string} function
 * @property {string} [id]
 */

/**
 * ComlexProcessingType
 * 
 * @typedef {object} ComlexProcessingType
 * @property {ComlexProcessingTypeAttributes} attributes
 */

/**
 * ComlexProcessingTypeAttributes
 * 
 * @typedef {object} ComlexProcessingTypeAttributes
 * @property {string} method
 * @property {string} [source]
 * @property {string} [description]
 * @property {string} [id]
 */

/**
 * ProcessingPrerequisitesType
 * 
 * @typedef {object} ProcessingPrerequisitesType
 * @property {ProcessingPrerequisitesTypeAttributes} attributes
 */

/**
 * ProcessingPrerequisitesTypeAttributes
 * 
 * @typedef {object} ProcessingPrerequisitesTypeAttributes
 * @property {string} method
 * @property {string} source
 */

/**
 * InputsType
 * 
 * @typedef {object} InputsType
 * @property {InputsTypeAttributes} attributes
 * @property {FunctionArgumentType[]} FunctionArgument
 * @property {GenericInputType[]} Input
 */

/**
 * InputsTypeAttributes
 * 
 * @typedef {object} InputsTypeAttributes
 * @property {string} [description]
 */

/**
 * GenericInputType
 * 
 * @typedef {object} GenericInputType
 * @property {GenericInputTypeAttributes} attributes
 */

/**
 * GenericInputTypeAttributes
 * 
 * @typedef {object} GenericInputTypeAttributes
 * @property {string} description
 * @property {string} type
 * @property {string} path
 */

/**
 * OutputsType
 * 
 * @typedef {object} OutputsType
 * @property {OutputsTypeAttributes} attributes
 * @property {FunctionOutputType} [Return]
 * @property {GenericOutputType[]} Output
 */

/**
 * OutputsTypeAttributes
 * 
 * @typedef {object} OutputsTypeAttributes
 * @property {string} [description]
 */

/** 
 * FunctionOutputType
 * 
 * @typedef {object} FunctionOutputType
 * @property {FunctionOutputTypeAttributes} attributes
 */

/**
 * FunctionOutputTypeAttributes
 * 
 * @typedef {object} FunctionOutputTypeAttributes
 * @property {string} type
 * @property {string} path
 */

/**
 * GenericOutputType
 * 
 * @typedef {object} GenericOutputType
 * @property {GenericOutputTypeAttributes} attributes
 */

/**
 * GenericOutputTypeAttributes
 * 
 * @typedef {object} GenericOutputTypeAttributes
 * @property {string} description
 * @property {string} type
 * @property {string} path
 */

module.exports = {
    /**
     * @type {CredibilityType}
     * @type {EvidenceType}
     * @type {EvidenceAttributes}
     * @type {MetricType}
     * @type {MetricAttributes}
     * @type {TestType}
     * @type {FunctionArgumentType}
     * @type {FunctionArgumentAttributes}
     * @type {ProcessingType}
     * @type {SimpleProcessingType}
     * @type {SimpleProcessingTypeAttributes}
     * @type {ComlexProcessingType}
     * @type {ComlexProcessingTypeAttributes}
     * @type {ProcessingPrerequisitesType}
     * @type {ProcessingPrerequisitesTypeAttributes}
     * @type {InputsType}
     * @type {GenericInputType}
     * @type {GenericInputTypeAttributes}
     * @type {OutputsType}
     * @type {FunctionOutputType}
     * @type {FunctionOutputTypeAttributes}
     * @type {GenericOutputType}
     * @type {GenericOutputTypeAttributes}
     */
}

