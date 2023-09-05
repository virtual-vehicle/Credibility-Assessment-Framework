/**
 * @typedef {import('../types/specification').Link} Link
 * @typedef {import('../types/specification').Locator} Locator
 * @typedef {import('../types/specification').Arc} Arc
 * @typedef {import('../types/internal_types').ContextEntry} ContextEntry
 */

const TITLE_IRI = "http://purl.org/dc/terms/title";

/**
 * Creates the starting node from the Arc for a named graph, according to https://www.w3.org/TR/json-ld/#named-graphs
 * 
 * @param {Arc} arc the converted XLink Arc
 * @param {Locator} startLocator the converted XLink start Locator
 * @param {Locator} endLocator the converted XLink end Locator
 * @returns {object} a start node for a JSON-LD named graph
 */
function createJsonLdStartNode(arc, startLocator, endLocator) {
    let node = {};

    // xlink_href is a mandatory attribute
    node["@id"] = startLocator.attributes.xlink_href;

    // xlink_role is an optional attribute to define a semantic meaning of the node
    if (startLocator.attributes.xlink_role !== undefined)
        node["@type"] = startLocator.attributes.xlink_role;
    
    // xlink_arcrole is an optional attribute to define a semantic meaning for the edge. If not indicated, the
    // simple "to" from the http://www.w3.org/1999/xlink namespace is used
    let arcrole = arc.attributes.xlink_arcrole !== undefined ? arc.attributes.xlink_arcrole : "to";        
    node[arcrole] = [endLocator.attributes.xlink_href];

    return node;
}

/**
 * Creates the end node of a Locator for a named graph, according to https://www.w3.org/TR/json-ld/#named-graphs
 * 
 * @param {Locator} endLocator the converted XLink Locator
 * @returns {object} an end node for a JSON-LD named graph
 */
function createJsonLdEndNode(endLocator) {
    let node = {};

    // xlink_href is a mandatory attribute
    node["@id"] = endLocator.attributes.xlink_href;

    // xlink_role is an optional attribute to define a semantic meaning of the node
    if (endLocator.attributes.xlink_role !== undefined)
        node["@type"] = endLocator.attributes.xlink_role;
    
    return node;
}

/**
 * Integrates a node from the functions createJsonLdStartNode or createJsonLdEndNode into the named JSON-LD graph.
 * That means, it merges existing nodes with the same ID, if necessary.
 * 
 * @param {object} node the JSON-LD node to integrate
 * @param {object} graph the JSON-LD named graph where the node should be integrated
 * @returns {object} the updated JSON-Ld named graph
 */
function integrateJsonLdNodeIntoGraph(node, graph) {
    // first, check if the resource is already existing as a node in the graph
    let idxNode = graph["@graph"].findIndex(graphNode => graphNode["@id"] === node["@id"]);
    if (idxNode == -1) {
        // if node of resource is not yet included in the graph, then add it as a new node
        graph["@graph"].push(node);
    }
    else {
        // if resource is already included in the graph, integrate the node in existing node of resource
        // if no arcrole (edge) applies for this node, there is nothing to do 
        const arcrole = Object.keys(node).filter(key => key !== "@id" && key !== "@type");
        if (arcrole.length == 0)
            return graph;
        
        if (graph["@graph"][idxNode][arcrole] !== undefined) {
            // if the arcrole property is already existing, then add the target resource in the array 
            graph["@graph"][idxNode][arcrole].push(...node[arcrole]);
        }
        else {
            // if property is not yet existing, add it as a new property
            graph["@graph"][idxNode][arcrole] = node[arcrole];
        }
    }

    return graph;
}


/**
 * Adds a title to the graph from the extended Link xlink:title
 * 
 * @param {object} graph the JSON-LD named graph to update
 * @param {Link} link the converted XLink where the title will be extracted from
 * @returns {object} the updated JSON-LD named graph
 */
function addTitleToGraph(graph, link) {
    graph["title"] = link.attributes.xlink_title;

    return graph;
}

/**
 * Adds context to the JSON-LD named graph from a key-value-pair object
 * 
 * @param {object} graph the JSON-LD named graph to update
 * @param {ContextEntry[]} context key-value-pairs mapping an IRI to a term
 * @returns {object} the updated JSON-LD named graph with added context
 */
function addContextToGraph(graph, context) {
    for (let contextEntry of context)
        graph["@context"][contextEntry.term] = contextEntry.iri;
    
    graph["@context"]["title"] = TITLE_IRI;

    return graph;
}

exports.createJsonLdStartNode = createJsonLdStartNode;
exports.createJsonLdEndNode = createJsonLdEndNode;
exports.integrateJsonLdNodeIntoGraph = integrateJsonLdNodeIntoGraph;
exports.addTitleToGraph = addTitleToGraph;
exports.addContextToGraph = addContextToGraph;