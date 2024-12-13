/**
 * @typedef {import('../types/specification').SsvParameterSet} SsvParameterSet
 * @typedef {import('../types/specification').SsvParameterSetAttributes} SsvParameterSetAttributes
 * @typedef {import('../types/specification').SsvParameters} SsvParameters
 * @typedef {import('../types/specification').SsvParameter} SsvParameter
 * @typedef {import('../types/specification').SsvParameterAttributes} SsvParameterAttributes
 * @typedef {import('../types/specification').SsvReal} SsvReal
 * @typedef {import('../types/specification').SsvInteger} SsvInteger
 * @typedef {import('../types/specification').SsvBoolean} SsvBoolean
 * @typedef {import('../types/specification').SsvString} SsvString
 * @typedef {import('../types/specification').SsvEnumeration} SsvEnumeration
 * @typedef {import('../types/specification').SsvBinary} SsvBinary
 * @typedef {import('../types/specification').SsvRealAttributes} SsvRealAttributes
 * @typedef {import('../types/specification').SsvIntegerAttributes} SsvIntegerAttributes
 * @typedef {import('../types/specification').SsvBooleanAttributes} SsvBooleanAttributes
 * @typedef {import('../types/specification').SsvStringAttributes} SsvStringAttributes
 * @typedef {import('../types/specification').SsvEnumerationAttributes} SsvEnumerationAttributes
 * @typedef {import('../types/specification').SsvBinaryAttributes} SsvBinaryAttributes
 * @typedef {import('../types/specification').SscAnnotations} SscAnnotations
 * @typedef {import('../types/specification').SscAnnotation} SscAnnotation
 * @typedef {import('../types/specification').SscAnnotationAttributes} SscAnnotationAttributes
 * @typedef {import('../types/specification').SscEnumerations} SscEnumerations
 * @typedef {import('../types/specification').SscEnumeration} SscEnumeration
 * @typedef {import('../types/specification').SscEnumerationAttributes} SscEnumerationAttributes
 * @typedef {import('../types/specification').SscItem} SscItem
 * @typedef {import('../types/specification').SscItemAttributes} SscItemAttributes
 * @typedef {import('../types/specification').SscUnits} SscUnits
 * @typedef {import('../types/specification').SscUnit} SscUnit
 * @typedef {import('../types/specification').SscUnitAttributes} SscUnitAttributes
 * @typedef {import('../types/specification').SscBaseUnit} SscBaseUnit
 * @typedef {import('../types/specification').SscBaseUnitAttributes} SscBaseUnitAttributes
 */

exports.transformSsvParameter = transformSsvParameter;

/**
 * @param {SsvParameterSetAttributes} attributes
 * @returns {object}
 */
function transformSsvParameterSetAttributes(attributes) {
    return {
        '@_version': attributes.version,
        '@_name': attributes.name,
        '@_id': attributes.id,
        '@_description': attributes.description,
        '@_author': attributes.author,
        '@_fileversion': attributes.fileversion,
        '@_copyright': attributes.copyright,
        '@_license': attributes.license,
        '@_generationTool': attributes.generationTool,
        '@_generationDateAndTime': attributes.generationDateAndTime
    };
}

/**
 * @param {SsvParameter[]} parameters 
 * @returns 
 */
function transformSsvParameter(parameters) {
    let transformedParameters = [];

    for (let parameter of parameters) {
        transformedParameters.push({
            '@_name': parameter.attributes.name,
            '@_id': parameter.attributes.id,
            '@_description': parameter.attributes.description,
            'ssv:Real': parameter.Real !== undefined ? transformSsvReal(parameter.Real) : undefined,
            'ssv:Integer': parameter.Integer !== undefined ? transformSsvInteger(parameter.Integer) : undefined,
            'ssv:Boolean': parameter.Boolean !== undefined ? transformSsvBoolean(parameter.Boolean) : undefined,
            'ssv:String': parameter.String !== undefined ? transformSsvString(parameter.String) : undefined,
            'ssv:Enumeration': parameter.Enumeration !== undefined ? transformSsvEnumeration(parameter.Enumeration) : undefined,
            'ssv:Binary': parameter.Binary !== undefined ? transformSsvBinary(parameter.Binary) : undefined,
            'ssv:Annotations': parameter.Annotations !== undefined ? transformSscAnnotations(parameter.Annotations): undefined
        })
    }

    return transformedParameters;
}

/**
 * @param {SsvReal} real 
 * @returns {object}
 */
function transformSsvReal(real) {
    return {
        '@_value': String(real.attributes.value),
        '@_unit': real.attributes.unit
    };
}

/**
 * @param {SsvInteger} integer 
 * @returns {object}
 */
function transformSsvInteger(integer) {
    return {
        '@_value': String(integer.attributes.value)
    };
}

/**
 * @param {SsvBoolean} integer 
 * @returns {object}
 */
function transformSsvBoolean(integer) {
    return {
        '@_value': String(integer.attributes.value)
    };
}

/**
 * @param {SsvString} string 
 * @returns {object}
 */
function transformSsvString(string) {
    return {
        '@_value': string.attributes.value
    };
}

/**
 * @param {SsvEnumeration} enumeration 
 * @returns {object}
 */
function transformSsvEnumeration(enumeration) {
    return {
        '@_value': enumeration.attributes.value,
        '@_name': enumeration.attributes.name
    };
}

/**
 * @param {SsvBinary} binary 
 * @returns {object}
 */
function transformSsvBinary(binary) {
    return {
        '@_mime-type': binary.attributes.mime_type,
        '@_value': binary.attributes.value
    };
}

/**
 * @param {SscAnnotations} annotations 
 * @returns {object}
 */
function transformSscAnnotations(annotations) {
    return {
        'ssc:Annotation': transformSscAnnotation(annotations.Annotation)
    };
}

/**
 * @param {SscAnnotation[]} annotations 
 * @returns {object}
 */
function transformSscAnnotation(annotations) {
    let transformedAnnotations = [];

    for (let annotation of annotations) {
        let annotationContent = {...annotation.content};
        annotationContent['@_type'] = annotation.attributes.type;
        transformedAnnotations.push(annotationContent);
    }
    
    return transformedAnnotations;
}