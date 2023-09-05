/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * 
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

/**
 * KeyObject from node crypto module, for documentation, see https://nodejs.org/api/crypto.html#class-keyobject
 * 
 * @typedef {object} KeyObject
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
 * @property {number} status_code   additional information regarding the check for machine interpretation
 */

/**
 * Additional information required to specify a KeyObject
 * 
 * @typedef {object} KeySpec
 * @property {string} format        Format of the given key. Must be "pem", "der" or "jwk".
 * @property {string} [type]        Specifies the cryptography standard that has been used. Must be "pkcs1", "pkcs8" or "sec1". This option is required only if the format is "der" and ignored otherwise.
 * @property {boolean} isEncrypted  Indicates whether encryption is used
 * @property {string} [passphrase]  The passphrase to use for decryption of an encrypted key
 */

module.exports = {
    /**
     * @type {ResultLog}
     * @type {KeyObject}
     * @type {KeySpec}
     * @type {ExpertStatement}
     * @type {SignedStatement}
     */
}