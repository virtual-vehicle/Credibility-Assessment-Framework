const { XMLParser } = require("fast-xml-parser");

const PARSE_AS_ARRAY = [
    'road',
    'controller',
    'junction',
    'junctionGroup',
    'station',
    'userData',
    'userDataContent',
    'include',
    'geometry',
    'superelevation',
    'shape',
    'elevation',
    'CRG',
    'type',
    'lane',
    'laneOffset',
    'laneSection',
    'height',
    'width',
    'border',
    'predecessor',
    'successor',
    'material',
    'speed',
    'access',
    'roadMark',
    'rule',
    'connection',
    'priority',
    'laneLink',
    'junctionReference',
    'tunnel',
    'bridge',
    'objectReference',
    'repeat',
    'object',
    'validity',
    'cornerReference',
    'marking',
    'outline',
    'cornerRoad',
    'cornerLocal',
    'signalReference',
    'signal',
    'dependency',
    'reference',
    'control',
    'switch',
    'platform',
    'segment',
    'line'
];

/**
 * 
 * @param {string} xodrString 
 * @returns {object}
 */
function parseOpendrive(xodrString) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (tagName, _) => {
            if(PARSE_AS_ARRAY.includes(tagName)) return true;
            else return false;
        }
    };
    const parser = new XMLParser(options);

    return parser.parse(xodrString);
}

exports.parseOpendrive = parseOpendrive;