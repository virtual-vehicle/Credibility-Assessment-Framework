# STMD-CRUD

The STMD CRUD package provides a simple interface to create, read, update and delete contents of [Simulation Task Meta Data](https://github.com/PMSFIT/SSPTraceability) files.

## USAGE

1. [Instantiation](#instantiation)
2. [Create elements](#create-elements) 
    - [`addResource`](#addresource)
    - [`addResourceReference`](#addresourcereference)
    - [`addLink`](#addlink)
3. [Read elements](#read-elements)
    - [`getResources`](#getresources)
    - [`getResourceFromId`](#getresourcefromid)
    - [`getResourceFromReference`](#getresourcefromreference)
    - [`getResourceReferences`](#getresourcereferences)
    - [`getLinks`](#getlinks)
    - [`getClassifications`](#getclassifications)
    - [`getAnnotations`](#getannotations)
    - [`getLifeCycleEntries`](#getlifecycleentries)
    - [`getTopLevelInformation`](#gettoplevelinformation)
    - [`getGeneralInformation`](#getgeneralinformation)
4. [Update elements](#update-elements)
    - [`updateResource`](#updateresource)
    - [`updateLink`](#updatelink)
5. [Delete elements](#delete-elements)
    - [`deleteResource`](#deleteresource)
    - [`deleteResourceReference`](#deleteresourcereference)
    - [`deleteLink`](#deletelink)
6. [Exporters](#exporters)
    - [`export`](#export)
    - [`createGraphFromLink`](#creategraphfromlink)


### Instantiation

For instantiation of a StmdCrud, use the xml string of the STMD file as the single argument:

```javascript
stmdString = fs.readFileSync("path/to/stmd_file.stmd", "utf-8");
stmdCrud = new StmdCrud(stmdString); // if stdmString is not set, a new, empty STMD will be instantiated.
```

Parsing of the complete STMD file is done in the background. In case the stmdString is not set, an empty STMD is instantiated.

### Create elements

#### `addResource`

To add a resource to a specific location, pass the resource and its location (the list of enclosing parent elements) to `addResource`:

```javascript
resource = {
    attributes: {
        kind: "requirement",
        type: "application/json",
        id: "req_01",
        source: "./requirements/model_requierment_01.json"
    }
};
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:DefineModelRequirements", "stc:Output"];

addedSuccessful = stmdCrud.addResource(resource, location); // if ID is not unique, addResource will return false
```
`resource` must be of type [`ResourceType`](./types/specification.js)

`location` must be the location (given as hierarchical string array of the element tree) where to add the resource. 
Please note: In this first version, it will not be checked if the location is valid according to the XML schema of the STMD!

#### `addResourceReference`

To add a resource reference to a specific location, pass the resource reference and its location (the list of enclosing parent elements) to `addResourceReference`:

```javascript
resourceReference = {
    attributes: {
        xlink_href: "#req_01",
        description: "reference to requirement with ID req_01"
    }
};
location = ["stmd:SimulationTaskMetaData", "stmd:DesignPhase", "stmd:DefineModelDesignSpecification", "stc:Input"];

addedSuccessful = stmdCrud.addResourceReference(resourceReference, location); // if ID is not unique, addResourceReference will return false
```
`resourceReference` must be of type [`ResourceReference`](./types/specification.js)

`location` must be the location (given as hierarchical string array of the element tree) where to add the resource reference. 
Please note: In this first version, it will not be checked if the location is valid according to the XML schema of the STMD!

#### `addLink`

To add a link to a specific location, pass the link and its location (the list of enclosing parent elements) to `addLink`:

```javascript
link = {
    locator: [
        {
            attributes: {
                xlink_href: "#req_01",
                xlink_label: "a_requirement",
                xlink_role: "model-requirement"
            }
        },
        {
            attributes: {
                xlink_href: "#spec_model",
                xlink_label: "according_specification",
                xlink_role: "model-specification"           
            }
        }
    ],
    arc: [
        {
            attributes: {
                xlink_from: "according_specification",
                xlink_to: "a_requirement"
                xlink_arcrole: "derived-from"
            }                
        }
    ],
    attributes: {
        xlink_title: "requirement source of the model specification",
    }
};

location = ["stmd:SimulationTaskMetaData", "stmd:DesignPhase", "stmd:DefineModelDesignSpecification"];

addedSuccessful = stmdCrud.addLink(link, location);
```
`link` must be of type [`LinksType`](./types/specification.js)

`location` must be the location (given as hierarchical string array of the element tree) where to add the link. 
Please note: In this first version, it will not be checked if the location is valid according to the XML schema of the STMD!

### Read elements

#### `getResources`

To get all resources of a specific location, pass the location (the list of enclosing parent elements) to `getResources`:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:DefineModelRequirements", "stc:Output"];

availableResources = stmdCrud.getResources(location);
```
The function returns an array of type [`AvailableResource`](./types/internal_types.js).

If you want to get additionally all resources of the sub-elements, pass `true` as second argument:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:DefineModelRequirements"];

availableResources = stmdCrud.getResources(location, true);
```
In this case, the resources of all particles of `stmd:DefineModelRequirements` are returned, i.e., all elements in `stc:Input`, `stc:Procedure`, `stc:Output` and `stc:Rationale`.

#### `getResourceFromId`

To get a specific resource by its ID (given in its attributes, cf. [`addResource`](#addresource)), use `getResourceFromId`:

```javascript
stmdCrud.getResourceFromId("req_01");
```

The function will return the resource as [`AvailableResource`](./types/internal_types.js) or `undefined`, if no resource with the given ID exists.

#### `getResourceFromReference`

To get the resource, which is references by a resource reference, pass a ResourceReference object to the function `getResourceFromReference`:

```javascript
resourceReference = {
    attributes: {
        xlink_href: "req_m_01",
        ...
    }
}; // typically requested via stmdCrud.getResourceReferences(...)

resource = stmdCrud.getResourceFromReference(resourceReference);
```

The function will return the resource with the ID "req_m_01".

#### `getResourceReferences`

To get all resources references of a specific location, pass the location (the list of enclosing parent elements) to `getResourceReferences`:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:DefineModelRequirements", "stc:Output"];

availableResources = stmdCrud.getResourceReferences(location);
```
The function returns an array of type [`AvailableResourceReference`](./types/internal_types.js).

If you want to get additionally all resources references of the sub-elements, pass `true` as second argument:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:DefineModelRequirements"];

availableResources = stmdCrud.getResourceReferences(location, true);
```
In this case, the resources references of all particles of `stmd:DefineModelRequirements` are returned, i.e., all resource references in `stc:Input`, `stc:Procedure`, `stc:Output` and `stc:Rationale`.

#### `getLinks`

To get all Link elements (converted stc:Link) of a given parent element in the STMD, pass the location of the enclosing parent elements to `getLinks`:

**Please note**: The Link elements below the LinksType element (stc:Links) are returned here, so stc:Links must not be part of the location!

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:ImplementationPhase", "stmd:IntegrateSimulation"];

availableLinks = stmdCrud.getLinks(location);
```

The function returns an array of type [`AvailableLinks`](./types/internal_types.js).

If you want to get all links of sub-elements, pass `true` as second argument:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:ImplementationPhase"];

availableLinks = stmdCrud.getLinks(location, true);
```
In this case, the links of all steps of `stmd:ImplementationPhase` are returned, i.e., all resource references in `stc:Input`, `stc:Procedure`, `stc:Output` and `stc:Rationale`.

#### `getLifeCycleEntries`

To get all lify cycle entries (converted stc:Drafted, stc:Defined, stc:Validated, ...) of a specific location, pass the the location of the stc:LifeCycleInformation element to `getLifeCycleEntries`:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:ImplementationPhase"];

availableLifecycleEntries = stmdCrud.getLifeCycleEntries(location);
```
The function will return an array of [`AvailableLifeCycleEntry`](./types/internal_types.js) objects. Depending on which LifeCycleEntryTypes are given, the single objets carry the name of the LifeCycleEntryTypes as `status` argument:
```javascript
// example for availableLifecycleEntries, as requested above
[
    {
        location: ["stmd:SimulationTaskMetaData", "stmd:ImplementationPhase"],
        status: "Validated",
        lifecycleEntry: { ... }
    },
    {
        location: ["stmd:SimulationTaskMetaData", "stmd:ImplementationPhase"],
        status: "Approved",
        lifecycleEntry: { ... }
    }, 
]
```

#### `getClassifications`

To get all classification elements (converted stc:Classification) of a given parent element, pass the location (the list of enclosing parent elements) to `getClassifications`:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:VerifyRequirements"];

classifications = stmdCrud.getClassifications(location);
```
The function returns an array of type [`Classification`](./types/specification.js).

**Please note**: Classifications inside Resources or ResourceReferences can not be requested with this method. For this purpose, use [`getResources`](#getresources) and explore its child elements.

#### `getAnnotations`

To get all annotation elements (converted stc:Annotation) of a given parent element, pass the location (the list of enclosing parent elements) to `getAnnotations`:

```javascript
location = ["stmd:SimulationTaskMetaData", "stmd:RequirementsPhase", "stmd:VerifyRequirements"];

annotations = stmdCrud.getAnnotations(location);
```
The function returns an array of type [`Annotation`](./types/specification.js).

**Please note**: Classifications inside Resources or ResourceReferences can not be requested with this method. For this purpose, use [`getResources`](#getresources) and explore its child elements.

#### `getTopLevelInformation`

To get the top-level information of the STMD (version, name, GUID, author, generationTool, etc.), use `getTopLevelInformation`:

```javascript
stmdCrud.getTopLevelInformation();
```
The function will return an object of type [`SimulationTaskMetaDataAttributes`](./types/specification.js).

#### `getGeneralInformation`

To get the general information of the STMD (contains the derivation chain of the STMD), use `getGeneralInformation`:

```javascript
stmdCrud.getGeneralInformation();
```
The function will return an object of type [`GeneralInformationType`](./types/specification.js). 


### Update elements

#### `updateResource`

To update a specific resource, pass the UID of the available resource, the updated resource object and the target location to `updateResource`:

(**Please note**: The UID is not the same as the ID of the resource, given in its attributes. The latter one is optional and therefore it can't be used as a unique reference. The UID is an internal UID, allocated within the instance of the STMD CRUD class. It can be identified by calling [`getResources`](#getresources)).

```javascript
// the user wants to update the following resource:
availableResource = {
    uid: "9afb41b78ea6b",
    location: ["stmd:SimulationTaskMetaData", "stmd:EvaluationPhase", "stmd:EvaluateSimulationResults", "stc:Output"],
    resource: {
            attributes: {
                kind: "result",
                type: "application/json",
                id: "result_uncertainty_quantification",
                source: "./evaluation/20230830_uncertainty_quantification.json"
            }
    }
};

// change resource content
updatedResource = {...availableResource.resource};
updatedResource.attributes.source = "./evaluation/20230905_uncertainty_quantification.json";

// set new location
newLocation = ["stmd:SimulationTaskMetaData", "stmd:EvaluationPhase", "stmd:EvaluateSimulationResults", "stc:Procedure"],

updateSuccessful = stmdCrud.updateResource(updatedResource, newLocation, availableResource.uid);
```

If the UID does not exist, the operation will cancel and return `false`.

#### `updateLink`

To update a specific link, pass the UID of the available link, the updated link object and the target location to `updateLink`:

(**Please note**: The UID is not the same as the ID of the resource, given in its attributes. The latter one is optional and therefore it can't be used as a unique reference. The UID is an internal UID, allocated within the instance of the STMD CRUD class. It can be identified by calling [`getLinks`](#getlinks)).

```javascript
// the user wants to update the following link:
availableLink = {
    uid: "a81e76447c3cd",
    location: ["stmd:SimulationTaskMetaData", "stmd:DesignPhase", "stmd:DefineModelDesignSpecification"],
    link: {
        locator: [...],
        arc: [...],
        attributes: {
            xlink_title: "requirement source of the model specification",
        }
    }        
};

// change resource content
updatedLink = {...availableLink.link};
updatedLink.Link[0].attributes.xlink_title = "any new title";

updateSuccessful = stmdCrud.updateLink(updatedLink, availableLink.location, availableLink.uid);
```

If the UID does not exist, the operation will cancel and return `false`.

### Delete elements

#### `deleteResource`

To delete a specific resource, pass the UID of the resource you want to delete to `deleteResource`:

(**Please note**: The UID is not the same as the ID of the resource, given in its attributes. The latter one is optional and therefore it can't be used as a unique reference. The UID is an internal UID, allocated within the instance of the STMD CRUD class. It can be identified by calling [`getResources`](#getresources)).

```javascript
// the resource, the user wants to delete
availableResource = {
    uid: "9afb41b78ea6b",
    location: [...],
    resource: {...}
};

deletedSuccessful = stmdCrud.deleteResource(availableResource.uid);
```

The operation will not only delete the resource itself, but also **all resource references** that point to this resource.

If the UID does not exist, the operation will cancel and return `false`.

#### `deleteResourceReference`

To delete a specific resource reference, pass the UID of the resource reference you want to delete to `deleteResourceReference`:

(**Please note**: The UID is not the same as the ID of the resource, given in its attributes. The latter one is optional and therefore it can't be used as a unique reference. The UID is an internal UID, allocated within the instance of the STMD CRUD class. It can be identified by calling [`getResourceReferences`](#getresourcereferences)).

```javascript
// the resource reference, the user wants to delete
availableResourceReference = {
    uid: "bb2557dc14053",
    location: [...],
    resourceReference: {...}
};

deletedSuccessful = stmdCrud.deleteResourceReference(availableResourceReference.uid);
```

If the UID does not exist, the operation will cancel and return `false`.

#### `deleteLink`

To delete a specific link, pass the UID of the link you want to delete to `deleteLink`:

(**Please note**: The UID is not the same as the ID of the resource, given in its attributes. The latter one is optional and therefore it can't be used as a unique reference. The UID is an internal UID, allocated within the instance of the STMD CRUD class. It can be identified by calling [`getLinks`](#getlinks)).

```javascript
// the link, the user wants to delete
availableLink = {
    uid: "425f82460328e",
    location: [...],
    link: {...}
};

deletedSuccessful = stmdCrud.deleteLink(availableLink.uid);
```

If the UID does not exist, the operation will cancel and return `false`.

### Exporters

#### `export`

To export the current instance of the STMD (including all changes done) to XML, use the `export` function:

```javascript 
xmlString = stmdCrud.export();
```

#### `createGraphFromLink`

To create a JSON-LD named graph (as defined in https://www.w3.org/TR/json-ld/#named-graphs) from a specific Link, use `createGraphFromLink`. Pass a [`Link`](./types/specification.js) and a context (as an array of [`ContextEntry`](./types/internal_types.js) elements) to give semantical meaning to the used vocabulary:

```javascript
/*
STMD raw version of Link:

<stc:Link xlink:type="extended" xlink:title="requirement source of the model specification">
    <stc Locator xlink:type="locator" xlink:href="#req_01" xlink:label="a_requirement" xlink:role="requirement" />
    <stc Locator xlink:type="locator" xlink:href="#spec_model" xlink:label="according_specification" xlink:role="design-specification" />
    <stc:Arc xlink:type="arc" xlink:from="according_specification" xlink:to="a_requirement" xlink:arcrole="derived-from" />
</stc:Link>
*/

// The upper raw link from the STMD will be considered as the link to translate. The STMD CRUD internal type looks the following
// (and may be requested by using stmdCrud.getLinks):
link = {
    locator: [
        {
            attributes: {
                xlink_href: "#req_01",
                xlink_label: "a_requirement",
                xlink_role: "requirement"
            }
        },
        {
            attributes: {
                xlink_href: "#spec_model",
                xlink_label: "according_specification",
                xlink_role: "design-specification"           
            }
        }
    ],
    arc: [
        {
            attributes: {
                xlink_from: "according_specification",
                xlink_to: "a_requirement"
                xlink_arcrole: "derived-from"
            }                
        }
    ],
    attributes: {
        xlink_title: "requirement source of the model specification",
    }
};

// Describe context of used vocabulary
context = [
    {
        term: "requirement",
        iri: "https://docs.nomagic.com/display/SYSMLP190/Requirement"
    },
    {
        term: "design-specification",
        iri: "https://dbpedia.org/page/Design_specification"
    },
    {
        term: "derived-from",
        iri: "https://docs.nomagic.com/display/SYSMLP190/Derive"
    }
];

stmdCrud.createGraphFromLink(link, context);
```

This function return the following named-graph, as a string:

```javascript
{
    "@context": {
        "requirement": "https://docs.nomagic.com/display/SYSMLP190/Requirement",
        "design-specification": "https://dbpedia.org/page/Design_specification",
        "derived-from": "https://docs.nomagic.com/display/SYSMLP190/Derive",
        "title": "http://purl.org/dc/terms/title"
    },
    "@graph": [
        {
            "@id": "#req_01",
            "@type": "requirement",
        },
        {
            "@id": "#spec_model",
            "@type": "design-specification",
            "derived-from": [
                "#req_01"
            ]
        }
    ],
    "title": "requirement source of the model specification"
}
```
