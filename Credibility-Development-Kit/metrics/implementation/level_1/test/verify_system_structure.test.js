const { describe, it } = require("mocha");
const { expect } = require("chai");
const metrics = require("..");

describe("checkSystemStructure", () => {

    describe("well-defined structure", () => {

        it("everything well-defined => expect true", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cpu_unit",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace", "computer", "mainboard"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer", "mainboard", "cpu_unit"]
                    },
                    {
                        "name": "mainboard",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace", "computer"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                    {
                        "subsystem": ["workplace", "computer"],
                        "element_start": "",
                        "name_start": "usb_1",
                        "element_end": "mainboard",
                        "name_end": "io_1"
                    },
                    {
                        "subsystem": ["workplace", "computer"],
                        "element_start": "",
                        "name_start": "usb_2",
                        "element_end": "mainboard",
                        "name_end": "io_2"
                    },
                    {
                        "subsystem": ["workplace", "computer", "mainboard"],
                        "element_start": "",
                        "name_start": "io_2",
                        "element_end": "",
                        "name_end": "io_3"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace", "computer"],
                        "element": "mainboard",
                        "name": "io_1",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace", "computer"],
                        "element": "mainboard",
                        "name": "io_2",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace", "computer"],
                        "element": "mainboard",
                        "name": "io_3",
                        "kind": "output",
                        "type": "Real"
                    },
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
            
            expect(verification.result).to.be.true;
        });

        it("select input connector that does not require connection => expect true", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    }
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "input",
                        "type": "Real"
                    }
                 ]
            };

            let notRequired = [
                {
                    "subsystem": ["workplace"],
                    "element": "computer",
                    "name": "usb_1",
                    "kind": "input",
                    "type": "Real"
                }
            ];
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure), JSON.stringify(notRequired));
    
            expect(verification.result).to.be.true;
        });

        it("example with System connector acting as input and output => expect true", () => {
            let systemStructure = {
                "elements": [{
                    "name": "dc_motor_system",
                    "type": "System",
                    "source": "",
                    "subsystem": []
                }, {
                    "name": "battery",
                    "type": "Component",
                    "source": "./res/battery.fmu",
                    "subsystem": ["dc_motor_system"]
                }, {
                    "name": "dc_motor",
                    "type": "System",
                    "source": "",
                    "subsystem": ["dc_motor_system"]
                }, {
                    "name": "electrics",
                    "type": "Component",
                    "source": "./res/dc_motor_electrics.fmu",
                    "subsystem": ["dc_motor_system", "dc_motor"]
                }, {
                    "name": "mechanics",
                    "type": "Component",
                    "source": "./res/dc_motor_mechanics.fmu",
                    "subsystem": ["dc_motor_system", "dc_motor"]
                }],
                "connectors": [{
                    "subsystem": ["dc_motor_system"],
                    "element": "battery",
                    "name": "U_bat",
                    "kind": "output",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system"],
                    "element": "dc_motor",
                    "name": "U_0",
                    "kind": "input",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system"],
                    "element": "dc_motor",
                    "name": "rot_speed",
                    "kind": "output",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "electrics",
                    "name": "U_0",
                    "kind": "input",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "electrics",
                    "name": "phi",
                    "kind": "input",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "electrics",
                    "name": "w",
                    "kind": "input",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "electrics",
                    "name": "T_el",
                    "kind": "output",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "mechanics",
                    "name": "T_mot",
                    "kind": "input",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "mechanics",
                    "name": "phi",
                    "kind": "output",
                    "type": "Real"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element": "mechanics",
                    "name": "w",
                    "kind": "output",
                    "type": "Real"
                }],
                "connections": [{
                    "subsystem": ["dc_motor_system"],
                    "element_start": "battery",
                    "name_start": "U_bat",
                    "element_end": "dc_motor",
                    "name_end": "U_0"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element_start": "electrics",
                    "name_start": "T_el",
                    "element_end": "mechanics",
                    "name_end": "T_mot"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element_start": "mechanics",
                    "name_start": "w",
                    "element_end": "electrics",
                    "name_end": "w"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element_start": "mechanics",
                    "name_start": "phi",
                    "element_end": "electrics",
                    "name_end": "phi"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element_start": "",
                    "name_start": "U_0",
                    "element_end": "electrics",
                    "name_end": "U_0"
                }, {
                    "subsystem": ["dc_motor_system", "dc_motor"],
                    "element_start": "mechanics",
                    "name_start": "w",
                    "element_end": "",
                    "name_end": "rot_speed"
                }]
            };

            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.true;
        });

    });

    describe("ill-defined elements", () => {

        it("one element name existing twice in same subsystem => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mainboard",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace", "computer"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling_1.fmu",
                        "subsystem": ["workplace", "computer"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling_2.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [ ],
                connectors: [ ]
            };

            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));

            expect(verification.result).to.be.false;
            expect(verification.log.includes("there is at least 1 element in the system with the same name")).to.be.true;
        });

        it("subsystem pedigree contains a Component => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mainboard",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace", "computer"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling_1.fmu",
                        "subsystem": ["workplace", "computer"]
                    },
                    {
                        "name": "cpu",
                        "type": "Component",
                        "source": "./res/cpu.fmu",
                        "subsystem": ["workplace", "computer", "mainboard"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer", "mainboard", "cpu"]
                    },
                ],
                connections: [ ],
                connectors: [ ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));

            expect(verification.result).to.be.false;
            expect(verification.log.includes("the following element is contained in a subsystem list, but is denoted as Component")).to.be.true;
        });

        it("connector refers to a component that is not existing => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "optical_mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "inout",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "inout",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
        });

        it("connector and connection refer to the same component that is not existing => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "optical_mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "optical_mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "inout",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "inout",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
        });

        it("connection refers to a component that is not existing => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "optical_mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "inout",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "inout",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
        });

    });

    describe("ill-defined connectors", () => {

        it("one input is not connected => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "optical_mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    }
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "input",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
            expect(verification.log.includes("The following input connector is not connected")).to.be.true;
        });
    
        it("one required connector is connected on the wrong layer => expect false", () => {
            
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "device_i_o",
                        "type": "Element",
                        "source": "./res/deviceio.fmu",
                        "subsystem": ["workplace","computer"]
                    },                    
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    }
                ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace", "computer"],
                        "element": "device_i_o",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Real"
                    }
                ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
        });
    
        it("input connectors connected twice => expect false", () => {
            
            let systemStructure = {
                elements: [ 
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    }
                ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Real"
                    }
                ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
            expect(verification.log.includes("The following input connector is connected multiple times")).to.be.true;
        });

        it("one used connector's name is not unique => expect false", () => {
            
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    }
                ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Integer"
                    }
                ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
            expect(verification.log.includes("more than 1 connector with the same name available")).to.be.true;
        });

        it("one used connector not defined => expect false", () => {
            
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_c"
                    }
                ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    }
                ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
            expect(verification.log.includes("could not identify one of the connectors")).to.be.true;
        });

        it("unknown data type => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Float"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "inout",
                        "type": "Float"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "inout",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
        });

    });

    describe("ill-defined connections", () => {

        it("data type not supported => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Float"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "input",
                        "type": "Float"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "input",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
            expect(verification.log.includes("systemStructure does not fulfill the required schema")).to.be.true;
        })

        it("data types do not match => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "cooling",
                        "type": "Component",
                        "source": "./res/cooling.fmu",
                        "subsystem": ["workplace", "computer"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "String"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "inout",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "inout",
                        "type": "Real"
                    }
                 ]
            };
    
            const verification = metrics.checkSystemStructure(JSON.stringify(systemStructure));
    
            expect(verification.result).to.be.false;
        });

        it("connection provides a not allowed connector combination => expect false", () => {
            let systemStructure = {
                elements: [
                    {
                        "name": "workplace",
                        "type": "System",
                        "source": "",
                        "subsystem": []
                    },
                    {
                        "name": "computer",
                        "type": "System",
                        "source": "",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "mouse",
                        "type": "Component",
                        "source": "./res/mouse.fmu",
                        "subsystem": ["workplace"]
                    },
                    {
                        "name": "keyboard",
                        "type": "Component",
                        "source": "./res/keyboard.fmu",
                        "subsystem": ["workplace"]
                    }
                ],
                connections: [
                    {
                        "subsystem": ["workplace"],
                        "element_start": "mouse",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_1"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element_start": "keyboard",
                        "name_start": "usb_plug",
                        "element_end": "computer",
                        "name_end": "usb_2"
                    },
                 ],
                connectors: [
                    {
                        "subsystem": ["workplace"],
                        "element": "mouse",
                        "name": "usb_plug",
                        "kind": "input",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "keyboard",
                        "name": "usb_plug",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_1",
                        "kind": "output",
                        "type": "Real"
                    },
                    {
                        "subsystem": ["workplace"],
                        "element": "computer",
                        "name": "usb_2",
                        "kind": "input",
                        "type": "Real"
                    }
                 ]
            };
        });

    });

});