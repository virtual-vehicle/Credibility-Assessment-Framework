const crypto = require('crypto');
const Ajv = require("ajv");
const ajv = new Ajv();
require("ajv-keywords")(ajv);

/**
 * @typedef {import('../../types').ResultLog} ResultLog
 * @typedef {import('../../types').KeyObject} KeyObject
 * @typedef {import('../../types').KeySpec} KeySpec
*/

exports.createPrivateKeyObject = createPrivateKeyObject;
exports.isKeySpecValid = isKeySpecValid;
exports.isDocumentStructureValid = isDocumentStructureValid;
exports.isCertificateValid = isCertificateValid;
 
/**
 * creates a Private Key Object from the node crypto module, that must be used in the signing function
 * @author   localhorst87
 * @private
 * @param    {String|Object|Buffer} privateKey  Private key as PEM, JWK or DER. If PEM is used, a utf-8 encoded string must be passed; 
 *                                              if JWK is used the JSON object must be passed; and if DER is used a Buffer must be passed.
 * @param    {KeySpec} keySpecification         specification object, that is used as input for signDocument
 * @return   {KeyObject}                        returns a private key object
*/
 function createPrivateKeyObject(privateKey, keySpecification) {
    const checkedKeySpec = isKeySpecValid(keySpecification);
    if (checkedKeySpec.result == false) {
        throw("Can't create private key object: " + checkedKeySpec.log);
    }
    
    return crypto.createPrivateKey({  
        key: privateKey,
        format: keySpecification.format,
        type: keySpecification.type,
        passphrase: keySpecification.passphrase ? keySpecification.passphrase : "",
        encoding: "utf-8"
    });
 }
 
/**
 * Performs check if the specification object used in createPrivateKeyObject is valid. In specific, it checks if type is given, in case the 
 * format is DER (Distinguished Encoding Rules), if a passphrase is given, in case the key is encrypted and if the passphrase sticks to the
 * maximum length of 1024 bytes.
 * 
 * @author   localhorst87
 * @private
 * @param    {KeySpec} keySpecification  Specification object, that is used as input for createPrivateKeyObject
 * @return   {ResultLog}                 The result property will be true/false if keySpecification is valid/invalid
*/
 function isKeySpecValid(keySpecification) {
    if (typeof(keySpecification) != "object") {
        return {
            result: false,
            log: "keySpecification must be an object"
        }
    }
    
    const fields = Object.keys(keySpecification);
    if (!fields.includes("format") || !fields.includes("isEncrypted")) {
        return {
            result: false,
            log: "keySpecification must contain at least the following properties: 'format', 'isEncrypted'"
        }
    }

    if (keySpecification.format.toLowerCase() != "pem" && keySpecification.format.toLowerCase() != "der" && keySpecification.format.toLowerCase() != "jwk") {
        return {
            result: false,
            log: "Unsupported private key format. Format must be 'pem', 'der' or 'jwk'"
        }
    }

    if (keySpecification.format == "der" && !keySpecification.type) {
        return {
            result: false,
            log: "If private key is encrypted via DER (Distinguished Encoding Rules), a type must be specified ('pkcs1', 'pkcs8' or 'sec1')"
        }
    }

    if (keySpecification.format == "der" && keySpecification.type.toLowerCase() != "pkcs1" && keySpecification.type.toLowerCase() != "pkcs8" && keySpecification.type.toLowerCase() != "sec1") {
        return {
            result: false,
            log: "Unsupported type. Must be 'pkcs1', 'pkcs8' or 'sec1'"
        }
    }

    if (keySpecification.isEncrypted && !keySpecification.passphrase) {
        return {
            result: false,
            log: "A passphrase for decryption must be given, if private key is encrypted"
        }
    }

    if (keySpecification.isEncrypted && (keySpecification.passphrase.length < 4 || keySpecification.passphrase.length > 1024)) {
        return {
            result: false,
            log: "Passphrase must be between 4 and 1024 characters"
        }
    }

    return {
        result: true,
        log: "Key specification is valid"
    }
 }

