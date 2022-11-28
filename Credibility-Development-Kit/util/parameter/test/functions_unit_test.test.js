const { describe, it } = require('mocha');
const { expect } = require('chai');
const helper = require('../src/helper');
const { createSamples, ScalarParameter } = require('..');

describe('createSamples', () => {

    var aleatoryParameter1 = new ScalarParameter(40, {
        name: 'spring stiffness constant c',
        unit: 'N/cm',
        interval: 1e-2,
        tolerance_absolute: 2,
        standard_deviation: 1,
    });

    var aleatoryParameter2 = new ScalarParameter(1000, {
        name: "damping coefficient k",
        unit: "N/(cm/s)",
        interval: 1e-2,
        tolerance_relative: 0.04,
        standard_deviation_factor: 2
    });

    var epistemicParameter1 = new ScalarParameter(1570, {
        name: "vehicle mass m",
        unit: "kg",
        interval: 1,
        lower_limit: 1490,
        upper_limit: 1800
    });

    var epistemicParameter2 = new ScalarParameter(0.55, {
        name: "front-axle load, relative",
        unit: "-",
        interval: 1e-3,
        lower_limit: 0.47,
        upper_limit: 0.59
    });

    var discreteParameter = new ScalarParameter(75, {
        name: "normed passenger weight",
        unit: "kg"
    });

    describe('argument tests', () => {
        
        it('single parameter, no. of samples not given => expect 5 default samples', () => {
            let sampling = createSamples(aleatoryParameter1, {method: "equally_spaced"});

            expect(sampling.values[0].length).to.equal(5);
        });

    });

    describe('single parameter, aleatory uncertainty', () => {

        it('valid call => expect valid return structure', () => {
            let sampling = createSamples(aleatoryParameter1, {
                samples: 10,
                method: "equally_spaced"
            });

            expect(sampling.names).to.deep.equal([aleatoryParameter1.name]);
            expect(sampling.units).to.deep.equal([aleatoryParameter1.unit]);
            expect(sampling.values[0].length).to.equal(10);
        });

        it('method equally-spaced => expect correct values', () => {
            let sampling = createSamples(aleatoryParameter1, {
                samples: 10, 
                method: "equally_spaced"
            });

            let samplingOrdered = sampling.values[0].sort((a,b) => a-b)

            // 10 samples equally-spaced vector: [0.05, 0.15, 0.25, ..., 0.95]
            let expectedValuesOrdered = [
                38.5277, 
                39.0296, 
                39.3609, 
                39.6330, 
                39.8801, 
                40.1199, 
                40.3670,  
                40.6391, 
                40.9704, 
                41.4723];

            let diff = samplingOrdered.map((val, i) => Math.abs(val - expectedValuesOrdered[i]));

            expect(diff.every(dval => dval < 1e-2)).to.be.true;
        });

        it('method monte-carlo => expect correct boundaries', () => {
            let sampling = createSamples(aleatoryParameter1, {
                samples: 1000,
                method: "monte_carlo"
            });

            expect(sampling.values[0].every(val => {
                return val[0] >= aleatoryParameter1.limits[0] && val[0] <= aleatoryParameter1.limits[1]
            })).to.be.true;             
        });

    });

    describe('multiple parameter', () => {

        it('aleatory uncertainties => expect valid return structure', () => {
            let sampling = createSamples([aleatoryParameter1, aleatoryParameter2], {
                samples: 10, 
                method: "monte_carlo"
            });

            expect(sampling.values.length).to.equal(1);
            expect(sampling.names).to.deep.equal([aleatoryParameter1.name, aleatoryParameter2.name]);
            expect(sampling.units).to.deep.equal([aleatoryParameter1.unit, aleatoryParameter2.unit]);
            expect(sampling.values[0].length).to.equal(10);
            expect(sampling.values[0][0].length).to.equal(2);
        });

        it('epistemic uncertainties => expect valid return structure', () => {
            let sampling = createSamples([epistemicParameter1, epistemicParameter2], {
                samples: 10, 
                method: "monte_carlo"
            });

            expect(sampling.values.length).to.equal(10);
            expect(sampling.names).to.deep.equal([epistemicParameter1.name, epistemicParameter2.name]);
            expect(sampling.units).to.deep.equal([epistemicParameter1.unit, epistemicParameter2.unit]);
            expect(sampling.values[0].length).to.equal(1);
            expect(sampling.values[0][0].length).to.equal(2);
        });

        it('aleatory and epistemic uncertainties => expect valid return structure', () => {
            let sampling = createSamples([aleatoryParameter1, epistemicParameter1, epistemicParameter2], {
                samples_aleatory: 10,
                samples_epistemic: 8,
                method_aleatory: "equally_spaced",
                method_epistemic: "monte_carlo"
            });

            expect(sampling.values.length).to.equal(8);
            expect(sampling.values[0].length).to.equal(10);
            expect(sampling.values[0][0].length).to.equal(3);
        });

        it('aleatory, epistemic and discrete uncertainties => expect valid return structure', () => {
            let sampling = createSamples([aleatoryParameter1, epistemicParameter1, epistemicParameter2, discreteParameter], {
                // samples_aleatory will be default value 5, if not given
                samples_epistemic: 7,
                method_aleatory: "equally_spaced",
                method_epistemic: "monte_carlo"
            });

            expect(sampling.values.length).to.equal(7); // number of epistemic 
            expect(sampling.values[0].length).to.equal(5); // number of aleatory
            expect(sampling.values[0][0].length).to.equal(4); // number of parameters
        });

    });

    describe('invalid calls', () => {

        it('invalid number of samples given', () => {
            let configInv = {
                samples_aleatory: 0,
                samples_epistemic: 7,
                method_aleatory: "equally_spaced",
                method_epistemic: "monte_carlo"
            };

            expect(() => createSamples([aleatoryParameter1, epistemicParameter1, discreteParameter], configInv)).to.throw();
        });

        it('invalid method given', () => {
            let configInv = {
                samples_aleatory: 3,
                method_aleatory: "latin"
            };

            expect(() => createSamples([aleatoryParameter1, aleatoryParameter2], configInv)).to.throw();
        });
        
    });

});