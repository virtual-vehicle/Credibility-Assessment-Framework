/**
 * JSON schema for defining the structure of system models
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const SYSTEM_STRUCTURE = {
    "type": "object",
    "properties": {
        "elements": {
            "type": "array",
            "items": {
                "type": "object",
                "properties" : {
                    "name": { 
                        "type": "string"
                    },
                    "type": {
                        "type": "string",
                        "enum": ["System", "Component", "SignalDictionaryReference"],
                    },
                    "source": {
                        "type": "string"
                    },
                    "pedigree" :{
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }       
                }
            }
        },
        "connectors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties" : {
                    "subsystem" :{
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "element": {
                        "type": "string"
                    },
                    "name": { 
                        "type": "string"
                    },
                    "kind": {
                        "type": "string",
                        "enum": ["input", "output", "inout", "paramter", "calculatedParameter"]
                    },
                    "type": {
                        "type": "string",
                        "enum": ["Real", "Integer", "Boolean", "String", "Enumeration"]
                    }          
                }
            }
        },
        "connections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties" : {
                    "subsystem" :{
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "element_start": { 
                        "type": "string"
                    },
                    "name_start": {
                        "type": "string"
                    },
                    "element_end": {
                        "type": "string"
                    },
                    "name_end": {
                        "type": "string"
                    }          
                }
            }
        }
    }
};

/**
 * JSON schema for defining the description of a model
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const MODEL_DESCRIPTION = {
    "type": "object",
    "properties": {
        "modelVariables": {
            "type": "array",
            "items": {
                "type": "object",
                "properties" : {
                    "name": {
                        "type": "string"
                    },
                    "usage": {
                        "type": "string",
                        "enum": ["local", "input", "output", "parameter", "calculatedParameter", "independent"]
                    },
                    "variability": {
                        "type": "string",
                        "enum": ["constant", "fixed", "tubable", "discrete", "continuous"]
                    },
                    "data_type": {
                        "type": "string",
                        "enum": ["Real", "Integer", "Boolean", "String", "Enumeration"]
                    },
                    "init_method": {
                        "type": "string",
                        "enum": ["exact", "approx", "calculated", "substitute", "permitted"]
                    },
                    "init_value": {
                        "type": "number",
                        "nullable": true
                    },
                    "unit": {
                        "type": "string"
                    },
                    "range": {
                        "type": "array",
                        "items": {
                            "type": "number",
                            "nullable": true
                        },
                        "minItems": 2,
                        "maxItems": 2
                    }  
                }
            }
        },
        "typeDefinitions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties" : {
                    "name": {
                        "type": "string"
                    },
                    "usage": {
                        "type": "string",
                        "enum": ["Real", "Integer", "Boolean", "String", "Enumeration"]
                    }
                }
            }
        },
        "unitDefinitions" : {
            "type": "array",
            "items": {
                "type": "object",
                "properties" : {
                    "name": {
                        "type": "string"
                    },
                    "si_unit_composition": {
                        "type": "object",
                        "properties": {
                            "factor": {
                                "type": "number"
                            },
                            "offset": {
                                "type": "number"
                            },
                            "base_units": {
                                "type": "object",
                                "properties": {
                                    "kg": {
                                        "type": "integer"
                                    },
                                    "m": {
                                        "type": "integer"
                                    },
                                    "s":  {
                                        "type": "integer"
                                    },
                                    "A":  {
                                        "type": "integer"
                                    },
                                    "K":  {
                                        "type": "integer"
                                    },
                                    "mol":  {
                                        "type": "integer"
                                    },
                                    "cd":  {
                                        "type": "integer"
                                    },
                                    "rad":  {
                                        "type": "integer"
                                    }
                                }
                            }
                        }                                
                    }
                }
            }
        }
    }
};

exports.SYSTEM_STRUCTURE = SYSTEM_STRUCTURE;
exports.MODEL_DESCRIPTION = MODEL_DESCRIPTION;