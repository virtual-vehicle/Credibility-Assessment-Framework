const { XMLParser } = require("fast-xml-parser");

/**
 * @typedef {import('../../types/types').MapLocation} MapLocation
 */

exports.parseOpenscenario = parseOpenscenario;
exports.getInitialPositions = getInitialPositions;

const PARSE_AS_ARRAY = [
    "ScenarioObject",
    "Private",
    "PrivateAction"
];

/**
 * @param {string} xoscString 
 * @returns {object}
 */
function parseOpenscenario(xoscString) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (tagName, _) => {
            if(PARSE_AS_ARRAY.includes(tagName)) return true;
            else return false;
        }
    };
    const parser = new XMLParser(options);

    return parser.parse(xoscString);
}

/**
 * 
 * @param {string} xoscParsed 
 * @returns {MapLocation[]}
 */
function getInitialPositions(xoscParsed) {
    let initPositionsRaw = [];
    let entities = [];
    let privates = xoscParsed["OpenSCENARIO"]["Storyboard"]["Init"]["Actions"]["Private"];

    for (let private of privates) {
        let privateActions = private["PrivateAction"];
        privateActions = privateActions.filter(pa => pa["TeleportAction"] !== undefined);
        privateActions = privateActions.filter(pa => pa["TeleportAction"]["Position"] !== undefined);
        for (let privateAction of privateActions) {
            initPositionsRaw.push(privateAction["TeleportAction"]["Position"]);
            entities.push(private["@_entityRef"]);
        }
    }

    let mapLocations = [];

    for (let initPosition of initPositionsRaw) {
        if (initPosition["LanePosition"] !== undefined) {
            mapLocations.push({
                roadId: initPosition["LanePosition"]["@_roadId"],
                laneId: initPosition["LanePosition"]["@_laneId"],
                s: initPosition["LanePosition"]["@_s"]
            })
        }
        else if (initPosition["RelativeLanePosition"] !== undefined) {
            let idxRef = entities.findIndex(entity => entity === initPosition["RelativeLanePosition"]["@_entityRef"]);
            let initPositionRef = initPositionsRaw[idxRef];
            mapLocations.push({
                roadId: initPositionRef["LanePosition"]["@_roadId"],
                laneId: String(Number(initPositionRef["LanePosition"]["@_laneId"]) + Number(initPosition["RelativeLanePosition"]["@_dLane"])),
            })
        }
    }

    return mapLocations;
}