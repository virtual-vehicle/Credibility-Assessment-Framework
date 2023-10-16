const schemas = require("../types/schemas");
const util = require("../../../../util/util-common");
const stmd_crud = require("../../../../util/stmd-crud");

const KEYWORD_DERIVED = "derived-from";
const KEYWORD_IMPLEMENTATION = "has-implementation";

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
            log: "The type of resourceIri is not a design"
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

    if (resourceItem[KEYWORD_DERIVED]) {

        for (var dIndex in resourceItem[KEYWORD_DERIVED]) {

            if (resourceItem[KEYWORD_DERIVED][dIndex][0] != "#" ) {
                // Not the internal variable
                continue;
            };

            var checkDerived = isResourceInPhase(resourceItem[KEYWORD_DERIVED][dIndex], 'stmd:RequirementsPhase', stmdCrud);

            if (checkDerived.result == false) {
                checkDerived = isResourceInPhase(resourceItem[KEYWORD_DERIVED][dIndex], 'stmd:DesignPhase', stmdCrud);

                if (checkDerived.result == false) {
                    return {
                        result: false,
                        log : "The design specification "+resourceIri+" is justified by "+resourceItem[KEYWORD_DERIVED][dIndex]+" with a resource from the "+checkDerived.actualPhase+", but must not come from the implementation phase or evaluation phase"
                    }
                }
            }
        }
    } else {
        return {
            result: false,
            log : "Design specification "+resourceIri+" can not be traced to source (justification missing)"
        }
    }

    if (resourceItem[KEYWORD_IMPLEMENTATION]) {
        for (var dIndex in resourceItem[KEYWORD_IMPLEMENTATION]) {

            if (resourceItem[KEYWORD_IMPLEMENTATION][dIndex][0] != "#" ) {
                // Not the internal variable
                continue;
            };

            var checkValidated = isResourceInPhase(resourceItem[KEYWORD_IMPLEMENTATION][dIndex], "stmd:ImplementationPhase", stmdCrud);
            if (checkValidated.result == false) {
                return {
                    result: false,
                    log: "Implementation of design specification "+resourceIri+" is "+resourceItem[KEYWORD_IMPLEMENTATION][dIndex]+" that is located in "+checkValidated.actualPhase+", but is expected to be located in the implementation phase."
                }
            }
        }
    }  else {
        return {
            result: false,
            log : "Design specification "+resourceIri+" is not linked to its implementation"
        }
    }

    return {
        result: true,
        log: "Design specification " + resourceIri + " can be traced to source and implementation" 
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