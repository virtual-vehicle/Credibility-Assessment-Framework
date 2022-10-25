/**
 * Checks if the initial conditions are consistent, that means if required initial values 
 * are given and permitted initial values are not given, etc.
 * @author   localhorst87
 * @function
 * @param    {Array} modelDescription    parsed model description
 * @return   {Boolean}                   returns true/false upon passing/failing the test
*/
function checkInitialConditions(modelDescription) {
    let failureFound = false;

    const modelVariables = modelDescription.modelVariables;

    for (let variable of modelVariables) {
        if (variable.init_method == "exact" || variable.init_method == "approx" || variable.init_method == "substitute") { // value must be provided
            if (variable.init_value != null) {
                continue;
            }
            else {
                failureFound = true;
                break;
            }
        }
        else if (variable.init_method == "calculated" || variable.init_method == "permitted") { // value must NOT be provided
            if (variable.init_value == null) {
                continue;
            }
            else {
                failureFound = true;
                break;
            }
        }
        else {
            failureFound = true;
            break;
        }
    }
    
    return failureFound == false;
}

/**
* Checks whether all model variables are defined either by pure SI base units or by the 
* units that were defined within the model 
* @author   localhorst87
* @param    {Array} modelDescription    parsed model description
* @return   {Boolean}                   returns true/false upon passing/failing the test
*/
function checkUnitImplementation(modelDescription) {
    let failureFound = false;

    const baseUnits = ["kg", "m", "s", "A", "K", "mol", "cd", "rad", "-"];
    const modelVariables = modelDescription.modelVariables;
    const unitDefinitions = modelDescription.unitDefinitions;
    const definedUnits = unitDefinitions.map(unitDef => unitDef.name);


    for (let variable of modelVariables) {
        if (baseUnits.includes(variable.unit) || definedUnits.includes(variable.unit)) {
            continue;
        }
        else {
            failureFound = true;
            break;
        }
    }

    return failureFound == false;
}

/**
* Checks if all types used in the model are defined, whether as a plain data type
* or as a defined type in the model
* @author   localhorst87
* @param    {Array}     modelDescription    parsed model description
* @return   {Boolean}                       returns true/false upon passing/failing the test
*/
function checkTypeImplementation(modelDescription) {
    let failureFound = false;

    const dataTypes = ["Real", "Integer", "Boolean", "String", "Enumeration"];
    const modelVariables = modelDescription.modelVariables;
    const typeDefinitions = modelDescription.typeDefinitions;
    const declaredTypes = typeDefinitions.map(typeDef => typeDef.name);

    for (let variable of modelVariables) {
        if (!dataTypes.includes(variable.data_type)) {
            failureFound = true;
            break;
        }

        if (variable.declared_type) {
            if (!declaredTypes.includes(variable.declared_type)) {
                failureFound = true;
                break;
            }
        }
        else {
            continue;
        }
    }

    return failureFound == false;
}