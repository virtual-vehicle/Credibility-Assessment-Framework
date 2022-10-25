# IMPLEMENTATION - MODELS - LEVEL 1

A collection of metrics that can be used for assessing the credibility of simulation model implementation, according to Credibility Level 1:

* [`verifyExpertStatement`](#verifyexpertstatement): Can be used for checking if a given statement has been signed by the expert that is identified by an X509 certificate[^1]
* [`verifySystemStructure`](#verifysystemstructure): Static code check, if a system structure (including all components, connectors and connections of the system) is well-defined

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
const metrics = require(".");

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

For observing some examples, see [here](./examples/examples_verify_expert_statement.js), or use

```
npm run example-expert-statement
```

from a terminal, for running the examples. 

---
## `verifySystemStructure`

*Static code check, if a representation of a system structure (including all components, connectors and connections of the system) is well-defined. That means it verifies if all subsystems are uniquely identifiable, if all required inputs are connected unambigouosly, if the data types of the connected element's connectors are consistent and if each element a connection references to is exactly available once in a subsystem*

## Domains:
Can be used Domain-independent

## Models:
Is independent with respect to the underlying models that compose the system model

## Usage:
This quality metric belongs to the category of static code checks. The input to this function represents a generic data structure, that can be translated from a System Structure Definition (SSD) file. SSD is specified as a standard within the Modelica SSP[^2]. 
The metric checks if the system representation is well-defined and can be implemented in general, which means, the quality criterion follows boolean logic (either it is well-defined or not). However, the quality criterion can be softened by defining input connectors that do not need a connection (e.g., because the input uses default values). In the following snippet the the input "supply_voltage" of the component "pressure_sensor" does not require to be connected:

```javascript
let systemStructure = "...";
let noConnectionNeeded = JSON.stringify([
    {
        "subsystem": ["seat", "surface"],
        "element": "pressure_sensor",
        "name": "supply_voltage",
        "kind": "input",
        "type": "Real"
    }
]);

let result = verifySystemStructure(systemStructure, noConnectionNeeded);
```
## Examples:

Consider the following example of a simple system model of a DC motor:

![system model example](./docs/system_model_example.png "System Model example")

The system has been translated from the SSD standard format and results in the [following generic data structure](./examples/system_structures/dc_motor_example.json "System Structure example").

```javascript
const fs = require("fs");
const metrics = require(".");

const systemStructure = fs.readFileSync("./examples/system_structures/dc_motor_example.json", "utf8");

const result = metrics.verifySystemStructure(systemStructure);
// will return 
// { result: true, log: 'system structure is well-defined' }
```

If we change for instance the type of the output connector "phi" of the mechanical model to "Integer" like given in the following
```javascript
{
    "subsystem": ["dc_motor_system", "dc_motor"],
    "element": "mechanics",
    "name": "phi",
    "kind": "output",
    "type": "Integer"
}
```
the check will return a negative result, as the types of the associated connection are no longer consistent:
```javascript
const fs = require("fs");
const metrics = require(".");

const systemStructure = fs.readFileSync("./examples/system_structures/dc_motor_example_type_inconsistent.json", "utf8");

const result = metrics.verifySystemStructure(systemStructure);
// will return 
// { result: false, log: 'data types for the Connectors of the following Connection are not equal: {"subsystem":["dc_motor_system","dc_motor"],"element_start":"mechanics","name_start":"phi","element_end":"electrics","name_end":"phi"}' }
```

If we skip an input connection, for example the following connection
```javascript
{
    "subsystem": ["dc_motor_system", "dc_motor"],
    "element_start": "",
    "name_start": "U_0",
    "element_end": "electrics",
    "name_end": "U_0"
}
```
the check will return a negative result, as well, unless we don't declare the destination of the connection to not require a connection:

```javascript
const fs = require("fs");
const metrics = require(".");

const systemStructure = fs.readFileSync("./examples/system_structures/dc_motor_example_input_not_connected.json", "utf8");
const inputNotRequired = JSON.stringify([
    {
        "subsystem": ["dc_motor_system", "dc_motor"],
        "element": "electrics",
        "name": "U_0",
        "kind": "input",
        "type": "Real"
    }
]);

const result1 = metrics.verifySystemStructure(systemStructure);
// will return 
// { result: false, log: 'The following input connector is not connected: {"subsystem":["dc_motor_system","dc_motor"],"element":"electrics","name":"U_0","kind":"input","type":"Real"}' }

const result2 = metrics.verifySystemStructure(systemStructure, inputNotRequired);
// will return 
// { result: false, log: 'system structure is well-defined' }
```

For observing some examples, see [here](./examples/examples_verify_system_structure.js), or use

```
npm run example-system-structure
```

from a terminal, for running the examples. 

[^1]: https://www.itu.int/rec/T-REC-X.509/en
[^2]: https://ssp-standard.org/publications/SSP10/SystemStructureAndParameterization10.pdf