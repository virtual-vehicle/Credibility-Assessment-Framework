const { describe, it } = require("mocha");
const { expect } = require("chai");
const FileSync = require("fs");
const metrics = require("..");

describe("checkExpertCodeReview", () => {

    describe("valid inputs", () => {

        it("statement signature valid => expect true", () => {
            const statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_02.json", "utf8");
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/cert_02.pem", "utf8");
    
            const resultLog = metrics.checkExpertCodeReview(statementSigned, cert);
            const expectedOutput = {
                result: true,
                log: "The expert statement has been proven valid"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    
        it("certificate from another expert than that who signed the statement => expect false", () => {
            const statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_02.json", "utf8");
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/cert_01.der");
    
            const resultLog = metrics.checkExpertCodeReview(statementSigned, cert);
            const expectedOutput = {
                result: false,
                log: "The expert statement could not be proven valid (signature is not valid)"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    
        it("statement signature changed afterwards => expect false", () => {
            let statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_01.json", "utf8");
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/cert_01.der");
    
            const tweakedStatement = "Code Review done. Eliminated all identified errors.";
            let signedStatementStruct = JSON.parse(statementSigned);
            signedStatementStruct.content = tweakedStatement;
            statementSigned = JSON.stringify(signedStatementStruct);
    
            const resultLog = metrics.checkExpertCodeReview(statementSigned, cert);
            const expectedOutput = {
                result: false,
                log: "The expert statement could not be proven valid (signature is not valid)"
            };
            
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    
        it("certificate expired => expect false", () => {
            const statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_03.json", "utf8");
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/cert_03_expired.pem");
    
            const resultLog = metrics.checkExpertCodeReview(statementSigned, cert);
            const expectedOutput = {
                result: false,
                log: "The expert statement could not be proven valid (X509 certificate expired)"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    
    });
    
    describe("invalid inputs", () => {
    
        it("signedDocument has wrong type => expect false with according log", () => {
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/cert_02.pem", "utf8");
            const resultLog = metrics.checkExpertCodeReview(["arbitrary content"], cert);
            const expectedOutput = {
                result: false,
                log: "The expert statement could not be proven valid (signedStatement must be stringified JSON)"
            };
            expect(resultLog).to.deep.equal(expectedOutput);        
        });
    
        it("signedDocument structure not as expected => expect false with according log", () => {
            let statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_01.json", "utf8");
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/cert_01.der");
    
            let signedStatementStruct = JSON.parse(statementSigned);
            delete signedStatementStruct.hash_algorithm;
            statementSigned = JSON.stringify(signedStatementStruct);
    
            const resultLog = metrics.checkExpertCodeReview(statementSigned, cert);
            const expectedOutput = {
                result: false,
                log: "The expert statement could not be proven valid (signedStatement structure is not valid)"
            };
            
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    
        it("certificate has wrong type => expect false with according log", () => {
            const statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_01.json", "utf8");
    
            const resultLog = metrics.checkExpertCodeReview(statementSigned, ["cert"]);
            const expectedLogExcerpt = "The expert statement could not be proven valid (X509 certificate not valid";
            
            expect(resultLog.result).to.be.false;
            expect(resultLog.log.includes(expectedLogExcerpt)).to.be.true;
        });
    
        it("certificate format not supported => expect false with according log", () => {
            const statementSigned = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/statement_01.json", "utf8");
            const cert = FileSync.readFileSync("./test/test_data/verify_expert_statement/pki/privatekey.pem", "utf8");
            
            const resultLog = metrics.checkExpertCodeReview(statementSigned, cert);
            const expectedLogExcerpt = "The expert statement could not be proven valid (X509 certificate not valid";
     
            expect(resultLog.result).to.be.false;
            expect(resultLog.log.includes(expectedLogExcerpt)).to.be.true;
        });
    
    });

});