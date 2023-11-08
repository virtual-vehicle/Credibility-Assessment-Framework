const parser = require('./parser');
const extractors = require('./extractors');
const inserters = require('./inserters');

/**
 * @typedef {import('../types/specification').SsvParameterSet} SsvParameterSet
 * @typedef {import('../types/specification').SsvParameterSetAttributes} SsvParameterSetAttributes
 * @typedef {import('../types/specification').SsvParameter} SsvParameter
 * @typedef {import('../types/specification').SsvParameterAttributes} SsvParameterAttributes
 * @typedef {import('../types/specification').SscEnumeration} SscEnumeration
 * @typedef {import('../types/specification').SscUnit} SscUnit
 * @typedef {import('../types/specification').SscAnnotation} SscAnnotation
 */

exports.SsvCrud = class SsvCrud {
    /**
     * The raw parsed SSV file, parsed by fast-xml-parser
     * 
     * @private 
     * @type {object}
     */
    #ssvRawParsed;

    /**
     * Attributes of the SsvParameterSet
     * 
     * @private
     * @type {SsvParameterSetAttributes}
     */
    #topLevelInformation;

    /**
     * All parameters of the SSV
     * 
     * @private 
     * @type {SsvParameter[]}
     */
    #parameters;

    /**
     * All enums of the SSV
     * 
     * @private
     * @type {SscEnumeration[]}
     */
    #enumerations;

    /**
     * All units of the SSV
     * 
     * @private
     * @type {SscUnit[]}
     */
    #units;

    /**
     * All annotations of the SSV
     * 
     * @private
     * @type {SscAnnotation[]}
     */
    #annotations;


    /**
     * @param {string} ssvString the stringified SSV file
     */
    constructor(ssvString = "") {
        if (ssvString !== "") {
            this.#ssvRawParsed = parser.parseSSV(ssvString);
            const ssvParameterset = extractors.extractSsvParameterSet(this.#ssvRawParsed);

            this.#topLevelInformation = ssvParameterset.attributes;
            this.#parameters = ssvParameterset.Parameters.Parameter;
            this.#enumerations = ssvParameterset.Enumerations !== undefined ? ssvParameterset.Enumerations.Enumeration : [];
            this.#units = ssvParameterset.Units !== undefined ? ssvParameterset.Units.Unit : [];
            this.#annotations = ssvParameterset.Annotations !== undefined ? ssvParameterset.Annotations.Annotation : [];
        }
    }

    /**
     * Export to .ssv format
     * @returns {string}
     */
    export() {
        // on-the-fly solution for simple purpose of changing SSVs
        // TO DO: imlement complete solution, after all elements can be CRUD.

        this.#ssvRawParsed['ssv:ParameterSet']['ssv:Parameters']['ssv:Parameter'] = inserters.transformSsvParameter(this.#parameters);

        return parser.writeSSV(this.#ssvRawParsed);
    }

    /**
     * Returns the value of the parameter with the given name
     * 
     * @param {string} parameterName 
     * @returns {number | string | boolean}
     */
    getParameterValue(parameterName) {
        const parameter = this.#parameters.find(parameter => parameter.attributes.name === parameterName);
        if (parameter === undefined)
            throw("parameter " + parameterName + " does not exist!");
        
        const dataType = this.#getParameterType(parameter);

        return parameter[dataType].attributes.value;        
    }

    /**
     * Returns the data type of the parameter (Real, Integer, String, Boolean, Enumeration, or Binary)
     * 
     * @param {string} parameterName 
     * @returns {string}
     */
    getParameterType(parameterName) {
        const parameter = this.#parameters.find(parameter => parameter.attributes.name === parameterName);
        if (parameter === undefined)
            throw("parameter " + parameterName + " does not exist!");
        
        return this.#getParameterType(parameter);
    }

    /**
     * Sets the value of a parameter
     * 
     * @param {string} parameterName 
     * @param {number | string | boolean} value
     */
    setParameterValue(parameterName, value) {
        const idxParameter = this.#parameters.findIndex(parameter => parameter.attributes.name === parameterName);
        if (idxParameter < 0)
            throw("parameter " + parameterName + " does not exist!");

        const dataType = this.#getParameterType(this.#parameters[idxParameter]);

        switch (dataType) {
            case "Real": 
                value = Number(value);
                break;
            case "Integer": 
                value = Number(value);
                break;
            case "Boolean": 
                value = Boolean(value);
                break;
            default: 
                value = String(value);
        }

        this.#parameters[idxParameter][dataType].attributes.value = value;        
    }

    #getParameterType(parameter) {
        const prunedParameter = extractors.pruneObject(parameter, ['attributes']);

        return Object.keys(prunedParameter)[0];
    }
}