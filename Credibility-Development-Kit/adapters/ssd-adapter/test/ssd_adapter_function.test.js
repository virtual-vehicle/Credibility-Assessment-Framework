const { describe, it } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const { translate } = require("../.");
const fs = require('fs');
const helper = require('../src/helper');

describe("translate", () => {

  describe("successful translations", () => {

    it("example with subsystem and components, reduced to only necessary elements => expect correct elements", () => {
      let ssdPath = "./test/res/example_01.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);
      let expectedElements = [
          {
            "name": "dc_motor_system",
            "type": "System",
            "source": "",
            "subsystem": [],
          },
          {
            "name": "battery",
            "type": "Component",
            "source": "./res/battery.fmu",
            "subsystem": ["dc_motor_system"],
          },
          {
            "name": "dc_motor",
            "type": "System",
            "source": "",
            "subsystem": ["dc_motor_system"],
          },
          {
            "name": "electrics",
            "type": "Component",
            "source": "./res/dc_motor_electrics.fmu",
            "subsystem": ["dc_motor_system", "dc_motor"],
          },
          {
            "name": "mechanics",
            "type": "Component",
            "source": "./res/dc_motor_mechanics.fmu",
            "subsystem": ["dc_motor_system", "dc_motor"],
          }
      ];

      expect(parsedResult.elements).to.deep.equal(expectedElements);
    });

    it("example with subsystem and components, reduced to only necessary elements => expect correct connectors", () => {
      let ssdPath = "./test/res/example_01.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);

      let expectedConnectors = [
        {
          "subsystem": ["dc_motor_system"],
          "element": "battery",
          "name": "U_suppl",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system"],
          "element": "dc_motor",
          "name": "U_0",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system"],
          "element": "dc_motor",
          "name": "rot_speed",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "U_suppl",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "phi",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "w",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "M_el",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "mechanics",
          "name": "M_el",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "mechanics",
          "name": "phi",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "mechanics",
          "name": "w",
          "kind": "output",
          "type": "Real"
        }
      ];

      expect(parsedResult.connectors).to.deep.equal(expectedConnectors);
    });

    it("example with subsystem and components, reduced to only necessary elements => expect correct connections", () => {
      let ssdPath = "./test/res/example_01.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);

      let expectedConnections = [
        {
          "subsystem": ["dc_motor_system"],
          "element_start": "battery",
          "name_start": "U_suppl",
          "element_end": "dc_motor",
          "name_end": "U_0"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "electrics",
          "name_start": "M_el",
          "element_end": "mechanics",
          "name_end": "M_el"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "mechanics",
          "name_start": "w",
          "element_end": "electrics",
          "name_end": "w"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "mechanics",
          "name_start": "phi",
          "element_end": "electrics",
          "name_end": "phi"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "",
          "name_start": "U_0",
          "element_end": "electrics",
          "name_end": "U_suppl"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "mechanics",
          "name_start": "w",
          "element_end": "",
          "name_end": "rot_speed"
        }
      ];
      
      expect(parsedResult.connections).to.deep.equal(expectedConnections);
    });

    it("example with subsystem and components, verbose elements => expect correct elements", () => {
      let ssdPath = "./test/res/example_01.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);
      let expectedElements = [
          {
            "name": "dc_motor_system",
            "type": "System",
            "source": "",
            "subsystem": [],
          },
          {
            "name": "battery",
            "type": "Component",
            "source": "./res/battery.fmu",
            "subsystem": ["dc_motor_system"],
          },
          {
            "name": "dc_motor",
            "type": "System",
            "source": "",
            "subsystem": ["dc_motor_system"],
          },
          {
            "name": "electrics",
            "type": "Component",
            "source": "./res/dc_motor_electrics.fmu",
            "subsystem": ["dc_motor_system", "dc_motor"],
          },
          {
            "name": "mechanics",
            "type": "Component",
            "source": "./res/dc_motor_mechanics.fmu",
            "subsystem": ["dc_motor_system", "dc_motor"],
          }
      ];

      expect(parsedResult.elements).to.deep.equal(expectedElements);
    });

    it("example with subsystem and components, verbose elements => expect correct connectors", () => {
      let ssdPath = "./test/res/example_01.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);

      let expectedConnectors = [
        {
          "subsystem": ["dc_motor_system"],
          "element": "battery",
          "name": "U_suppl",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system"],
          "element": "dc_motor",
          "name": "U_0",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system"],
          "element": "dc_motor",
          "name": "rot_speed",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "U_suppl",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "phi",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "w",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "electrics",
          "name": "M_el",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "mechanics",
          "name": "M_el",
          "kind": "input",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "mechanics",
          "name": "phi",
          "kind": "output",
          "type": "Real"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element": "mechanics",
          "name": "w",
          "kind": "output",
          "type": "Real"
        }
      ];

      expect(parsedResult.connectors).to.deep.equal(expectedConnectors);
    });

    it("example with subsystem and components, verbose elements => expect correct connections", () => {
      let ssdPath = "./test/res/example_01.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);

      let expectedConnections = [
        {
          "subsystem": ["dc_motor_system"],
          "element_start": "battery",
          "name_start": "U_suppl",
          "element_end": "dc_motor",
          "name_end": "U_0"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "electrics",
          "name_start": "M_el",
          "element_end": "mechanics",
          "name_end": "M_el"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "mechanics",
          "name_start": "w",
          "element_end": "electrics",
          "name_end": "w"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "mechanics",
          "name_start": "phi",
          "element_end": "electrics",
          "name_end": "phi"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "",
          "name_start": "U_0",
          "element_end": "electrics",
          "name_end": "U_suppl"
        },
        {
          "subsystem": ["dc_motor_system", "dc_motor"],
          "element_start": "mechanics",
          "name_start": "w",
          "element_end": "",
          "name_end": "rot_speed"
        }
      ];
      
      expect(parsedResult.connections).to.deep.equal(expectedConnections);
    });

  });

  describe("unsuccessful translations", () => {

    var sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
    });

    it("SSD file not found => expect empty result", () => {
      let ssdPath = "./test/res/unknown.ssd";
      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);
      let expectedResult = {error : "Could not open specified SSD file"};

      expect(parsedResult).to.deep.equal(expectedResult);
    });
    
    it("XML structure not valid => expect empty result", () => {
      let ssdPath = "./test/res/example_01.ssd";
      sandbox.stub(fs, "readFileSync").returns(""); // we don't need ssd and xsd strings for this case
      sandbox.stub(helper, "validateXml").returns(false);

      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);
      let expectedResult = {error : "Parsing of SSD not possible, due to invalid XML structure"};

      expect(parsedResult).to.deep.equal(expectedResult);
    });

    it("schema not valid => expect empty result", () => {
      let ssdPath = "./test/res/example_01.ssd";
      sandbox.stub(fs, "readFileSync").returns(""); // we don't need ssd and xsd strings for this case
      sandbox.stub(helper, "validateXml").returns(true);
      sandbox.stub(helper, "validateSsd").returns(false);

      let result = translate(ssdPath);
      let parsedResult = JSON.parse(result);
      let expectedResult = {error : "Parsing of SSD not possible, due to invalid implementation of the given XSD structure"};

      expect(parsedResult).to.deep.equal(expectedResult);
    });

  });

});