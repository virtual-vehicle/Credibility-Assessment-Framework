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

const SIGNAL_JSON = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
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
        "units": {
            "type": "object",
            "properties": {
                "time": {
                    "type": "string"
                },
                "values": {
                    "type": "string"
                },
            },
            "required": ["time", "values"]
        },
        "precision": {
            "type": "integer",
            "minimum": 1
        },
        "history": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "step": {
                        "type": "integer",
                        "minimum": 1
                    },
                    "date": {
                        "type": "string"
                    },
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
                    "processing": {
                        "type": "string"
                    }
                },
                "required": ["step", "date", "time", "values", "processing"]
            }
        }
    },
    "required": ["name", "time", "values", "units", "precision", "history"]
};

exports.SIGNAL_JSON = SIGNAL_JSON;
exports.SIGNAL_CONFIG = SIGNAL_CONFIG;
exports.COMPARE_OPTIONS = COMPARE_OPTIONS;