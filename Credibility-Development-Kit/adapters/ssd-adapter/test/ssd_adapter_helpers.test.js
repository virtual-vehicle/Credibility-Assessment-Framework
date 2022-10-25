const { describe, it } = require("mocha");
const { expect } = require("chai");
const helper = require("../src/helper");

describe("parseSsd", () => {

    describe("test if specific elements are parsed as array, although they only have a single element", () => {

        var ssdString = `
        <?xml version="1.0" encoding="UTF-8"?>
        <ssd:SystemStructureDescription>
          <ssd:System name="system0">
            <ssd:Elements>
              <ssd:Component name="sys_element" type="application/x-fmu-sharedlibrary" source=".\sysel.fmu">
                <ssd:Connectors>
                  <ssd:Connector name="ding" kind="output">
                    <ssc:Real/>
                  </ssd:Connector>
                </ssd:Connectors>
              </ssd:Component>
              <ssd:System name="subsystem">
                <ssd:Connectors>
                  <ssd:Connector name="dong" kind="input">
                    <ssc:Real/>
                  </ssd:Connector>
                  <ssd:Connector name="globalout" kind="output">
                    <ssc:Real/>
                  </ssd:Connector>
                </ssd:Connectors>
              </ssd:System>
            </ssd:Elements>
            <ssd:Connections>
              <ssd:Connection startElement="sys_element" startConnector="ding" endConnector="dong"/>
            </ssd:Connections>
          </ssd:System>
        </ssd:SystemStructureDescription>`;

        it("one ssd:System element per layer available => expect to be parsed as array (and not as object)", () => {
            let parsedSsd = helper.parseSsd(ssdString);
            let expectedSystemArray = parsedSsd["ssd:SystemStructureDescription"]["ssd:System"];

            expect(expectedSystemArray.length).to.equal(1);
        });

        it("one ssd:Component element available => expect to be parsed as array", () => {
          let parsedSsd = helper.parseSsd(ssdString);
          let expectedSystemArray = parsedSsd["ssd:SystemStructureDescription"]["ssd:System"];
          let expectedComponentArray = expectedSystemArray[0]["ssd:Elements"]["ssd:Component"];
          
          expect(expectedComponentArray.length).to.equal(1);
        });

        it("one ssd:Connection element available => expect to be parsed as array", () => {
          let parsedSsd = helper.parseSsd(ssdString);
          let expectedSystemArray = parsedSsd["ssd:SystemStructureDescription"]["ssd:System"];
          let expectedConnectionArray = expectedSystemArray[0]["ssd:Connections"]["ssd:Connection"];

          expect(expectedConnectionArray.length).to.equal(1);
        });

        it("one ssd:Connector element on System layer available => expect to be parsed as array", () => {
          let parsedSsd = helper.parseSsd(ssdString);
          let expectedSystemArray = parsedSsd["ssd:SystemStructureDescription"]["ssd:System"];
          let expectedComponentArray = expectedSystemArray[0]["ssd:Elements"]["ssd:Component"];
          let expectedConnectorArray = expectedComponentArray[0]["ssd:Connectors"]["ssd:Connector"];

          expect(expectedConnectorArray.length).to.equal(1);
        });

    });

    describe("test if attributes are parsed as well", () => {

      var ssdString = `
      <?xml version="1.0" encoding="UTF-8"?>
      <ssd:SystemStructureDescription>
        <ssd:System name="system0">
          <ssd:Elements>
            <ssd:Component name="sys_element" type="application/x-fmu-sharedlibrary" source=".\sysel.fmu">
              <ssd:Connectors>
                <ssd:Connector name="ding" kind="output">
                  <ssc:Real/>
                </ssd:Connector>
              </ssd:Connectors>
            </ssd:Component>
          </ssd:Elements>
        </ssd:System>
      </ssd:SystemStructureDescription>`;

      it("check if property is existing and is parsed with leading @_", () => {
        let parsedSsd = helper.parseSsd(ssdString);
        let expectedSystemArray = parsedSsd["ssd:SystemStructureDescription"]["ssd:System"];
        let componentToCheck = expectedSystemArray[0]["ssd:Elements"]["ssd:Component"][0];

        expect(componentToCheck.hasOwnProperty("@_name")).to.be.true;
      });

    });

});

