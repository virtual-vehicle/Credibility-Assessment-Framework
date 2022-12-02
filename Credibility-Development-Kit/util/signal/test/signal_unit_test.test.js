const { describe, it } = require("mocha");
const { expect } = require("chai");
const { Signal, DEFAULT_TIME_UNIT, DEFAULT_VALUES_UNIT } = require("../.");

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe("Constructor tests, including constructor helper methods", () => {

    describe("using 1 argument (Signal instance)", () => {

        // TO DO: WRITE ADDITIONAL CONSTRUCTOR TEST IF 1 ARGUMENT IS GIVEN

        // Background: This constructor is required to make a deep copy of the Signal (via the copy() function in this class)

        // When using one argument in the constructur (like "let newSig = Signal(existingSignal);") the new Signal 
        // must copy all the properties of the existing Signal (name, units, time, values, history, precision).

        // Therefore we want to test the following cases:
        // - using one argument that is a Signal instance => object must be constructed
        // - using one argument that is NOT a Signal instance => object must NOT be constructed (throws error)
        // - using one argument that is a Signal instance => test if all the properties are equal (1 test for each property)

    });

    describe("using 3 arguments (time array, value array, config object)", () => {

        describe("test array arguments", () => {

            it("provide arguments correct => expect instance to be truthy", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "rotational speed"
                };
    
                expect(new Signal(timeArray, valueArray, config)).to.be.a.instanceof(Signal);
            });
    
            it("provide no arrays => expect to throw errer", () => {
                let timeArray = 0;
                let valueArray = 2;
                let config = {
                    name: "rotational speed"
                };
        
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            })
            
            it("arrays of different length => expect to throw error", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9, 19.0];
                let config = {
                    name: "rotational speed"
                };
        
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
        
            it("arrays empty => expect to throw error", () => {
                let timeArray = [];
                let valueArray = [];
                let config = {
                    name: "rotational speed"
                };
        
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
        });
    
        describe("default config values tests", () => {
            it("provide minimal config data => expect preconfigured values", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal"
                };
                
                let signal = new Signal(timeArray, valueArray, config);
                
                expect(signal.name).to.equal("test signal");
                expect(signal.units.time).to.equal(DEFAULT_TIME_UNIT);
                expect(signal.units.values).to.equal(DEFAULT_VALUES_UNIT);
                expect(signal.precision).to.equal(6);
            });
        
            it("provide all config data => expect given values", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal",
                    unit_time: "min",
                    unit_values: "km/h",
                    precision: 3
                };
                
                let signal = new Signal(timeArray, valueArray, config);
                
                expect(signal.name).to.equal("test signal");
                expect(signal.units.time).to.equal("min");
                expect(signal.units.values).to.equal("km/h");
                expect(signal.precision).to.equal(3);
            });
        });
    
        describe("#isUnitValid", () => {
            it("invented unit => expect failed instanciation", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    unit_time: "s",
                    unit_values: "rpmin",
                    precision: 3
                };
    
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
        });    
    
        describe("#isConfigValid", () => {
            it("miss out name => expect failed instanciation", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    unit_time: "s",
                    unit_values: "rad/s",
                    precision: 3
                };
    
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
    
            it("provide wrong type for unit => expect failed instanciation", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal",
                    unit_time: 0
                };
    
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
    
            it("provide float value for precision => expect failed instanciation", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal",
                    precision: 1.5
                };
    
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
        
            it("provide a too low precision value => expect failed instanciation", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal",
                    precision: 0
                };
    
                expect(() => new Signal(timeArray, valueArray, config)).to.throw();
            });
        });
    
        describe("#applyPrecision", () => {
            it("given precision higher than precision of array => Expect equality of values", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal",
                    precision: 4
                };
    
                let signal = new Signal(timeArray, valueArray, config);
                
                expect(signal.time).to.deep.equal(timeArray);
                expect(signal.values).to.deep.equal(valueArray);
            });
    
            it("given precision lower than precision of array => Expect rounded values", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal",
                    precision: 2
                };
    
                let signal = new Signal(timeArray, valueArray, config);
                
                expect(signal.time).to.deep.equal(timeArray);
                expect(signal.values).to.deep.equal([0.0, 4.7, 17]);
            });
        });
    
        describe("history initiation", () => {
            it("automatic history entry => expect history to have exactly 1 entry", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal"
                };
        
                let signal = new Signal(timeArray, valueArray, config);
        
                expect(signal.history.length).to.equal(1);
            });  
        
            it("automatic history entry => expect time and values to be a copy and not a reference", () => {
                let timeArray = [1.4, 1.5, 1.6];
                let valueArray = [0.0, 4.7, 16.9];
                let config = {
                    name: "test signal"
                };
                
                let signal = new Signal(timeArray, valueArray, config);
                signal.values = [0.0, 4.7, 17.0];
        
                expect(signal.history[0].values[2]).to.equal(16.9);
            });
        });
    });

});

describe("complexer getter methods", () => {
    describe("duration", () => {
        it("three values given => expect duration greater than 0", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
    
            expect(signal.duration).to.equal(0.2);
        });

        it("one value given => expect duration to equal 0", () => {
            let timeArray = [1.5];
            let valueArray = [4.7];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
    
            expect(signal.duration).to.equal(0);
        });
    });

    describe("time", () => {
        it("try to change value via getter => expect nothing to happen, as a copy must be returned and not a reference", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            signal.time[2] = 1.7;
            expect(signal.time[2]).to.equal(1.6);
        })
    })
});

describe("complexer setter methods", () => {
    describe("values", () => {
        it("set new values with higher precision than target precision => expect value property to be equal to rounded values", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal",
                precision: 3
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            signal.values = [0.024, 4.915, 17.97];

            expect(signal.values).to.deep.equal([0.024, 4.92, 18.0]);
        });

        it("set single value to new value => expect value to remain the same", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal",
                precision: 3
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            signal.values[2] = 17;

            expect(signal.values).to.deep.equal([0.0, 4.7, 16.9]);
        });

        it("set new values => expect another history value", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            signal.values = [0.2, 4.9, 17.5];

            expect(signal.history.length).to.equal(2);
        });
    });
});

describe("history methods", () => {
    describe("#addHistoryEntry", () => {
        it("invoke #addHistoryEntry by changing values => check correctness of history values", async () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            await sleep(20);
            signal.values = [0.0, 5.0, 17.0];

            expect(signal.history[0].step).to.equal(1);
            expect(signal.history[0].time).to.deep.equal([1.4, 1.5, 1.6]);
            expect(signal.history[0].values).to.deep.equal([0.0, 4.7, 16.9]);
            expect(signal.history[0].processing).to.equal("initialized signal");
            expect(signal.history[1].step).to.equal(2);
            expect(signal.history[1].time).to.deep.equal([1.4, 1.5, 1.6]);
            expect(signal.history[1].values).to.deep.equal([0.0, 5.0, 17.0]);
            expect(signal.history[1].processing).to.equal("manual change of values");
            expect(signal.history[1].date - signal.history[0].date).to.at.least(20);
        });       
    });

    describe("revert", () => {
        it("revert to a former step => check correctness of history values", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            signal.values = [0.0, 5.0, 17.0]; // adds history entry
            let revertedSignal = signal.revert(1);

            expect(revertedSignal.values).to.deep.equal(valueArray);
            expect(revertedSignal.history.length).to.equal(1);
            expect(signal.values).to.deep.equal([0.0, 5.0, 17.0]);
            expect(signal.history.length).to.equal(2);
        });

        it("revert to non existing step => expect to throw error", () => {
            let timeArray = [1.4, 1.5, 1.6];
            let valueArray = [0.0, 4.7, 16.9];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            signal.values = [0.0, 5.0, 17.0]; // adds history entry

            expect(() => signal.revert(3)).to.throw();
        });        
    });
});

