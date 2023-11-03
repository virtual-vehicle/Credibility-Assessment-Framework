exports.checkPedigrees = checkPedigrees;
exports.areInputsConnected = areInputsConnected;
exports.areDataTypesConsistent = areDataTypesConsistent;
exports.checkConnectionElements = checkConnectionElements;
exports.areConnectionsAllowed = areConnectionsAllowed;

const ALLOWED_CONNECTIONS = [
    {
        source_element: "System",
        source_kind: "parameter",
        destination_element: "System",
        destination_kind: "calculatedParameter"
    },
    {
        source_element: "System",
        source_kind: "parameter",
        destination_element: "System",
        destination_kind: "output"
    },
    {
        source_element: "System",
        source_kind: "input",
        destination_element: "System",
        destination_kind: "output"
    },
    {
        source_element: "System",
        source_kind: "parameter",
        destination_element: "Component",
        destination_kind: "parameter"
    },
    {
        source_element: "System",
        source_kind: "parameter",
        destination_element: "Component",
        destination_kind: "input"
    },
    {
        source_element: "System",
        source_kind: "parameter",
        destination_element: "Component",
        destination_kind: "inout"
    },
    {
        source_element: "System",
        source_kind: "input",
        destination_element: "Component",
        destination_kind: "input"
    },
    {
        source_element: "System",
        source_kind: "input",
        destination_element: "Component",
        destination_kind: "inout"
    },
    {
        source_element: "Component",
        source_kind: "calculatedParameter",
        destination_element: "Component",
        destination_kind: "input"
    },
    {
        source_element: "Component",
        source_kind: "calculatedParameter",
        destination_element: "Component",
        destination_kind: "inout"
    },
    {
        source_element: "Component",
        source_kind: "output",
        destination_element: "Component",
        destination_kind: "input"
    },
    {
        source_element: "Component",
        source_kind: "output",
        destination_element: "Component",
        destination_kind: "inout"
    },
    {
        source_element: "Component",
        source_kind: "inout",
        destination_element: "Component",
        destination_kind: "input"
    },
    {
        source_element: "Component",
        source_kind: "calculatedParameter",
        destination_element: "System",
        destination_kind: "calculatedParameter"
    },
    {
        source_element: "Component",
        source_kind: "calculatedParameter",
        destination_element: "System",
        destination_kind: "output"
    },
    {
        source_element: "Component",
        source_kind: "output",
        destination_element: "System",
        destination_kind: "output"
    },
    {
        source_element: "Component",
        source_kind: "inout",
        destination_element: "System",
        destination_kind: "output"
    }
];

/**
 * @typedef {import('../../types/types').SystemStructure} SystemStructure
 * @typedef {import('../../types/types').SystemElement} SystemElement
 * @typedef {import('../../types/types').Connector} Connector
 * @typedef {import('../../types/types').Connection} Connection
 * @typedef {import('../../types/types').ResultLog} ResultLog
 */

/**
 * Checks if the subsystem list is consisting only of System elements
 * and if each subsystem has unique child elements (no elements with the same name)
 * 
 * @author   localhorst87
 * @function
 * @param    {SystemStructure} systemStructure  the system model representation
 * @return   {ResultLog}                        returns true/false and a log upon passing/failing the test
*/
function checkPedigrees(systemStructure) {
    let failureFound = false;
    let log = "elements are all unique";
    
    let elementList = JSON.parse(JSON.stringify(systemStructure.elements)); // cumbersome way for cloning multi-layer objects... 

    elementLoop:
    while(elementList.length > 0) {
        let element = elementList.shift();

        // check if name is unique within the subsystem
        let elementsOfSameSubsystem = elementList.filter(el => areSubsystemsEqual(el, element));
        let nameIsUnique = elementsOfSameSubsystem.every(el => el.name != element.name);
        if (!nameIsUnique) {
            failureFound = true;
            log = "there is at least 1 element in the system with the same name in its enclosing subsystem: " + JSON.stringify(element);
            break;
        }

        // check if elements in subsystem are all Systems and not Components
        while (element.subsystem.length > 0) {
            let nextElementName = element.subsystem.pop();

            let nextElement = systemStructure.elements.filter(el => el.name == nextElementName && areSubsystemsEqual(el, element));
            if (nextElement[0].type != "System") {
                failureFound = true;
                log = "the following element is contained in a subsystem list, but is denoted as Component: " + JSON.stringify(nextElement);
                break elementLoop;
            }   
        }
    }   

    return {
        result: failureFound == false,
        log: log
    };
}

