# DESIGN, LEVEL 1

A collection of metrics that can be used for assessing the credibility of simulation model implementation, according to Credibility Level 1:

* [`checkJustification`](#checkJustification): Review all the resource in the design specification and check whether its justification is given and comprehensive and validation results can refer to it

---
## `checkJustification`

### I. Metadata
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Design Specification
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 1
Purpose                 | For each resource from the design specification phase it is checked, if a justification is given and comprehensive
Implements              | Basic justification checks
Acceptance criteria     | Expert Statement

### II. USAGE
-----------------------------

*Preparation step 1, expert statement:*

A qualified expert checks the following criterions for the design specification:

* **availability**: Is a justification for the selection of the design specification available?
* **comprehensive**: Is the justification comprehensible? Is the justification supported by giving assumptions and constraints, if needed?
* **references**: Do the references to resources in the justification (e.g., requirements) exist?

The result of the first step is the expert statement. The content of the expert statement itself must contain the reduced result of the check (true/false) and the verbal statement, according to the following approach:

```javascript
{
    result: true,
    log: "The design with ID M_08 is necessary, unambiguous, complete, singular, achievable, and verifiable."
}
```

*Preparation step 2, sign expert statment:* 

The expert check must be wrapped into the content of the signedStatement object, as can be observed below. This object must be stringified to be used as input of `checkJustification`. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

*Evaluate signed statment:*

The `checkJustification` function takes the signed expert statement and the X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate.

The X509 certificate to be passed must be PEM- or DER-encoded. If PEM is used, a string is expected, if DER is used, a Buffer is expected.

```javascript
signedStatement = '{"content":{"result":true,"log":"The design with ID M_08 is availability, comprehensive and references."},"signature":"09f41fd02ab1a891cf92b7228d...997d93efa9b1b52712372","hash_algorithm":"SHA256","signature_encoding":"hex"}';
x509Pem = `-----BEGIN CERTIFICATE-----
MIIENzCCAx+gAwIBAgIUIUdYlY0Da5/4K/kAvFGkcpO1j9kwDQYJKoZIhvcNAQEL
...
nsA7g4QT5oCHJnRtfLXMgMdW+/Q76CqJgYsT
-----END CERTIFICATE-----`;
```

### III. Input Specification
---------------------------

Input 1 for the expert || 
------------------------|---------------
Entity kind             | Design specification
Entity type             | Any kind of the design specification resource, the justification should be done fo    
Must contain            | At least a unique ID of the resources that will be used

Input 2 for the expert || 
------------------------|---------------
Entity kind             | Justification
Entity type             | The non-formal justification for selecting the design, given in input 1
Must contain            | A unique identification of the resources that are referenced (UID of design specification, requirements, analysis results, etc.)

Input 3 for the expert || 
------------------------|---------------
Entity kind             | Analysis results, requirements, etc
Entity type             | Any kind of representation of this entities (text, images, etc.)
Must contain            | At least a unique ID of any resource

### IV. Output Specification
-----------------------------

|| Req. Ok 
------------------------|---------------
Event                   | Justification is comprehensive
Result                  | true
Log                     | The justification of design specification with ID `<design spec resource ID>`

|| Req. Justification is missing
------------------------|---------------
Event                   | Justification is missing
Result                  | false
Log                     | No justification of design specification with ID `<design spec resource ID>` could be found

|| Req. Justification is not comprehensible
------------------------|---------------
Event                   | Justification is not comprehensible
Result                  | false
Log                     | Justification of design specification with ID `<design spec resource ID>` is not comprehensible with the given information.

|| Req. Reference not resolved
------------------------|---------------
Event                   | Unique reference to one of the resources (design specification, requirements, etc.) couldn't be resolved
Result                  | false
Log                     | The resource with the ID `<resource ID>` couldn't be resolve

checkJustification(signedStatement, x509Pem);
```

The function will check...

* ...the type and schema validity of the inputs
* ...the result of the expert statment itself
* ...the validity of the X509 certificate
* ...the validity of the signature

The output will be a ResultLog, indicating the result and additional logging information, as can be observed in the example below.

```javascript
{
    result: false,
    log: "The expert statement could not be proven valid (X509 certificate expired)"
}
```

### V. EXAMPLES
-----------------------------

```javascript
const fs = require("fs");
const verisign = require("../../../../util/veri-sign");

// A. Preparation steps

// Step 1 (expert makes statment)
expertStatement = {
    result: true,
    log: "The design with ID M_08 is availability, comprehensive and references."
};

// Step 2 (expert signs statement)
privateKey = fs.readFileSync("./examples/keystore/pem_encrypted/private.pem", "utf8");
keySpec = {
    format: "pem",
    isEncrypted: true,
    passphrase: "ThisIsMyPassphrase"
};

signedStatement = verisign.sign(expertStatement, privateKey, keySpec);

// B. Evaluation

// read X509 certificate
x509Pem = fs.readFileSync("./examples/keystore/pem_encrypted/cert.pem", "utf8");

// evaluate
checkSingleSemantic(signedStatement, x509Pem);
```