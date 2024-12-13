/**
 * @typedef {import('../types/specification').SsvParameterSet} SsvParameterSet
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

exports.extractSsvParameterSet = extractSsvParameterSet;
exports.pruneObject = pruneObject;

/**
 * Extracts the complete SsvParameterSet
 * @param {object} ssv the raw-parsed ssv file
 * @returns {SsvParameterSet} the transformed SsvParameterSet
 */
function extractSsvParameterSet(ssv) {
    return transformSsvParameterSet(ssv['ssv:ParameterSet'])
}

/**
 * @param {object} parameterSet raw-parsed ParameterSet object
 * @returns {SsvParameterSet} transformed SsvParameterSet object
 */
function transformSsvParameterSet(parameterSet) {
    return {
        attributes: {
            version: parameterSet['@_version'],
            name: parameterSet['@_name'],
            id: parameterSet['@_id'],
            description: parameterSet['@_description'],
            author: parameterSet['@_author'],
            fileversion: parameterSet['@_fileversion'],
            copyright: parameterSet['@_copyright'],
            license: parameterSet['@_license'],
            generatingTool: parameterSet['@_generatingTool'],
            generationDateAndTime: parameterSet['@_generationDateAndTime']
        },
        Parameters: transformSsvParameters(parameterSet['ssv:Parameters']),
        Enumerations: parameterSet['ssv:Enumerations'] !== undefined ? transformSscEnumerations(parameterSet['ssv:Enumerations']) : undefined,
        Units: parameterSet['ssv:Units'] !== undefined ? transformSscUnits(parameterSet['ssv:Units']) : undefined,
        Annotations: parameterSet['ssv:Annotations'] !== undefined ? transformSscAnnotations(parameterSet['ssv:Annotations']) : undefined,
    };
}

/**
 * @param {object} parameters raw-parsed TParameters object
 * @returns {SsvParameters} transformed SsvParameters object
 */
function transformSsvParameters(parameters) {
    return {
        Parameter: transformSsvParameter(parameters['ssv:Parameter'])
    };
}

/**
 * @param {object[]} parameters raw-parsed TParameter array
 * @returns {SsvParameter[]} transformed SsvParameter array
 */
function transformSsvParameter(parameters) {
    let transformedParameters = [];

    for (let parameter of parameters) {
        transformedParameters.push({
            attributes: {
                name: parameter['@_name'],
                id: parameter['@_id'],
                description: parameter['@_description']
            },
            Real: parameter['ssv:Real'] !== undefined ? transformSsvReal(parameter['ssv:Real']) : undefined,
            Integer: parameter['ssv:Integer'] !== undefined ? transformSsvInteger(parameter['ssv:Integer']) : undefined,
            Boolean: parameter['ssv:Boolean'] !== undefined ? transformSsvBoolean(parameter['ssv:Boolean']) : undefined,
            String: parameter['ssv:String'] !== undefined ? transformSsvString(parameter['ssv:String']) : undefined,
            Enumeration: parameter['ssv:Enumeration'] !== undefined ? transformSsvEnumeration(parameter['ssv:Enumeration']) : undefined,
            Binary: parameter['ssv:Binary'] !== undefined ? transformSsvBinary(parameter['ssv:Binary']) : undefined,
            Annotations: parameter['ssc:Annotations'] !== undefined ? transformSscAnnotations(parameter['ssc:Annotations']) : undefined
        })
    }

    return transformedParameters;
}

/**
 * @param {object} real raw-parsed Real object
 * @returns {SsvReal} transformed SsvReal object
 */
function transformSsvReal(real) {
    return {
        attributes: {
            value: Number(real['@_value']),
            unit: real['@_unit']
        }
    };
}

/**
 * @param {object} integer raw-parsed Integer object
 * @returns {SsvReal} transformed SsvInteger object
 */
function transformSsvInteger(integer) {
    return {
        attributes: {
            value: Number(real['@_value'])
        }
    };
}

/**
 * @param {object} boolean raw-parsed Boolean object
 * @returns {SsvBoolean} transformed SsvBoolean object
 */
function transformSsvBoolean(boolean) {
    return {
        attributes: {
            value: Boolean(boolean['@_value'])
        }
    };
}

/**
 * @param {object} string raw-parsed String object
 * @returns {SsvString} transformed SsvString object
 */
function transformSsvString(string) {
    return {
        attributes: {
            value: string['@_value']
        }
    };
}

/**
 * @param {object} enumeration raw-parsed Enumeration object
 * @returns {SsvEnumeration} transformed SsvEnumeration object
 */
function transformSsvEnumeration(enumeration) {
    return {
        attributes: {
            value: enumeration['@_value'],
            name: real['@_name']
        }
    };
}