/**
 * Checks if the inputs of the system are connected
 * 
 * @author   localhorst87
 * @function 
 * @param    {SystemStructure} systemStructure  the system model representation
 * @param    {Connector[]}     [notRequired]    a list of input connectors that do not require a connection
 * @return   {ResultLog}                        returns true/false and a log upon passing/failing the test
*/
function areInputsConnected(systemStructure, notRequired = []) {
    let failureFound = false;
    let log = "all inputs are connected properly";

    const inputConnectors = systemStructure.connectors.filter(connector => connector.kind == "input");

    for (let connector of inputConnectors) {        
        
        let connectedInput = systemStructure.connections.filter(connection => startConnectorMatches(connector, connection));

        if (connectedInput.length > 1) {
            failureFound = true;
            log = "The following input connector is connected multiple times: " + JSON.stringify(connector);
            break;
        }

        // check if connector is among the connectors that do not required input connection
        if (notRequired.findIndex(conNotReq => connectorsEqual(conNotReq, connector)) > -1)
            continue;

        if (connectedInput.length == 0) {
            failureFound = true;
            log = "The following input connector is not connected: " + JSON.stringify(connector);
            break;
        }
    }
    
    return {
        result: failureFound == false,
        log: log
    };
}

/**
 * Checks if the connectors are unique, which means for each element all connectors can uniquely be identified 
 * via a unique name
 * 
 * @author   localhorst87
 * @function
 * @param    {SystemStructure} systemStructure  systemStructure datastructure (parsed JSON string)
 * @return   {ResultLog}                        returns true/false and a log upon passing/failing the test
*/
function areConnectorsUnique(systemStructure) {
    let failureFound = false;
    let log = "all connectors are unique";

    for (let connection of systemStructure.connections) {
        let startConnectors = extractStartConnectorFromConnection(systemStructure.connectors, connection);
        let endConnectors = extractEndConnectorFromConnection(systemStructure.connectors, connection);
        let areConnectorsUnique = connectorsIdentfiable(startConnectors, endConnectors, connection);
        
        // if connectors are not unique available, break and return
        if (!areConnectorsUnique.result) {
            failureFound = true;
            log = areConnectorsUnique.log;
            break;
        }
    }

    return {
        result: failureFound == false,
        log: log
    };
}

/**
 * Checks if the data types of the connected element's connectors are consistent
 * 
 * @author   localhorst87
 * @function
 * @param    {SystemStructure} systemStructure  systemStructure datastructure (parsed JSON string)
 * @return   {ResultLog}                        returns true/false and a log upon passing/failing the test
*/
function areDataTypesConsistent(systemStructure) {
    let failureFound = false;
    let log = "data types are consistent";

    // precondition: Connectors are unique
    let preCheck = areConnectorsUnique(systemStructure);
    if (preCheck.result == false) {
        return {
            result: false,
            log: preCheck.log
        };
    }

    for (let connection of systemStructure.connections) {
        let startConnectors = extractStartConnectorFromConnection(systemStructure.connectors, connection);
        let endConnectors = extractEndConnectorFromConnection(systemStructure.connectors, connection);
       
        // check if data types match
        if (startConnectors[0].type != endConnectors[0].type) {
            failureFound = true;
            log = "data types for the Connectors of the following Connection are not equal: " + JSON.stringify(connection);
            break;
        }
    }

    return {
        result: failureFound == false,
        log: log
    };
}

