const FileSync = require("fs");
const prompt = require("prompt-sync")();
const verisign = require("./..");

// ------------ Create input --------------
const statement = prompt("Enter any arbitrary statement you want to sign: ");

console.log(`\n expertStatement = "${statement}" \n`);

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
    privateKey = FileSync.readFileSync("./examples/keystore/pem_encrypted/private.pem", "utf8");
    keySpecification = {
        format: "pem",
        isEncrypted: true,
        passphrase: "ThisIsMyPassphrase"
    };
}
else if (privateKeyChoice == "2") {
    privateKey = FileSync.readFileSync("./examples/keystore/jwk/private.jwk", "utf8");
    privateKey = JSON.parse(privateKey);
    keySpecification = {
        format: "jwk",
        isEncrypted: false,
    };
}
else if (privateKeyChoice == "3") {
    privateKey = FileSync.readFileSync("./examples/keystore/der_pkcs8/private.der");
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

signedStatement = verisign.sign(statement, privateKey, keySpecification);
console.log(`signedStatement = ${signedStatement}\n`);

// ------------ store statement ------------

const filename = prompt("Enter a filename for saving the statement (without extension): ");
const path = "./examples/signed_statements/" + filename + ".json";
FileSync.writeFileSync(path, signedStatement);

console.log(`statement saved under ${path}`);