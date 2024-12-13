/**
 * JSON schema for defining the structure of system models
 *
 * @author lvtan
 * @readonly
 * @constant {Object}
*/
const NAMED_GRAPH_SCHEMA = 
{
    "type": "object",
    "properties": {
        "@context": {
            "type": "object",
            "description": "a context description, according to https://www.w3.org/TR/json-ld11/#the-context. Currently only the expanded form is supported",
            "patternProperties": {
                "^.*$": {
                    "type": "string",
                    "description": "any keywords used as @type in the named graph"
                },
            },
            "additionalProperties": false
        },
        "@graph": {
            "type": "array",
            "description": "a named graph, according to https://www.w3.org/TR/json-ld11/#named-graphs",
            "items": {
                "type": "object",
                "properties": {
                    "@id": {
                        "type": "string",
                        "description": "the IRI of the resource inside the STMD file, e.g. #requirement_012",
                    },
                    "@type": {
                        "type": "string",
                        "description": "the type of the resource, according to https://www.w3.org/TR/json-ld11/#specifying-the-type. If not given as an IRI, the term must be defined in the @context"
                    }
                },
                "required": ["@id", "@type"],
                "additionalProperties": {
                    "type": "array"
                }
            }
        },
        "additionalProperties": { 
            "type": "string"
        }
    },
    "required": ["@graph"]
};

exports.NAMED_GRAPH_SCHEMA = NAMED_GRAPH_SCHEMA;