/**
 * Checks for all Connections of the System if the element the Connection references to is exactly available 
 * once in a subsystem 
 * 
 * @author   localhorst87
 * @function
 * @param    {SystemStructure} systemStructure  systemStructure datastructure (parsed JSON string)
 * @return   {ResultLog}                        returns true/false and a log upon passing/failing the test
*/
function checkConnectionElements(systemStructure) {
    let failureFound = false;
    let log = "all connections are consistent";

    for (let connection of systemStructure.connections) {

        let startElement, endElement;

        // identify start element
        if (connection.element_start == "") {
            // start element is a System: Find the element whose name is the system of the connection, within the same system pedigree
            // for comparison, the last element of connection subsystem list will be cut in areSubsystemsEqual, as the connection goes from a System to a Component of the System
            startElement = systemStructure.elements.filter(element => element.name == connection.subsystem[connection.subsystem.length-1] && areSubsystemsEqual(element, connection, 2));
        }
        else {
            // start element is a Component: Find the element whose name is the same as given in connection.element_start, within the same system pedigree
            startElement = systemStructure.elements.filter(element => element.name == connection.element_start && areSubsystemsEqual(element, connection));
        }

        // check if exactly 1 element is identified
        if (startElement.length == 0) {
            failureFound = true;
            log = "could not identify any system element for the starting point the following Connection is referencing to: " + JSON.stringify(connection);
            break;
        }
        else if (startElement.length > 1) {
            failureFound = true;
            log = "more than 1 system element identified for the starting point the following Connection is referencing to: " + JSON.stringify(connection); 
            break;
        }
        
        if (connection.element_end == "") {
            // end element is a System: Find the element whose name is the system of the connection, within the same system pedigree
            // for comparison, the last element of connection subsystem list will be cut in areSubsystemsEqual, as the connection goes from a System to a Component of the System
            endElement = systemStructure.elements.filter(element => element.name == connection.subsystem[connection.subsystem.length-1] && areSubsystemsEqual(element, connection, 2));
        }
        else {
            // end element is a Component: Find the element whose name is the same as given in connection.element_end, within the same system pedigree
            endElement = systemStructure.elements.filter(element => element.name == connection.element_end && areSubsystemsEqual(element, connection));
        }

        if (endElement.length == 0) {
            failureFound = true;
            log = "could not identify any system element for the end point the following Connection is referencing to: " + JSON.stringify(connection);
            break;
        }
        else if (endElement.length > 1) {
            failureFound = true;
            log = "more than 1 system element identified for the end point the following Connection is referencing to: " + JSON.stringify(connection); 
            break;
        }
    }

    return {
        result: failureFound == false,
        log: log
    }
}

/**
 * Checks if all connections have allowed connections (combination of source/destination element and kind)
 * 
 * @author   localhorst87
 * @function
 * @param    {SystemStructure} systemStructure  systemStructure datastructure (parsed JSON string)
 * @return   {ResultLog}                        returns true/false and a log upon passing/failing the test
*/
function areConnectionsAllowed(systemStructure) {
    let failureFound = false;
    let log = "all connections are allowed";
    
    // precondition: Connectors are unique
    let preCheck = areConnectorsUnique(systemStructure);
    if (preCheck.result == false) {
        return {
            result: false,
            log: preCheck.log
        };
    }

    for (let connection of systemStructure.connections) {
        let startConnectors = extractStartConnectorFromConnection(systemStructure.connectors, connection);
        let endConnectors = extractEndConnectorFromConnection(systemStructure.connectors, connection);

        if (!isConnectionAllowed(connection, startConnectors[0], endConnectors[0])) {
            failureFound = true;
            log = "The following connection has a not-supported combination of source/destination element types and connector kinds: " + JSON.stringify(connection);
            break;
        }
    }
    
    return {
        result: failureFound == false,
        log: log
    }
}