describe("timestep getter", () => {

    describe("valid cases", () => {

        it("time steps equal => expect to return difference", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(signal.timestep).to.equal(0.1);
        });

    });

    describe("invalid cases", () => {

        it("time steps smaller than target precision => expect to throw", () => {
            let timeArray = [1.450, 1.451, 1.452, 1.453, 1.454]; // all 1.45 after applying precision
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                precision: 2
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.timestep).to.throw();
        });

        it("time steps not monotonously increasing => expect to throw", () => {
            let timeArray = [1.45, 1.46, 1.459, 1.48, 1.49];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.timestep).to.throw();
        });

        it("time steps not equal => expect to throw", () => {
            let timeArray = [1.5, 1.6, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.timestep).to.throw();
        });

        it("time length smaller than 2 => expect to throw", () => {
            let timeArray = [1.5];
            let valueArray = [4.7];
            let config = {
                name: "test signal",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.timestep).to.throw();
        })

    });

});


describe("sliceToTime methods", () => {

    describe("valid arguments", () => {

        it("provide start and end values between time values => expect sliced arrays", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToTime(1.45, 1.75);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6, 1.7]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9, 18.4]);
        });

        it("provide start and end values between time values => expect new history entry", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToTime(1.45, 1.75);

            expect(resultSignal.history.length).to.equal(2);
        });

        it("provide start and end values that matches time values exactly => expect values to be included", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToTime(1.4, 1.7);

            expect(resultSignal.time).to.deep.equal([1.4, 1.5, 1.6, 1.7]);
            expect(resultSignal.values).to.deep.equal([0.0, 4.7, 16.9, 18.4]);
        });

        it("provide start and end values that matches time values exactly, set include arguments to false => expect values to be excluded", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToTime(1.4, 1.7, false, false);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9]);
        });

        it("provide start and end values outside the time vector => expect nothing to change", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToTime(1.35, 1.85);

            expect(resultSignal.time).to.deep.equal(timeArray);
            expect(resultSignal.values).to.deep.equal(valueArray);
        });
    });

    describe("invalid arguments", () => {

        it("provide start and end values inside two samples => expect to throw error, as start would be later than end", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToTime(1.41, 1.49)).to.throw();
        });

        it("provide lower end value than first time sample => expect to throw error, as it would result in empty arrays", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToTime(1.1, 1.3)).to.throw();
        });

        it("provide higher start value than last time sample => expect to throw error, as it would result in empty arrays", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToTime(1.9, 2.1)).to.throw();
        });
               
        it("provide higher end value than start value => expect to throw error", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToTime(1.6, 1.4)).to.throw();
        });

        it("provide wrong startTime/endTime type => expect to throw error", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToTime([1.6], [1.4])).to.throw();
        });       

        it("provide wrong includeStartTime/includeEndTime types => expect to throw error", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToTime(1.5, 1.7, "true", 0)).to.throw();
        });

    });

});

describe("sliceToIndex methods", () => {

    describe("valid operations", () => {

        it("provide start and end index as indices > 0, no provision of includeXXXIdx args => expect sliced arrays", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, 4);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6, 1.7]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9, 18.4]);
        });

        it("provide start and end index as indices > 0, includeStartIdx = true, includeEndIdx = true => expect to include end index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, 4, true, true);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6, 1.7, 1.8]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9, 18.4, 19.1]);
        });

        it("provide start and end index as indices > 0, includeStartIdx = false, includeEndIdx = true => expect to exclude start index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, 4, false, true);

            expect(resultSignal.time).to.deep.equal([1.6, 1.7, 1.8]);
            expect(resultSignal.values).to.deep.equal([16.9, 18.4, 19.1]);
        });

        it("provide start and end index as indices > 0, end index > length => expect to cut until the end", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, 10);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6, 1.7, 1.8, 1.9, 2.0]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9, 18.4, 19.1, 19.4, 19.5]);
        });

        it("provide start and end index as indices < 0, no provision of includeXXXIdx args => expect to cut from end and to not include end index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-4, -2);

            expect(resultSignal.time).to.deep.equal([1.7, 1.8]);
            expect(resultSignal.values).to.deep.equal([18.4, 19.1]);
        });

        it("provide start and end index as indices < 0, includeStartIdx = true, includeEndIdx = true => expect to cut from end and to include end index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-4, -2, true, true);

            expect(resultSignal.time).to.deep.equal([1.7, 1.8, 1.9]);
            expect(resultSignal.values).to.deep.equal([18.4, 19.1, 19.4]);
        });

        it("provide start and end index as indices < 0, includeStartIdx = false, includeEndIdx = true => expect to cut from end and to not include start index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-4, -2, false, true);

            expect(resultSignal.time).to.deep.equal([1.8, 1.9]);
            expect(resultSignal.values).to.deep.equal([19.1, 19.4]);
        });

        it("provide start and end index as indices < 0, |start index| > length  => expect to cut from start", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-10, -4);

            expect(resultSignal.time).to.deep.equal([1.4, 1.5, 1.6]);
            expect(resultSignal.values).to.deep.equal([0.0, 4.7, 16.9]);
        });

        it("provide start index > 0, and end index < 0, no provision of includeXXXIdx args => expect to cut from both sides and to not include end index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, -2);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6, 1.7, 1.8]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9, 18.4, 19.1]);
        });

        it("provide start index > 0, and end index < 0, includeStartIdx = true, includeEndIdx = true => expect to cut from both sides and to include both indices", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, -2, true, true);

            expect(resultSignal.time).to.deep.equal([1.5, 1.6, 1.7, 1.8, 1.9]);
            expect(resultSignal.values).to.deep.equal([4.7, 16.9, 18.4, 19.1, 19.4]);
        });

        it("provide start index > 0, and end index < 0, includeStartIdx = true, includeEndIdx = true => expect to cut from both sides and to not include start index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(1, -2, false, true);

            expect(resultSignal.time).to.deep.equal([1.6, 1.7, 1.8, 1.9]);
            expect(resultSignal.values).to.deep.equal([16.9, 18.4, 19.1, 19.4]);
        });

        it("provide start index < 0, and end index > 0, no provision of includeXXXIdx => expect to cut from both sides and to not include end index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-4, 5);

            expect(resultSignal.time).to.deep.equal([1.7, 1.8]);
            expect(resultSignal.values).to.deep.equal([18.4, 19.1]);
        });

        it("provide start index < 0, and end index > 0, includeStartIdx = true, includeEndIdx = true => expect to cut from both sides and to include start and end index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-4, 5, true, true);

            expect(resultSignal.time).to.deep.equal([1.7, 1.8, 1.9]);
            expect(resultSignal.values).to.deep.equal([18.4, 19.1, 19.4]);
        });

        it("provide start index < 0, and end index > 0, includeStartIdx = false, includeEndIdx = true => expect to cut from both sides and to not include start index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-4, 5, false, true);

            expect(resultSignal.time).to.deep.equal([1.8, 1.9]);
            expect(resultSignal.values).to.deep.equal([19.1, 19.4]);
        });

        it("only provide start index > 0 => expect to cut until the end and to include start index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(4);

            expect(resultSignal.time).to.deep.equal([1.8, 1.9, 2.0]);
            expect(resultSignal.values).to.deep.equal([19.1, 19.4, 19.5]);
        });

        it("only provide start index < 0 => expect to cut from the end and to include start index", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(-2);

            expect(resultSignal.time).to.deep.equal([1.9, 2.0]);
            expect(resultSignal.values).to.deep.equal([19.4, 19.5]);
        });

        it("provide no arguments => expect to do nothing", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex();

            expect(resultSignal.time).to.deep.equal(timeArray);
            expect(resultSignal.values).to.deep.equal(valueArray);
            expect(resultSignal.history.length).to.equal(1);
        });
        
        it("valid operation => expect added history entry", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.sliceToIndex(2, 5);

            expect(resultSignal.history.length).to.equal(2);
        });

    });

    describe("invalid operations", () => { 

        it("provide wrong type for start index => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex([0], 2)).to.throw();
        });

        it("provide wrong type for end index => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(0, [-2])).to.throw();
        });

        it("provide wrong type includeStartIdx => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(0, 2, "false", true)).to.throw();
        });

        it("provide wrong type includeEndIdx => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(0, 2, true, 1)).to.throw();
        });

        it("provide non integer value for start index => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(0.5, 5)).to.throw();
        });

        it("provide non integer value for end index => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(0, 5.5)).to.throw();
        });

        it("start index and end index > 0, start index > end index => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(2, 0)).to.throw();
        });       

        it("start index and end index > 0, start index == end index, end index not included => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(2, 2)).to.throw();
        });

        it("start index and end index < 0, start index > end index => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(-4, -5)).to.throw();
        });

        it("start index and end index < 0, start index == end index, end index not included => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(-4, -4)).to.throw();
        });

        it("start index > 0 end index < 0, would overcut => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(4, -5)).to.throw();
        });

        it("start index > 0 end index < 0, indices match, but end index not included => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(4, -3)).to.throw();
        });

        it("start index < 0 end index > 0, would overcut => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(-5, 1)).to.throw();
        });

        it("start index < 0 end index > 0, indices match, but end index not included => expect to throw", () => {
            let timeArray = [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1, 19.4, 19.5];
            let config = {
                name: "test signal"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.sliceToIndex(-5, 2)).to.throw();
        });

    });

});

