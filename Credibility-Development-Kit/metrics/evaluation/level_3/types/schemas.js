/**
 * JSON schema for representing an empirical distribution
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const EMPIRICAL_DISTRIBUTION_SCHEMA = 
{
    "type": "object",
    "properties": {
        "type": {
            "type": "string",
            "description": "Identifier if this distribution is a PDF or CDF",
            "enum": ["PDF","pdf","CDF","cdf"]
        },
        "x": {
            "type": "array",
            "description": "Samples of the random variable",
            "items": {
                "type": "number"
            }
        },
        "y": {
            "type": "array",
            "description": "Probability for each sample (relative probability for PDF or accumulated probability for CDF)",
            "items": {
                "type": "number"
            }
        },
        "unit": {
            "type": "string",
            "description": "Unit of the random variable"
        }
    },
    "required": ["type", "x", "y", "unit"]
};

/**
 * JSON schema for representing P-Boxes
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const P_BOXES_SCHEMA = 
{
    "type": "object",
    "properties": {
        "p_left": {
            "type": "array",
            "description": "Left boundary of EDFs",
            "items": {
                "type": "number"
            }
        },
        "p_right": {
            "type": "array",
            "description": "Right boundary of EDFs",
            "items": {
                "type": "number"
            }
        },
        "x": {
            "type": "array",
            "description": "Samples of the random variable",
            "items": {
                "type": "number"
            }
        },
        "unit": {
            "type": "string",
            "description": "Unit of the random variable"
        }
    },
    "required": ["p_left", "p_right", "x", "unit"]
};

exports.EMPIRICAL_DISTRIBUTION_SCHEMA = EMPIRICAL_DISTRIBUTION_SCHEMA;
exports.P_BOXES_SCHEMA = P_BOXES_SCHEMA;