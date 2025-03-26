const { OdrReader } = require('opendrive-reader');

/**
 * @typedef {import("../../types/types").t_road} t_road
 * @typedef {import("../../types/types").t_junction} t_junction
 * @typedef {import("../../types/types").LaneTransition} LaneTransition
 */

exports.getLaneLinksRoadToSuccessingRoadImplicite = getLaneLinksRoadToSuccessingRoadImplicite;
exports.getLaneLinksPredecessingRoadToRoadImplicite = getLaneLinksPredecessingRoadToRoadImplicite;
exports.getLaneLinksRoadToSuccessingRoadSection = getLaneLinksRoadToSuccessingRoadSection;
exports.getLaneLinksPredecessingRoadToRoadSection = getLaneLinksPredecessingRoadToRoadSection;
exports.getLaneLinksRoadToSuccessingRoadJunction = getLaneLinksRoadToSuccessingRoadJunction;
exports.getLaneLinksPredecessingRoadToRoadJunction = getLaneLinksPredecessingRoadToRoadJunction;
exports.getRoadDirections = getRoadDirections;
exports.getLaneLinkMethodPredecessing = getLaneLinkMethodPredecessing;
exports.getLaneLinkMethodSuccessing = getLaneLinkMethodSuccessing;

/**
 * @param {t_road} road
 * @param {t_road} relatedRoad
 * @param {OdrReader} odrReader
 */
function getRoadDirections(road, relatedRoad, odrReader) {
    // 1.) search in the predecessors
    if (road.link.predecessor !== undefined) {
        if (road.link.predecessor.attributes.elementId === relatedRoad.attributes.id || road.link.predecessor.attributes.elementId === relatedRoad.attributes.junction) {
            if (road.link.predecessor.attributes.elementType == "junction") {
                let junction = odrReader.getJunction(road.link.predecessor.attributes.elementId);
                let relConnection = junction.connection.find(connection => connection.attributes.incomingRoad == road.attributes.id 
                                                                        && connection.attributes.connectingRoad == relatedRoad.attributes.id);
                if (relConnection !== undefined) {
                    if (relConnection.attributes.contactPoint == "start")
                        return "diverging";
                    else
                        return "same";
                }
                else {
                    
                }
            }
            else {
                if (road.link.predecessor.attributes.contactPoint == "start")
                    return "diverging";
                else
                    return "same";
            }
        }
    }

    // 2.) search in the successors
    if (road.link.successor !== undefined) {
        if (road.link.successor.attributes.elementId === relatedRoad.attributes.id || road.link.successor.attributes.elementId === relatedRoad.attributes.junction) {
            if (road.link.successor.attributes.elementType == "junction") {
                let junction = odrReader.getJunction(road.link.successor.attributes.elementId);
                let relConnection = junction.connection.find(connection => connection.attributes.incomingRoad == road.attributes.id 
                                                                        && connection.attributes.connectingRoad == relatedRoad.attributes.id);
                if (relConnection !== undefined) {
                    if (relConnection.attributes.contactPoint == "end") 
                        return "opposing";
                    else 
                        return "same";
                }
            }
            else {
                if (road.link.successor.attributes.contactPoint == "end") 
                    return "opposing";
                else 
                    return "same";
            }
        }
    }

    return "unknown";
}

/**
 * Returns pairs of lanes of the two roads that are connected,
 * according to the given linkage logic of the roads, if no junction is present
 * 
 * Specifically, it is distinguished between the reference line of the two roads
 * running in the same direction or opposite directions
 * 
 * @param {t_road} road
 * @param {t_road} successingRoad
 * @param {OdrReader} odrReader
 * @returns {number[][]} pairs of corresponding lane IDs of road and successing road
 */
