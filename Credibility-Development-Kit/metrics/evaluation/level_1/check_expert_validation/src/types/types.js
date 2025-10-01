/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * 
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

/**
 * SignedStatement structure
 * 
 * @typedef {object} SignedStatement
 * @property {ExpertStatement} content      The expert statement in a formal structure
 * @property {string} signature             The signature that has been generated from the stringified ExpertStatement
 * @property {string} hash_algorithm        The hash algorithm that has been used to generate the signature
 * @property {string} signature_encoding    The encoding of the signature (currently, only "hex" is allowed)
 */

/**
 * Formal structure to describe an expert statement
 * 
 * @typedef {object} ExpertStatement
 * @property {boolean} result       result of the experts check (passed or not passed)
 * @property {string} log           additional information regarding the check for human interpretation
 */


module.exports = {
    /**
     * @type {ResultLog}
     * @type {SignedStatement}
     * @type {ExpertStatement}
     */
}