/**
 * @param {object} binary raw-parsed Binary object
 * @returns {SsvBinary} transformed SsvBinary object
 */
function transformSsvBinary(binary) {
    return {
        attributes: {
            mime_type: binary['@_mime-type'],
            value: binary['@_value']
        }
    };
}

/**
 * @param {object} annotations raw-parsed Annotations object
 * @returns {SscAnnotations} transformed SscAnnotations object
 */
function transformSscAnnotations(annotations) {
    return {
        Annotation: transformSscAnnotations(annotations['ssc:Annotation'])
    };
}

/**
 * @param {object[]} annotations raw-parsed Annotation array
 * @returns {SscAnnotation[]} transformed SscAnnotation array
 */
function transformSscAnnotation(annotations) {
    let transformedAnnotations = [];

    for (let annotation of annotations) {
        transformedAnnotations.push({
            attributes: {
                type: annotation['@_type']
            },
            content: pruneObject(annotation, ['@_type'])
        })
    }

    return transformedAnnotations;
}

/**
 * @param {object} enumerations raw-parsed TEnumerations object
 * @returns {SscEnumerations} transformed SscEnumerations object
 */
function transformSscEnumerations(enumerations) {
    return {
        Enumerations: transformSscEnumeration(enumerations['ssc:Enumeration'])
    };
}

/**
 * @param {object[]} enumerations raw-parsed TEnumeration array
 * @returns {SscEnumeration[]} transformed SscEnumeration array
 */
function transformSscEnumeration(enumerations) {
    let transformedEnumerations = [];

    for (let enumeration of enumerations) {
        transformedEnumerations.push({
            attributes: {
                name: enumeration['@_name'],
                id: enumeration['@_id'],
                description: enumeration['@_description']
            },
            Item: transformSscItem(enumeration['ssc:Item']),
            Annotations: enumeration['ssc:Annotations'] !== undefined ? transformSscAnnotations(enumeration['ssc:Annotations']): undefined
        });
    }

    return transformedEnumerations;
}

/**
 * 
 * @param {object[]} items raw-parsed Item array
 * @returns {SscItem[]} transformed SscItem array
 */
function transformSscItem(items) {
    let transformedItems = [];

    for (let item of items) {
        transformedItems.push({
            attributes: {
                name: item['@_name'],
                value: Number(item['@_value'])
            }
        });
    }

    return transformedItems;
}

/**
 * @param {object} units raw-parsed TUnits object
 * @returns {SscUnits} transformed SscUnits object 
 */
function transformSscUnits(units) {
    return {
        Unit: transformSscUnit(units['ssc:Unit'])
    };
}

/** 
 * @param {object[]} units raw-parsed TUnit array
 * @returns {SscUnit[]} transformed SscUnit array
 */
function transformSscUnit(units) {
    let transformedUnits = [];

    for (let unit of units) {
        transformedUnits.push({
            attributes: {
                name: unit['@_name'],
                id: unit['@_id'],
                description: unit['@_description']
            },
            BaseUnit: transformSscBaseUnit(unit['ssc:BaseUnit']),
            Annotations: unit['ssc:Annotations'] !== undefined ? transformSscAnnotations(unit['ssc:Annotations']) : undefined
        });
    }

    return transformedUnits;
}

/**
 * @param {object} baseUnit raw-parsed BaseUnit object
 * @returns {SscBaseUnit} transformed SscBaseUnit object
 */
function transformSscBaseUnit(baseUnit) {
    return {
        attributes: {
            kg: baseUnit['@_kg'] !== undefined ? Number(baseUnit['@_kg']) : undefined,
            m: baseUnit['@_m'] !== undefined ? Number(baseUnit['@_m']) : undefined,
            s: baseUnit['@_s'] !== undefined ? Number(baseUnit['@_s']) : undefined,
            A: baseUnit['@_A'] !== undefined ? Number(baseUnit['@_A']) : undefined,
            K: baseUnit['@_K'] !== undefined ? Number(baseUnit['@_K']) : undefined,
            mol: baseUnit['@_mol'] !== undefined ? Number(baseUnit['@_mol']) : undefined,
            cd: baseUnit['@_cd'] !== undefined ? Number(baseUnit['@_cd']) : undefined,
            rad: baseUnit['@_rad'] !== undefined ? Number(baseUnit['@_rad']) : undefined,
            factor: baseUnit['@_factor'] !== undefined ? Number(baseUnit['@_factor']) : undefined,
            offset: baseUnit['@_offset'] !== undefined ? Number(baseUnit['@_offset']) : undefined
        }
    };
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