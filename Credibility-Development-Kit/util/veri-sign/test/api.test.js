const { it, describe } = require("mocha");
const { expect } = require("chai");
const FileSync = require("fs");
const verisign = require("../.");

describe("sign", () => {

    describe("valid inputs", () => {

        it("use PEM utf8-string as private key => expect to successfully sign", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };
            const expertStatement = {
                result: true,
                log: "arbitrary content",
                status_code: 200
            };

            const signedDoc = verisign.sign(expertStatement, privateKey, keySpec);

            expect(signedDoc).to.be.ok;
        });

        it("use DER Buffer as private key => expect to successfully sign", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/der_pkcs8/private.der");
            const keySpec = {
                format: "der",
                type: "pkcs8",
                isEncrypted: false
            };
            const expertStatement = {
                result: true,
                log: "arbitrary content",
                status_code: 200
            };

            let signedDoc = verisign.sign(expertStatement, privateKey, keySpec);
            
            expect(signedDoc).to.be.ok;                
        });

        it("use JWK object as private key => expect to successfully sign", () => {
            let privateKey = FileSync.readFileSync("./test/test_data/jwk/private.jwk", "utf8");
            privateKey = JSON.parse(privateKey);
            const keySpec = {
                format: "jwk",
                isEncrypted: false
            };
            const expertStatement = {
                result: true,
                log: "arbitrary content",
                status_code: 200
            };

            let signedDoc = verisign.sign(expertStatement, privateKey, keySpec);
            
            expect(signedDoc).to.be.ok;                
        });

        it("sign document => expect to be wrapped into information structure", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };
            const expertStatement = {
                result: true,
                log: "arbitrary content",
                status_code: 200
            };

            let signedDoc = verisign.sign(expertStatement, privateKey, keySpec);

            signedDoc = JSON.parse(signedDoc);

            expect(signedDoc.content).to.deep.equal(expertStatement);
            expect(signedDoc.signature.length).to.equal(512);
        });

    });

    describe("invalid inputs", () => {

        it("expertStatement does not fulfill schema => expect to throw", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };
            const expertStatement = {
                result: true,
                status_code: 200
            };

            expect(() => verisign.sign(expertStatement, privateKey, {})).to.throw();
        });

        it("log of expertStatement is empty string => expect to throw", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };
            const expertStatement = {
                result: true,
                log: "",
                status_code: 200
            };

            expect(() => verisign.sign(expertStatement, privateKey, keySpec)).to.throw();
        });

        it("keySpec is empty => expect to throw", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const expertStatement = {
                result: true,
                log: "everything good",
                status_code: 200
            };

            expect(() => verisign.sign(expertStatement, privateKey, {})).to.throw();
        });

        it("privateKey is empty => expect to throw", () => {
            const privateKey = `
            -----BEGIN PRIVATE KEY-----
            -----END PRIVATE KEY-----
            `;

            const keySpec = {
                format: "pem",
                isEncrypted: false
            };

            const expertStatement = {
                result: true,
                log: "everything good",
                status_code: 200
            };

            expect(() => verisign.sign(expertStatement, privateKey, keySpec)).to.throw();
        });

        it("privateKey is not String, Buffer and Object => expect to throw", () => {
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };

            const expertStatement = {
                result: true,
                log: "everything good",
                status_code: 200
            };
            
            expect(() => verisign.sign(expertStatement, 2564468, keySpec)).to.throw();
        });

        it("keySpec not as expected => expect to throw", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");

            const expertStatement = {
                result: true,
                log: "everything good",
                status_code: 200
            };

            expect(() => verisign.sign(expertStatement, privateKey, 1)).to.throw();
        });

    });
    
});

describe("verify", () => {

    describe("valid inputs", () => {

        it("PEM certificate, valid signature => expect true", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/pem/signed_statement_example.json", "utf8");
            const certificate = FileSync.readFileSync("./test/test_data/pem/cert.pem", "utf8");
            
            const resLog = verisign.verify(signedStatement, certificate);

            expect(resLog.result).to.be.true;
        });

        it("DER certificate, valid signature => expect true", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/der_pkcs8/signed_statement_example.json", "utf8");
            const certificate = FileSync.readFileSync("./test/test_data/der_pkcs8/cert.der");

            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog.result).to.be.true;
        });

        it("valid signature, wrong certificate => expect false", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/pem/signed_statement_example.json", "utf8");
            const certificate = FileSync.readFileSync("./test/test_data/der_pkcs8/cert.der");

            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog.result).to.be.false;
        });

        it("content of signature changed afterwards => expect false", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/pem/signed_statement_example.json", "utf8");
            let tweakedDocument = JSON.parse(signedStatement);
            tweakedDocument.content.result = false;
            tweakedDocument = JSON.stringify(tweakedDocument);
            const certificate = FileSync.readFileSync("./test/test_data/pem/cert.pem", "utf8");

            const resLog = verisign.verify(tweakedDocument, certificate);
    
            expect(resLog.result).to.be.false;
        });

        it("certificate expired => expect false", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/pem_expired/signed_statement_example.json", "utf8");
            const certificate = FileSync.readFileSync("./test/test_data/pem_expired/cert.pem", "utf8");
    
            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog).to.deep.equal({
                result: false,
                log: "X509 certificate expired"
            })
        });

    });

    describe("invalid inputs", () => {

        it("signed document has invalid structure => expect to throw", () => {
            let signedStatement = {
                doc: "arbitrary content",
                sign: "12fgpjgop"
            };
            signedStatement = JSON.stringify(signedStatement);
            const certificate = FileSync.readFileSync("./test/test_data/pem/cert.pem", "utf8");
    
            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog).to.deep.equal({
                result: false,
                log: "signedStatement structure is not valid"
            })
        });

        it("signed document has invalid type => expect to throw", () => {
            let signedStatement = FileSync.readFileSync("./test/test_data/pem/signed_statement_example.json", "utf8");
            signedStatement = JSON.parse(signedStatement); // object instead of string
            const certificate = FileSync.readFileSync("./test/test_data/pem/cert.pem", "utf8");
   
            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog).to.deep.equal({
                result: false,
                log: "signedStatement must be a stringified ExpertStatement JSON"
            })
        });

        it("PEM certificate has invalid structure => expect to throw", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/pem/signed_statement_example.json", "utf8");
            const certificate = "-----BEGIN CERTIFICATE-----";
    
            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog).to.deep.equal({
                result: false,
                log: "X509 certificate not valid: Error: error:0908F066:PEM routines:get_header_and_data:bad end line"
            })            
        });

        it("certificate has invalid data type => expect to throw", () => {
            const signedStatement = FileSync.readFileSync("./test/test_data/pem/signed_statement_example.json", "utf8");
            const certificate = 12;
    
            const resLog = verisign.verify(signedStatement, certificate);
    
            expect(resLog).to.deep.equal({
                result: false,
                log: "X509 certificate not valid: TypeError [ERR_INVALID_ARG_TYPE]: The \"buffer\" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received type number (12)"
            })             
        });

    });

});