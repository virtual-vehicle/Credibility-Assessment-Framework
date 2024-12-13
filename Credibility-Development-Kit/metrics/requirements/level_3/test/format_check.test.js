const { describe, it } = require("mocha");
const { expect } = require("chai");
const FileSync = require("fs");
const metrics = require("..");

describe("Check ReqIF Structure", () => {

    it("test-1 : Check reqif file is valid", () => {
        const reqIfModel = FileSync.readFileSync("./test/test_data/test-1.reqif", "utf8");
        
        const resultLog = metrics.formatCheck(reqIfModel, []);

        const expectedOutput = {
            result : true,
            log : "The requirement fulfills the given ReqIF schema"
        };

        expect(resultLog).to.deep.equal(expectedOutput);
    });

	it("test-2 :  Reqif file is not valid in XML", ()=> {
        const reqIfModel = FileSync.readFileSync("./test/test_data/test-2.reqif", "utf8");
        
        const resultLog = metrics.formatCheck(reqIfModel);

        const expectedOutput = {
            result : false,
            log : "The requirement does not implement the given ReqIF schema correctly, due to invalid XML structure"
        };

        expect(resultLog).to.deep.equal(expectedOutput);
    });
})

describe("Check ReqIF attributes", () => {

    it("test-3 :  all attributes are completed", ()=> {
        const reqIfModel = FileSync.readFileSync("./test/test_data/test-1.reqif", "utf8");
        
        const resultLog = metrics.formatCheck(reqIfModel, "['Signee', 'Creator', 'Owner']");
        
        const expectedOutput = {
            result : true,
            log : "The requirement fulfills the given ReqIF schema. (All required attributes are contained in the requirement)"
        };

        expect(resultLog).to.deep.equal(expectedOutput);
    });

    it("test-4 :  missing attributes", ()=> {
        const reqIfModel = FileSync.readFileSync("./test/test_data/test-1.reqif", "utf8");
        
        const resultLog = metrics.formatCheck(reqIfModel, "['Signee', 'Creator', 'Id']");
        
        const expectedOutput = {
            result : false,
            log : "The requirement is missing at least one required attribute, please check Id"
        };

        expect(resultLog).to.deep.equal(expectedOutput);
    });
});