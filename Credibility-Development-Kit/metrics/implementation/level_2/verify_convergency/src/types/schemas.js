/**
 * JSON schema for defining a Measurement
 *
 * @author localhorst87
 * @readonly
 * @constant {Object}
*/
const MEASUREMENT = {
    "type": "object",
    "properties": {
        "time": {
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "values": {
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "unit": {
            "type": "string"
        }
    },
    "required": ["time", "values", "unit"]
};

exports.MEASUREMENT = MEASUREMENT;