/**
 * Checks if each connector is available exactly once!
 * 
 * @author   localhorst87
 * @private
 * @param    {Connector[]} startConnectors  filtered start Connector list
 * @param    {Connector[]} endConnectors    filtered end Connector list
 * @param    {Connection} connection        the connection for information in the log
 * @return   {ResultLog}                          
*/
function connectorsIdentfiable(startConnectors, endConnectors, connection) {
    let result = true;
    let log = "connectors are available exactly once"

    if (startConnectors.length == 0 || endConnectors.length == 0) {
        result = false;
        log = "could not identify one of the connectors of the following Connection:" + JSON.stringify(connection);
    }
    if (startConnectors.length > 1 || endConnectors.length > 1) {
        result = false;
        log = "more than 1 connector with the same name available for one of the connectors of the following Connection: " + JSON.stringify(connection);
    }

    return {
        result: result,
        log: log
    };
}

/**
 * Extracts the start connector from the given connection
 * 
 * @author   localhorst87
 * @private
 * @param    {Connector[]} allConnectors    all connector objects from the system structure
 * @param    {Connection} connection        connection object from system structure
 * @return   {Connector[]}                  the filtered list of of Connectors. Should contain 1 element if
 *                                          system structure is well-defined. Else it's ill-defined
*/
function extractStartConnectorFromConnection(allConnectors, connection) {
    let connectorsSameSubsystem, connectorsSameElement, resultingConnector;

    // distinguish if input is from System (element_start = "") or Component, bc. subsystem tree is different then
    if (connection.element_start == "") {
        connectorsSameSubsystem = allConnectors.filter(connector => areSubsystemsEqual(connection, connector, 1)); // connection subsystem list will be cut in areSubsystemsEqual 
        connectorsSameElement = connectorsSameSubsystem.filter(connector => connection.subsystem.slice(-1) == connector.element); // the enclosing subsystem is the element to compare!
        resultingConnector = connectorsSameElement.filter(connector => connection.name_start == connector.name);
    }
    else {
        connectorsSameSubsystem = allConnectors.filter(connector => areSubsystemsEqual(connection, connector));
        connectorsSameElement = connectorsSameSubsystem.filter(connector => connection.element_start == connector.element);
        resultingConnector = connectorsSameElement.filter(connector => connection.name_start == connector.name);
    }

    return resultingConnector;
}

/**
 * Extracts the end connector from the given connection
 * 
 * @author   localhorst87
 * @private
 * @param    {Connector[]} allConnectors    all connector objects from the system structure
 * @param    {Connection} connection        connection object from system structure
 * @return   {Connector[]}                  the filtered list of of Connectors. Should contain 1 element if
 *                                          system structure is well-defined. Else it's ill-defined
*/
function extractEndConnectorFromConnection(allConnectors, connection) {
    let connectorsSameSubsystem, connectorsSameElement, resultingConnector;

    // distinguish if input is from System (element_end = "") or Component, bc. subsystem tree is different then
    if (connection.element_end == "") {
        connectorsSameSubsystem = allConnectors.filter(connector => areSubsystemsEqual(connection, connector, 1)); // connection subsystem list will be cut in areSubsystemsEqual 
        connectorsSameElement = connectorsSameSubsystem.filter(connector => connection.subsystem.slice(-1) == connector.element); // the enclosing subsystem is the element to compare!
        resultingConnector = connectorsSameElement.filter(connector => connection.name_end == connector.name);
    }
    else {
        connectorsSameSubsystem = allConnectors.filter(connector => areSubsystemsEqual(connection, connector));
        connectorsSameElement = connectorsSameSubsystem.filter(connector => connection.element_end == connector.element);
        resultingConnector = connectorsSameElement.filter(connector => connection.name_end == connector.name);
    }

    return resultingConnector;
}