describe("extractTElements", () => {

    it("one layer: system => expect only one element with corresponding attributes", () => {
      let parsedSsd = {
        "?xml":{
          "@_version":"1.0",
          "@_encoding":"UTF-8"
        },
        "ssd:SystemStructureDescription":{
          "ssd:System":[ 
            { // <-- TElement
              "@_name":"system0",
              "ssd:Connectors":{
                "ssd:Connector":[
                  {
                    "ssc:Real":"",
                    "@_name":"globalin",
                    "@_kind":"input"
                  }
                ]
              }
            }
          ]
        }
      };

      let expectedTElements = [
        {
          name: "system0",
          type: "System",
          source: "",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0],
          subsystem: [],
        }
      ];

      let tElementArray = helper.extractTElements(parsedSsd);
      expect(tElementArray).to.deep.equal(expectedTElements);
    }); 

    it("two layers: system -- components => expect three elements with corresponding attributes", () => {
      let parsedSsd = {
        "?xml":{
          "@_version":"1.0",
          "@_encoding":"UTF-8"
        },
        "ssd:SystemStructureDescription":{
          "ssd:System":[ 
            { // <-- TElement
              "@_name":"system0",
              "ssd:Elements":{
                "ssd:Component":[ 
                  { // <-- TElement
                    "@_name":"sys_element_1",
                    "@_type":"application/x-fmu-sharedlibrary",
                    "@_source":"./sysel1.fmu",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"ding",
                          "@_kind":"output"
                        }]
                      }
                  },
                  { // <-- TElement
                    "@_name":"sys_element_2",
                    "@_type":"application/x-fmu-sharedlibrary",
                    "@_source":"./sysel2.fmu",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"dong",
                          "@_kind":"input"
                        }
                      ]
                    }
                  }]
                },
              "ssd:Connections":{
                "ssd:Connection":[
                  {
                    "@_startElement":"sys_element_1",
                    "@_startConnector":"ding",
                    "@_endElement":"sys_element_2",
                    "@_endConnector":"dong"
                  }
                ]
              }
            }
          ]
        }
      };

      let expectedTElements = [
        {
          name: "system0",
          type: "System",
          source: "",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0],
          subsystem: [],
        },
        {
          name: "sys_element_1",
          type: "Component",
          source: "./sysel1.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][0],
          subsystem: ["system0"],
        },
        {
          name: "sys_element_2",
          type: "Component",
          source: "./sysel2.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][1],
          subsystem: ["system0"],
        }
      ];

      let tElementArray = helper.extractTElements(parsedSsd);
      expect(tElementArray).to.deep.equal(expectedTElements);
    }); 
    
    it("two layers: system -- components, system => expect four elements with corresponding attributes", () => {
      let parsedSsd = {
        "?xml":{
          "@_version":"1.0",
          "@_encoding":"UTF-8"
        },
        "ssd:SystemStructureDescription":{
          "ssd:System":[ 
            { // <-- TElement
              "@_name":"system0",
              "ssd:Elements":{
                "ssd:Component":[
                  { // <-- TElement
                    "@_name":"sys_element_1",
                    "@_type":"application/x-fmu-sharedlibrary",
                    "@_source":"./sysel1.fmu",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"ding",
                          "@_kind":"output"
                        }]
                      }
                  },
                  { // <-- TElement
                    "@_name":"sys_element_2",
                    "@_type":"application/x-fmu-sharedlibrary",
                    "@_source":"./sysel2.fmu",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"dong",
                          "@_kind":"input"
                        }]
                      }
                  }],
                "ssd:System":[ // <-- TElement
                  {
                    "@_name":"subsystem",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"globalin",
                          "@_kind":"input"
                        },
                        {
                          "ssc:Real":"",
                          "@_name":"globalout",
                          "@_kind":"output"
                        }
                      ]
                    }                  
                  }]
                },
              "ssd:Connections":{
                "ssd:Connection":[
                  {
                    "@_startElement":"sys_element_1",
                    "@_startConnector":"ding",
                    "@_endElement":"sys_element_2",
                    "@_endConnector":"dong"
                  }
                ]
              }
            }
          ]
        }
      };

      let expectedTElements = [
        {
          name: "system0",
          type: "System",
          source: "",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0],
          subsystem: [],
        },
        {
          name: "sys_element_1",
          type: "Component",
          source: "./sysel1.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][0],
          subsystem: ["system0"],
        },
        {
          name: "sys_element_2",
          type: "Component",
          source: "./sysel2.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][1],
          subsystem: ["system0"],
        },
        {
          name: "subsystem",
          type: "System",
          source: "",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:System"][0],
          subsystem: ["system0"],
        }
      ];

      let tElementArray = helper.extractTElements(parsedSsd);
      expect(tElementArray).to.deep.equal(expectedTElements);
    });

    it("three layers: system -- components, system -- components", () => {
      let parsedSsd = {
        "?xml":{
          "@_version":"1.0",
          "@_encoding":"UTF-8"
        },
        "ssd:SystemStructureDescription":{
          "ssd:System":[ 
            { // <-- TElement
              "@_name":"system0",
              "ssd:Elements":{
                "ssd:Component":[
                  { // <-- TElement
                    "@_name":"sys_element_1",
                    "@_type":"application/x-fmu-sharedlibrary",
                    "@_source":"./sysel1.fmu",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"ding",
                          "@_kind":"output"
                        }]
                      }
                  },
                  { // <-- TElement
                    "@_name":"sys_element_2",
                    "@_type":"application/x-fmu-sharedlibrary",
                    "@_source":"./sysel2.fmu",
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"dong",
                          "@_kind":"input"
                        }]
                      }
                  }],
                "ssd:System":[ 
                  { // <-- TElement
                    "@_name":"subsystem",
                    "ssd:Elements":{
                      "ssd:Component":[
                        { // <-- TElement
                          "@_name":"sub_sys_element",
                          "@_type":"application/x-fmu-sharedlibrary",
                          "@_source":"./sysel3.fmu",
                          "ssd:Connectors":{
                            "ssd:Connector":[
                              {
                                "ssc:Real":"",
                                "@_name":"ching",
                                "@_kind":"input"
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "ssd:Connectors":{
                      "ssd:Connector":[
                        {
                          "ssc:Real":"",
                          "@_name":"globalin",
                          "@_kind":"input"
                        },
                        {
                          "ssc:Real":"",
                          "@_name":"globalout",
                          "@_kind":"output"
                        }]
                    }                  
                  }
                ]
              },
              "ssd:Connections":{
                "ssd:Connection":[
                  {
                    "@_startElement":"sys_element_1",
                    "@_startConnector":"ding",
                    "@_endElement":"sys_element_2",
                    "@_endConnector":"dong"
                  }
                ]
              }
            }
          ]
        }
      };

      let expectedTElements = [
        {
          name: "system0",
          type: "System",
          source: "",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0],
          subsystem: [],
        },
        {
          name: "sys_element_1",
          type: "Component",
          source: "./sysel1.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][0],
          subsystem: ["system0"],
        },
        {
          name: "sys_element_2",
          type: "Component",
          source: "./sysel2.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][1],
          subsystem: ["system0"],
        },
        {
          name: "subsystem",
          type: "System",
          source: "",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:System"][0],
          subsystem: ["system0"],
        },
        {
          name: "sub_sys_element",
          type: "Component",
          source: "./sysel3.fmu",
          tree: parsedSsd["ssd:SystemStructureDescription"]["ssd:System"][0]["ssd:Elements"]["ssd:System"][0]["ssd:Elements"]["ssd:Component"][0],
          subsystem: ["system0", "subsystem"],
        }
      ];

      let tElementArray = helper.extractTElements(parsedSsd);
      expect(tElementArray).to.deep.equal(expectedTElements);
    });

});

