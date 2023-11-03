# REQUIREMENT - LEVEL 3

A metric to support the model verification for the requirement at level 3.

* [`formatCheck`](#formatCheck): check whether a single requirement fulfills the standardized ReqIF schema and (optionally) check if certain attributes are existing and filled

---
## `formatCheck`

### I. Metadata
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Requirements
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 3
Purpose                 | Tests, if a single requirement fulfills the standardized ReqIF schema and (optionally) check if certain attributes (like "creator", "status" etc.) are existing and filled
Implements              | Formal check
Acceptance criteria     | Schema fulfilled

### II. Input Specification
---------------------------

requirement || 
------------------------|---------------
Unserialized data type  | string
Implements schema       | [reqif.xsd](https://www.omg.org/spec/ReqIF/20110401/reqif.xsd)
Interpretation          | The string of the requirement formulated as ReqIF     

(attributesToCheck) || 
------------------------|---------------
Unserialized data type  | array<string>
Implements schema       | `[<path to attributes>]`
Interpretation          | A list of required attributes that each requirement needs to fulfill

### III. Output Specification
---------------------------

|| format check OK 
------------------------|---------------
Event                   | ReqIF schema is fulfilled. Optionally, all required attributes are contained in each single requirement
Result                  | true
Log                     | The requirement fulfills the given ReqIF schema. 

(All required attributes are contained in the requirement). 

|| schema not valid
------------------------|---------------
Event                   | ReqIF schema is not fulfilled
Result                  | false
Log                     | The requirement does not implement the given ReqIF schema correctly, (reason..) 

|| (attribute missing)
------------------------|---------------
Event                   | At least one required attribute is missing in the requirement
Result                  | false
Log                     | The requirement is missing at least one required attribute, please check <attribute>

### IV. USAGE
---------------------------

For the following example, the requirement test-1.reqif will be checked as following:
* `util.validateXML`: the first step will check the XML format of the requirement, if the XML structure is invalid, we can not continue other steps
* `util.validateXMLAgainstXSD`: This will verify the requirement against the XSD schema to guarantee that the ReqIF file follows the standard
* `checkAttributesInModel`: If users specify needed attributes, it will be checked and verify one by one. The required attributes are equivalent with the column names in the ReqIf document. Please see the example for more detail.

```javascript
const FileSync = require("fs");

const reqIfModel = FileSync.readFileSync("./test/test_data/test-1.reqif", "utf8");

const formatCheck = metrics.formatCheck(reqIfModel, ['Signee', 'Creator', 'Owner']);

// returns { result: true, log: "The requirement fulfills the given ReqIF schema. (All required attributes are contained in the requirement)"}
```
