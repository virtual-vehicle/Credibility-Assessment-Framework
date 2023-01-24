const { describe, it } = require('mocha');
const { expect } = require('chai');
const uncertainty = require('..');
const { Signal } = require('../../signal');

describe('createEmpiricalDistribution', () => {

    var sig1 = new Signal([0, 1, 2, 3], [2.5, 2.7, 2.9, 2.4], { name: "test1", unit_values: "m/s^2", precision: 2 });
    var sig2 = new Signal([0, 1, 2, 3], [2.7, 2.9, 3.1, 2.5], { name: "test2", unit_values: "m/s^2", precision: 2 });
    var sig3 = new Signal([0, 1, 2, 3], [2.9, 2.4, 2.1, 2.2], { name: "test3", unit_values: "m/s^2", precision: 2 });

    describe('arguments test', () => {

        it('discrete values array only => expect to not throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([0.78, 0.82, 0.74, 0.89, 0.85])).to.not.throw();
        });

        it('Signal array with function => expect to not throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([sig1, sig2, sig3], (signal) => signal.values[1])).to.not.throw();
        });

        it('Signal array w/o function => expect to throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([sig1, sig2, sig3])).to.throw();
        });

        it('Signal array with wrong functions argument => expect to throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([sig1, sig2, sig3], 2)).to.throw();
        });

        it('mixed array => expect to throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([sig1, sig2, [2.5, 2.7]], signal => signal.values[1])).to.throw();
        });

        it('nor number nor Signal array => expect to throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution(["0", "1", "0"])).to.throw();
        });

        it('discrete values, array size too short => expect to throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([0.78])).to.throw();
        });

        it('first input not an array => expect to throw', () => {
            expect(() => uncertainty.createEmpiricalDistribution([0.78])).to.throw();
        });

    });

    describe('return structure', () => {

        it('all different values => expect correct no. of samples', () => {
            let edf = uncertainty.createEmpiricalDistribution([0.78, 0.82, 0.74, 0.89, 0.85]);

            expect(edf.type).to.deep.equal("CDF");
            expect(edf.x.length).to.equal(5); // num of different values
            expect(edf.p.length).to.equal(5);
            expect(edf.unit).to.deep.equal("unknown");
        });

        it('some values equal => expect correct no. of samples', () => {
            let edf = uncertainty.createEmpiricalDistribution([0.74, 0.82, 0.74, 0.89, 0.82]);

            expect(edf.type).to.deep.equal("CDF");
            expect(edf.x.length).to.equal(3); // num of different values
            expect(edf.p.length).to.equal(3);
            expect(edf.unit).to.deep.equal("unknown");
        });

    });

    describe('results check', () => {

        it('discrete values provided', () => {
            let edf = uncertainty.createEmpiricalDistribution([0.78, 0.74, 0.80, 0.82, 0.74, 0.82, 0.85]);

            expect(edf.x).to.deep.equal([0.74, 0.78, 0.80, 0.82, 0.85]);
            expect(edf.p).to.deep.equal([2 / 7, 3 / 7, 4 / 7, 6 / 7, 1]);
            expect(edf.unit).to.deep.equal("unknown");
        });

        it('Signals provided', () => {
            let signals = [sig1, sig2, sig3];
            let evalFn = signal => signal.divide(9.81).values[3];

            let edf = uncertainty.createEmpiricalDistribution(signals, evalFn); // [0.24, 0.25, 0.22]

            expect(edf.x).to.deep.equal([0.22, 0.24, 0.25]);
            expect(edf.p).to.deep.equal([1 / 3, 2 / 3, 1]);
            expect(edf.unit).to.deep.equal("m/s^2");
        });

    });

});


