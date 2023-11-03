# IMPLEMENTATION - LEVEL 1

A collection of metrics that can be used for assessing the credibility of simulation model implementation, according to Credibility Level 1:

* [`checkExpertCodeReview`](#checkexpertcodereview): Checks if an artifact has passed the expert review (e.g., code verification) and if the signed expert statement is valid
* [`checkSystemStructure`](#checksystemstructure): Static code check, if a system structure (including all components, connectors and connections of the system) is well-defined
* [`checkPlausibility`](#checkplausibility): Dynamic code check, if a parameter change will be resulting in the expected behaivor of the simulation 

---
## `checkExpertCodeReview`

*Static code check, if any produced code to build and run simulations passes certain quality criterions (e.g., IEEE 730). This is done by an expert wo needs to give a statement about this action*.

### I. METADATA
---------------------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Implementation
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 1
Purpose                 | Checks if an artifact has passed the expert review (e.g., code verification) and if the signed expert statement is valid
Implements              | Static Code Check
Acceptance criteria     | Expert Statement

### II. USAGE
---------------------------

This metric is to be considered as implicite metric, i.e. both the quality metric and the quality criterion is evaluated by an expert, who's giving a statement about the metric, the criterion and its results. Consider the following example:

*Preparation step 1, expert statement:*

A qualified expert makes a static code review (*metric*), as part of the Software Quality Assurance, according to best practices and the standard IEEE 730 (*criterion*).

The result of the first step is the expert statement. The content of the expert statement itself must contain the reduced result of the check (true/false) and the verbal statement, according to the following approach:

```javascript
{
    result: true,
    log: "Performed static code review, as part of the Software Quality Assurance, according to best practices and IEEE 730. As a result, the code is free of deficiencies and errors (see file unit-test-results.json)."
}
```

*Preparation step 2, sign expert statment:* 

The expert check must be wrapped into the content of the signedStatement object, as can be observed below. This object must be stringified to be used as input of `checkExpertCodeReview`. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

*Evaluate signed statment:*

The `checkExpertCodeReview` function takes the signed expert statement and the X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate.

The X509 certificate to be passed must be PEM- or DER-encoded. If PEM is used, a string is expected, if DER is used, a Buffer is expected.

```javascript
signedStatement = '{"content":{"result":true,"log":"Performed static code review, as part of the Software Quality Assurance, according to best practices and IEEE 730. As a result, the code is free of deficiencies and errors (see file unit-test-results.json)."},"signature":"09f41fd02ab1a891cf92b7228d...997d93efa9b1b52712372","hash_algorithm":"SHA256","signature_encoding":"hex"}';
x509Pem = `-----BEGIN CERTIFICATE-----
MIIENzCCAx+gAwIBAgIUIUdYlY0Da5/4K/kAvFGkcpO1j9kwDQYJKoZIhvcNAQEL
...
nsA7g4QT5oCHJnRtfLXMgMdW+/Q76CqJgYsT
-----END CERTIFICATE-----`;

checkExpertCodeReview(signedStatement, x509Pem);
```

The function will check...

* ...the type and schema validity of the inputs
* ...the result of the expert statment itself
* ...the validity of the X509 certificate
* ...the validity of the signature

The output will be a ResultLog, indicating the result and additional logging information, as can be observed in the example below.

```javascript
{
    result: true,
    log: "Performed static code review, as part of the Software Quality Assurance, according to best practices and IEEE 730. As a result, the code is free of deficiencies and errors (see file unit-test-results.json)."
}
```

### III. INPUTS
---------------------------

Input for the expert || 
------------------------|---------------
Entity kind             | Code to build and execute the simulation
Entity type             | Any simulation code (models, parameters, test cases, etc.)
Must contain            | Production code that is used for the planned delivered simulation

### IV. OUTPUTS
---------------------------

|| Review passed
------------------------|---------------
Event                   | Code review passed
Result                  | true
Log                     | Performed static code review of (...), as part of the Software Quality Assurance, according to (...). The code is free of deficiencies and errors

|| Review not passed
------------------------|---------------
Event                   | Code likely to throw errors
Result                  | false
Log                     | Performed static code review of (...), as part of the Software Quality Assurance, according to (...). The implementation will likely throw errors. Code needs to be improved.

### V. EXAMPLES:
---------------------------

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

const result2022 = metrics.checkExpertCodeReview(expertStatement, cert2022);
// will return 
// { result: true, log: 'The expert statement has been proven valid' }

const result2019 = metrics.checkExpertCodeReview(expertStatement, cert2019);
// will return 
// { result: false, log: 'The expert statement could not be proven valid (X509 certificate expired)' }
```

For observing some examples, see [here](./examples/examples_verify_expert_statement.js), or use

```
npm run example-expert-statement
```

from a terminal, for running the examples. 

---

## `checkSystemStructure`

*Static code check, if a representation of a system structure (including all components, connectors and connections of the system) is well-defined. That means it verifies if all subsystems are uniquely identifiable, if all required inputs are connected unambigouosly, if the data types of the connected element's connectors are consistent and if each element a connection references to is exactly available once in a subsystem*

### I. METADATA
---------------------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Models in system simulations
CSP phase               | Implementation
CSP step                | Models
Level                   | 1
Purpose                 | Checks, if a system structure is well-defined
Implements              | Static Code Check
Acceptance criteria     | Logic check

### II. USAGE
--------------------------- 

This quality metric belongs to the category of static code checks. The input to this function represents a generic data structure, that can be translated from a System Structure Definition (SSD) file. SSD is specified as a standard within the Modelica SSP[^1]. 
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

let result = checkSystemStructure(systemStructure, noConnectionNeeded);
```

### III. INPUTS
---------------------------

systemStructure || 
------------------------|---------------
Unserialized data type  | JSON object
Implements schema       | [SYSTEM_STRUCTURE](./types/schemas.js)
Interpretation          | A System Structure representation (stringified), see notice below

*Notice: To build the JSON-representation of a system structure from an SSD file, use the [ssd-adapter package](../../../adapters/ssd-adapter/README.md)!*

notRequired (optional) || 
------------------------|---------------
Unserialized data type  | String array
Implements schema       | -
Interpretation          | A list of input connectors that do not require a connection (stringified array)   

### IV. OUTPUTS
---------------------------

|| System structure well-defined
------------------------|---------------
Event                   | The system structure is unambigously defined
Result                  | true
Log                     | system structure is well-defined

|| System structure can't be parsed
------------------------|---------------
Event                   | The argument systemStructure can't be parsed (must be stringified JSON)
Result                  | false
Log                     | systemStructure can not be parsed

|| Not-required input connectors can't be parsed
------------------------|---------------
Event                   | The argument notRequired can't be parsed (must be stringified JSON)
Result                  | false
Log                     | notRequired can not be parsed

|| System Structure violates schema
------------------------|---------------
Event                   | systemStructure does not fulfill the target schema (cf. [inputs](#iii-inputs-1))
Result                  | false
Log                     | systemStructure does not fulfill the required schema

|| System element name not unique
------------------------|---------------
Event                   | At least one element with the same name in its enclosing subsystem
Result                  | false
Log                     | there is at least 1 element in the system with the same name in its enclosing subsystem: (...)

|| Wrong notation of element
------------------------|---------------
Event                   | Element is listed as subsystem but is a component
Result                  | false
Log                     | the following element is contained in a subsystem list, but is denoted as Component: (...)

|| Input connecter connected multiple times
------------------------|---------------
Event                   | An input connector is connected multiple times (must have one input connection)
Result                  | false
Log                     | The following input connector is connected multiple times:(...)

|| Input connecter not connected
------------------------|---------------
Event                   | An input connector is not connected
Result                  | false
Log                     | The following input connector is not connected: (...)

|| Connector types unconsistent
------------------------|---------------
Event                   | Two connectors are connected but have non-compatible data types
Result                  | false
Log                     | data types for the Connectors of the following Connection are not equal: (...)

|| System element of connection missing
------------------------|---------------
Event                   | A connection is referencing to an unknown system element
Result                  | false
Log                     | could not identify any system element for the starting point the following Connection is referencing to: (...)

|| Multiple system elements for connection end point
------------------------|---------------
Event                   | More than 1 system element existing for end point of a connection
Result                  | false
Log                     | more than 1 system element identified for the end point the following Connection is referencing to: (...)

|| Unsupported connector combination
------------------------|---------------
Event                   | A connection has a not-supported combination of source/destination element types and connector kinds
Result                  | false
Log                     | The following connection has a not-supported combination of source/destination element types and connector kinds: (...)

|| Connector of connection unknown
------------------------|---------------
Event                   | Connectors of the a connection is not known in the system
Result                  | false
Log                     | could not identify one of the connectors of the following Connection:(...)

|| Connector not unambiguous
------------------------|---------------
Event                   | More than one connector with same name available for connector of a connection
Result                  | false
Log                     | more than 1 connector with the same name available for one of the connectors of the following Connection:(...)

### V. EXAMPLES

Consider the following example of a simple system model of a DC motor:

![system model example](./docs/system_model_example.png "System Model example")

The system has been translated from the SSD standard format and results in the [following generic data structure](./examples/system_structures/dc_motor_example.json "System Structure example").

```javascript
const fs = require("fs");
const metrics = require(".");

const systemStructure = fs.readFileSync("./examples/system_structures/dc_motor_example.json", "utf8");

const result = metrics.checkSystemStructure(systemStructure);
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

const result = metrics.checkSystemStructure(systemStructure);
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

const result1 = metrics.checkSystemStructure(systemStructure);
// will return 
// { result: false, log: 'The following input connector is not connected: {"subsystem":["dc_motor_system","dc_motor"],"element":"electrics","name":"U_0","kind":"input","type":"Real"}' }

const result2 = metrics.checkSystemStructure(systemStructure, inputNotRequired);
// will return 
// { result: false, log: 'system structure is well-defined' }
```

For observing some examples, see [here](./examples/examples_verify_system_structure.js), or use

```
npm run example-system-structure
```

from a terminal, for running the examples. 

## `checkPlausibility`

*Dynamic code check, where it is observed if a simulation behaves as expected, upon changing selected model parameters.*

### I. METADATA
---------------------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Implementation
CSP step                | Models, Integration
Level                   | 1
Purpose                 | Checks, if a parameter change will be resulting in the expected behaivor of the simulation 
Implements              | Dynamic Code Check
Acceptance criteria     | Logic check

### II. USAGE
--------------------------- 

### III. INPUTS
---------------------------

### IV. OUTPUTS
---------------------------

[^1]: https://ssp-standard.org/publications/SSP10/SystemStructureAndParameterization10.pdf