/**
 * JSON schema for the configuration of a ScalarParameter
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const SCALAR_PARAMETER_CONFIG = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "unit": {
            "type": "string"
        },
        "interval": {
            "type": "number",
        },
        "source_value": {
            "type": "string",
        },
        "source_uncertainty": {
            "type": "string",
        },
        "lower_limit": {
            "type": "number"
        },
        "upper_limit": {
            "type": "number"
        },
        "tolerance_absolute": {
            "type": "number",
        },
        "tolerance_relative": {
            "type": "number",
        },
        "standard_deviation": {
            "type": "number",
        },
        "standard_deviation_factor": {
            "type": "number",
        }
    },
    "required": ["name"]
};

/**
 * JSON schema for single constructor argument
 * 
 * @author localhorst87
 * @readonly
 * @constant {Object}
 */
const PARAMETER_JSON = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "data": {
            "type": "object",
            "properties": {
                "nominal": {
                    "type": "number"
                },
                "upper": {
                    "type": "number"
                },
                "lower": {
                    "type": "number"
                },
                "unit": {
                    "type": "string"
                },
                "interval": {
                    "type": "number"
                }                
            },
            "required": ["nominal"]
        },
        "uncertainty": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string"
                },
                "standardDeviation": {
                    "type": "number"
                }
            }
        },
        "source": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "string"
                },
                "uncertainty": {
                    "type": "string"
                }
            }
        }
    },
    "required": ["name", "data"]
};

exports.SCALAR_PARAMETER_CONFIG = SCALAR_PARAMETER_CONFIG;
exports.PARAMETER_JSON = PARAMETER_JSON;