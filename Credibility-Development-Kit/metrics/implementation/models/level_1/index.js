const verisign = require("../../../../util/veri-sign");
const Types = require("../../../../types");

/**
 * @module metrics/implementation/models/level_1
 */

/**
 * @typedef {import('../../../../types').ResultLog} ResultLog
 */

exports.verifyExpertStatement = verifyExpertStatement;

/**
 * Checks if the given document has been signed by the expert that is identified by the given X509 certificate
 *
 * @author   localhorst87
 * @param    {String} signedDocument            stringified JSON containing the following properties: content, signature, 
 *                                              hash_algorithm, signature_encoding. 
 *                                              Can be created using sign from util/veri-sign.
 * @param    {String|Buffer} x509Certificate    PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected,
 *                                              if DER is used, a Buffer is expected
 * @return   {ResultLog}                        returns true/false upon valid/invalid signature
*/
function verifyExpertStatement(signedDocument, x509Certificate) {
    // Valid signedDocument type and structure is checked within util/veri-sign/verify.
    // Certificate validity is checked within util/veri-sign/verify as well

    const verification = verisign.verify(signedDocument, x509Certificate);

    if (verification.result == true) {
        return {
            result: true,
            log: "The expert statement has been proven valid" 
        };
    }
    else {
        return {
            result: false, 
            log: "The expert statement could not be proven valid (" + verification.log + ")"
        }
    };
}