describe("unit conversion", () => {

    describe("valid arguments", () => {

        it("valid time conversion => expect conversion to be done", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s"
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.convert("time", "ms");

            expect(resultSignal.time).to.deep.equal([20, 30, 40, 50, 60]);
        });

        it("valid values conversion => expect conversion to be done", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.convert("values", "km/h");

            expect(resultSignal.values).to.deep.equal([0.0, 16.92, 60.84, 66.24, 68.76]);
        });

        it("valid values conversion => expect precision to be kept", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_values: "m/s",
                precision: 3
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.convert("values", "km/h");

            expect(resultSignal.values).to.deep.equal([0.0, 16.9, 60.8, 66.2, 68.8]);
        });

        it("valid conversion => expect units to be adapted in properties", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.convert("time", "ms");
            resultSignal = resultSignal.convert("values", "km/h");

            expect(resultSignal.units.time).to.equal("ms");
            expect(resultSignal.units.values).to.equal("km/h");
        });

        it("valid conversion => expect history entry to be added", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.convert("time", "ms");
            resultSignal = resultSignal.convert("values", "km/h");

            expect(resultSignal.history.length).to.equal(3);
        });
    });

    describe("invalid unit", () => {
        it("unknown unit => expect to throw error", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.convert("values", "lightspeedUnit")).to.throw();
        });

        it("unit base different => expect to throw error", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.convert("values", "kg/s")).to.throw();
        });
    });

    describe("invalid identifiers", () => {
        it("arrayIdentifier has invalid type => expect to throw error", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.convert(0, "km/h")).to.throw();
        });

        it("arrayIdentifier has not allowed value => expect to throw error", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.convert("vals", "km/h")).to.throw();
        });
    });
});

describe("add", () => {
    describe("valid operations", () => {
        it("valid signal + signal => expect element-wise addition", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.11, 0.12, 0.13, 0.14];
            let valueArray2 = [1.0, 2.0, 3.5, 1.7, 1.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult = signal1.add(signal2);

            expect(signalResult.time).to.deep.equal(timeArray1);
            expect(signalResult.values).to.deep.equal([1.0, 6.7, 20.4, 20.1, 20.1]);
        });

        it("valid signal + signal => expect input signals to remain untouched", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.11, 0.12, 0.13, 0.14];
            let valueArray2 = [1.0, 2.0, 3.5, 1.7, 1.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult = signal1.add(signal2);

            expect(signal1.values).to.deep.equal(valueArray1);
            expect(signal2.values).to.deep.equal(valueArray2);
        });

        it("valid signal + number => expect added offset with given precision", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let signalResult = signal.add(-0.5004);

            expect(signalResult.time).to.deep.equal(timeArray);
            expect(signalResult.values).to.deep.equal([-0.5, 4.2, 16.4, 17.9, 18.6]);
        });

        it("adding two signals => expect rounding to precision of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [2.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };

            let timeArray2 = [0.10, 0.11, 0.12, 0.13, 0.14];
            let valueArray2 = [1.014, 2.045, 3.578, 1.741, 1.003];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
                precision: 4
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult = signal1.add(signal2);

            expect(signalResult.values).to.deep.equal([3.01, 6.75, 20.5, 20.1, 20.1]);
        });

        it("adding offset => expect adding and AFTER adding rounding to precision of this instance", () => {
            let timeArray = [0.02, 0.03];
            let valueArray = [2.00, 0.001e-3];
            let config = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };

    
            let signal = new Signal(timeArray, valueArray, config);

            let signalResult = signal.add(4.999e-3);

            expect(signalResult.values).to.deep.equal([2.00, 5.00e-3]); // rounding before would result in [2.005, 5.001e-3]
        });

        it("valid argument => expect added history entry", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let signalResult = signal.add(-0.5);

            expect(signalResult.history.length).to.equal(2);
        });

        it("adding two signals with different value units => expect to use unit of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };

            let timeArray2 = [0.10, 0.11, 0.12, 0.13, 0.14];
            let valueArray2 = [105, 410, -690, -200, 0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "cm",
                precision: 3
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult = signal1.add(signal2);

            expect(signalResult.values).to.deep.equal([1.05, 8.80, 10.0, 16.4, 19.1]);
        });

        it("adding two signals with different time units => expect to use unit of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };

            let timeArray2 = [100, 110, 120, 130, 140];
            let valueArray2 = [0.105, 4.1, -6.9, -2.0, 0.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "ms",
                unit_values: "m",
                precision: 3
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult =  signal1.add(signal2);

            expect(signalResult.time).to.deep.equal(timeArray1);
            expect(signalResult.values).to.deep.equal([0.105, 8.80, 10.0, 16.4, 19.1]);
        });

        it("first signal has higher sample rate => expect to scale up sample rate of second signal", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.14]; // after interpolation it should equal [0.10, 0.11, 0.12, 0.13, 0.14]
            let valueArray2 = [1.0, 2.2]; // after interpolatoin it should equal  [1.0,  1.3,  1.6,  1.9,  2.2]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult = signal1.add(signal2);

            expect(signalResult.time).to.deep.equal(timeArray1);
            expect(signalResult.values).to.deep.equal([1.0, 6.0, 18.5, 20.3, 21.3]);
        });        

        it("first signal has lower sample rate => expect to scale down sample rate of second signal", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.00, 0.05, 0.10, 0.15, 0.20]; // after interpolation it should equal [0.0, 0.1, 0.2]
            let valueArray2 = [1.0, 1.54, 2.41, 3.50, 6.70]; // after interpolatoin it should equal  [1.0, 2.41, 6.70]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let signalResult = signal1.add(signal2);

            expect(signalResult.time).to.deep.equal(timeArray1);
            expect(signalResult.values).to.deep.equal([1.0, 10.31, 25.8]);
        });   
    });

    describe("invalid operations", () => {
        it("invalid argument type => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.add([0.5, -1.0, 1.0, 2.0, -0.5])).to.throw();
        });

        it("signal length different => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray2 = [1.0, 1.54, 2.41, 3.50, 6.70];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.add(signal2)).to.throw();
        });

        it("units of values have different physical base => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2, 0.3];
            let valueArray2 = [1.0, 1.54, 2.41];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.add(signal2)).to.throw();
        });

        it("units of time have different physical base => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2, 0.3];
            let valueArray2 = [1.0, 1.54, 2.41];
            let config2 = {
                name: "test signal 2",
                unit_time: "ms",
                unit_values: "m",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.add(signal2)).to.throw();
        });

        it("different duration => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.15, 0.20, 0.25];
            let valueArray2 = [1.0, 1.54, 2.41, 3.50];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };            
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.add(signal2)).to.throw();
        });
    });
});

