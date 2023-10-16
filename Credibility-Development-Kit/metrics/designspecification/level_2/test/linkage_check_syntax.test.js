const { describe, it } = require("mocha");
const { expect } = require("chai");
const FileSync = require("fs");
const metrics = require("..");

describe("checkLinkageSyntax", () => {

    describe("valid inputs", () => {

        it("check linkkages - valid with derived-from and has-implementation", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_03.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_approach_curved_roads",stmd);
            const expectedOutput = {
                result: true,
                log: "Design specification #designspec_model_approach_curved_roads can be traced to source and implementation"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

    });
    describe("invalid inputs", () => {
    
        it("named graph is not valid", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_07.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_approach_curved_roads_01",stmd);
            const expectedOutput = {
                result: false,
                log: "NamedGraph does not fulfill the required schema"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("stmd is not valid", () => {
            const namedGraph_01 = FileSync.readFileSync("./test/test_data/namedGraph_01.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_02.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph_01, "#designspec_carla_server_setup",stmd);

            const expectedOutput = {
                result: false,
                log: "stmd does not fulfill the required XML schema definition"
            };

            expect(resultLog).to.deep.equal(expectedOutput);
        });
    

        it("implementation missing", () => {
            const namedGraph_01 = FileSync.readFileSync("./test/test_data/namedGraph_01.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph_01, "#designspec_carla_server_setup",stmd);
            const expectedOutput = {
                result: false,
                log: "Design specification #designspec_carla_server_setup is not linked to its implementation"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });


        it("justification missing", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_02.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_real_road",stmd);
            const expectedOutput = {
                result: false,
                log: "Design specification #designspec_model_real_road can not be traced to source (justification missing)"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("resourceIri is not existed in the named graph", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_03.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_approach_curved_roads_01",stmd);
            const expectedOutput = {
                result: false,
                log: "The given resource IRI #designspec_model_approach_curved_roads_01 is not existing in the named graph"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("check resourceIri is implemented by invalid phase", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_05.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_approach_lane_width",stmd);

            const expectedOutput = {
                result: false,
                log: "Implementation of design specification #designspec_model_approach_lane_width is #req_m_07 that is located in stmd:RequirementsPhase, but is expected to be located in the implementation phase."
            };

            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("check resourceIri is derived by invalid phase", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_04.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_approach_curved_roads",stmd);

            const expectedOutput = {
                result: false,
                log: "The design specification #designspec_model_approach_curved_roads is justified by #eval_01 with a resource from the stmd:EvaluationPhase, but must not come from the implementation phase or evaluation phase"
            };

            expect(resultLog).to.deep.equal(expectedOutput);
        });

        it("resourceIri is not existed in the stmd", () => {
            const namedGraph = FileSync.readFileSync("./test/test_data/namedGraph_06.json", "utf8");
            const stmd = FileSync.readFileSync("./test/test_data/SimulationTask_03.stmd", "utf8");
            
            const resultLog = metrics.checkLinkageSyntax(namedGraph, "#designspec_model_approach_curved_roads_01",stmd);
            const expectedOutput = {
                result: false,
                log: "The resourceIri: #designspec_model_approach_curved_roads_01 is not existing in the STMD"
            };
    
            expect(resultLog).to.deep.equal(expectedOutput);
        });
    })
});