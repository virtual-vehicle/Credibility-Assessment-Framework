/**
 * JSON schema for the configuration of a Signal
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const SIGNAL_CONFIG = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "unit_time": {
            "type": "string"
        },
        "unit_values": {
            "type": "string"
        },
        "precision": {
            "type": "integer",
            "minimum": 1
        }
    },
    "required": ["name"]
};

/**
 * JSON schema for the options of the compare method
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const COMPARE_OPTIONS = {
    "type": "object",
    "properties": {
        "comparison": {
            "type": "string",
            "enum": ["absolute", "relative"]
        },
        "threshold": {
            "type": "number",
            "minimum": 0
        },
        "tolerance": {
            "type":"number",
            "minimum": 0
        },
        "unit": {
            "type": "string"
        },
        "precision": {
            "type": "integer",
            "minimum": 1
        },
        "reduce": {
            "type": "boolean"
        }
    }
};

exports.SIGNAL_CONFIG = SIGNAL_CONFIG;
exports.COMPARE_OPTIONS = COMPARE_OPTIONS;