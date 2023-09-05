const { describe, it } = require("mocha");
const { expect } = require("chai");
const FileSync = require("fs");
const metrics = require("..");

describe("linkageCheckSyntax", () => {

    describe("valid inputs", () => {

        it("check namedGraph", () => {
            const namedGraph_01 = FileSync.readFileSync("./test/test_data/namedGraph_01.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph_01, "#req_m_01",stmd);
            const expectedOutput = {
                result: true,
                log: "Linkage check is valid"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("check namedGraph - valid with consistency", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_04.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_04.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_m_01",stmd);
            const expectedOutput = {
                result: true,
                log: "Linkage check is valid"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("check namedGraph - invalid because of derived", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_05.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_05.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_m_01",stmd);

            const expectedOutput = {
                result: false,
                log: "The derived resourceIri #designspec_carla_server_setup should come from the STMD / RequirementsPhase or AnalysisPhase"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("check resourceIri is validated by invalid phase", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_03.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_m_01",stmd);
            
            const expectedOutput = {
                result: false,
                log: "The validated resourceIri #designspec_model_appraoch_number_of_lanes should come from EvaluationPhase"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("check resourceIri is derived by invalid phase", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_03.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_m_01",stmd);
            
            const expectedOutput = {
                result: false,
                log: "The validated resourceIri #designspec_model_appraoch_number_of_lanes should come from EvaluationPhase"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    });
    describe("invalid inputs", () => {
        it("invalid namedGraph - null input", () => {
            const namedGraph = "";
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_m_01",stmd);

            const expectedOutput = {
                result: false,
                log: "namedGraph, resourceIri or STMD is null"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("invalid namedGraph - invalid schema", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_02.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_f_01",stmd);

            const expectedOutput = {
                result: false,
                log: "Named graph does not follow the schema"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("invalid resource - not found resource id", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_01.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask.stmd", "utf8");
            
            const resultLog = metrics.linkageCheckSyntax(namedGraph, "#req_f_01",stmd);

            const expectedOutput = {
                result: false,
                log: "resourceIri #req_f_01 does not exist"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    })
});