/**
* Checks if the structure of the signed document is valid. In specific, it will be checked if all required properties are available
 * (that is content, signature, hash_algorithm and signature_encoding) and if their values are of allowed values
 * 
 * @author   localhorst87
 * @private
 * @param    {String} signedDocument stringified signed document, as returned by the sign function of this module
 * @return   {Boolean}               returns true/false upon valid/invalid structure
*/
function isDocumentStructureValid(signedDocument) {
    const signedDocumentJson = JSON.parse(signedDocument);

    const jsonSchema = {
        type: "object",
        properties: {
            content: {
                type: "string",
                transform: ["trim"],
                minLength: 1 },
            signature: {
                type: "string",
                minLength: 32 },
            hash_algorithm: {
                type: "string",
                transform: ["trim", "toEnumCase"],
                enum: [
                    "RSA-MD4",
                    "RSA-MD5",
                    "RSA-RIPEMD160",
                    "RSA-SHA1",
                    "RSA-SHA1-2",
                    "RSA-SHA224",
                    "RSA-SHA256",
                    "RSA-SHA3-224",
                    "RSA-SHA3-256",
                    "RSA-SHA3-384",
                    "RSA-SHA3-512",
                    "RSA-SHA384",
                    "RSA-SHA512",
                    "RSA-SHA512/224",
                    "RSA-SHA512/256",
                    "RSA-SM3",
                    "blake2b512",
                    "blake2s256",
                    "id-rsassa-pkcs1-v1_5-with-sha3-224",
                    "id-rsassa-pkcs1-v1_5-with-sha3-256",
                    "id-rsassa-pkcs1-v1_5-with-sha3-384",
                    "id-rsassa-pkcs1-v1_5-with-sha3-512",
                    "md4",
                    "md4WithRSAEncryption",
                    "md5",
                    "md5-sha1",
                    "md5WithRSAEncryption",
                    "ripemd",
                    "ripemd160",
                    "ripemd160WithRSA",
                    "rmd160",
                    "sha1",
                    "sha1WithRSAEncryption",
                    "sha224",
                    "sha224WithRSAEncryption",
                    "sha256",
                    "sha256WithRSAEncryption",
                    "sha3-224",
                    "sha3-256",
                    "sha3-384",
                    "sha3-512",
                    "sha384",
                    "sha384WithRSAEncryption",
                    "sha512",
                    "sha512-224",
                    "sha512-224WithRSAEncryption",
                    "sha512-256",
                    "sha512-256WithRSAEncryption",
                    "sha512WithRSAEncryption",
                    "shake128",
                    "shake256",
                    "sm3",
                    "sm3WithRSAEncryption",
                    "ssl3-md5",
                    "ssl3-sha1",
                    "whirlpool" ] },
            signature_encoding: {
                enum: ["hex"] }
            },
            "required": ["content", "signature", "hash_algorithm", "signature_encoding"]
        };
    
    const validate = ajv.compile(jsonSchema);

    return validate(signedDocumentJson);
}

/**
 * Checks if the X509 certificate is valid
 * 
 * @author   localhorst87
 * @private
 * @param    {String|Buffer} x509Certificate    A PEM or DER encoded X509 Certificate. If PEM is used, a utf-8 encoded string must be passed,
 *                                              if DER is used a Buffer must be passed.
 * @return   {ResultLog}                        The result of the validity check of the certificate
*/
function isCertificateValid(x509Certificate) {
    try {
        x509Certificate = new crypto.X509Certificate(x509Certificate);
    }
    catch (err) {
        return {
            result: false,
            log: "X509 certificate not valid: " + err
        }
    }    
    
    const validFrom = new Date(x509Certificate.validFrom);
    const validTo = new Date(x509Certificate.validTo);
    const currentDate = new Date();

    if (currentDate > validTo) {
        return {
            result: false,
            log: "X509 certificate expired"
        }
    }

    if (currentDate < validFrom) {
        return {
            result: false,
            log: "X509 certificate not yet valid"
        }
    }

    return {
        result: true,
        log: "X509 certificate valid"
    }
}