function getLaneLinksRoadToSuccessingRoadImplicite(road, successingRoad, odrReader) {
    let pairs = [];
    let direction = getRoadDirections(road, successingRoad, odrReader);

    if (direction == "same") {
        // => normal linkage, ref-lines have same direction
        // ----->|----->
        // => negative lanes match negative lanes, positive lanes match positive lanes

        const nLaneSecs = road.lanes.laneSection.length;

        if (road.lanes.laneSection[nLaneSecs-1].left !== undefined && successingRoad.lanes.laneSection[0].left !== undefined) {
            let laneIdsLeft = road.lanes.laneSection[nLaneSecs-1].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);
            let laneIdsLeftSucc = successingRoad.lanes.laneSection[0].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);

            if (laneIdsLeft.length === laneIdsLeftSucc.length) {
                for (let i = 0; i < laneIdsLeft.length; i++)
                    pairs.push([laneIdsLeft[i], laneIdsLeftSucc[i]]);
            }
        }

        if (road.lanes.laneSection[nLaneSecs-1].right !== undefined && successingRoad.lanes.laneSection[0].right !== undefined) {
            let laneIdsRight = road.lanes.laneSection[nLaneSecs-1].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);
            let laneIdslaneIdsRightSucc = successingRoad.lanes.laneSection[0].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);

            if (laneIdsRight.length === laneIdslaneIdsRightSucc.length) {
                for (let i = 0; i < laneIdsRight.length; i++)
                    pairs.push([laneIdsRight[i], laneIdslaneIdsRightSucc[i]]);
            }
        }
    }
    else if (direction == "opposing") {
        // => ref-lines have opposite direction   
        // ----->|<-----
        // negative lanes match positive lanes, and vice-versa

        const nLaneSecs = road.lanes.laneSection.length;
        const nLaneSecsSucc = successingRoad.lanes.laneSection.length;

        if (road.lanes.laneSection[nLaneSecs-1].left !== undefined && successingRoad.lanes.laneSection[nLaneSecsSucc-1].right !== undefined) {
            let laneIdsLeft = road.lanes.laneSection[nLaneSecs-1].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);
            let laneIdsRightSucc = successingRoad.lanes.laneSection[nLaneSecsSucc-1].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => b - a);

            if (laneIdsLeft.length === laneIdsRightSucc.length) {
                for (let i = 0; i < laneIdsLeft.length; i++)
                    pairs.push([laneIdsLeft[i], laneIdsRightSucc[i]]);
            }
        }

        if (road.lanes.laneSection[nLaneSecs-1].right !== undefined && successingRoad.lanes.laneSection[nLaneSecsSucc-1].left !== undefined) {
            let laneIdsRight = road.lanes.laneSection[nLaneSecs-1].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => b - a);
            let laneIdsLeftSucc = successingRoad.lanes.laneSection[nLaneSecsSucc-1].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);

            if (laneIdsRight.length === laneIdsLeftSucc.length) {
                for (let i = 0; i < laneIdsRight.length; i++)
                    pairs.push([laneIdsRight[i], laneIdsLeftSucc[i]]);
            }
        }
    }

    return pairs;
}

/**
 * Returns pairs of lanes of the two roads that are connected, according to the
 * given linkage logic of the roads, if no junction is present.
 * 
 * Specifically, it is distinguished between the reference line of the two roads
 * running in the same direction or diverging directions
 * 
 * @param {t_road} road
 * @param {t_road} predecessingRoad
 * @param {OdrReader} odrReader
 * @returns {number[][]} pairs of corresponding lane IDs of predecessing road to road
 */
