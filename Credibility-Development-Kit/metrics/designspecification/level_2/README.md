# DESIGN SPECIFICATION - LEVEL 2

Metrics to support the linkage verification for the design specification at level 2.

* [`checkLinkageSyntax`](#checklinkagesyntax): First step of design linkage check, that evaluates if a single design is linked to a source and to a validation result
* [`checkLinkageSemantics`](#checklinkagesemantics): Second step of the design linkage check, where an expert needs to check if the traceability attributes of a single design make sense from semantic point of view

---
## `checkLinkageSyntax`

### I. Metadata
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Design
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 2
Purpose                 | First step of Level-2 formal traceability check of each design specification: <br /><br /> Check if the design specification traceability is supported using a named graph. In detail: Is the justification of the design specification expressed with linkage to resources of former phases and/or the design phase and is the specification linked to implementation entities from the implementation phase? [to do: constrain the attributes/ontology to use]. <br /><br /> There is no further checking if the linkage itself makes sense from semantic point of view. This will be carried out in the second step (expert check)
Implements              | Check of traceability attributes
Acceptance criteria     | Traceability logic fulfilled


### II. USAGE 
---------------------------

For the following example, the design specfication #designspec_model_approach_curved_roads will be checked. As can be seen from the graph, it has "derived-from" and "has-implementation" attributes that 
indicate a linkage to the sources of the requirement and implementation phases. To export such a named graph from a Glue Particle (STMD), use the `createGraphFromLink` function from the [STMD CRUD package](../../../util/stmd-crud/).

`checkLinkageSyntax` is cross-checking simply if the relations between the resources are set up according to a agreed procedure, using the provided STMD, i.e., if the design specfication is derived from requirements or from artifacts that represent the task analysis and if the design specfication is implemented by a model in the implementation phase.

```javascript
fs = require('fs');

graph = {
    "@context": {
        "analysis": "https://pmsfit.github.io/SSPTraceability/master/#_analysisphase",
        "evaluation": "https://pmsfit.github.io/SSPTraceability/master/#_evaluationphase",
        "validated-by": "http://open-services.net/ns/rm#validatedBy",
        "functional-requirement": "https://docs.nomagic.com/display/SYSMLP190/Functional+Requirement",
        "implementation": "https://docs.nomagic.com/display/SYSMLP190/Implementation",
        "requirement": "https://docs.nomagic.com/display/SYSMLP190/Requirement",
        "extended-requirement": "https://docs.nomagic.com/display/SYSMLP190/Extended+Requirement",
        "design-specification": "https://dbpedia.org/page/Design_specification",
        "data-sheet": "https://dbpedia.org/page/Datasheet",
        "regulation": "http://purl.obolibrary.org/obo/NCIT_C68821",
        "constraint": "https://docs.nomagic.com/display/SYSMLP190/Design+Constraint",
        "test-case": "https://docs.nomagic.com/display/SYSMLP190/Test+Case",
        "standard": "http://purl.obolibrary.org/obo/NCIT_C81893",
        "source-code-repository": "http://purl.obolibrary.org/obo/APOLLO_SV_00000522",
        "vendor-documentation": "http://purl.obolibrary.org/obo/NCIT_C115742",
        "scientific-publication": "http://purl.obolibrary.org/obo/NCIT_C19026",
        "constrains": "http://open-services.net/ns/rm#constrains",
        "constrained-by": "http://open-services.net/ns/rm#constrainedBy",
        "derived-from": "https://docs.nomagic.com/display/SYSMLP190/Derive",
        "satisfies": "https://docs.nomagic.com/display/SYSMLP190/Satisfy",
        "is-satisfied-by": "http://semanticscience.org/resource/SIO_000363",
        "has-implementation": "http://semanticscience.org/resource/SIO_000234",
        "is-implementation-of": "http://semanticscience.org/resource/SIO_000233",
        "verifies": "https://docs.nomagic.com/display/SYSMLP190/Verify",
        "specifies": "http://purl.obolibrary.org/obo/NCIT_C25685",
        "is-specified-by": "http://semanticscience.org/resource/SIO_000339",
        "describes": "http://semanticscience.org/resource/SIO_000563",
        "is-model-of": "http://semanticscience.org/resource/SIO_000632",
        "manual": "http://semanticscience.org/resource/SIO_000161",
        "requires": "http://purl.org/dc/terms/requires",
        "title": "http://purl.org/dc/terms/title"
    },
    "@graph": [
        {
            "@id": "#designspec_model_approach_curved_roads",
            "@type": "design-specification",
            "derived-from": [
                "#req_m_15"
            ],
            "has-implementation": [
                "#impl_01"
            ]
        },
        {
            "@id": "#req_m_15",
            "@type": "requirement"
        },
        {
            "@id": "#impl_01",
            "@type": "implementation"
        }
    ],
    "title": "modeling approach curved roads"
};

resourceToCheck = "#designspec_model_approach_curved_roads";
stmd = fs.readFileSync("./path/to/glueparticle.stmd", "utf-8");

checkLinkageSyntax(graph, resourceToCheck, stmd); // returns { result: true, log: "Design specification #designspec_model_approach_curved_roads can be traced to source and implementation"}
```

### III. Input Specification
---------------------------

namedGraph || 
------------------------|---------------
Unserialized data type  | JSON-LD object
Implements schema       | [named graph schema](./types/schemas.js)
Interpretation          | Any design representation (text, images, etc.)     

resourceIri || 
------------------------|---------------
Unserialized data type  | string
Implements schema       | [RFC 3987](https://datatracker.ietf.org/doc/html/rfc3987#section-2)
Interpretation          | The IRI of the resource that is under investigation in this check (i.e., the design specification for that linkage will be checked

stmd || 
------------------------|---------------
Unserialized data type  | string
Implements schema       | [STMD schema](https://raw.githubusercontent.com/PMSFIT/SSPTraceability/master/STMD.xsd)
Interpretation          | The string of the STMD file where all resources are traced

### IV. Output Specification
---------------------------

|| linkage OK 
------------------------|---------------
Event                   | The justification of the design specification is expressed by linkage to requirements and results from the analysis phase; and the design specification is linked to implementation entities from the implementation phase.
Result                  | true
Log                     | Design specification `<design specification IRI>` can be traced to source and implementation.

|| named graph not valid
------------------------|---------------
Event                   | The graph, given in the namedGraph argument does not fulfill the JSON schema
Result                  | false
Log                     | namedGraph does not fulfill the required schema  

|| resource IRI not found
------------------------|---------------
Event                   | The resource IRI, as given in the resourceIri argument cannot be found in the graph
Result                  | false
Log                     | The given resource IRI `<resourceIri>` is not existing in the named graph

|| STMD not valid
------------------------|---------------
Event                   | The stmd file, as given in the stmd argument does not fulfill its XSD schema
Result                  | false
Log                     | The given STMD does not fulfill the required XML schema definition 

|| Justification missing
------------------------|---------------
Event                   | The justification of the design specification is not expressed with linkage; i.e., links to resources of former phases are missing
Result                  | false
Log                     | Design specification `<design specification resource IRI>` can not be traced to source (justification missing)

|| Implementation missing
------------------------|---------------
Event                   | The design specification is not linked to an implementation entity
Result                  | false
Log                     | Design specification `<design specification resource IRI>` is not linked to its implementation.

|| Justification and Implementation missing
------------------------|---------------
Event                   | The design specification is not linked to a source and not linked to a validation result
Result                  | false
Log                     | Design specification `<design specification resource IRI>` cannot be traced to source (justification missing) and is not linked to its implementation

|| Justification from wrong phase
------------------------|---------------
Event                   | The design specification is justified with a link, but it's coming from a phase different than expected (is not allowed to be located in implementation and evaluation phase) 
Result                  | false
Log                     | The design specification `<design specification resource IRI>` is justified with a resource from the `<actual phase>`, but must not come from the implementation phase or evaluation phase

|| Implementation from wrong phase
------------------------|---------------
Event                   | The design specification is linked to an implementation, but it's coming from a phase different than expected (must come from the implementation phase). 
Result                  | false
Log                     | Implementation of design specification `<design specification IRI>` is located in `<actual phase>`, but is expected to be located in the implementation phase

|| resource not existing
------------------------|---------------
Event                   | A resource with an IRI, as given in the named graph could not be found in the STMD
Result                  | false
Log                     | Resource (resource IRI) is not existing in the given STMD

## `checkLinkageSemantics`

### I. Metadata
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Design Specification
CSP step                | Models, Parameters, Environment, Test Cases, Integration
Level                   | 2
Purpose                 | Second step of formal traceability check of each design specification: <br/> An expert needs to check if the traceability attributes of a design specification make sense from semantic point of view (logical check of the linkage must have been carried out in the first step). <br/> Examples for the expert check: Is the justification for the design specification really comprehensible? Does the link to the implementation entity points to the correct artifact?
Acceptance criteria     | Expert check


### II. USAGE
-----------------------------

*Preparation step 1, expert statement:*

A qualified expert checks the following:

* **Sources**: Expert checks the linkage that represents the justification of the design specification, given in the graph:
    - Is there a causal relationship between the linked artifacts to the design specification that serve as justifications?
    - Does the causal relationship make sense?
    - If needed: Are constraints and necessary assumptions from former process phases given and/or comprehensible?

* **Validations**: Expert checks all linked implementations of the design specification, given in the graph:
    - Is there a recognizable relationship between specification and implementation?
    - Does the relationship make sense?

The result of the first step is the expert statement. The content of the expert statement itself must contain the reduced result of the check (true/false) and the verbal statement, according to the following approach:

```javascript
{
    result: false,
    log: "Derivation from source (#designspec_model_1) not comprehensible."
}
```

*Preparation step 2, sign expert statment:* 

The expert check must be wrapped into the content of the signedStatement object, as can be observed below. This object must be stringified to be used as input of `checkSingleSemantic`. For ease of use, the structure can be generated, using the [sign function of the veri-sign util](https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/main/Credibility-Development-Kit/util/veri-sign).

*Evaluate signed statment:*

The `checkLinkageSemantics` function takes the signed expert statement and the X509 certificate as inputs to check if the statement has been signed by the holder of the X509 certificate.

The X509 certificate to be passed must be PEM- or DER-encoded. If PEM is used, a string is expected, if DER is used, a Buffer is expected.

```javascript
signedStatement = '{"content":{"result":false,"log":"Derivation from source (#designspec_model_1) not comprehensible."},"signature":"09f41fd02ab1a891cf92b7228d...997d93efa9b1b52712372","hash_algorithm":"SHA256","signature_encoding":"hex"}';
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
    log: "Derivation from source (#designspec_model_1) not comprehensible."
}
```

### III. Input Specification
---------------------------

Input 1 for the expert || 
------------------------|---------------
Entity kind             | Design specification
Entity type             | Any kind of the design specification resource, the justification should be done for   
Must contain            | At least a unique ID of the resources that will be used

Input 2 for the expert || 
------------------------|---------------
Entity kind             | Graph
Entity type             | Any representation that shows clearly the linkage of the design specification to check. For instance, a JSON-LD or RDF representation, but also an image representation of the graph  
Must contain            | At least the linkage to source and validation results

Input 3 for the expert || 
------------------------|---------------
Entity kind             | Resources
Entity type             | Any textual and/or image representation of the linked resources, according to the named graph 
Must contain            | At least the content of the linked resources

### IV. Output Specification
-----------------------------

|| Ok: Linkage comprehensible
------------------------|---------------
Event                   | All links semantically comprehensible
Result                  | true
Log                     | The links of the design specification `<design specification IRI>` representing the justification and implementing artifacts are semantically correct

|| Linked resources not available
------------------------|---------------
Event                   | Linked resources are not available
Result                  | false
Log                     | At least one linked resource is not available

|| Justification is not comprehensive
------------------------|---------------
Event                   | It is not comprehensible how the design specification can be justified with the linked entities
Result                  | false
Log                     | The justification for the design specification `<design specification IRI>` is not comprehensible

|| Implementation unclear
------------------------|---------------
Event                   | It is not comprehensible that the given resource is an implementation of the design specification
Result                  | false
Log                     | Implementation `<resource IRI of implementation>` of design specification `<resource IRI of design specification>` is not comprehensible