describe("interpolate", () => {
    describe("valid operations", () => {
        it("provide valid target vector with matching boundaries and constant sample rate => expect linear interpolation", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };

            let targetTime = [0.10, 0.15, 0.20, 0.25, 0.30];
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.interpolate(targetTime);

            expect(resultSignal.time).to.deep.equal(targetTime);
            expect(resultSignal.values).to.deep.equal([0.0, 3.95, 7.9, 13.5, 19.1]);
        });

        it("provide valid target vector with boundaries inside and constant sample rate => expect linear interpolation", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };

            let targetTime = [0.15, 0.20, 0.25];
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.interpolate(targetTime);

            expect(resultSignal.time).to.deep.equal(targetTime);
            expect(resultSignal.values).to.deep.equal([3.95, 7.9, 13.5]);
        });

        it("provide valid target vector with boundaries inside and differentiating sample rate => expect linear interpolation", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };

            let targetTime = [0.19, 0.21, 0.22];
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.interpolate(targetTime);

            expect(resultSignal.time).to.deep.equal(targetTime);
            expect(resultSignal.values).to.deep.equal([7.11, 9.02, 10.14]);
        });

        it("provide valid arguments => expect to round to given precision", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };

            let targetTime = [0.19, 0.21, 0.22];
    
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.interpolate(targetTime);

            expect(resultSignal.time).to.deep.equal(targetTime);
            expect(resultSignal.values).to.deep.equal([7.11, 9.02, 10.1]);
        });
    });

    describe("invalid operations", () => {

        it("provide other type than array => expect to throw", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
        
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.interpolate(0.15)).to.throw();
        });

        it("provide empty array => expect to throw", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
        
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.interpolate([])).to.throw();
        });

        it("first time sample is smaller than existing first time sample => expect to throw", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let targetTime = [0.05, 0.10, 0.15];

            expect(() => signal.interpolate(targetTime)).to.throw();
        });

        it("last time sample is larger than existing last time sample => expect to throw", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let targetTime = [0.45, 0.50, 0.55];

            expect(() => signal.interpolate(targetTime)).to.throw();
        });

        it("target time array not monotonously increasing => expect to throw", () => {
            let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let targetTime = [0.15, 0.20, 0.175, 0.25];

            expect(() => signal.interpolate(targetTime)).to.throw();
        });

        it("existing time vector contains only one sample => expect to throw", () => {
            let timeArray = [0.2];
            let valueArray = [7.9];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let targetTime = [0.19, 0.21];

            expect(() => signal.interpolate(targetTime)).to.throw();
        });          
    });
});

describe("value", () => {

    let timeArray = [0.1, 0.2, 0.3, 0.4, 0.5];
    let valueArray = [0.0, 7.9, 19.1, 14.4, 15.1];
    let config = {
        name: "test signal",
        unit_time: "s",
        unit_values: "m/s",
        precision: 4
    };

    var signal = new Signal(timeArray, valueArray, config);

    describe('valid inputs', () => {

        it('valid input, time matches exactly => expect exact value', () => {
            let value = signal.value(0.3);
            
            expect(value).to.equal(19.1);        
        });

        it('valid input, interpolation required => expect interpolated value', () => {
            let value = signal.value(0.25);
            
            expect(value).to.equal(13.5);        
        });
        
    });

    describe('invalid inputs', () => {

        it('argument is not given as number => expect to throw', () => {     
            expect(() => signal.value([0.3])).to.throw()        
        });

        it('target time smaller than first time sample => expect to throw', () => {     
            expect(() => signal.value(0.09)).to.throw()        
        });

        it('target time greater than last time sample => expect to throw', () => {     
            expect(() => signal.value(0.51)).to.throw()        
        });
        
    });

});

describe("multiply", () => {
    
    describe("valid operations", () => {

        it("multiply with plain number => expect to multiply each value with number", () => {
            let timeArray = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s^2",
                precision: 3
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.multiply(2.0);

            expect(resultSignal.values).to.deep.equal([-4.8, 0.8, 11.2, 13.8, 14.4]);
        });

        it("multiply with signal => expect to multiply element-wise", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "N",
                precision: 3
            };
        
            let signal1 = new Signal(timeArray1, valueArray1, config1);

            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [1.0, 1.0, 2.0, 2.0, 2.0];
            let config2 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };
        
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.values).to.deep.equal([-2.4, 0.4, 11.2, 13.8, 14.4]);
        });

        it("multiply with signal => expect to keep precision of first signal", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "N",
                precision: 2
            };
        
            let signal1 = new Signal(timeArray1, valueArray1, config1);

            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [1.55, 1.0, 1.0, 3.76, 1.0];
            let config2 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };
        
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.values).to.deep.equal([-3.7, 0.4, 5.6, 26, 7.2]);
        });

        it("multiply with plain number. Unit not given => expect to keep unit", () => {
            let timeArray = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s^2",
                precision: 2
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.multiply(2.0);

            expect(resultSignal.units.values).to.equal("m/s^2");
        });

        it("multiply with plain number. Unit given => expect to refresh unit", () => {
            let timeArray = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s^2",
                precision: 2
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.multiply(2.0, "s");

            expect(resultSignal.units.values).to.equal("(m s) / s^2");
        });

        it("multiply with signal => expect to refresh value units", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "N",
                precision: 3
            };
        
            let signal1 = new Signal(timeArray1, valueArray1, config1);

            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [1.55, 1.0, 1.0, 3.76, 1.0];
            let config2 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };
        
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.units.values).to.equal("N m");
        });

        it("multiply with unitless signal => expect to keep unit", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "N",
                precision: 3
            };
        
            let signal1 = new Signal(timeArray1, valueArray1, config1);

            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [-1, -1, -1, 0, 0];
            let config2 = {
                name: "test signal",
                unit_time: "s",
                precision: 1
            };
        
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.units.values).to.equal("N");
        });

        it("valid argument => expect added history entry", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.multiply(-0.5);

            expect(resultSignal.history.length).to.equal(2);
        });

        it("multiply two signals with different time units => expect to use unit of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                precision: 3
            };

            let timeArray2 = [100, 110, 120, 130, 140];
            let valueArray2 = [1, 1, 1, -1, -1];
            let config2 = {
                name: "test signal 2",
                unit_time: "ms",
                precision: 3
            };
            
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
        });

        it("first signal has higher sample rate => expect to scale up sample rate of second signal", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 5.0, 10.0, 10.0, 10.0];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.14]; // after interpolation it should equal [0.10, 0.11, 0.12, 0.13, 0.14]
            let valueArray2 = [0.0, 10.0]; // after interpolatoin it should equal [0.0,  2.5,  5.0,  7.5,  10.0]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([0.0, 12.5, 50.0, 75.0, 100.0]);
        });        

        it("first signal has lower sample rate => expect to scale down sample rate of second signal", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 2.0, 4.0];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
            };

            let timeArray2 = [0.00, 0.05, 0.10, 0.15, 0.20]; // after interpolation it should equal [0.0, 0.1, 0.2]
            let valueArray2 = [0.0, 2.5, 5.0, 7.5, 10.0]; // after interpolatoin it should equal  [0.0, 5.0, 10.0]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.multiply(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([0.0, 10.0, 40.0]);
        });
    });

    describe("invalid operations", () => {
        it("invalid multipliable argument type => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
            
            let signal = new Signal(timeArray, valueArray, config);
            
            expect(() => signal.multiply([0.5, -1.0, 1.0, 2.0, -0.5])).to.throw();
        });

        it("invalid unit argument type => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.multiply(2.0, ["s"])).to.throw();
        }); 

        it("signal length different => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2];
            let valueArray2 = [1.0, 0.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.multiply(signal2)).to.throw();
        });

        it("divide signal with different duration => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s"
            };

            let timeArray2 = [0.10, 0.15, 0.20];
            let valueArray2 = [1.0, 1.0, -1.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s"
            };            
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.multiply(signal2)).to.throw();
        });
    });
});

