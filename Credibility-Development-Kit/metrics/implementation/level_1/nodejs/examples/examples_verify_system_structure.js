const fs = require("fs");
const metrics = require("..");
const prompt = require("prompt-sync")();

// load system structures
const systemStructureWellDefined = fs.readFileSync("./examples/system_structures/dc_motor_example.json", "utf-8");
const systemStructureTypeInconsistent = fs.readFileSync("./examples/system_structures/dc_motor_example_type_inconsistent.json", "utf-8");
const systemStructureConnectionCut = fs.readFileSync("./examples/system_structures/dc_motor_example_connection_cut.json", "utf-8");

// additional argument for not required input connection
const inputNotRequired = JSON.stringify([
    {
        "subsystem": ["dc_motor_system", "dc_motor"],
        "element": "electrics",
        "name": "U_0",
        "kind": "input",
        "type": "Real"
    }
]);

// verify
const resultWell = metrics.checkSystemStructure(systemStructureWellDefined);
const resultType = metrics.checkSystemStructure(systemStructureTypeInconsistent);
const resultCut = metrics.checkSystemStructure(systemStructureConnectionCut);
const resultCutAddedArg = metrics.checkSystemStructure(systemStructureConnectionCut, inputNotRequired);

console.log("\n------------------------------------------------------------------------------------\n");
console.log("loaded system structure: \n");
console.log(systemStructureWellDefined);
console.log("verification result: \n");
console.log(resultWell);
console.log("\n");

prompt("Press the 'Enter' key for the next example");

console.log("\n------------------------------------------------------------------------------------\n");
console.log("loaded system structure: \n");
console.log(systemStructureTypeInconsistent);
console.log("verification result: \n");
console.log(resultType);
console.log("\n");

prompt("Press the 'Enter' key for the next example");

console.log("\n------------------------------------------------------------------------------------\n");
console.log("loaded system structure: \n");
console.log(systemStructureConnectionCut);
console.log("verification result without additional argument: \n");
console.log(resultCut);
console.log("\n");

prompt("Press the 'Enter' key for the next example");

console.log("\n------------------------------------------------------------------------------------\n");
console.log("loaded system structure: \n");
console.log(systemStructureConnectionCut);
console.log("not required inputs: \n");
console.log(inputNotRequired);
console.log("verification result with additional argument: \n");
console.log(resultCutAddedArg);