describe("extractConnectors", () => {

  it("connectors available => expect array filled with Connectors", () => {
    let treeExcerpt = {
      "@_name":"system_name",
      "ssd:Connectors":{
        "ssd:Connector":[
          {
            "ssc:Real":"",
            "@_name":"globalin",
            "@_kind":"input"
          },
          {
            "ssc:Real":"",
            "@_name":"globalout",
            "@_kind":"output"
          }
        ]
      }                  
    };

    let tElement = {
      name: "system_name",
      type: "System",
      source: "",
      tree: treeExcerpt,
      subsystem: [],
    };

    let connectors = helper.extractConnectors(tElement);

    let expectedConenctors = [
      {
        subsystem: [],
        element: "system_name",
        name: "globalin",
        kind: "input",
        type: "Real"
      },
      {
        subsystem: [],
        element: "system_name",
        name: "globalout",
        kind: "output",
        type: "Real"
      }
    ];

    expect(connectors).to.deep.equal(expectedConenctors);
  });

  it("connectors not available => expect empty array", () => {

    let tElement = {
      name: "system_name",
      type: "System",
      source: "",
      tree: {"@_name":"system_name"},
      subsystem: [],
    };

    let connectors = helper.extractConnectors(tElement);

    expect(connectors).to.deep.equal([]);
  });

});