/**
 * Checks, if the given the given connector can be identified as start connector in the given connection
 * 
 * @author   localhorst87
 * @private
 * @param    {Connector} connector      The connector to compare
 * @param    {Connection} connection    The connection to compare
 * @return   {boolean}                  returns true/false if the start connector of the connection
 *                                      matches with the given connector
*/
function startConnectorMatches(connector, connection) {
    let isSameSubsystem, isSameElement, isSameName;
    
    // distinguish if input is from System (element_end = "") or Component, bc. subsystem tree is different then
    if (connection.element_end == "") {
        isSameSubsystem = areSubsystemsEqual(connection, connector, 1); // connection subsystem list will be cut in areSubsystemsEqual 
        isSameElement = connection.subsystem.slice(-1) == connector.element; // the enclosing subsystem is the element to compare!
        isSameName = connection.name_end == connector.name;
    }
    else {
        isSameSubsystem = areSubsystemsEqual(connection, connector);
        isSameElement = connection.element_end == connector.element;
        isSameName = connection.name_end == connector.name;
    }

    return isSameSubsystem && isSameElement && isSameName;
}

/**
 * Checks if two connectors are equal
 * 
 * @author   localhorst87
 * @private
 * @param    {Connector} connector1    first connector
 * @param    {Connector} connector2    second connector
 * @return   {boolean}                 returns true if connectors are equal
*/
function connectorsEqual(connector1, connector2) {
    const isSubsystemEqual = areSubsystemsEqual(connector1, connector2);
    const isNameEqual = connector1.name == connector2.name;
    const isElementEqual = connector1.element == connector2.element;
    const isKindEqual = connector1.kind == connector2.kind;
    const isTypeEqual = connector1.type == connector2.type;

    return isSubsystemEqual && isNameEqual && isElementEqual && isKindEqual && isTypeEqual;
}

/**
 * Checks if the subsystems of the two objects are equal. The objects may either be
 * a SystemElement, a Connector or a Connection
 * 
 * @author   localhorst87
 * @private
 * @param    {SystemElement|Connector|Connection} object1   first object
 * @param    {SystemElement|Connector|Connection} object2   second object
 * @param    {number} [slice]                               indicates if the last entry should be sliced.
 *                                                          If 1, it slices object1, if 2, it slices object2; else, nothing will be sliced
 * @return   {boolean}                                      returns true if subsystems are equal
*/
function areSubsystemsEqual(object1, object2, slice = 0) {
    // make shallow copy to avoid reference issues in multi-layered objects
    let subsystem1 = JSON.parse(JSON.stringify(object1));
    let subsystem2 = JSON.parse(JSON.stringify(object2));    

    if (slice == 1) {
        subsystem1.subsystem = subsystem1.subsystem.slice(0, -1);
    }
    else if (slice == 2) {
        subsystem2.subsystem = subsystem2.subsystem.slice(0, -1);
    }

    if (subsystem1.subsystem.length != subsystem2.subsystem.length) // array length equal?
        return false;

    return subsystem1.subsystem.every((subsystemName, idx) => subsystemName == subsystem2.subsystem[idx]); // array entries the same?
}

/**
 * Checks if the connection is among the allowed connections
 * 
 * @author   localhorst87
 * @private
 * @param    {Connection} connection        The connection to check
 * @param    {Connector} startConnector     The according start connector
 * @param    {Connector} endConnector       The according end connector
 * @return   {boolean}                      returns true/false if connection is allowed/not allowed
*/
function isConnectionAllowed(connection, startConnector, endConnector) {
    let startElement, endElement;

    if (connection.element_start == "")
        startElement = "System";
    else 
        startElement = "Component";

    if (connection.element_end == "")
        endElement = "System";
    else 
        endElement = "Component";
    
    let testFcn = conn => conn.source_element == startElement && conn.destination_element == endElement && conn.source_kind == startConnector.kind && conn.destination_kind == endConnector.kind;
    
    return ALLOWED_CONNECTIONS.findIndex(testFcn) > -1;
}