const fs = require("fs");
const prompt = require("prompt-sync")();
const verisign = require("./..");

// ------------ Create input --------------
const result = prompt("Enter the result of the expert check (true/false):");
const log = prompt("Enter the log of the expert check (any arbitrary text):");
const status_code = prompt("Enter the status response code of the expert check (100...999):");

const expertStatement = {
    result: result == "true" ? true : false,
    log: log,
    status_code: Number(status_code)
};

console.log(`\n expertStatement = ${expertStatement} \n`);

// ------------ Choose private key --------------
let privateKeyChoice;
while (privateKeyChoice != "0" && privateKeyChoice != "1" && privateKeyChoice != "2" && privateKeyChoice != "3") {
    console.log("Please choose a private key type you want to use for signing the statement: \n")
    privateKeyChoice = prompt("1 -> PEM | 2 -> JWK | 3 -> DER | (0 -> cancel): ");
}

let privateKey, keySpecification;
if (privateKeyChoice == "0")
    return;
else if (privateKeyChoice == "1") {
    privateKey = fs.readFileSync("./examples/keystore/pem_encrypted/private.pem", "utf8");
    keySpecification = {
        format: "pem",
        isEncrypted: true,
        passphrase: "ThisIsMyPassphrase"
    };
}
else if (privateKeyChoice == "2") {
    privateKey = fs.readFileSync("./examples/keystore/jwk/private.jwk", "utf8");
    privateKey = JSON.parse(privateKey);
    keySpecification = {
        format: "jwk",
        isEncrypted: false,
    };
}
else if (privateKeyChoice == "3") {
    privateKey = fs.readFileSync("./examples/keystore/der_pkcs8/private.der");
    keySpecification = {
        format: "der",
        type: "pkcs8",
        isEncrypted: false
    };
}

console.log("\nYour chosen private key: \n");
console.log(privateKey);
console.log(`keySpecification = ${JSON.stringify(keySpecification)}\n`);

// ------------ sign statement --------------

signedStatement = verisign.sign(expertStatement, privateKey, keySpecification);
console.log(`signedStatement = ${signedStatement} \n`);

// ------------ store statement ------------

const filename = prompt("Enter a filename for saving the statement (without extension): ");
const path = "./examples/signed_statements/" + filename + ".json";
fs.writeFileSync(path, signedStatement);

console.log(`statement saved under ${path}`);