const crypto = require('crypto');
const helper = require('./helper');
const Types = require('./types/types');

 /**
 * @module util/sign-data
 */

 /**
 * @typedef {import('./types/types').ResultLog} ResultLog
 * @typedef {import('./types/types').KeySpec} KeySpec
 */

exports.sign = sign;
exports.verify = verify;

/**
 * Adds a signature to the given content, according to the given private key and returns a JSON, consisting of the following properties: content (the content that is signed),
 * signature (the signature as encoded String), hash_algorithm (the used hash algo. SHA256 by default), signature_encoding (the binary-to-text encoding, used for creating
 * the signature, hex by default)
 *
 * @author   localhorst87
 * @param    {String} contentToSign             The content that needs to be signed. Will be wrapped in a JSON as a result of this function
 * @param    {String|Object|Buffer} privateKey  Private key as PEM, JWK or DER. If PEM is used, a utf-8 encoded string must be passed; 
 *                                              if JWK is used the JSON object must be passed; and if DER is used a Buffer must be passed.
 * @param    {KeySpec} keySpecification         The specification of the given private key (cf. KeySpec definition)
 * @return   {String}                           Stringified JSON, consisting of the content, signature and the meta-data (cf. description above)
*/
function sign(contentToSign, privateKey, keySpecification) {
    if (contentToSign == "" || typeof(contentToSign) != "string") {
        throw("contentToSign must be a non-empty string!");
    }

    const privateKeyObject = helper.createPrivateKeyObject(privateKey, keySpecification);
    const HASH_FUNCTION = "SHA256";
    const SIGNATURE_ENCODING = "hex";

    const signObject = crypto.createSign(HASH_FUNCTION);
    signObject.update(contentToSign);
    signObject.end();
    const signature = signObject.sign(privateKeyObject, SIGNATURE_ENCODING);

    const signedStatement = {
        content: contentToSign,
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
 * @param    {String}           signedStatement         The signed statement as a string, as it was returned by the "sign" function
 * @param    {String|Buffer}    x509Certificate         A PEM or DER encoded X509 Certificate. If PEM is used, a utf-8 encoded string must be passed,
 *                                                      if DER is used a Buffer must be passed.
 * @return   {ResultLog}                                   returns true/false w.r.t. the validity of the signature for the data and public key
*/
function verify(signedStatement, x509Certificate) {
    if(typeof(signedStatement) != "string") {
        return {
            result: false,
            log: "signedStatement must be stringified JSON"
        };
    }
    
    if(!helper.isDocumentStructureValid(signedStatement)) {
        return {
            result: false,
            log: "signedStatement structure is not valid"
        };
    }

    let certCheck = helper.isCertificateValid(x509Certificate)
    if(certCheck.result == false) {
        return {
            result: false,
            log: certCheck.log
        }
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

    let x509Object = new crypto.X509Certificate(x509Certificate);
    let publicKey = x509Object.publicKey;

    const verifyObject = crypto.createVerify(signedStatement.hash_algorithm);
    verifyObject.update(signedStatement.content);
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