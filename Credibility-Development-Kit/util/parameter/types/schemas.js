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

exports.SCALAR_PARAMETER_CONFIG = SCALAR_PARAMETER_CONFIG;