describe("extractConnections", () => {

  it("connections available, connections only between sub components => expect all properties to be filled", () => {
    let treeExcerpt = {
      "@_name":"system_name",
      "ssd:Connections":{
        "ssd:Connection":[
          {
            "@_startElement":"component_1",
            "@_startConnector":"ding",
            "@_endElement":"component_2",
            "@_endConnector":"dong"
          },
          {
            "@_startElement":"component_2",
            "@_startConnector":"ka",
            "@_endElement":"component_1",
            "@_endConnector":"ching"
          }
        ]
      }
    };

    let tElement = {
      name: "system_name",
      type: "System",
      source: "",
      tree: treeExcerpt,
      subsystem: [],
    };

    let connections = helper.extractConnections(tElement);

    let expectedConnections = [
      {
        subsystem: ["system_name"],
        element_start: "component_1",
        name_start: "ding",
        element_end: "component_2",
        name_end: "dong"

      },
      {
        subsystem: ["system_name"],
        element_start: "component_2",
        name_start: "ka",
        element_end: "component_1",
        name_end: "ching"
      }
    ];

    expect(connections).to.deep.equal(expectedConnections);
  });

  it("connections available, connections between system and sub components => expect empty string for element attributes for systems", () => {
    let treeExcerpt = {
      "@_name":"system_name",
      "ssd:Connections":{
        "ssd:Connection":[
          {
            "@_startConnector":"ding",
            "@_endElement":"component_2",
            "@_endConnector":"dong"
          },
          {
            "@_startElement":"component_2",
            "@_startConnector":"ka",
            "@_endConnector":"ching"
          }
        ]
      }
    };

    let tElement = {
      name: "system_name",
      type: "System",
      source: "",
      tree: treeExcerpt,
      subsystem: [],
    };

    let connections = helper.extractConnections(tElement);

    let expectedConnections = [
      {
        subsystem: ["system_name"],
        element_start: "",
        name_start: "ding",
        element_end: "component_2",
        name_end: "dong"

      },
      {
        subsystem: ["system_name"],
        element_start: "component_2",
        name_start: "ka",
        element_end: "",
        name_end: "ching"
      }
    ];

    expect(connections).to.deep.equal(expectedConnections);
  });

  it("no connections available => expect empty array", () => {

    let tElement = {
      name: "system_name",
      type: "System",
      source: "",
      tree: {"@_name":"system_name"},
      subsystem: [],
    };

    let connections = helper.extractConnections(tElement);

    expect(connections).to.deep.equal([]);
  });

});