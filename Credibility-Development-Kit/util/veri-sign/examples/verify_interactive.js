const FileSync = require("fs");
const prompt = require("prompt-sync")();
const verisign = require("./..");

// ------------ Choose statement --------------

let files = FileSync.readdirSync('./examples/signed_statements/');

if (files.length == 0) {
    console.log("no expert statements available. Create one using 'npm run example_sign'");
    return;
}

console.log("choose an expert statement:");
for (let i = 0; i < files.length; i++) {
    console.log(i + " --> " + files[i]);
}
console.log("x --> cancel \n")
const chosenFileNo = prompt("");

if(chosenFileNo == "x")
    return;

const chosenStatement = FileSync.readFileSync('./examples/signed_statements/' + files[Number(chosenFileNo)], "utf8");

console.log("\nchosen statement:\n")
console.log(chosenStatement);

// ------------ Choose Certificate --------------

let certs = FileSync.readdirSync('./examples/certificates/');

console.log("\nchoose a certificate to verify the statement:");
for (let i = 0; i < certs.length; i++) {
    console.log(i + " --> " + certs[i]);
}
console.log("x --> cancel \n")
const chosenCertNo = prompt("");

if(chosenCertNo == "x")
    return;

let certName = certs[Number(chosenCertNo)];

let encoding;
if (certName.slice(-3) != "der") {
    encoding = "utf8"
}

const chosenCert = FileSync.readFileSync('./examples/certificates/' + certName, encoding);

// ------------ Verify statement --------------

let verification = verisign.verify(chosenStatement, chosenCert);
verification = JSON.stringify(verification);
console.log(`\nverification = ${verification}\n`);