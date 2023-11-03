const schemas = require("../types/schemas");
const util = require("../../../../util/util-common");
const stmd_crud = require("../../../../util/stmd-crud");

const KEYWORD_IS_CONSTRAINED = "constrained-by";
const KEYWORD_HAS_ASSUMPTION = "has-assumption";

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
            log: "NamedGraph does not fulfill the required schema"
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
            log: "The given resource IRI " + resourceIri + " is not existing in the named graph"
        };
    }

    if (resourceItem["@type"] != "design-specification") {
        return {
            result: false,
            log: "The type of resourceIri is not a design specification"
        };  
    }

    var stmdCrud = new stmd_crud.StmdCrud(stmd);

    if (stmdCrud.errors) {
        return stmdCrud.errors;
    }

    var checkResourceIriExisted = isResourceInPhase(resourceIri, 'stmd:DesignPhase', stmdCrud);

    if (checkResourceIriExisted.result == false) {
        return checkResourceIriExisted;
    }

    if (resourceItem[KEYWORD_IS_CONSTRAINED] !== undefined && resourceItem[KEYWORD_HAS_ASSUMPTION] !== undefined) {

        for (var dIndex in resourceItem[KEYWORD_IS_CONSTRAINED]) {

            if (resourceItem[KEYWORD_IS_CONSTRAINED][dIndex][0] != "#") {
                // Not an internal variable
                continue;
            };

            var checkDerived = isResourceInPhase(resourceItem[KEYWORD_IS_CONSTRAINED][dIndex], 'stmd:DesignPhase', stmdCrud);

            if (checkDerived.result == false)
                return checkDerived;            
        }

        for (var dIndex in resourceItem[KEYWORD_HAS_ASSUMPTION]) {

            if (resourceItem[KEYWORD_HAS_ASSUMPTION][dIndex][0] != "#") {
                // Not an internal variable
                continue;
            };

            var checkDerived = isResourceInPhase(resourceItem[KEYWORD_HAS_ASSUMPTION][dIndex], 'stmd:DesignPhase', stmdCrud);

            if (checkDerived.result == false)
                return checkDerived;            
        }
    }
    else {
        return {
            result: false,
            log : "Design specification " + resourceIri + " does not have any linked constraint or assumption"
        }
    }

    return {
        result: true,
        log: "Design specification " + resourceIri + " is linked correctly to constraints and/or assumptions" 
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
 * @param    {Object} stmdCrud          The according STMD reader object
 * @return   {ResultLog}                  return true/false result attribute if resource can be found in the specific
 *                                        phase or not!
*/
function isResourceInPhase(resourceIri, phase, stmdCrud) {
    const availableResource = stmdCrud.getResourceFromId(resourceIri.slice(1));

    if (availableResource === undefined) {
        return {
            result: false,
            log: "The resourceIri: " + resourceIri + " is not existing in the STMD"
        };
    }

    if (availableResource.location[1] !== phase) {
        return {
            result: false,
            log: "The resource " + resourceIri + " was expected to be located in the phase " + phase,
            actualPhase: availableResource.location[1]
        }
    }

    return {
        result: true,
        log : "The resource " + resourceIri + " is existing in the correct phase " + phase 
    };
}