function getLaneLinksPredecessingRoadToRoadImplicite(road, predecessingRoad, odrReader) {
    let pairs = [];
    let direction = getRoadDirections(road, predecessingRoad, odrReader);

    if (direction == "same") {
        // => normal linkage, ref-lines have same direction
        // ----->|----->
        // => negative lanes match negative lanes, positive lanes match positive lanes

        const nLaneSecsPre = predecessingRoad.lanes.laneSection.length;

        if (road.lanes.laneSection[0].left !== undefined && predecessingRoad.lanes.laneSection[nLaneSecsPre-1].left !== undefined) {
            let laneIdsLeft = road.lanes.laneSection[0].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);
            let laneIdsLeftPre = predecessingRoad.lanes.laneSection[nLaneSecsPre-1].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);

            if (laneIdsLeft.length === laneIdsLeftPre.length) {
                for (let i = 0; i < laneIdsLeft.length; i++)
                    pairs.push([laneIdsLeftPre[i], laneIdsLeft[i]]);
            }
        }

        if (road.lanes.laneSection[0].right !== undefined && predecessingRoad.lanes.laneSection[nLaneSecsPre-1].right !== undefined) {
            let laneIdsRight = road.lanes.laneSection[0].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);
            let laneIdsRightPre = predecessingRoad.lanes.laneSection[nLaneSecsPre-1].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);

            if (laneIdsRight.length === laneIdsRightPre.length) {
                for (let i = 0; i < laneIdsRight.length; i++)
                    pairs.push([laneIdsRightPre[i], laneIdsRight[i]]);
            }
        }
    }
    else if (direction == "diverging") {
        // => ref-lines have diverging direction
        // <-----|----->
        // negative lanes match positive lanes, and vice-versa

        if (road.lanes.laneSection[0].left !== undefined && predecessingRoad.lanes.laneSection[0].right !== undefined) {
            let laneIdsLeft = road.lanes.laneSection[0].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);
            let laneIdsRightPre = predecessingRoad.lanes.laneSection[0].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => b - a);

            if (laneIdsLeft.length === laneIdsRightPre.length) {
                for (let i = 0; i < laneIdsLeft.length; i++)
                    pairs.push([laneIdsRightPre[i], laneIdsLeft[i]]);
            }
        }

        if (road.lanes.laneSection[0].right !== undefined && predecessingRoad.lanes.laneSection[0].left !== undefined) {
            let laneIdsRight = road.lanes.laneSection[0].right.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => b - a);
            let laneIdsLeftPre = predecessingRoad.lanes.laneSection[0].left.lane
                .map(lane => lane.attributes.id)
                .sort((a, b) => a - b);

            if (laneIdsRight.length === laneIdsLeftPre.length) {
                for (let i = 0; i < laneIdsRight.length; i++)
                    pairs.push([laneIdsLeftPre[i], laneIdsRight[i]]);
            }
        }
    }

    return pairs;
}

/**
 * @param {t_road} road 
 * @param {t_road} successingRoad 
 */
