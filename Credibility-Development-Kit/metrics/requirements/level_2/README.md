# REQUIREMENT - LEVEL 2

Metrics to support the linkage verification for requirements at level 2.

* [`checkLinkageSyntax`](#checklinkagesyntax): First step of requirement linkage check: Is a single requirement linked to a source and to a validation result? Further, it will be checked if the source is correctly located within the analysis phase or requirements phase and if the validation result is from either the implementation phase or the evaluation phase. There is no further checking if the linkage itself makes sense from semantic point of view. This will be carried out in the second step (expert check).
* [`checkLinkageSemantics`](#checklinkagesemantics): Second step of the requirement linkage check: An expert needs to check if the traceability attributes of a single requirement make sense from semantic point of view (logical check of the linkage must have been carried out in the first step). Examples for the expert check: Can the requirement really be derived from the given product requirement? Does the validation result can really be used to validate the requirement?

---
## `checkLinkageSyntax`

### I. METADATA
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Requirements
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 2
Purpose                 | First step of requirement linkage check: Evaluate if a single requirement is linked to a source and to a validation result
Implements              | Check of traceability attributes
Acceptance criteria     | Traceability logic fulfilled

### II. USAGE
---------------------------

For the following example, the requirement #req_m_01 will be checked. As can be seen from the graph, it has "derived-from" and "validated-by" attributes that 
indicate a linkage to the sources of the requrement and validation results. To export such a named graph from a Glue Particle (STMD), use the `createGraphFromLink` function from the [STMD CRUD package](../../../util/stmd-crud/).

`checkLinageSyntax` is cross-checking simply if the relations between the resources are set up according to a agreed procedure, using the provided STMD, i.e., if the requirement is derived from other requirements or from artifacts that represent the task analysis and if the requirement is validated in a later stage by test results.

```javascript
fs = require('fs');

graph = {
    "@context": {
        "requirement": "https://docs.nomagic.com/display/SYSMLP190/Requirement",
        "derived-from": "https://docs.nomagic.com/display/SYSMLP190/Derive",
        "validated-by": "http://purl.obolibrary.org/obo/SO_0000789",
        "vendor-documentation": "http://purl.obolibrary.org/obo/NCIT_C115742",
        "test-result": "http://www.ebi.ac.uk/efo/EFO_0000720",
        "title": "http://purl.org/dc/terms/title"
    },
    "@graph": [
        {
            "@id": "#req_m_01",
            "@type": "requirement",
            "derived-from": [
                "#req_e_01",
                "https://carla.readthedocs.io/en/latest/python_api/#carlamap"
            ],
            "validated-by": [
                "#evaulation_003"
            ]
        },
        {
            "@id": "#req_e_01",
            "@type": "requirement"
        },
        {
            "@id": "https://carla.readthedocs.io/en/latest/python_api/#carlamap",
            "@type": "vendor-documentation"
        },
        {
            "@id": "#evaluation_003",
            "@type": "test-result"
        }
    ],
    "title": "linkage of requirement M_01 (model format)"
};
resourceToCheck = "#req_m_01";
stmd = fs.readFileSync("./path/to/glueparticle.stmd", "utf-8");

checkLinkageSyntax(graph, resourceToCheck, stmd); // returns { result: true, log: "Resource (#req_m_01) is linked to a source and validation result"}
```

---


### III. INPUTS
---------------------------

namedGraph || 
------------------------|---------------
Unserialized data type  | JSON-LD object
Implements schema       | [named graph schema](./types/schemas.js)
Interpretation          | Any requirement representation (text, images, etc.)     

resourceIri || 
------------------------|---------------
Unserialized data type  | string
Implements schema       | [RFC 3987](https://datatracker.ietf.org/doc/html/rfc3987#section-2)
Interpretation          | The IRI of the resource that is under investigation in this check (i.e., the resource for that linkage will be checked)

namedGraph || 
------------------------|---------------
Unserialized data type  | string
Implements schema       | [STMD schema](https://raw.githubusercontent.com/PMSFIT/SSPTraceability/master/STMD.xsd)
Interpretation          | The string of the STMD file where all resources are traced

### IV. OUTPUTS
---------------------------

|| linkage OK 
------------------------|---------------
Event                   | The requirement is linked to a source and a validation result
Result                  | true
Log                     | Resource (resource IRI) is linked to a source and validation result. 

|| named graph not valid
------------------------|---------------
Event                   | The graph, given in the namedGraph argument does not fulfill the JSON schema
Result                  | false
Log                     | namedGraph does not fulfill the required schema  

|| resource IRI not found
------------------------|---------------
Event                   | The resource IRI, as given in the resourceIri argument cannot be found in the graph
Result                  | false
Log                     | The given resource IRI (resource IRI) is not existing in the named graph

|| STMD not valid
------------------------|---------------
Event                   | The stmd file, as given in the stmd argument does not fulfill its XSD schema
Result                  | false
Log                     | The given STMD does not fulfill the required XML schema definition 

|| source missing
------------------------|---------------
Event                   | The requirement is not linked to a source
Result                  | false
Log                     | Requirement (resource IRI) is not linked to its source

|| validation missing
------------------------|---------------
Event                   | The requirement is not linked to a validation result
Result                  | false
Log                     | Requirement (resource IRI) is not linked to a validation result

|| source and validation missing
------------------------|---------------
Event                   | The requirement is not linked to a source and not linked to a validation result
Result                  | false
Log                     | Requirement (resource IRI) is not linked to its source, nor to its validation result

|| source from wrong phase
------------------------|---------------
Event                   | The requirement has a source, but it's coming from a phase different than expected (must come from analysis phase or requirement phase itself) 
Result                  | false
Log                     | Source of requirement (resource IRI) is located in (actual phase), but is expected to come from the analysis phase or requirement phase.

|| validation result from wrong phase
------------------------|---------------
Event                   | The requirement has a validation result, but it's coming from a phase different than expected (must come from verification phase or evaluation phase) 
Result                  | false
Log                     | Validation result of requirement (resource IRI) is located in (actual phase), but is expected to come from the implementation phase or evaluation phase.

|| resource not existing
------------------------|---------------
Event                   | A resource with an IRI, as given in the named graph could not be found in the STMD
Result                  | false
Log                     | Resource (resource IRI) is not existing in the given STMD

## `checkLinkageSemantics`

### I. METADATA
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Requirements
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 2
Purpose                 | Second step of the requirement linkage check: Expert checks traceability attributes of a single requirement semantically
Acceptance criteria     | Expert check

### II. USAGE
-----------------------------

*Preparation step 1, expert statement:*

A qualified expert checks the following:

* **Sources**: The expert checks all contents of the sources of the requirement, given in the graph:
- Is there a causal relationship between source and requirement?
- Does the causal relationship make sense?

* **Validations**: The expert checks all contents of the validation results of the requirement, given in the graph:
- Is there a causal relationship between validation result and requirement?
- Does the causal relationship make sense?

The result of the first step is the expert statement. The content of the expert statement itself must contain the reduced result of the check (true/false) and the verbal statement, according to the following approach:

```javascript
{
    result: false,
    log: "Derivation from source (#req_e_01) not comprehensible."
}
```

*Preparation step 2, sign expert statment:* 

The expert check must be wrapped into the content of the signedStatement object, as can be observed below. This object must be stringified to be used as input of `checkSingleSemantic`. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

*Evaluate signed statment:*

The `checkLinkageSemantics` function takes the signed expert statement and the X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate.

The X509 certificate to be passed must be PEM- or DER-encoded. If PEM is used, a string is expected, if DER is used, a Buffer is expected.

```javascript
signedStatement = '{"content":{"result":false,"log":"Derivation from source (#req_e_01) not comprehensible."},"signature":"09f41fd02ab1a891cf92b7228d...997d93efa9b1b52712372","hash_algorithm":"SHA256","signature_encoding":"hex"}';
x509Pem = `-----BEGIN CERTIFICATE-----
MIIENzCCAx+gAwIBAgIUIUdYlY0Da5/4K/kAvFGkcpO1j9kwDQYJKoZIhvcNAQEL
...
nsA7g4QT5oCHJnRtfLXMgMdW+/Q76CqJgYsT
-----END CERTIFICATE-----`;

checkLinkageSemantics(signedStatement, x509Pem);
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
    log: "Derivation from source (#req_e_01) not comprehensible."
}
```

### III. INPUTS
---------------------------

Input 1 for the expert || 
------------------------|---------------
Entity kind             | Requirement
Entity type             | Any textual and/or image representation of the requirement   
Must contain            | At least the actual content of the requirement

Input 2 for the expert || 
------------------------|---------------
Entity kind             | Graph
Entity type             | Any representation that shows clearly the linkage of the requirement to check. For instance, a JSON-LD or RDF representation, but also an image representation of the graph  
Must contain            | At least the linkage to source and validation results

Input 3 for the expert || 
------------------------|---------------
Entity kind             | Resources
Entity type             | Any textual and/or image representation of the linked resources, according to the named graph 
Must contain            | At least the content of the linked resources

### IV. OUTPUTS
-----------------------------

|| Linkage comprehensible
------------------------|---------------
Event                   | All links semantically comprehensible
Result                  | true
Log                     | The links of requirement (requirement IRI) to its source and validation results are semantically correct

|| Linked resources not available
------------------------|---------------
Event                   | Linked resources are not available
Result                  | false
Log                     | At least one linked resource is not available

|| Requirement source not comprehensible
------------------------|---------------
Event                   | It is not to comprehensible, how the requirement has been derived from the given source
Result                  | false
Log                     | Derivation from source (resource IRI of source) not comprehensible

|| Requirement validation not comprehensible
------------------------|---------------
Event                   | It is not to comprehensible, how the requirement can be validated using the given validation results.
Result                  | false
Log                     | Validation of requirement using (resource IRI) of validation result> not comprehensible