describe('createPBoxes', () => {

    var edf1 = {
        type: "CDF",
        x: [50, 52, 53, 55, 56, 58],
        p: [0.1, 0.4, 0.6, 0.7, 0.9, 1.0],
        unit: "km/h"
    };
    var edf2 = {
        type: "CDF",
        x: [50, 54, 55, 56, 60],
        p: [0.2, 0.5, 0.6, 0.8, 1.0],
        unit: "km/h"
    };

    var edfWrong1 = {
        type: "CDF",
        x: [50, 52, 52, 55, 57],
        p: [0.2, 0.4, 0.6, 1.2, 1.2], // contains values > 1 
        unit: "km/h"
    };
    var edfWrong2 = {
        type: "CDF",
        x: [50, 52, 52, 55, 57],
        p: [0.2, 0.4, 0.2, 0.6, 1.0], // not monot. increasing
        unit: "km/h"
    };
    var edfWrong3 = {
        type: "CDF",
        x: [50, 49, 52, 55, 57], // not monot. increasing
        p: [0.2, 0.4, 0.5, 0.6, 1.0], 
        unit: "km/h"
    };

    describe('input checks', () => {

        it('cdf contains p values > 1 => expect to throw', () => {
            expect(() => uncertainty.createPBoxes([edf1, edfWrong1])).to.throw();
        }); 
        
        it('p values of cdf not monotonously increasing => expect to throw', () => {
            expect(() => uncertainty.createPBoxes([edf1, edf2, edfWrong2])).to.throw();
        }); 

        it('x values of cdf not monotonously increasing => expect to throw', () => {
            expect(() => uncertainty.createPBoxes([edf1, edf2, edfWrong3])).to.throw();
        }); 
        
    });

    it('predefined config', () => {
        let pBoxes = uncertainty.createPBoxes([edf1, edf2], {
            x_min: 48,
            x_max: 62,
            interval: 2
        });

        expect(pBoxes.x).to.deep.equal([48, 50, 52, 54, 56, 58, 60, 62]);
        expect(pBoxes.p_left).to.deep.equal([0, 0.2, 0.4, 0.6, 0.9, 1.0, 1.0, 1.0]);
        expect(pBoxes.p_right).to.deep.equal([0, 0.1, 0.2, 0.5, 0.8, 0.8, 1.0, 1.0]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('auto config => expect p-boxes without redundant values', () => {
        let pBoxes = uncertainty.createPBoxes([edf1, edf2]);

        expect(pBoxes.x).to.deep.equal([50, 52, 53, 54, 55, 56, 58, 60]);
        expect(pBoxes.p_left).to.deep.equal([0.2, 0.4, 0.6, 0.6, 0.7, 0.9, 1.0, 1.0]);
        expect(pBoxes.p_right).to.deep.equal([0.1, 0.2, 0.2, 0.5, 0.6, 0.8, 0.8, 1.0]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('offset not given as number => expect to throw', () => {
        expect(() => uncertainty.createPBoxes([edf1, edf2], "1.2")).to.throw();
    });

    it('only one edf => expect to throw', () => {
        expect(() => uncertainty.createPBoxes([edf1], {})).to.throw();
    });

    it('edf not given as array => expect to throw', () => {
        expect(() => uncertainty.createPBoxes({edfs: [edf1, edf2]}, {})).to.throw();
    });

});

describe('addUncertainty', () => {

    describe('EDF', () => {

        it('single value EDF + symmetric uncertainty => expect vertical P-Boxes', () => {
            const edf = {
                type: "CDF",
                x: [1000],
                p: [1],
                unit: "rad/s"                
            };

            const pBoxes = uncertainty.addUncertainty(edf, 10);

            expect(pBoxes.p_left).to.deep.equal([1, 1]);
            expect(pBoxes.p_right).to.deep.equal([0, 1]);
            expect(pBoxes.x).to.deep.equal([990, 1010]);
        });

        it('single value EDF + unsymmetric uncertainty => expect vertical P-Box', () => {
            const edf = {
                type: "CDF",
                x: [1000],
                p: [1],
                unit: "rad/s"                
            };

            const pBoxes = uncertainty.addUncertainty(edf, [0, 15]);

            expect(pBoxes.p_left).to.deep.equal([1, 1]);
            expect(pBoxes.p_right).to.deep.equal([0, 1]);
            expect(pBoxes.x).to.deep.equal([1000, 1015]);
        });

        it('stair EDF + symmetric uncertainty, keepIntervals = true => expect P-Box with shifted x-ticks', () => {
            const edf = {
                type: "CDF",
                x: [960, 980, 1000, 1020, 1025, 1030],
                p: [0, 0.2, 0.4, 0.9, 0.9, 1],
                unit: "rad/s"
            };

            const pBoxes = uncertainty.addUncertainty(edf, 20);

            expect(pBoxes.x).to.deep.equal([940, 960, 980, 1000, 1005, 1010, 1020, 1040, 1045, 1050]);
            expect(pBoxes.p_left).to.deep.equal([0, 0.2, 0.4, 0.9, 0.9, 1, 1, 1, 1, 1]);
            expect(pBoxes.p_right).to.deep.equal([0, 0, 0, 0.2, 0.2, 0.2, 0.4, 0.9, 0.9, 1]);
        });

        it('stair EDF + symmetric uncertainty, keepIntervals = false => expect P-Box with unique values', () => {
            const edf = {
                type: "CDF",
                x: [960, 980, 1000, 1020, 1025, 1030],
                p: [0, 0.2, 0.4, 0.9, 0.9, 1],
                unit: "rad/s"
            };

            const pBoxes = uncertainty.addUncertainty(edf, 20, false);

            expect(pBoxes.x).to.deep.equal([960, 980, 1000, 1010, 1020, 1040, 1050]);
            expect(pBoxes.p_left).to.deep.equal([0.2, 0.4, 0.9, 1, 1, 1, 1]);
            expect(pBoxes.p_right).to.deep.equal([0, 0, 0.2, 0.2, 0.4, 0.9, 1]);
        });

        it('stair EDF + asymmetric uncertainty, keepIntervals = false => expect one-side extended P-Box with unique values', () => {
            const edf = {
                type: "CDF",
                x: [960, 980, 1000, 1020, 1025, 1030],
                p: [0, 0.2, 0.4, 0.9, 0.9, 1],
                unit: "rad/s"
            };

            const pBoxes = uncertainty.addUncertainty(edf, [20, 0], false);

            expect(pBoxes.x).to.deep.equal([960, 980, 1000, 1010, 1020, 1030]);
            expect(pBoxes.p_left).to.deep.equal([0.2, 0.4, 0.9, 1, 1, 1]);
            expect(pBoxes.p_right).to.deep.equal([0, 0.2, 0.4, 0.4, 0.9, 1]);
        });
        
    });

    describe('P-Boxes', () => {

        it('p-boxes + symmetric uncertainty, keepIntervals = true => expect two-sided extended boxes', () => {
            const pBoxes = {
                x: [980, 990, 1000, 1010, 1020, 1040, 1050],
                p_left: [0.2, 0.2, 0.6, 0.8, 1, 1, 1],
                p_right: [0, 0.1, 0.1, 0.1, 0.5, 0.9, 1],
                unit: "rad/s"
            };

            const extendedpBoxes = uncertainty.addUncertainty(pBoxes, 10);

            expect(extendedpBoxes.x).to.deep.equal([970, 980, 990, 1000, 1010, 1020, 1030, 1050, 1060]);
            expect(extendedpBoxes.p_left).to.deep.equal([0.2, 0.2, 0.6, 0.8, 1, 1, 1, 1, 1]);
            expect(extendedpBoxes.p_right).to.deep.equal([0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.9, 1]);
        });

        it('p-boxes + symmetric uncertainty, keepIntervals = false => expect two-sided extended boxes with only unique values', () => {
            const pBoxes = {
                x: [980, 990, 1000, 1010, 1020, 1040, 1050],
                p_left: [0.2, 0.2, 0.6, 0.8, 1, 1, 1],
                p_right: [0, 0.1, 0.1, 0.1, 0.5, 0.9, 1],
                unit: "rad/s"
            };

            const extendedpBoxes = uncertainty.addUncertainty(pBoxes, 10, false);

            expect(extendedpBoxes.x).to.deep.equal([970, 990, 1000, 1010, 1030, 1050, 1060]);
            expect(extendedpBoxes.p_left).to.deep.equal([0.2, 0.6, 0.8, 1, 1, 1, 1]);
            expect(extendedpBoxes.p_right).to.deep.equal([0, 0, 0.1, 0.1, 0.5, 0.9, 1]);
        });

        it('p-boxes + unsymmetric uncertainty, keepIntervals = false => expect extended boxes with only unique values', () => {
            const pBoxes = {
                x: [980, 990, 1000, 1010, 1020, 1040, 1050],
                p_left: [0.2, 0.2, 0.6, 0.8, 1, 1, 1],
                p_right: [0, 0.1, 0.1, 0.1, 0.5, 0.9, 1],
                unit: "rad/s"
            };

            const extendedpBoxes = uncertainty.addUncertainty(pBoxes, [5, 10], false);

            expect(extendedpBoxes.x).to.deep.equal([975, 995, 1000, 1005, 1015, 1030, 1050, 1060]);
            expect(extendedpBoxes.p_left).to.deep.equal([0.2, 0.6, 0.6, 0.8, 1, 1, 1, 1]);
            expect(extendedpBoxes.p_right).to.deep.equal([0, 0, 0.1, 0.1, 0.1, 0.5, 0.9, 1]);
        });

    });

});

describe('calcAreaValidationMetric', () => {
    
    describe('Sim: EDF, Ref: EDF', () => {

        it('single value and single value, same edf => expect AVM = 0', () => {
            const edf1 = {
                type: "CDF",
                x: [1020],
                p: [1.0],
                unit: "rad/s"
            };
    
            expect(uncertainty.calcAreaValidationMetric(edf1, edf1)).to.equal(0);        
        });
    
        it('single value and single value, ref > sim => AVM > 0', () => {
            const edf1 = {
                type: "CDF",
                x: [1000],
                p: [1.0],
                unit: "rad/s"
            };
    
            const edf2 = {
                type: "CDF",
                x: [1010],
                p: [1.0],
                unit: "rad/s"
            }; 
    
            expect(uncertainty.calcAreaValidationMetric(edf1, edf2)).to.equal(10);        
        });
    
        it('single value and single value, negative scale => AVM > 0', () => {
            const edf1 = {
                type: "CDF",
                x: [-1000],
                p: [1.0],
                unit: "rad/s"
            };
    
            const edf2 = {
                type: "CDF",
                x: [-1010],
                p: [1.0],
                unit: "rad/s"
            }; 
    
            expect(uncertainty.calcAreaValidationMetric(edf1, edf2)).to.equal(10);        
        });
    
        it('single value and single value, sim > ref => AVM > 0', () => {
            const edf1 = {
                type: "CDF",
                x: [1020],
                p: [1.0],
                unit: "rad/s"
            };
    
            const edf2 = {
                type: "CDF",
                x: [1000],
                p: [1.0],
                unit: "rad/s"
            }; 
    
            expect(uncertainty.calcAreaValidationMetric(edf1, edf2)).to.equal(20);        
        });
    
        it('stair function and single value', () => {
            const edf1 = {
                type: "CDF",
                x: [960, 1020],
                p: [0.4, 1.0],
                unit: "rad/s"
            };
    
            const edf2 = {
                type: "CDF",
                x: [960],
                p: [1.0],
                unit: "rad/s"
            }; 
    
            expect(uncertainty.calcAreaValidationMetric(edf1, edf2)).to.equal(36);        
        });
    
        it('stair functions with different resolution', () => {
            const edf1 = {
                type: "CDF",
                x: [960, 1020],
                p: [0.4, 1.0],
                unit: "rad/s"
            };
    
            const edf2 = {
                type: "CDF",
                x: [960, 970, 1020, 1030],
                p: [0.2, 0.4, 0.9, 1.0],
                unit: "rad/s"
            }; 
    
            expect(uncertainty.calcAreaValidationMetric(edf1, edf2)).to.equal(3);        
        });
    
    });
    
    describe('Sim: pBox, Ref: EDF', () => {
    
        it('single value edf inside p-box => expect AVM = 0', () => {
            const pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1]
            };
    
            const edf = {
                type: "CDF",
                x: [1020],
                p: [1.0],
                unit: "rad/s"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edf)).to.equal(0);
        });
    
        it('single value edf outside p-box => expect AVM > 0', () => {
            const pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1]
            };
    
            const edf = {
                type: "CDF",
                x: [1050],
                p: [1.0],
                unit: "rad/s"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edf)).to.equal(17);
        });
    
        it('single value edf partly inside p-box => expect AVM > 0', () => {
            const pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9, 1, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1, 1]
            };
    
            const edf = {
                type: "CDF",
                x: [1000],
                p: [1.0],
                unit: "rad/s"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edf)).to.equal(5);
        });
    
        it('stair function edf, partly inside p-box, finer resolution => expect AVM > 0', () => {
            const pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9, 1, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1, 1]
            };
    
            const edf = {
                type: "CDF",
                x: [960, 990, 1000, 1025, 1030, 1040],
                p: [0.3, 0.4, 0.6, 0.7, 0.9, 1.0],
                unit: "rad/s"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edf)).to.equal(1.5);
        });
        
    });
    
    describe('Sim: EDF, Ref: p-Box', () => {
    
        it('reference p-box completely outside => expect AVM > 0', () => {
            const edf = {
                type: "CDF",
                x: [950, 970, 980, 990, 1000, 1010],
                p: [0.2, 0.3, 0.5, 0.8, 0.9, 1.0],
                unit: "rad/s"
            };
    
            const pBoxes = {
                x: [980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                p_left: [0.2, 0.2, 0.6, 0.8, 1.0, 1.0, 1.0, 1.0],
                p_right: [0, 0.1, 0.1, 0.1, 0.5, 0.5, 0.9, 1.0],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(edf, pBoxes)).to.equal(21);        
        });
        
        it('reference p-box completely wraps EDF => expect AVM = 0', () => {
            const edf = {
                type: "CDF",
                x: [980, 1010, 1030],
                p: [0.15, 0.7, 1.0],
                unit: "rad/s"
            };
    
            const pBoxes = {
                x: [980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                p_left: [0.2, 0.2, 0.6, 0.8, 1.0, 1.0, 1.0, 1.0],
                p_right: [0, 0.1, 0.1, 0.1, 0.5, 0.5, 0.9, 1.0],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(edf, pBoxes)).to.equal(0);        
        });
    
        it('reference p-box wraps EDF partly => expect AVM > 0', () => {
            const edf = {
                type: "CDF",
                x: [960, 1010, 1060],
                p: [0.1, 0.9, 1.0],
                unit: "rad/s"
            };
    
            const pBoxes = {
                x: [980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                p_left: [0.2, 0.2, 0.6, 0.8, 1.0, 1.0, 1.0, 1.0],
                p_right: [0, 0.1, 0.1, 0.1, 0.5, 0.5, 0.9, 1.0],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(edf, pBoxes)).to.equal(4);        
        });
    });
    
    describe('Sim: p-Box, Ref: p-Box', () => {
        
        it('sim p-box wraps ref p-box completely => expect AVM = 0', () => {
            const pBoxesSim = {
                x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesRef = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.5, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.2, 0.7, 0.9, 0.9, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(0); 
        });
    
        it('ref p-box wraps sim p-box completely => expect AVM = 0', () => {
            const pBoxesRef = {
                x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesSim = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.5, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.2, 0.7, 0.9, 0.9, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(0); 
        });
    
        it('left border of ref p-box outside, but right border inside => expect AVM = 0', () => {
            const pBoxesSim = {
                x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesRef = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.2, 0.7, 0.9, 0.9, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(0); 
        });
    
        it('left and right border of ref p-box outside, right border matches left border of sim => expect AVM = 0', () => {
            const pBoxesSim = {
                x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesRef = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.7, 0.7, 0.9, 0.9, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(0); 
        });
    
        it('left border of ref p-box outside left sim border, right ref border outside right sim border => expect AVM = 0', () => {
            const pBoxesSim = {
                x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesRef = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.9, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(0); 
        });
    
        it('right border of ref p-box outside left sim border => expect AVM > 0', () => {
            const pBoxesSim = {
                x: [950, 970, 980, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.3, 0.5, 1, 1, 1, 1],
                p_right: [0, 0, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesRef = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.7, 0.7, 0.9, 0.9, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(2); 
        });
    
        it('boxes completely shifted => expect AVM > 0', () => {
            const pBoxesSim = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020],
                p_left: [0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
                p_right: [0, 0, 0.1, 0.3, 0.3, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };
    
            const pBoxesRef = {
                x: [980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.2, 0.4, 0.8, 0.8, 0.8, 1, 1],
                p_right: [0, 0, 0.3, 0.7, 0.7, 0.7, 1],
                unit: "rad/s",
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxesSim, pBoxesRef)).to.equal(8); 
        });
    
    
    
    });
    
    describe('calcAreaValidationMetric p-box and EDF, random tests', () => {
    
        var edf1 = {
            type: "CDF",
            x: [50, 52, 53, 55, 56, 58],
            p: [0.1, 0.4, 0.6, 0.7, 0.9, 1.0],
            unit: "km/h"
        };
        var edf2 = {
            type: "CDF",
            x: [50, 54, 55, 56, 60],
            p: [0.2, 0.5, 0.6, 0.8, 1.0],
            unit: "km/h"
        };
    
        it('Case 0', () => {
            let pBoxes = uncertainty.createPBoxes([edf1, edf2], {
                x_min: 48,
                x_max: 62,
                interval: 2
            }); // Maurizio: I would consider create a p-box instance directly to better control the outcome!
    
            let edfCheck = {
                type: "CDF",
                x: [50,  51,  52,  53,  54,  56,  62],
                p: [0.0, 0.0, 0.4, 0.6, 0.8, 1.0, 1.0],
                unit: "km/h"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(1.0);
        });
    
        it('Case 1', () => {
            let pBoxes = uncertainty.createPBoxes([edf1, edf2], {
                x_min: 48,
                x_max: 62,
                interval: 2
            });
    
            let edfCheck = {
                type: "CDF",
                x: [50,  51,  52,  53,  54,  56,  62],
                p: [0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.0],
                unit: "km/h"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(0.8);
        });
    
        it('Case 2', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let edfCheck = {
                type: "CDF",
                x: [980],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(11);
        });
        it('Case 3', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let edfCheck = {
                type: "CDF",
                x: [1020],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(0);
        });
        it('Case 4', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let edfCheck = {
                type: "CDF",
                x: [1050],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(17);
    
        });
        it('Case 5', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let edfCheck = {
                type: "CDF",
                x: [950],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(37);
        });
        it('Case 6', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1, 1],
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9, 1, 1, 1, 1, 1]
            }
    
            let edfCheck = {
                type: "CDF",
                x: [1000],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, edfCheck)).to.equal(5);
        });
    });
    
    describe('p-Box and p-box random tests', () => {
        it('Case 1', () => {
            let pBoxData = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0,   0,   0,   0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1,   1],
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9,   1,   1,   1, 1,   1]
            }
            let pBoxExp = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [ 0,   0,   0,   0, 0.1, 0.3, 0.3, 0.5, 0.8, 0.8, 1,   1],
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 1.0, 1.0,   1.0,   1,   1, 1,   1]
            }
            let rs = uncertainty.calcAreaValidationMetric(pBoxData, pBoxExp);
            expect(rs).to.equal(0);
        })
    
        it('Case 2', () => {
            let pBoxData = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0,   0,   0,   0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1,   1],
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9,   1,   1,   1, 1,   1]
            }
            let pBoxExp = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [ 0,   0,   0.4,   0.5, 1.0, 1.0, 1.0, 1.0, 1, 1, 1.0,   1],
                p_left: [0, 0.6, 1.0, 1.0, 1.0, 1, 1,   1,   1,   1, 1,   1]
            }
            let rs = uncertainty.calcAreaValidationMetric(pBoxData, pBoxExp);
            expect(rs).to.equal(12);
    
        })
    
        it('Case 3', () => {
            let pBoxData = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0,   0,   0,   0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1,   1],
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9,   1,   1,   1, 1,   1]
            }
            let pBoxExp = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [  0, 0.0, 0,   0,   0,    0   , 0,   0,   0,   1, 1,   1],
                p_left: [0, 0.0, 0,   0,   0,    0   , 0,   0.3,   1,   1, 1,   1]
            }
            let rs = uncertainty.calcAreaValidationMetric(pBoxData, pBoxExp);
            expect(rs).to.equal(9);
    
        })
    });
    
});