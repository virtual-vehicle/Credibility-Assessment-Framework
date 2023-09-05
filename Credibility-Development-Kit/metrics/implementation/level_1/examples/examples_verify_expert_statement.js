const fs = require("fs");
const metrics = require("..");
const prompt = require("prompt-sync")();

// load expert statement
const expertStatement = fs.readFileSync("./examples/statements/expert_statement.json", "utf8");

// tweak statement
const tweakedContent = "Code Review done. Eliminated all identified errors (forever ever!)";
let signedStatementStruct = JSON.parse(expertStatement);
signedStatementStruct.content = tweakedContent;
const tweakedStatement = JSON.stringify(signedStatementStruct);

// load certificates
const cert2019 = fs.readFileSync("./examples/certificates/x509_john_doe_2019.pem", "utf8"); // expired
const cert2022 = fs.readFileSync("./examples/certificates/x509_john_doe_2022.pem", "utf8"); // valid
const certOther = fs.readFileSync("./examples/certificates/x509_other.der"); // arbitrary certificate

// verify
const result2022 = metrics.checkExpertReview(expertStatement, cert2022);
const result2019 = metrics.checkExpertReview(expertStatement, cert2019);
const resultOther = metrics.checkExpertReview(expertStatement, certOther);
const resultTweaked = metrics.checkExpertReview(tweakedStatement, cert2022);

console.log("\n------------------------------------------------------------------------------------\n");
console.log("loaded expert statement: \n");
console.log(expertStatement);
console.log("\n------------------------------------------------------------------------------------\n");

console.log("verification of expertStatement with certificate x509_john_doe_2019.pem: \n");
console.log(result2019);
console.log("\n------------------------------------------------------------------------------------\n");

console.log("\n");
prompt("Press the 'Enter' key for the next example");

console.log("verification of expertStatement with certificate x509_john_doe_2022.pem: \n");
console.log(result2022);
console.log("\n------------------------------------------------------------------------------------\n");

console.log("\n");
prompt("Press the 'Enter' key for the next example");

console.log("verification of expertStatement with certificate x509_other.der: \n");
console.log(resultOther);
console.log("\n------------------------------------------------------------------------------------\n");

console.log("\n");
prompt("Press the 'Enter' key for the next example");

console.log("tweak expert statement: \n");
console.log(tweakedStatement);
console.log("\n------------------------------------------------------------------------------------\n");

console.log("\n");
prompt("Press the 'Enter' key for the next example");

console.log("verification of tweakedStatement with certificate x509_john_doe_2019.pem: \n");
console.log(resultTweaked);
console.log("\n------------------------------------------------------------------------------------\n");