const verisign = require("../../../../util/veri-sign");
const { SIGNED_STATEMENT } = require("../types/schemas");

 /**
 * @typedef {import('../types/types').ResultLog} ResultLog
 * @typedef {import('../types/types').SignedStatement} SignedStatement
 */

/**
 * This metric takes a signed expert statement, checks if the signature of the expert is valid (against a given
 * X509 certificate) and processes the expert statement.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 0.2
 * @param {String} signedExpertStatement  stringified JSON implement the {@link SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, 
 *                                        if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
function checkExpertStatement(signedExpertStatement, x509Certificate) {
    // the verify method checks validity of inputs, therefore no need to check it again
    const isSignatureValid = verisign.verify(signedExpertStatement, x509Certificate);

    if (isSignatureValid.result === false) {
        return {
            result: false,
            log: "The expert statement could not be verified (" + verification.log + ")"
        };
    }
    else {
        const parsedStatement = JSON.parse(signedExpertStatement);

        return {
            result: parsedStatement.content.result,
            log: parsedStatement.content.log
        };
    }
}

exports.checkExpertStatement = checkExpertStatement;