describe("divide", () => {
    
    describe("valid operations", () => {

        it("divide by plain number => expect to divide each value by number", () => {
            let timeArray = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray = [-2.4, 0.4, 5.6, 7.0, 7.2];
            let config = {
                name: "test signal",
                unit_time: "s",
                precision: 2
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.divide(2);

            expect(resultSignal.values).to.deep.equal([-1.2, 0.2, 2.8, 3.5, 3.6]);
        });

        it("divide by signal => expect to divide element-wise", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [-2.4, 0.4, 5.6, 1.5, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s^2",
                precision: 2
            };
            
            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [1, 2, -2, -0.5, -1];
            let config2 = {
                name: "test signal",
                unit_time: "s",
                precision: 1
            };

            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.values).to.deep.equal([-2.4, 0.2, -2.8, -3.0, -7.2]);
        });

        it("divide by plain number with given unit => expect to refresh unit", () => {
            let timeArray = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "N",
                precision: 2
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.divide(2, "m^2");

            expect(resultSignal.units.values).to.equal("N / m^2");
        });

        it("divide by signal with given unit => expect to refresh unit", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [7.4, 4.5, 5.6, 1.5, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "l",
                precision: 2
            };
            
            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [1, 2, 2, 0.5, 1];
            let config2 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m^2",
                precision: 1
            };

            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.units.values).to.equal("l / m^2");
        });

        it("divide by signal without unit => expect to keep unit", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [7.4, 4.5, 5.6, 1.5, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "km/h",
                precision: 2
            };
            
            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [1.53, 2.11, 2.11, 0.5, 1.9];
            let config2 = {
                name: "test signal",
                unit_time: "s",
            };

            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.units.values).to.equal("km/h");
        });

        it("valid division by number => expect to keep precision", () => {
            let timeArray = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray = [-2.4, 0.4, 5.6, 6.9, 7.2];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "km/h",
                precision: 2
            };
        
            let signal = new Signal(timeArray, valueArray, config);
            let resultSignal = signal.divide(3.6);

            expect(resultSignal.values).to.deep.equal([-0.67, 0.11, 1.6, 1.9, 2.0]);
        });

        it("valid division by signal => expect to keep precision", () => {
            let timeArray1 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray1 = [7.4, 4.5, 5.6, 1.5, 7.2];
            let config1 = {
                name: "test signal",
                unit_time: "s",
                unit_values: "km/h",
                precision: 2
            };
            
            let timeArray2 = [0.0, 0.1, 0.2, 0.3, 0.4];
            let valueArray2 = [3, 2.5, 1.3, 2.0, 1.0];
            let config2 = {
                name: "test signal",
                unit_time: "s",
            };

            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.values).to.deep.equal([2.5, 1.8, 4.3, 0.75, 7.2]);
        });

        it("divide two signals with different time units => expect to use unit of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                precision: 3
            };

            let timeArray2 = [100, 110, 120, 130, 140];
            let valueArray2 = [1, 1, 1, -1, -1];
            let config2 = {
                name: "test signal 2",
                unit_time: "ms",
                precision: 3
            };
            
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
        });

        it("first signal has higher sample rate => expect to scale up sample rate of second signal", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 5.0, 10.0, 10.0, 10.0];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };

            let timeArray2 = [0.10, 0.14]; // after interpolation it should equal [0.10, 0.11, 0.12, 0.13, 0.14]
            let valueArray2 = [10, 20]; // after interpolatoin it should equal [10,  12.5,  15,  17.5,  20]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([0.0, 0.4, 0.667, 0.571, 0.5]);
        });        

        it("first signal has lower sample rate => expect to scale down sample rate of second signal", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 30.0, 80.0];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
            };

            let timeArray2 = [0.00, 0.05, 0.10, 0.15, 0.20]; // after interpolation it should equal [0.0, 0.1, 0.2]
            let valueArray2 = [10, 12.5, 15.0, 17.5, 20.0]; // after interpolatoin it should equal  [10.0, 15.0, 20.0]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.divide(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([0.0, 2.0, 4.0]);
        });

    });

    describe("invalid operations", () => {
        it("invalid dividable argument type => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.divide([0.5, -1.0, 1.0, 2.0, -0.5])).to.throw();
        });

        it("invalid unit argument type => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.divide(2.0, ["s"])).to.throw();
        });

        it("divide by 0 => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.divide(0)).to.throw();
        });

        it("divide by signal that contains a 0 => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 2.0, 4.0];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
            };

            let timeArray2 = [0.00, 0.10, 0.20]; 
            let valueArray2 = [1.0, 0.0, -1.0]; 
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };
            
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.divide(signal2)).to.throw();
        });

        it("signal length different => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2];
            let valueArray2 = [1.0, 0.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.divide(signal2)).to.throw();
        });

        it("multiplying two signals with different duration => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.15, 0.20];
            let valueArray2 = [1.0, 1.0, -1.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
            };            
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.divide(signal2)).to.throw();
        });

    });

});

describe("subtract", () => {

    describe("valid operations", () => {

        it("valid signal - signal => expect element-wise subtraction", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.11, 0.12, 0.13, 0.14];
            let valueArray2 = [1.0, 2.0, 3.5, 1.7, 1.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.subtract(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([-1.0, 2.7, 13.4, 16.7, 18.1]);
        });

        it("valid signal - number => expect subtracted offset with given precision", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.subtract(0.5004);

            expect(resultSignal.time).to.deep.equal(timeArray);
            expect(resultSignal.values).to.deep.equal([-0.5, 4.2, 16.4, 17.9, 18.6]);
        });

        it("subtracting two signals => expect rounding to precision of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04];
            let valueArray1 = [2.0, 4.7, 16.9];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };

            let timeArray2 = [0.10, 0.11, 0.12];
            let valueArray2 = [1.014, 2.045, 3.578];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
                precision: 4
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.subtract(signal2);

            expect(resultSignal.values).to.deep.equal([0.986, 2.66, 13.3]);
        });

        it("subtract offset => expect subtraction and AFTER subtraction rounding to precision of this instance", () => {
            let timeArray = [0.02, 0.03];
            let valueArray = [2.00, 0.001e-3];
            let config = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
                precision: 3
            };

    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.subtract(4.999e-3);

            expect(resultSignal.values).to.deep.equal([2.00, -5.0e-3]); // rounding before would result in [1.995, -4.999e-3]
        });

        it("valid argument => expect added history entry", () => {
            let timeArray = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            let resultSignal = signal.subtract(-0.5);

            expect(resultSignal.history.length).to.equal(2);
        });

        it("subtract signal with different value units => expect to use unit of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };

            let timeArray2 = [0.10, 0.11, 0.12, 0.13, 0.14];
            let valueArray2 = [105, 410, -690, -200, 0];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "cm",
                precision: 3
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.subtract(signal2);

            expect(resultSignal.values).to.deep.equal([-1.05, 0.60, 23.8, 20.4, 19.1]);
        });

        it("subtracting two signals with different time units => expect to use unit of this instance", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m",
                precision: 3
            };

            let timeArray2 = [100, 110, 120, 130, 140];
            let valueArray2 = [0.105, 4.1, 6.9, 2.0, 0.0];
            let config2 = {
                name: "test signal 2",
                unit_time: "ms",
                unit_values: "m",
                precision: 3
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.subtract(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([-0.105, 0.60, 10.0, 16.4, 19.1]);
        });

        it("first signal has higher sample rate => expect to scale up sample rate of second signal", () => {
            let timeArray1 = [0.02, 0.03, 0.04, 0.05, 0.06];
            let valueArray1 = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.14]; // after interpolation it should equal [0.10, 0.11, 0.12, 0.13, 0.14]
            let valueArray2 = [1.0, 2.2]; // after interpolatoin it should equal  [1.0,  1.3,  1.6,  1.9,  2.2]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.subtract(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([-1.0, 3.4, 15.3, 16.5, 16.9]);
        });        

        it("first signal has lower sample rate => expect to scale down sample rate of second signal", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.00, 0.05, 0.10, 0.15, 0.20]; // after interpolation it should equal [0.0, 0.1, 0.2]
            let valueArray2 = [1.0, 1.54, 2.41, 3.50, 6.70]; // after interpolatoin it should equal  [1.0, 2.41, 6.70]
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            let resultSignal = signal1.subtract(signal2);

            expect(resultSignal.time).to.deep.equal(timeArray1);
            expect(resultSignal.values).to.deep.equal([-1.0, 5.49, 12.4]);
        });   
    });

    describe("invalid operations", () => {
        it("invalid argument type => except to throw", () => {
            let timeArray = [0.020, 0.030, 0.040, 0.050, 0.060];
            let valueArray = [0.0, 4.7, 16.9, 18.4, 19.1];
            let config = {
                name: "test signal",
                unit_time: "s",
                unit_values: "m/s",
            };
    
            let signal = new Signal(timeArray, valueArray, config);

            expect(() => signal.subtract([0.5, -1.0, 1.0, 2.0, -0.5])).to.throw();
        });

        it("signal length different => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2, 0.3, 0.4, 0.5];
            let valueArray2 = [1.0, 1.54, 2.41, 3.50, 6.70];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };

    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.subtract(signal2)).to.throw();
        });

        it("units of values have different physical base => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2, 0.3];
            let valueArray2 = [1.0, 1.54, 2.41];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.subtract(signal2)).to.throw();
        });

        it("units of time have different physical base => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.1, 0.2, 0.3];
            let valueArray2 = [1.0, 1.54, 2.41];
            let config2 = {
                name: "test signal 2",
                unit_time: "ms",
                unit_values: "m",
            };
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.subtract(signal2)).to.throw();
        });

        it("different duration => except to throw", () => {
            let timeArray1 = [0.1, 0.2, 0.3];
            let valueArray1 = [0.0, 7.9, 19.1];
            let config1 = {
                name: "test signal 1",
                unit_time: "s",
                unit_values: "m/s",
            };

            let timeArray2 = [0.10, 0.15, 0.20, 0.25];
            let valueArray2 = [1.0, 1.54, 2.41, 3.50];
            let config2 = {
                name: "test signal 2",
                unit_time: "s",
                unit_values: "m/s",
            };            
    
            let signal1 = new Signal(timeArray1, valueArray1, config1);
            let signal2 = new Signal(timeArray2, valueArray2, config2);

            expect(() => signal1.subtract(signal2)).to.throw();
        });

    });

});

