# VERI-SIGN

This utility can be used to sign and verify expert statements, based on a public key infrastructure.

## USAGE

Expert statements are part of Credibility Assessments to confirm non-formal checks throughout the Credible Simulation Process and Credible Modeling Process. They are usually referred to as being part of Credibility Level 1 metrics.

## PRINCIPLE

This module provides for a `sign` and a `verify` function:

* `sign` takes any arbitrary formalized statement (consisting of a result, a log, and a status response code), creates a signature of it by using the experts private key and wraps the signature into a well-defined structure, next to meta-data of the signature, like the hash algorithm and encoding used. This is done typically on supplier side by experts that customer and supplier agreed upon.
* `verify` takes the signature-wrapped statement and verifies it against a given X509 certificate. This is typically done on customer side, with public certificates of supplier experts that customer and supplier agreed upon.

![workflow using sign and verify](./docs/workflow.png "Workflow")

## DETAIL

Statements to sign do not need to follow any formality, except that a statement must be given as a string, as in the following simplyfied example:

```javascript
statement = {
    result: true,
    log: "All model requirements have been checked semantically, according to ISO/IEC/IEEE 29148",
    status_code: 200
};
```

To sign the statement, a private key must be handed over, as well as the specification about the private key.

Currently, `pem`, `der` and `jwk` encodings are supported for private key represantation. If you decide to use a PEM encoded private key, it must be given as a string, as for example illustrated in the following excerpt:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDX41C6lKMAfxME
3fIfph95ZrKRxWzPSoa7Erv7sqQuT3jgrPhyCA6YUTlq6dXpcAddSaJ+2lHm4L5m
...
+VuHyq4upQ3ivUxPXiPp7ouL5pmBIPHusLrbiMGf4ytHosIMhiNI9NyGgyABFPuL
IOj3A7f9/ALJTtHUU/AC4zg=
-----END PRIVATE KEY-----
```

JWK keys must be handed over as a JSON object (not stringified) and DER encoded keys must be given as a Buffer. For details, see the reference.

The key specification must contain at least the information about the format the key is given in and if the key is encrypted. If the latter is the case, the passphrase for decoding must be given as well (see second example). If the DER encoding is used, the encryption standard must be indicated with the `type` property. Currently `pkcs1`, `pkcs8` and `sec1` (only for elliptic curves as hash algorithm) are supported.

```javascript
{
    format: "pem",
    isEncrypted: false,
};
```

```javascript
{
    format: "der",
    isEncrypted: true,
    type: "pkcs8",
    passphrase: "ThisIsMySecretPassphrase"
};
```
After correctly handing over all arguments to the `sign` function, a JSON object as depicted in the following will be returned (but stringified):

```javascript
{
    "content": {
        "result": true,
        "log": "All model requirements have been checked semantically, according to ISO/IEC/IEEE 29148",
    },
    "signature": "00514ff050a656...b624eb92338308702b",
    "hash_algorithm": "SHA256",
    "signature_encoding": "hex"
}
```

This wrapped statement can later be used to be verified against a public key of an expert that is typically contained in a public X509 certificate. For this purpose, a `pem` oder `der` represantation of an X509 certificate must be handed over to the `verify` function, as given for example in the following:

```
-----BEGIN CERTIFICATE-----
MIIEDzCCAvegAwIBAgIUdBgY79Rx8iKuwNuP6KXS6/xUoJ8wDQYJKoZIhvcNAQEL
BQAwgZUxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMQ8wDQYDVQQHDAZN
...
dPcjLqX0NndfpzCLFlYCzB+EA61/rvxqKcck1ZHAKCvPCqDYQiYs/v6p/xwRTRne
ltREsqyrgXMibih7xDCXyZyInzl33U9pFd8hi0gi81MC7jU=
-----END CERTIFICATE-----
```

The result of the verify function will be a `ResultLog` object, giving logging information alongside the result, for example:

```javascript
{
    result: true,
    log: "signature is valid"
}
```

For further explanation, see the reference.

## EXAMPLE

Sign expert statement:

```javascript
const fs = require("fs");
const verisign = require("./");

// create inputs
const statement = {
    result: true,
    log: "All model requirements have been checked semantically, according to ISO/IEC/IEEE 29148",
    status_code: 200
};
const privateKey = fs.readFileSync("./examples/keystore/pem_encrypted/private.pem", "utf8");
const keySpecification = {
    format: "pem",
    isEncrypted: true,
    passphrase: "ThisIsMyPassphrase"
};

// sign statement and store
const signedStatement = verisign.sign(statement, privateKey, keySpecification);
fs.writeFileSync("./examples/signed_statements/req.json", signedStatement);
```

Verify expert statement:

```javascript
const fs = require("fs");
const verisign = require("./");

// get inputs
const signedStatement = fs.readFileSync("./examples/signed_statements/req.json", "utf8");
const certificate_1 = fs.readFileSync("./examples/keystore/pem_encrypted/cert.pem", "utf8");
const certificate_2 = fs.readFileSync("./examples/keystore/der_pkcs8/cert.der");

// verify signed statement
console.log(verisign.verify(signedStatement, certificate_1)); // should be valid
console.log(verisign.verify(signedStatement, certificate_2)); // should be invalid
```

## INTERACTIVE EXAMPLES

For interactive examples, use 

```
npm run example_sign
```

from the console to start the interactive example to create signed statements, and

```
npm run example_verify
```

to run an interactive example to verify your created statements.