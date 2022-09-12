# IMPLEMENTATION - MODELS - LEVEL 1

A collection of metrics that can be used for assessing the credibility of simulation model implementation, according to Credibility Level 1:

* [`verifyExpertStatement`](#verifyexpertstatement): Can be used for checking if a given statement has been signed by the expert that is identified by an X509 certificate[^1]

---
## `verifyExpertStatement`

*Can be used for checking if a given statement has been signed by the expert, who is identified by an X509 certificate*

## Domains:
Can be used Domain-independent

## Models:
Can be used Model-independent

## Usage:
This metric is to be considered as implicite metric, i.e. both the quality metric and the quality criterion is evaluated by an expert, who's giving a statement about the metric, the criterion and its results. Consider the following example:

```javascript
{
    "content": "Performed static code review, as part of the Software Quality Assurance, according to best practices and IEEE 730. As a result, the code is free of deficiencies and errors (see './unit-test-results.json').",
    "signature": "00514ff050a656...b624eb92338308702b",
    "hash_algorithm": "SHA256",
    "signature_encoding": "hex"
}
```
The statement can be broken down to the following:
* Metric: "static code review, as part of the Software Quality Assurance"
* Crtierion: "best practices and IEEE 730"
* Result: "code is free of deficiencies and errors (see './unit-test-results.json')"

The `verifyExpertStatement` function takes an expert statement and an X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate. For the expert statement, a JSON is expected that fulfills the properties, as given in the example above. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

The output will be a ResultLog, indicating the result and additional logging information, as can be observed in the example below:

```javascript
{
    result: false, 
    log: "The expert statement could not be proven valid (X509 certificate expired)"
}
```

## Examples:

We consider a signed expert statement and two X509 certificates.

The expert is giving a statement about code review steps:

```javascript
// expert_statement.json

{
    "content": "Performed static code review, as part of the Software Quality Assurance, according to best practices and IEEE 730. As a result, the code is free of deficiencies and errors.",
    "signature": "b624eb92338308702b...00514ff050a656",
    "hash_algorithm": "SHA256",
    "signature_encoding": "hex"
}
```
We try to verify the statement with the following certificates:

```
// x509_john_doe_2022.pem

-----BEGIN CERTIFICATE-----
MIIEDzCCAvegAwIBAgIUdBgY79Rx8iKuwNuP6KXS6/xUoJ8wDQYJKoZIhvcNAQEL
...
ltREsqyrgXMibih7xDCXyZyInzl33U9pFd8hi0gi81MC7jU=
-----END CERTIFICATE-----
```

```
// x509_john_doe_2019.pem

-----BEGIN CERTIFICATE-----
MIIEJTCCAw2gAwIBAgIUVaAGmS8al7x9alHAF/9nhEKLDP0wDQYJKoZIhvcNAQEL
...
stEAxvDWkktb
-----END CERTIFICATE-----
```

```javascript
const fs = require("fs");
const metrics = require("./");

const expertStatement = fs.readFileSync("./examples/statements/expert_statement.json", "utf8");
const cert2019 = fs.readFileSync("./examples/certificates/x509_john_doe_2019.pem", "utf8");
const cert2022 = fs.readFileSync("./examples/certificates/x509_john_doe_2022.pem", "utf8");

const result2022 = metrics.verifyExpertStatement(expertStatement, cert2022);
// will return 
// { result: true, log: 'The expert statement has been proven valid' }

const result2019 = metrics.verifyExpertStatement(expertStatement, cert2019);
// will return 
// { result: false, log: 'The expert statement could not be proven valid (X509 certificate expired)' }
```

For observing some examples, see [here](./examples/examples.js), or use

```
npm run example
```

from a terminal, for running the examples. 

[^1]: https://www.itu.int/rec/T-REC-X.509/en