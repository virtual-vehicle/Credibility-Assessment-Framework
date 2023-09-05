const crypto = require('crypto');
const helper = require('./helper');
const common = require('../util-common');
const schemas = require('./types/schemas');

 /**
 * @module util/sign-data
 */

 /**
 * @typedef {import('./types/types').ResultLog} ResultLog
 * @typedef {import('./types/types').KeySpec} KeySpec
 * @typedef {import('./types/types').ExpertStatement} ExpertStatement
 */

exports.checkExpertStatement = checkExpertStatement;
exports.sign = sign;
exports.verify = verify;

/**
 * This metric takes a signed expert statement, checks if the signature of the expert is valid (against a given
 * X509 certificate) and processes the expert statement.
 * 
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @param {String} signedExpertStatement  stringified JSON that implements the {@link schemas.SIGNED_STATEMENT} schema
 * @param {String|Buffer} x509Certificate PEM- or DER-encoded X509 certificate. If PEM is used, a string is expected, 
 *                                        if DER is used, a Buffer is expected
 * @returns {ResultLog} result and logging information
 */
function checkExpertStatement(signedExpertStatement, x509Certificate) {
    // the verify method checks validity of inputs, therefore no need to check it again
    const isSignatureValid = verify(signedExpertStatement, x509Certificate);

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

/**
 * Adds a signature to the given content, according to the given private key and returns a JSON, consisting of the following properties: content (the content that is signed),
 * signature (the signature as encoded String), hash_algorithm (the used hash algo. SHA256 by default), signature_encoding (the binary-to-text encoding, used for creating
 * the signature, hex by default)
 *
 * @author localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @param {ExpertStatement} expertStatement  The expert statement that needs to be signed
 * @param {String|Object|Buffer} privateKey  Private key as PEM, JWK or DER. If PEM is used, a utf-8 encoded string must be passed; 
 *                                           if JWK is used the JSON object must be passed; and if DER is used a Buffer must be passed.
 * @param {KeySpec} keySpecification         The specification of the given private key (cf. KeySpec definition)
 * @return {String}                          Stringified JSON, consisting of the expert statement, signature and the meta-data (cf. description above)
*/
function sign(expertStatement, privateKey, keySpecification) {
    if(!common.isStructureValid(expertStatement, schemas.EXPERT_STATEMENT)) {
        throw("expertStatement structure is not valid");
    }

    var privateKeyObject;
    const HASH_FUNCTION = "SHA256";
    const SIGNATURE_ENCODING = "hex";

    try {
        privateKeyObject = helper.createPrivateKeyObject(privateKey, keySpecification);
    }
    catch (err) {
        if (err.code == "ERR_OSSL_EVP_BAD_DECRYPT")
            throw("passphrase is wrong!")
        else 
            throw(err);
    }

    const signObject = crypto.createSign(HASH_FUNCTION);
    signObject.update(JSON.stringify(expertStatement));
    signObject.end();
    const signature = signObject.sign(privateKeyObject, SIGNATURE_ENCODING);

    const signedStatement = {
        content: expertStatement,
        signature: signature,
        hash_algorithm: HASH_FUNCTION,
        signature_encoding: SIGNATURE_ENCODING
    };
    
    return JSON.stringify(signedStatement);
}

/**
 * Checks, if the document that has been signed with the sign function has been signed by the 
 * holder of the given certificate 
 *
 * @author   localhorst87
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @param {String}           signedStatement         The signed statement as a string, as it was returned by the "sign" function
 * @param {String|Buffer}    x509Certificate         A PEM or DER encoded X509 Certificate. If PEM is used, a utf-8 encoded string must be passed,
 *                                                   if DER is used a Buffer must be passed.
 * @return {ResultLog}                               returns true/false w.r.t. the validity of the signature for the data and public key
*/
function verify(signedStatement, x509Certificate) {
    if(typeof(signedStatement) != "string") {
        return {
            result: false,
            log: "signedStatement must be a stringified ExpertStatement JSON"
        };
    }

    try {
        signedStatement = JSON.parse(signedStatement);
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse the signed statement (" + err + ")"
        };
    }
    
    if(!common.isStructureValid(signedStatement, schemas.SIGNED_STATEMENT)) {
        return {
            result: false,
            log: "signedStatement structure is not valid"
        };
    }

    const certCheck = helper.isCertificateValid(x509Certificate)
    if(certCheck.result == false) {
        return {
            result: false,
            log: certCheck.log
        }
    }

    const x509Object = new crypto.X509Certificate(x509Certificate);
    const publicKey = x509Object.publicKey;
    const verifyObject = crypto.createVerify(signedStatement.hash_algorithm);
    verifyObject.update(JSON.stringify(signedStatement.content));
    verifyObject.end();
    const verification = verifyObject.verify(publicKey, signedStatement.signature, signedStatement.signature_encoding);
    
    if(verification == true) {
        return {
            result: true,
            log: "signature is valid"
        };
    }
    else {
        return {
            result: false,
            log: "signature is not valid"
        };
    }
}