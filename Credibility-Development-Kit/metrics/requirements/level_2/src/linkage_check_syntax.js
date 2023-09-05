const schemas = require("../types/schemas");
const util = require("../../../../util/util-common");
const stmd_reader = require("../../../../util/stmd-reader");

const KEYWORD_DERIVED = "derived-from";
const KEYWORD_VALIDATED = "validated-by";

exports.linkageCheckSyntax = linkageCheckSyntax;

/**
 * Check whether the resourceIri satisfies linkage check level 2 based on the namedGraph and STMD
 *
 * @author   lvtan3005
 * @param    {String} namedGraph                Stringified JSON-LD of the named graph that shows the linkage of the 
 *                                              requirement
 * @param    {String} resourceIri               The ID of the requirement needed to check
 * @param    {String} stmd                      The STMD content where all resources are tracked
 * @return   {ResultLog}                        returns true/false upon valid/invalid signature
*/
function linkageCheckSyntax(namedGraph, resourceIri, stmd) {

    if (!resourceIri || !namedGraph || !stmd) {
        return {
            result: false,
            log: "namedGraph, resourceIri or STMD is null"
        };        
    }

    try {
        namedGraph = JSON.parse(namedGraph);
    }
    catch (err) {
        return {
            result: false,
            log: "Could not parse the namec graph (" + err + ")"
        };
    }

    if(!util.isStructureValid(namedGraph, schemas.NAMED_GRAPH_SCHEMA)) {
        return {
            result: false,
            log: "Named graph does not follow the schema"
        };
    }

    var graph = namedGraph["@graph"];

    var resourceItem = undefined;
    for (var gIndex in graph) {
        if (graph[gIndex]["@id"] == resourceIri) {
            resourceItem = graph[gIndex];
            break;
        }
    }

    if (!resourceItem) {
        return {
            result: false,
            log: "resourceIri " + resourceIri + " does not exist"
        };
    }

    if (resourceItem["@type"] != "requirement") {
        return {
            result: false,
            log: "The type of resourceIri is not a requirement"
        };  
    }

    var stmdReader = new stmd_reader.StmdReader(stmd);

    var checkResourceIriExisted = isResourceInPhase(resourceIri, 'stmd:RequirementsPhase', stmdReader);

    if (checkResourceIriExisted.result == false) {
        return checkResourceIriExisted;
    }

    if (resourceItem[KEYWORD_DERIVED]) {

        for (var dIndex in resourceItem[KEYWORD_DERIVED]) {

            if (resourceItem[KEYWORD_DERIVED][dIndex][0] != "#" ) {
                // Not the internal variable
                continue;
            };

            var checkDerived = isResourceInPhase(resourceItem[KEYWORD_DERIVED][dIndex], 'stmd:RequirementsPhase', stmdReader);

            if (checkDerived.result == false) {
                checkDerived = isResourceInPhase(resourceItem[KEYWORD_DERIVED][dIndex], 'stmd:AnalysisPhase', stmdReader);

                if (checkDerived.result == false) {
                    return {
                        result: false,
                        log : "The derived resourceIri "+resourceItem[KEYWORD_DERIVED][dIndex]+" should come from the STMD / RequirementsPhase or AnalysisPhase" 
                    }
                }
            }
        }
    }

    if (resourceItem[KEYWORD_VALIDATED]) {
        for (var dIndex in resourceItem[KEYWORD_VALIDATED]) {

            if (resourceItem[KEYWORD_VALIDATED][dIndex][0] != "#" ) {
                // Not the internal variable
                continue;
            };

            var checkValidated = isResourceInPhase(resourceItem[KEYWORD_VALIDATED][dIndex], "stmd:EvaluationPhase", stmdReader);
            if (checkValidated.result == false) {
                return {
                    result: false,
                    log : "The validated resourceIri "+ resourceItem[KEYWORD_VALIDATED][dIndex]+" should come from EvaluationPhase" 
                }
            }
        }
    }

    return {
        result: true,
        log: "Resource (" + resourceIri + ") is linked to a source and validation result" 
    };
}

/**
 * Checks if resourceIri in the specific phase, that is taken from stmd
 *
 * @author   lvtan3005
 * @param    {String} resourceIri         The IRI of the (internal) requirement ID that needs to be checked 
 *                                        (e.g. "#requirement_12")
 * @param    {String} phase               The ID of phase of that needed to check whethere the resourceIri in this phase
 *                                        (e.g. "stmd:RequirementsPhase")
 * @param    {Object} stmdReader          The according STMD reader object
 * @return   {ResultLog}                  return true/false result attribute if resource can be found in the specific
 *                                        phase or not!
*/
function isResourceInPhase(resourceIri, phase, stmdReader) {
    const availableResource = stmdReader.getResourceFromId(resourceIri.slice(1));

    if (availableResource === undefined) {
        return {
            result: false,
            log: "The resourceIri: " + resourceIri + " is not existing in the STMD"
        };
    }

    if (availableResource.location[1] !== phase) {
        return {
            result: false,
            log: "The resource " + resourceIri + " was expected to be located in the phase " + phase
        }
    }

    return {
        result: true,
        log : "The resource " + resourceIri + " is existing in the correct phase " + phase 
    };
}