const fs = require("fs");
const prompt = require("prompt-sync")();
const { Signal } = require("..");

// load example data
let data = fs.readFileSync("./examples/data/global_temperature.json", "utf8");
data = JSON.parse(data);

// extract data
const referenceTime = data.reference.year;
const referenceValues = data.reference.diff_temperature;
const simTime = data.simulation.year;
const simValues = data.simulation.diff_temperature;

// create signals
let reference = new Signal(referenceTime, referenceValues, {
    name: "global temperature difference measurement",
    unit_time: "year",
    unit_values: "degC",
    precision: 4,
});
let simulation = new Signal(simTime, simValues, {
    name: "global temperature difference simulation",
    unit_time: "year",
    unit_values: "degC",
    precision: 4,
});

console.log("load signals... \n");

console.log("---------- Measurement data ----------");
console.log(reference.print() + "\n");
console.log("---------- Simulation data ----------");
console.log(simulation.print() + "\n");
prompt("Press the 'Enter' key for the next step ");

console.log("\n slice measurement to last 30 years using sliceToTime: \n");
reference = reference.sliceToTime(1992, 2021);
console.log(reference.print() + "\n");
prompt("Press the 'Enter' key for the next step");

console.log("\n align simulation data to time frame of measurement data using interpolate: \n");
simulation = simulation.interpolate(reference.time);
console.log(simulation.print() + "\n");
prompt("Press the 'Enter' key for the next step");

console.log("\n check if simulation fulfills accuracy of max. 0.15°C deviation using compare: \n");
let isAccuracyOkay = simulation.compare("==", reference, {
    tolerance: 0.15, // °C
    reduce: true 
});
console.log("\n accuracy fulfilled? --> " + isAccuracyOkay + "\n");
prompt("Press the 'Enter' key for the next step");

console.log("\n observe accuracy by subtracting measurement and simulation data, using subtract: \n")
difference = simulation.subtract(reference);
console.log(difference.values);