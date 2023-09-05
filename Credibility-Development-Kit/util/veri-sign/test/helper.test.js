const { it, describe } = require("mocha");
const { expect } = require("chai");
const FileSync = require("fs");
const helper = require("../helper");

describe("createPrivateKeyObject", () => {

    describe("valid keys", () => {

        it("PEM => expect KeyObject to be created", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };
    
            let keyObj = helper.createPrivateKeyObject(privateKey, keySpec);
    
            expect(keyObj).to.be.ok;
        });

        it("PEM, with encryption => expect KeyObject to be created", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem/private.pem", "utf8");
            const passphrase = FileSync.readFileSync("./test/test_data/pem_encrypted/passphrase", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: true,
                passphrase: passphrase
            };
    
            let keyObj = helper.createPrivateKeyObject(privateKey, keySpec);
    
            expect(keyObj).to.be.ok;
        });

        it("JWK => expect KeyObject to be created", () => {
            let privateKey = FileSync.readFileSync("./test/test_data/jwk/private.jwk", "utf8");
            privateKey = JSON.parse(privateKey);
            const keySpec = {
                format: "jwk",
                isEncrypted: false
            };
    
            let keyObj = helper.createPrivateKeyObject(privateKey, keySpec);
    
            expect(keyObj).to.be.ok;
        });

        it("DER PKCS1 => expect KeyObject to be created", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/der_pkcs1/private.der");
            const keySpec = {
                format: "der",
                type: "pkcs1",
                isEncrypted: false
            };
    
            let keyObj = helper.createPrivateKeyObject(privateKey, keySpec);
    
            expect(keyObj).to.be.ok;
        });

        it("DER PKCS8 => expect KeyObject to be created", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/der_pkcs8/private.der");
            const keySpec = {
                format: "der",
                type: "pkcs8",
                isEncrypted: false
            };
    
            let keyObj = helper.createPrivateKeyObject(privateKey, keySpec);
    
            expect(keyObj).to.be.ok;
        });

        it("DER SEC1 => expect KeyObject to be created", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/der_sec1/private.der");
            const keySpec = {
                format: "der",
                type: "sec1",
                isEncrypted: false
            };
    
            let keyObj = helper.createPrivateKeyObject(privateKey, keySpec);
    
            expect(keyObj).to.be.ok;
        });

    });

    describe("invalid key spec", () => {

        it("KeySpec object invalid => expect to throw", () => {
            const keySpec = {
                format: "pem",
                isEncrypted: true,
                // passphrase: "abcd"
            };
    
            expect(() => helper.createPrivateKeyObject(privateKey, keySpec)).to.throw();
        });

        it("PEM, with encryption, passphrase not correct => expect to throw", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/pem_encrypted/private.pem", "utf8");
            const keySpec = {
                format: "pem",
                isEncrypted: true,
                passphrase: "wrong passphrase"
            };
        
            expect(() => helper.createPrivateKeyObject(privateKey, keySpec)).to.throw();
        });

        it("Private key and KeySpec do not match => expect to throw", () => {
            const privateKey = FileSync.readFileSync("./test/test_data/der_pkcs1/private.der");
            const keySpec = {
                format: "der",
                type: "pkcs8",
                isEncrypted: false
            };
    
            expect(() => helper.createPrivateKeyObject(privateKey, keySpec)).to.throw();
        });

    });

});

describe("isKeySpecValid", () => {

    describe("valid keySpec", () => {

        it("valid format given in lower case => expect true", () => {
            const keySpec = {
                format: "pem",
                isEncrypted: false
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.true;
        });
    
        it("format given in upper case => expect true", () => {
            const keySpec = {
                format: "JWK",
                isEncrypted: false
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.true;
        });
    
        it("encryption used => expect true", () => {
            const keySpec = {
                format: "pem",
                isEncrypted: true,
                passphrase: "12345"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.true;
        });

    });

    describe("invalid keySpec", () => {

        it("not an object => expect false", () => {
            const keySpec = 12;
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });

        it("missing property 'isEncrypted' => expect false", () => {
            const keySpec = {
                format: "pem"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });

        it("missing property 'format' => expect false", () => {
            const keySpec = {
                isEncrypted: false
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });

        it("other type given than PEM, DER or JWK => expect false", () => {
            const keySpec = {
                format: "xxx",
                isEncrypted: true,
                passphrase: "12345"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });
    
        it("no type given on DER format => expect false", () => {
            const keySpec = {
                format: "der",
                isEncrypted: false,
                passphrase: "12345"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });
    
        it("unsupported type given for DER format => expect false", () => {
            const keySpec = {
                format: "der",
                isEncrypted: true,
                type: "pkcs2",
                passphrase: "12345"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });
    
        it("passphrase not given for encrypted key => expect false", () => {
            const keySpec = {
                format: "der",
                isEncrypted: true,
                type: "pkcs1"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });
    
        it("passphrase too short for encrypted key => expect false", () => {
            const keySpec = {
                format: "der",
                isEncrypted: true,
                type: "pkcs1",
                passphrase: "123"
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });
    
        it("passphrase too long for encrypted key => expect false", () => {
            const tooLongPassphrase = `
                0100000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0200000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0300000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0400000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0500000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0600000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0700000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0800000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                0900000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                1000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
                1100000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
            `;
               
            const keySpec = {
                format: "der",
                isEncrypted: true,
                type: "pkcs1",
                passphrase: tooLongPassphrase
            };
    
            const resultLog = helper.isKeySpecValid(keySpec);
    
            expect(resultLog.result).to.be.false;
        });

    });

});

describe("isCertificateValid", () => {

    describe("valid inputs", () => {

        it("valid PEM encoded certificate => expect true", () => {
            const certificate = FileSync.readFileSync("./test/test_data/pem/cert.pem", "utf8");
            const resLog = helper.isCertificateValid(certificate);

            expect(resLog.result).to.be.true;
        });

        it("valid DER encoded certificate => expect true", () => {
            const certificate = FileSync.readFileSync("./test/test_data/der_pkcs8/cert.der");
            const resLog = helper.isCertificateValid(certificate);

            expect(resLog.result).to.be.true;
        });

        it("expired PEM encoded certificate => expect false", () => {
            const certificate = FileSync.readFileSync("./test/test_data/pem_expired/cert.pem", "utf8");
            const resLog = helper.isCertificateValid(certificate);

            expect(resLog).to.deep.equal({
                result: false,
                log: "X509 certificate expired"
            });
        });

    });

    describe("invalid inputs", () => {

        it("PEM encoded certificate has invalid structure => expect false", () => {
            const certificate = "-----BEGIN CERTIFICATE-----";
            
            const resLog = helper.isCertificateValid(certificate);
    
            expect(resLog.result).to.be.false;
        });

        it("certificate has invalid data type => expect false", () => {
            const certificate = 12;
            
            const resLog = helper.isCertificateValid(certificate);
    
            expect(resLog.result).to.be.false;
        });

    });

});