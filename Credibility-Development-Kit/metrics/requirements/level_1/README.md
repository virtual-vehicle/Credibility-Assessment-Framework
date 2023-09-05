# REQUIREMENTS, LEVEL 1

A collection of metrics that can be used for assessing the credibility of simulation model implementation, according to Credibility Level 1:

* [`checkSingleSemantic`](#checksinglesemantic): Checks if a single requirement fulfills quality aspects in a way that specifications can be built upon it and validation results can refer to it
* [`checkCollectionSemantic`](#checkcollectionsemantic): Checks if the collection of requirements fulfills quality aspects in a way that specifications can be built upon it and validation results can refer to it
---
## `checkSingleSemantic`

### I. METADATA
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Requirements
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 1
Purpose                 | Checks if a single requirement fulfills quality aspects in a way that specifications can be built upon it and validation results can refer to it
Implements              | Semantic Check
Acceptance criteria     | Expert Statement

### II. USAGE
-----------------------------

This metric is to be considered as implicite metric, i.e. both the quality metric and the quality criterion is evaluated by an expert, who's giving a statement about the metric, the criterion and its results. Consider the following example:

*Preparation step 1, expert statement:*

A qualified expert performs semantical checks of a single requirement (*metric*) checks the following *criterions* of the requirement:

* **necessary**: Every requirement generates extra effort in the form of processing, maintenance, and verification. Only necessary requirements should therefore be included. Unnecessary requirements are of two varieties: (i) unnecessary specification of environment, which should be left to the discretion of the engineer in the specification or implementation phase, and (ii) a redundant environment requirement covered in some other combination of model requirements
* **unambiguous**: Is the requirement clear and concise? Is it possible to interpret the requirement in multiple ways? Are the terms defined or referenced to the tool specification? Does the requirement conflict with or contradict another requirement? Each requirement statement should be written to address only one concept. Requirements with "and", "or", "commas", or other forms of redundancy can be difficult to verify and should be avoided as it can be difficult to ensure all personnel have a common understanding. The language used must be clear, exact, and in sufficient detail to meet all reasonable interpretations.
* **complete**: The stated requirement should be complete and measurable and not need further amplification. The stated requirement should provide sufficient capability of characteristics.
* **singular**: The requirement statement should be of only one requirement and should not be a combination of requirements or more than one function or constraint.
* **achievable**: The requirement must be technically achievable within the constraints of technical feasibility and costs.
* **verifiable**: Each requirement should be verifiable by a single method in the evaluation phase. A requirement requiring multiple methods to verify should be broken into multiple requirements. (There is no problem with one method verifying multiple requirements; however, it indicates a potential for consolidating requirements)

The result of the first step is the expert statement. The content of the expert statement itself must contain the reduced result of the check (true/false) and the verbal statement, according to the following approach:

```javascript
{
    result: true,
    log: "The requirement with ID M_08 is necessary, unambiguous, complete, singular, achievable, and verifiable."
}
```

*Preparation step 2, sign expert statment:* 

The expert check must be wrapped into the content of the signedStatement object, as can be observed below. This object must be stringified to be used as input of `checkSingleSemantic`. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

*Evaluate signed statment:*

The `checkSingleSemantic` function takes the signed expert statement and the X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate.

The X509 certificate to be passed must be PEM- or DER-encoded. If PEM is used, a string is expected, if DER is used, a Buffer is expected.

```javascript
signedStatement = '{"content":{"result":true,"log":"The requirement with ID M_08 is necessary, unambiguous, complete, singular, achievable, and verifiable."},"signature":"09f41fd02ab1a891cf92b7228d...997d93efa9b1b52712372","hash_algorithm":"SHA256","signature_encoding":"hex"}';
x509Pem = `-----BEGIN CERTIFICATE-----
MIIENzCCAx+gAwIBAgIUIUdYlY0Da5/4K/kAvFGkcpO1j9kwDQYJKoZIhvcNAQEL
...
nsA7g4QT5oCHJnRtfLXMgMdW+/Q76CqJgYsT
-----END CERTIFICATE-----`;

checkSingleSemantic(signedStatement, x509Pem);
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

### III. INPUTS
---------------------------

Input for the expert || 
------------------------|---------------
Entity kind             | Requirement
Entity type             | Any requirement representation (text, images, etc.)     
Must contain            | At least a unique ID of the requirement and the requirement description 

### IV. OUTPUTS
-----------------------------

|| Req. okay 
------------------------|---------------
Event                   | Requirement description fulfills semantic criteria
Result                  | true
Log                     | The requirement (requirement ID) is necessary, unambiguous, complete, singular, achievable, and verifiable.

|| Req. not necessary
------------------------|---------------
Event                   | Requirement is not necessary 
Result                  | false
Log                     | The requirement description (requirement ID) is violating the necessity criterion: The requirement is (unnecessary/redundant), (explanation)

|| Req. not unambiguous
------------------------|---------------
Event                   | Requirement not unambiguous 
Result                  | false
Log                     | The requirement description (requirement ID) is violating the unambiguity criterion: (explanation)

|| Req. not complete 
------------------------|---------------
Event                   | Requirement is not complete 
Result                  | false
Log                     | The requirement description (requirement ID) is violating the completeness criterion: (explanation)

|| Req. not singular 
------------------------|---------------
Event                   | Requirement is not singular 
Result                  | false
Log                     | The requirement description (requirement ID) is violating the singularity criterion: (explanation)

|| Req. not achievable 
------------------------|---------------
Event                   | Requirement is not achievable 
Result                  | false
Log                     | The requirement description (requirement ID) is violating the achievability criterion: (explanation)

|| Req. not verfiable 
------------------------|---------------
Event                   | Requirement is not verfiable 
Result                  | false
Log                     | The requirement description (requirement ID) is violating the verifiability criterion: (explanation)

### V. EXAMPLES
-----------------------------

```javascript
const fs = require("fs");
const verisign = require("../../../../util/veri-sign");

// A. Preparation steps

// Step 1 (expert makes statment)
expertStatement = {
    result: true,
    log: "The requirement with ID M_08 is necessary, unambiguous, complete, singular, achievable, and verifiable."
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

## `checkCollectionSemantic`

### I. METADATA
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Requirements
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 1
Purpose                 | Checks if the collection of requirements fulfills quality aspects in a way that specifications can be built upon it and validation results can refer to it
Implements              | Semantic Check
Acceptance criteria     | Expert Statement

### II. USAGE
-----------------------------

*Preparation step 1, expert statement:*

A qualified expert checks the following criterions of the collection of all requirement:

* **complete**: The set of requirements contains everything pertinent to the definition of the simulation or model
* **consistent**: The set of requirements is consistent in that the requirements are not contradictory nor duplicated. Terms and abbreviations are used consistently in all requirements.
* **affordable**: The set of requirements can be satisfied by a solution that is obtainable within the planned cost, schedule, and technical constraints.
* **bounded**: The set of requirements defines the required scope for the solution to meet the stakeholder needs. Consequently, all necessary requirements must be included; irrelevant requirements must be excluded.

The result of the first step is the expert statement. The content of the expert statement itself must contain the reduced result of the check (true/false) and the verbal statement, according to the following approach:

```javascript
{
    result: false,
    log: "The requirement collection is not affordable: The requirements towards the accuracy of the simulation results cannot be afforded with the given technical constraints."
}
```

*Preparation step 2, sign expert statment:* 

The expert check must be wrapped into the content of the signedStatement object, as can be observed below. This object must be stringified to be used as input of `checkSingleSemantic`. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

*Evaluate signed statment:*

The `checkSingleSemantic` function takes the signed expert statement and the X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate.

The X509 certificate to be passed must be PEM- or DER-encoded. If PEM is used, a string is expected, if DER is used, a Buffer is expected.

```javascript
signedStatement = '{"content":{"result":false,"log":"The requirement collection is not affordable: The requirements towards the accuracy of the simulation results cannot be afforded with the given technical constraints."},"signature":"09f41fd02ab1a891cf92b7228d...997d93efa9b1b52712372","hash_algorithm":"SHA256","signature_encoding":"hex"}';
x509Pem = `-----BEGIN CERTIFICATE-----
MIIENzCCAx+gAwIBAgIUIUdYlY0Da5/4K/kAvFGkcpO1j9kwDQYJKoZIhvcNAQEL
...
nsA7g4QT5oCHJnRtfLXMgMdW+/Q76CqJgYsT
-----END CERTIFICATE-----`;

checkSingleSemantic(signedStatement, x509Pem);
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
    log: "The requirement collection is not affordable: The requirements towards the accuracy of the simulation results cannot be afforded with the given technical constraints."
}
```


### III. INPUTS
---------------------------

Input for the expert || 
------------------------|---------------
Entity kind             | Requirement collection
Entity type             | Any representation requirements (text, images, etc.)   
Must contain            | The collection of all single requirements

### IV. OUTPUTS
-----------------------------

|| Collection okay 
------------------------|---------------
Event                   | Requirement collection fulfills semantic criteria
Result                  | true
Log                     | The environment requirement collection is complete, consistent, affordable, and bounded.

|| Collection not complete
------------------------|---------------
Event                   | Requirement collection not complete 
Result                  | false
Log                     | The requirement collection is violating the completeness criterion: (explanation)

|| Collection not consistent
------------------------|---------------
Event                   | Requirement collection not consistent
Result                  | false
Log                     | The requirement collection is violating the consistency criterion: (explanation)

|| Collection not affordable
------------------------|---------------
Event                   | Requirement collection is not affordable 
Result                  | false
Log                     | The requirement collection is violating the affordability criterion: (explanation)

|| Collection not bounded
------------------------|---------------
Event                   | Requirement collection is not bounded
Result                  | false
Log                     | The requirement collection is violating the boundary criterion: (explanation)


### V. EXAMPLES
-----------------------------

```javascript
const fs = require("fs");
const verisign = require("../../../../util/veri-sign");

// A. Preparation steps

// Step 1 (expert makes statment)
expertStatement = {
    result: false,
    log: "The requirement collection is not affordable: The requirements towards the accuracy of the simulation results cannot be afforded with the given technical constraints."
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