describe("compare", () => {

    describe("arguments", () => {

        describe("invalid inputs for operators", () => {

            it("don't provide string => expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare(["<",">"], 10.0)).to.throw();
            });

            it("provide other than allowed operators => expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("~", 10.0)).to.throw();
            });

        });

        describe("invalid inputs for reference", () => {

            it("provide string => expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("==", "10.0")).to.throw();
            });

            it("provide array => expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("==", [10, 12, 13, 15])).to.throw();
            });

        });

        describe("default values for options", () => {

            it("comparison => defaults to absolute", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 10.0, {tolerance: 1.0});

                expect(result.values).to.deep.equal([1, 1, 0, 0]) // [1, 1, 1, 1] on relative comparison
            });

            it("threshold => defaults to 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [9, 10, 11, 12];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("!=", 10.0);

                expect(result.values).to.deep.equal([1, 0, 1, 1])
            });

            it("tolerance => defaults to 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [9, 10, 11, 12];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 10.0);

                expect(result.values).to.deep.equal([0, 1, 0, 0])
            });

            it("unit => defaults to same as signal", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [9, 10, 11, 12];
                let config = { 
                    name: "test signal",
                    unit_values: "m^3/s"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare("<", 10.0)).to.not.throw();
            });
            
            it("number precision => defaults to same as signal", () => {
                let timeArray = [0.0, 0.01, 0.02];
                let valueArray = [1100, 1100, 1200];
                let config = { 
                    name: "test signal",
                    precision: 2
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 1000, {tolerance: 99.5}); // tolerance becomes 10e+1

                expect(result.values).to.deep.equal([1, 1, 0]) // abs(diff)_prec2 = [10e+1, 10e+1, 20e+1]
            });

            it("reduce => defaults to false", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [9, 10, 11, 12];
                let config = { 
                    name: "test signal",
                    unit_values: "m^3/s"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 10);

                expect(result).to.be.an.instanceof(Signal);
            });

        });

        describe("invalid inputs for options", () => {

            it("comparison => expects a string", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("==", 10.0, {comparison: 0})).to.throw();
            });

            it("comparison => expects either absolute or relative", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("==", 10.0, {comparison: "abs"})).to.throw();
            });

            it("threshold => expects a number", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("!=", 10.0, {threshold: "1.0"})).to.throw();
            });

            it("threshold => must be greater or equal to 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("!=", 10.0, {threshold: -0.5})).to.throw();
            });

            it("tolerance => expects a number", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("!=", 10.0, {tolerance: "1.0"})).to.throw();
            });

            it("tolerance => must be greater or equal to 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("!=", 10.0, {tolerance: -0.5})).to.throw();
            });

            it("unit => must be a string", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("<", 10.0, {unit: -1})).to.throw();
            });

            it("unit => must be a valid unit", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("<", 10.0, {unit: "megabytes_per_seconds"})).to.throw();
            });

            it("precision => must be a number", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("<", 10.0, {precision: "3"})).to.throw();
            });

            it("precision => must be an integer", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("<", 10.0, {precision: 1.5})).to.throw();
            });

            it("precision => must be greater than 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("<", 10.0, {precision: -1})).to.throw();
            });

            it("precision => must be a boolean value", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10, 11, 12, 13];
                let config = { name: "test signal" };

                let signal = new Signal(timeArray, valueArray, config);


                expect(() => signal.compare("<", 10.0, {reduce: 1})).to.throw();
            });

        });

    });

    describe("basic comparison to number, absolute", () => {

        describe("basic comparison, no threshold/tolerance", () => {

            it("signal < number, absolute, no threshold/tolerance => expect val - ref < 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", 103.0);

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });

            it("signal <= number, absolute, no threshold/tolerance => expect val - ref <= 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 103.0);

                expect(result.values).to.deep.equal([0, 1, 1, 1])
            });
                        
            it("signal > number, absolute, no threshold/tolerance => expect val - ref > 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">", 103.0);

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal >= number, absolute, no threshold/tolerance => expect val - ref >= 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 103.0);

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            }); 

            it("signal != number, absolute, no threshold/tolerance => expect val - ref != 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [101.5, 100.0, 99.9, 99.2];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("!=", 100.0);

                expect(result.values).to.deep.equal([1, 0, 1, 1])
            });

            it("signal == number, absolute, no threshold/tolerance => expect val - ref == 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("==", 103.0);

                expect(result.values).to.deep.equal([0, 1, 0, 0])
            });

        });

        describe("basic comparison, absolute, threshold given", () => {

            it("signal < number, absolute, threshold => expect val - ref < -threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 101.0, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", 103.0, {threshold: 2.0}); // -> val < 101.0

                expect(result.values).to.deep.equal([0, 0, 0, 1])
            });

            it("signal <= number, absolute, threshold => expect val - ref <= -threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 101.0, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 103.0, {threshold: 2.0}); // -> val <= 101.0

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });

            it("signal > number, absolute, threshold => expect val - ref > threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.5, 105.0, 104.9, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">", 103.0, {threshold: 2.0}); // -> val > 105.0

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal >= number, absolute, threshold => expect val - ref >= 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.5, 105.0, 104.9, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 103.0, {threshold: 2.0}); // -> val >= 105.0

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            });
            
            it("signal != number, absolute, threshold => expect |val - ref| > threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.1, 105.0, 104.9, 101.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("!=", 103.0, {threshold: 2.0}); // -> |val - 103| > 2.0

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal == number, absolute, threshold => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.0, 104.9, 101.1, 101.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare("==", 103.0, {threshold: 2.0})).to.throw();
            });

        });

        describe("basic comparison, absolute, tolerance given", () => {

            it("signal < number, absolute, tolerance => expect val - ref < tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.1, 105.0, 104.9, 100.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", 103.0, {tolerance: 2.0}); // -> val < 105.0

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });

            it("signal <= number, absolute, tolerance => expect val - ref <= tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.1, 105.0, 104.9, 100.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 103.0, {tolerance: 2.0}); // -> val <= 105.0

                expect(result.values).to.deep.equal([0, 1, 1, 1])
            });

            it("signal > number, absolute, tolerance => expect val - ref > -tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [101.2, 101.1, 101.0, 100.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">", 103.0, {tolerance: 2.0}); // -> val > 101.0

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            });

            it("signal >= number, absolute, tolerance => expect val - ref >= -tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [101.2, 101.1, 101.0, 100.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 103.0, {tolerance: 2.0}); // -> val >= 101.0

                expect(result.values).to.deep.equal([1, 1, 1, 0])
            });

            it("signal != number, absolute, tolerance => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [101.2, 101.1, 101.0, 100.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare("!=", 103.0, {tolerance: 2.0})).to.throw()
            });

            it("signal == number, absolute, tolerance => expect |val - ref| <= tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.1, 105.0, 101.0, 100.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("==", 103.0, {tolerance: 2.0}); // -> |val - 103.0| <= 2.0

                expect(result.values).to.deep.equal([0, 1, 1, 0])
            });

        });

        describe("comparison, reduced to one value", () => {

            it("signal < number, absolute, reduced => expect false", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.0, 102.1, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", 103.0, {reduce: true});

                expect(result).to.equal(false)
            });

            it("signal >= number, absolute, reduced => expect true", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.0, 102.1, 100.8, 100.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 100.0, {reduce: true});

                expect(result).to.equal(true)
            });
            
        });

    });

    describe("basic, relative comparison", () => {
        
        describe("basic relative comparison, no threshold/tolerance", () => {
            
            it("signal < number, relative, no threshold/tolerance => expect same as absolute: val - ref < 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", 103.0, {comparison: "relative"});

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });

            it("signal <= number, relative, no threshold/tolerance => expect same as absolute: val - ref <= 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 103.0, {comparison: "relative"});

                expect(result.values).to.deep.equal([0, 1, 1, 1])
            });
                        
            it("signal > number, relative, no threshold/tolerance => expect same as absolute: val - ref > 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">", 103.0, {comparison: "relative"});

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal >= number, relative, no threshold/tolerance => expect same as absolute: val - ref >= 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 103.0, {comparison: "relative"});

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            }); 

            it("signal != number, relative, no threshold/tolerance => expect same as absolute: val - ref != 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [101.5, 100.0, 99.9, 99.2];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("!=", 100.0, {comparison: "relative"});

                expect(result.values).to.deep.equal([1, 0, 1, 1])
            });

            it("signal == number, relative, no threshold/tolerance => expect same as absolute: val - ref == 0", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("==", 103.0, {comparison: "relative"});

                expect(result.values).to.deep.equal([0, 1, 0, 0])
            });

            it("reference is zero, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02];
                let valueArray = [3.1, 2.7, 0.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare("==", 0, {comparison: "relative"})).to.throw();
            });

        });

        describe("basic comparison, relative, threshold given", () => {

            it("signal < number, relative, threshold => expect (val - ref) / |ref| < -threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-10.6, -10.5, -10.4, -10.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", -10.0, {comparison: "relative", threshold: 0.05}); // -> (val + 10.0) / 10.0 < -0.05

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal <= number, relative, threshold => expect (val - ref) / |ref| <= -threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10.0, 9.6, 9.5, 9.4];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 10.0, {comparison: "relative", threshold: 0.05}); // -> (val - 10.0) / 10.0 <= -0.05

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });

            it("signal > number, relative, threshold => expect (val - ref) / |ref| > threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [100.0, 104.9, 105.0, 105.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">", 100.0, {comparison: "relative", threshold: 0.05}); // -> (val - 100.0) / 100.0 > 0.05

                expect(result.values).to.deep.equal([0, 0, 0, 1])
            });

            it("signal >= number, relative, threshold => expect (val - ref) / |ref| >= threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-100.0, -95.1, -95.0, -94.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", -100.0, {comparison: "relative", threshold: 0.05}); // -> (val + 100.0) / 100.0 >= 0.05

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });
            
            it("signal != number, relative, threshold, element-wise => expect |val - ref| / |ref| > threshold", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-105.1, -105.0, -95.0, -94.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("!=", -100.0, {comparison: "relative", threshold: 0.05}); // -> |val + 100.0| / 100.0 > threshold

                expect(result.values).to.deep.equal([1, 0, 0, 1])
            });

            it("signal == number, relative, threshold, element-wise => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.0, 104.9, 101.1, 101.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare("==", 103.0, {comparison: "relative", threshold: 0.05})).to.throw();
            });
            
        });

        describe("basic comparison, relative, tolerance given", () => {

            it("signal < number, relative, threshold => expect (val - ref) / |ref| < tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<", -10.0, {comparison: "relative", tolerance: 0.05}); // -> (val + 10.0) / 10.0 < 0.05

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal <= number, relative, threshold => expect (val - ref) / |ref| <= tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10.4, 10.5, 10.6, 10.7];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("<=", 10.0, {comparison: "relative", tolerance: 0.05}); // -> (val - 10.0) / 10.0 <= 0.05

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            });

            it("signal > number, relative, tolerance => expect (val - ref) / |ref| > -tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [94.9, 95.0, 95.1, 95.2];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">", 100.0, {comparison: "relative", tolerance: 0.05}); // -> (val - 100.0) / 100.0 > -0.05

                expect(result.values).to.deep.equal([0, 0, 1, 1])
            });

            it("signal >= number, relative, tolerance => expect (val - ref) / |ref| > -tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [94.9, 95.0, 95.1, 95.2];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 100.0, {comparison: "relative", tolerance: 0.05}); // -> (val - 100.0) / 100.0 >= -0.05

                expect(result.values).to.deep.equal([0, 1, 1, 1])
            });
            
            it("signal != number, relative, tolerance => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [105.1, 105.0, 95.0, 94.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare("!=", 100.0, {comparison: "relative", tolerance: 0.05})).to.throw();
            });

            it("signal == number, relative, tolerance => expect |val - ref| / |ref| <= tolerance", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-105.1, -105.0, -95.0, -94.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("==", -100.0, {comparison: "relative", tolerance: 0.05}); // -> (val + 100.0) / 100.0 <= 0.05

                expect(result.values).to.deep.equal([0, 1, 1, 0])
            });
            
        });

        describe("basic comparison, tolerance and threshold given", () => {

            it("signal < number, threshold and tolerance given => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("<", -10.0, {comparison: "relative", tolerance: 0.05, threshold: 0.04})).to.throw();
            });

            it("signal <= number, threshold and tolerance given => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("<=", -10.0, {tolerance: 0.05, threshold: 0.04})).to.throw();
            });

            it("signal > number, threshold and tolerance given => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare(">", -10.0, {tolerance: 0.05, threshold: 0.04})).to.throw();
            });

            it("signal >= number, threshold and tolerance given => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare(">=", -10.0, {comparison: "relative", tolerance: 0.05, threshold: 0.04})).to.throw();
            });

            it("signal != number, threshold and tolerance given => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("!=", -10.0, {comparison: "relative", tolerance: 0.05, threshold: 0.04})).to.throw();
            });

            it("signal == number, threshold and tolerance given => invalid combination, expect to throw", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [-9.6, -9.5, -9.4, -9.3];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                expect(() => signal.compare("==", -10.0, {tolerance: 0.05, threshold: 0.04})).to.throw();
            });

        });

    });

    describe("basic comparison to second signal", () => {

        describe("basic, absolute comparison, element-wise", () => {

            it("signal < reference signal, absolute => expect new Signal with 0/1 values", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [103.0, 103.9, 101.0, 98.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("<", signalRef);

                expect(result.values).to.deep.equal([0, 1, 1, 0])
            });

            it("signal <= reference signal, absolute => expect new Signal with 0/1 values", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [103.5, 103.9, 101.0, 98.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("<=", signalRef);

                expect(result.values).to.deep.equal([1, 1, 1, 0])
            });

            it("signal == reference signal, absolute => expect new Signal with 0/1 values", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [103.5, 103.9, 101.0, 98.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("==", signalRef);

                expect(result.values).to.deep.equal([1, 0, 0, 0])
            });

            it("signal != reference signal, absolute => expect new Signal with 0/1 values", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [103.5, 103.9, 101.0, 98.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("!=", signalRef);

                expect(result.values).to.deep.equal([0, 1, 1, 1])
            });

            it("signal >= reference signal, absolute => expect new Signal with 0/1 values", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [103.5, 103.9, 101.0, 98.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare(">=", signalRef);

                expect(result.values).to.deep.equal([1, 0, 0, 1])
            });

            it("signal > reference signal, absolute => expect new Signal with 0/1 values", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [103.5, 103.9, 101.0, 98.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare(">", signalRef);

                expect(result.values).to.deep.equal([0, 0, 0, 1])
            });

        });

        describe("feasibility tests", () => {

            it("sample rate of reference lower => expect linear interpolation before", () => {
                let timeArray1 = [0.0, 0.01, 0.02];
                let valueArray1 = [103.5, 102.2, 100.8];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.02];
                let valueArray2 = [103.4, 101.0]; // [103.4, 102.2, 101.0] after interpolation
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("==", signalRef);

                expect(result.values).to.deep.equal([0, 1, 0])
            });

            it("sample rate of reference higher => expect linear interpolation before", () => {
                let timeArray1 = [0.0, 0.1, 0.2];
                let valueArray1 = [103.5, 102.2, 100.8];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.05, 0.1, 0.15, 0.2];
                let valueArray2 = [103.4, 103.2, 102.2, 102.1, 100.8]; // [103.4, 102.2, 100.8] after interpolation
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("==", signalRef);

                expect(result.values).to.deep.equal([0, 1, 1])
            });

            it("duration not equal => expect to throw", () => {
                let timeArray1 = [0.0, 0.01, 0.02];
                let valueArray1 = [103.5, 102.2, 100.8];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.05, 0.1, 0.15];
                let valueArray2 = [103.4, 103.2, 102.2, 102.1];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                expect(() => signal.compare("==", signalRef)).to.throw();
            });

            it("relative comparison and reference contains a 0 => expect to throw", () => {
                let timeArray1 = [0.0, 0.01, 0.02];
                let valueArray1 = [0.51, 0.23, 0.14];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "kg/s"
                };

                let timeArray2 = [0.0, 0.01, 0.02];
                let valueArray2 = [0.47, 0.10, 0.00];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "kg/s"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                expect(() => signal.compare("==", signalRef, {comparison: "relative"})).to.throw();
            });

            
            it("comparing signals with length 1 => expect to perform comparison for this one value", () => {
                let timeArray1 = [0.0];
                let valueArray1 = [0.51];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "kg/s"
                };

                let timeArray2 = [0.02];
                let valueArray2 = [0.00];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "kg/s"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("==", signalRef);

                expect(result.length).to.equal(1);
                expect(result.values).to.deep.equal([0]);
            });

        });

    });

    describe("comparison between Signals with different physical units", () => {

        describe("valid operations", () => {

            it("specify unit for number", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [103.5, 103.0, 100.8, 99.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare(">=", 28, {unit: "m/s"}); // 28 m/s = 100.8 km/h

                expect(result.values).to.deep.equal([1, 1, 1, 0])
            });

            it("specify unit for number and absolute threshold => expect conversion", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [108.1, 108.0, 93.6, 93.5];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("!=", 28, {unit: "m/s", threshold: 2}); // 30 m/s = 108 km/h, 26 m/s = 93.6 km/h

                expect(result.values).to.deep.equal([1, 0, 0, 1])
            });

            it("specify unit for number and relative threshold => conversion of relative threshold must be avoided", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [32.3, 32.4, 39.6, 39.7];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                let result = signal.compare("==", 10, {comparison: "relative", unit: "m/s", tolerance: 0.1}); // [9,10,11] m/s = [32.4,36,39.6]  km/h, 

                expect(result.values).to.deep.equal([0, 1, 1, 0]) // conversion of tolerance into km/h would result in 36% tolerance
            });

            it("signals with different units", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [27.0, 27.5, 28.0, 28.0]; // [97.2, 99, 100.8, 100.8] km/h
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "m/s"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare(">", signalRef);

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            });

            it("signals with different units and tolerance unit specified", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [91.0, 92.5, 98.3, 101.8];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [25.0, 26.0, 27.0, 28.0]; // [90, 93.6, 97.2, 100.8] km/h
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "m/s"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                let result = signal.compare("==", signalRef, {tolerance: 1000, unit: "m/h"}); // tol: 1 km/h

                expect(result.values).to.deep.equal([1, 0, 0, 1]) // [1.0, 0.9, 0.9, 1.0] <= 1.0
            });

        });

        describe("invalid operations", () => {

            it("signal and number, units have different physical base", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [100, 100, 100, 100];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray, valueArray, config);

                expect(() => signal.compare(">", 9.5, {unit: "m/s^2"})).to.throw()
            });

            it("signal and signal, units have different physical base", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [27.0, 27.5, 28.0, 28.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "N"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                expect(() => signal.compare(">", signalRef)).to.throw()
            });

            it("signal and signal, units have different physical time base", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [103.5, 103.0, 100.8, 99.1];
                let config1 = {
                    name: "test signal",
                    unit_time: "m",
                    unit_values: "km/h"
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [27.0, 27.5, 28.0, 28.0];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h"
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);

                expect(() => signal.compare(">", signalRef)).to.throw()
            });
            
        })

    });

    describe("precision related tests", () => {

        describe("signal and number", () => {

            it("number has higher precision than signal => expect to use precision of Signal", () => {
                let timeArray = [0.0, 0.01, 0.02];
                let valueArray = [47.9, 48.0, 48.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 3
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 48.04995); // becomes 48.0 before comparison

                expect(result.values).to.deep.equal([0, 1, 0])
            });

            it("precision of number is explicitly given and is same precision => expect correct rounding", () => {
                let timeArray = [0.0, 0.01, 0.02];
                let valueArray = [47.9, 48.0, 48.1];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 7
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 48.04995, {precision: 7, tolerance: 0.05});

                expect(result.values).to.deep.equal([0, 1, 0]) // [0.14995, 0.04995, 0.05005]
            });

            it("precision of number is explicitly given and lower than precision of signal => expect precision of signal to be scaled down", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [50.4, 49.8, 48.7, 47.1]; // [50, 50, 49, 47] with precision 2
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 3
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare(">", 48.7, {precision: 2}); // 49 with precision 2

                expect(result.values).to.deep.equal([1, 1, 0, 0])
            });

        });

        describe("signal and signal", () => {

            it("this signal has higher precision than reference signal => expect precision of ref to be scaled down", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [50.49, 49.60, 48.70, 47.49]; // [50, 50, 49, 47] with precision 2 
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 4
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [50, 49, 48, 47];
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 2
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);
                
                let result = signal.compare("==", signalRef);

                expect(result.values).to.deep.equal([1, 0, 0, 1])
            });

            it("precision of reference signal higher than precision of this signal => expect precision of reference signal to be scaled down", () => {
                let timeArray1 = [0.0, 0.01, 0.02, 0.03];
                let valueArray1 = [50, 50, 49, 47];
                let config1 = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 2
                };

                let timeArray2 = [0.0, 0.01, 0.02, 0.03];
                let valueArray2 = [49.51, 49.49, 48.00, 46.51]; // [50, 49, 48, 47] with precision 2 
                let config2 = {
                    name: "test signal 2",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 4
                };

                let signal = new Signal(timeArray1, valueArray1, config1);
                let signalRef = new Signal(timeArray2, valueArray2, config2);
                
                let result = signal.compare(">", signalRef);

                expect(result.values).to.deep.equal([0, 1, 1, 0])
            });

        });

        describe("tolerance and threshold precision", () => {

            it("tolerance precision is higher than signal precision => scale down to signal precision", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [51.1, 51.0, 49.0, 48.9];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 3
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 50.0, {tolerance: 1.004}); // 1.00 with precision 3

                expect(result.values).to.deep.equal([0, 1, 1, 0])
            });

            it("number precision given, tolerance precision is between signal and number precision => scale down all values to lowest precision", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [51.0041, 51.0039, 48.9961, 48.9959]; // [51.0, 51.0, 49.0, 49.0] with precision 3
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 5
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 50.0, {precision: 3, tolerance: 1.004});
                // diff w/o precision: [1.0041, 1.0039, -1.0039, -1.0041]
                // diff with precision: [1.00, 1.00, -1.00, -1.00]

                expect(result.values).to.deep.equal([1, 1, 1, 1]) // [0, 1, 1, 0] w/o precision
            });

            it("threshold precision is higher than signal precision => scale down to signal precision", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [51.0, 50.9, 49.1, 49.0];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 3
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("!=", 50.0, {threshold: 0.9995}); // 1.00 with precision
                // diff [1.0, 0.9, -0.9, -1.0]

                expect(result.values).to.deep.equal([0, 0, 0, 0]) // [1, 0, 0, 1] w/o precision
            });

            it("relative tolerance precision is higher than signal precision => scale down to signal precision", () => {
                let timeArray = [0.0, 0.01, 0.02, 0.03];
                let valueArray = [10.2, 10.1, 9.9, 9.8];
                let config = {
                    name: "test signal",
                    unit_time: "s",
                    unit_values: "km/h",
                    precision: 3
                };

                let signal = new Signal(timeArray, valueArray, config);
                
                let result = signal.compare("==", 10.0, {comparison: "relative", tolerance: 0.01999}); // 0.020 with precision
                // relative diff: [0.02, 0.01, -0.01, -0.02]

                expect(result.values).to.deep.equal([1, 1, 1, 1]) // [0, 1, 1, 0] w/o precision
            });

        });

    });

    // add division by 0 test

});