function getLaneLinksRoadToSuccessingRoadSection(road, successingRoad) {
    let pairs = [];

    // first search in the last lane section of road for successors links

    const nLaneSections = road.lanes.laneSection.length;

    if (road.lanes.laneSection[nLaneSections-1].left !== undefined) {
        for (let lane of road.lanes.laneSection[nLaneSections-1].left.lane) {
            if (lane.link !== undefined) {
                if (lane.link.successor !== undefined) {
                    for (let successor of lane.link.successor) {
                        pairs.push([lane.attributes.id, successor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    if (road.lanes.laneSection[nLaneSections-1].right !== undefined) {
        for (let lane of road.lanes.laneSection[nLaneSections-1].right.lane) {
            if (lane.link !== undefined) {
                if (lane.link.successor !== undefined) {
                    for (let successor of lane.link.successor) {
                        pairs.push([lane.attributes.id, successor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    if (pairs.length > 0)
        return pairs;

    // if pairs is still empty, search in the first lane section of successingRoad for predecessor links

    if (successingRoad.lanes.laneSection[0].left !== undefined) {
        for (let lane of successingRoad.lanes.laneSection[0].left.lane) {
            if (lane.link !== undefined) {
                if (lane.link.predecessor !== undefined) {
                    for (let predecessor of lane.link.predecessor) {
                        pairs.push([lane.attributes.id, predecessor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    if (successingRoad.lanes.laneSection[0].right !== undefined) {
        for (let lane of successingRoad.lanes.laneSection[0].right.lane) {
            if (lane.link !== undefined) {
                if (lane.link.predecessor !== undefined) {
                    for (let predecessor of lane.link.predecessor) {
                        pairs.push([lane.attributes.id, predecessor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    return pairs;
}

/**
 * @param {t_road} road 
 * @param {t_road} successingRoad 
 */
function getLaneLinksPredecessingRoadToRoadSection(road, predecessingRoad) {
    let pairs = [];

    // first search in the last lane section of predecessingRoad for successors links

    const nLaneSections = predecessingRoad.lanes.laneSection.length;

    if (predecessingRoad.lanes.laneSection[nLaneSections-1].left !== undefined) {
        for (let lane of predecessingRoad.lanes.laneSection[nLaneSections-1].left.lane) {
            if (lane.link !== undefined) {
                if (lane.link.successor !== undefined) {
                    for (let successor of lane.link.successor) {
                        pairs.push([lane.attributes.id, successor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    if (predecessingRoad.lanes.laneSection[nLaneSections-1].right !== undefined) {
        for (let lane of predecessingRoad.lanes.laneSection[nLaneSections-1].right.lane) {
            if (lane.link !== undefined) {
                if (lane.link.successor !== undefined) {
                    for (let successor of lane.link.successor) {
                        pairs.push([lane.attributes.id, successor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    if (pairs.length > 0)
        return pairs;

    // if pairs is still empty, search in the first lane section of road for predecessor links

    if (road.lanes.laneSection[0].left !== undefined) {
        for (let lane of road.lanes.laneSection[0].left.lane) {
            if (lane.link !== undefined) {
                if (lane.link.predecessor !== undefined) {
                    for (let predecessor of lane.link.predecessor) {
                        pairs.push([lane.attributes.id, predecessor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    if (road.lanes.laneSection[0].right !== undefined) {
        for (let lane of road.lanes.laneSection[0].right.lane) {
            if (lane.link !== undefined) {
                if (lane.link.predecessor !== undefined) {
                    for (let predecessor of lane.link.predecessor) {
                        pairs.push([lane.attributes.id, predecessor.attributes.id])
                    }                    
                }
            }
                
        }
    }

    return pairs;
}

/**
 * @param {t_road} road
 * @param {t_road} successingRoad
 * @param {OdrReader} odrReader
 */
function getLaneLinksRoadToSuccessingRoadJunction(road, successingRoad, odrReader) {
    let pairs = [];

    let junction;

    if (road.attributes.junction !== "-1") {
        // road belongs to junction
        junction = odrReader.getJunction(road.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == successingRoad.attributes.id 
                                    && con.attributes.connectingRoad == road.attributes.id);

        if (connection !== undefined) {
            for (let laneLink of connection.laneLink) {
                pairs.push([laneLink.attributes.to, laneLink.attributes.from]);
                // [to, from] is correct here, as "to" belongs to road and "from" belongs to the successing road
            }
        }    
    }
    else {
        // successingRoad belongs to junction
        junction = odrReader.getJunction(successingRoad.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == road.attributes.id 
                                                      && con.attributes.connectingRoad == successingRoad.attributes.id);
        if (connection !== undefined) {
            for (let laneLink of connection.laneLink)
                pairs.push([laneLink.attributes.from, laneLink.attributes.to]);
        }        
    }

    return pairs;
}

/**
 * @param {t_road} road
 * @param {t_road} predecessingRoad
 * @param {OdrReader} odrReader
 */
function getLaneLinksPredecessingRoadToRoadJunction(road, predecessingRoad, odrReader) {
    let pairs = [];

    let junction;
    
    if (road.attributes.junction !== "-1") {
        // road belongs to junction
        junction = odrReader.getJunction(road.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == predecessingRoad.attributes.id 
                                    && con.attributes.connectingRoad == road.attributes.id);
        if (connection !== undefined) {
            for (let laneLink of connection.laneLink)
                pairs.push([laneLink.attributes.from, laneLink.attributes.to]);
        }
    }
    else {
        // predecessingRoad belongs to junction
        junction = odrReader.getJunction(predecessingRoad.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == road.attributes.id
                                                    && con.attributes.connectingRoad == predecessingRoad.attributes.id);
        if (connection !== undefined) {
            for (let laneLink of connection.laneLink) {
                pairs.push([laneLink.attributes.to, laneLink.attributes.from]);
                // [to, from] is correct here, as "to" belongs to the predecessingRoad and "from" belongs to road
            }
        }
    }

    return pairs;
}

/**
 * 
 * @param {t_road} road 
 * @param {t_road} predecessingRoad 
 * @param {OdrReader} odrReader
 * @returns {string} 
 */
function getLaneLinkMethodPredecessing(road, predecessingRoad, odrReader) {
    if (road.attributes.junction == "-1" && predecessingRoad.attributes.junction == "-1") {
        if (hasLaneSectionLinks(predecessingRoad, "successor") || hasLaneSectionLinks(road, "predecessor"))
            return "lane_section_linking";
        
        return "implicite";
    }
    else if (road.attributes.junction !== "-1") {
        let junction = odrReader.getJunction(road.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == predecessingRoad.attributes.id);
        if (connection !== undefined)
            return "junction_linking";

        if (hasLaneSectionLinks(predecessingRoad, "successor") || hasLaneSectionLinks(road, "predecessor"))
            return "lane_section_linking";

        return "implicite";
    }
    else {
        let junction = odrReader.getJunction(predecessingRoad.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == road.attributes.id);
        if (connection !== undefined)
            return "junction_linking";

        if (hasLaneSectionLinks(predecessingRoad, "successor") || hasLaneSectionLinks(road, "predecessor"))
            return "lane_section_linking";

        return "implicite";
    }
}

/**
 * 
 * @param {t_road} road 
 * @param {t_road} successingRoad 
 * @param {OdrReader} odrReader
 * @returns {string} 
 */
function getLaneLinkMethodSuccessing(road, successingRoad, odrReader) {
    if (road.attributes.junction == "-1" && successingRoad.attributes.junction == "-1") {
        if (hasLaneSectionLinks(successingRoad, "predecessor") || hasLaneSectionLinks(road, "successor"))
            return "lane_section_linking";
        
        return "implicite";
    }
    else if (road.attributes.junction !== "-1") {
        let junction = odrReader.getJunction(road.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == successingRoad.attributes.id);
        if (connection !== undefined)
            return "junction_linking";

        if (hasLaneSectionLinks(successingRoad, "predecessor") || hasLaneSectionLinks(road, "successor"))
            return "lane_section_linking";

        return "implicite";
    }
    else {
        let junction = odrReader.getJunction(successingRoad.attributes.junction);
        let connection = junction.connection.find(con => con.attributes.incomingRoad == road.attributes.id);
        if (connection !== undefined)
            return "junction_linking";

        if (hasLaneSectionLinks(successingRoad, "predecessor") || hasLaneSectionLinks(road, "successor"))
            return "lane_section_linking";

        return "implicite";
    }
}

/**
 * @param {t_road} road
 * @param {string} type must be either "successor" or "predecessor"
 * @returns {boolean} 
 */
function hasLaneSectionLinks(road, type) {
    let idxLaneSection;

    if (type == "successor")
        idxLaneSection = road.lanes.laneSection.length - 1;
    else
        idxLaneSection = 0;

    if (road.lanes.laneSection[idxLaneSection].left !== undefined) {
        if (road.lanes.laneSection[idxLaneSection].left.lane[0].link !== undefined) {
            if (road.lanes.laneSection[idxLaneSection].left.lane[0].link[type] !== undefined)
                return true;       
        }
    }

    if (road.lanes.laneSection[idxLaneSection].right !== undefined) {
        if (road.lanes.laneSection[idxLaneSection].right.lane[0].link !== undefined) {
            if (road.lanes.laneSection[idxLaneSection].right.lane[0].link[type] !== undefined)
                return true;       
        }
    }

    return false;
}

function hasJunctionLinks(juction, road, roadOfJunction) {

}