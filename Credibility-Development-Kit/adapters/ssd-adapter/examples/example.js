const { translate } = require("../.");
const prompt = require("prompt-sync")();

let ssdPath = prompt("enter the path of your SSD file: ");

const systemStructureCdk = translate(ssdPath);

console.log("Result: ");
console.log(systemStructureCdk);