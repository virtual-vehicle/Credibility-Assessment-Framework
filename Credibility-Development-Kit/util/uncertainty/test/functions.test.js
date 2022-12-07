const { describe, it } = require('mocha');
const { expect } = require('chai');
const uncertainty = require('..');
const { Signal } = require('../../signal');

describe('createCumulativeHistogram', () => {

    var sig1 = new Signal([0, 1, 2, 3], [2.5, 2.7, 2.9, 2.4], { name: "test1", unit_values: "m/s^2", precision: 2 });
    var sig2 = new Signal([0, 1, 2, 3], [2.7, 2.9, 3.1, 2.5], { name: "test2", unit_values: "m/s^2", precision: 2 });
    var sig3 = new Signal([0, 1, 2, 3], [2.9, 2.4, 2.1, 2.2], { name: "test3", unit_values: "m/s^2", precision: 2 });
    var sig4 = new Signal([0, 1, 2, 3], [2500, 2300, 2000, 2200], { name: "test4", unit_values: "mm/s^2", precision: 2 });

    describe('arguments test', () => {

        it('discrete values array only => expect to not throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([0.78, 0.82, 0.74, 0.89, 0.85])).to.not.throw();
        });

        it('Signal array with function => expect to not throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([sig1, sig2, sig3], (signal) => signal.values[1])).to.not.throw();
        });

        it('Signal array w/o function => expect to throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([sig1, sig2, sig3])).to.throw();
        });

        it('Signal array with wrong functions argument => expect to throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([sig1, sig2, sig3], 2)).to.throw();
        });

        it('mixed array => expect to throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([sig1, sig2, [2.5, 2.7]], signal => signal.values[1])).to.throw();
        });

        it('nor number nor Signal array => expect to throw', () => {
            expect(() => uncertainty.createCumulativeHistogram(["0", "1", "0"])).to.throw();
        });

        it('discrete values, array size too short => expect to throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([0.78])).to.throw();
        });

        it('first input not an array => expect to throw', () => {
            expect(() => uncertainty.createCumulativeHistogram([0.78])).to.throw();
        });

    });

    describe('return structure', () => {

        it('all different values => expect correct no. of samples', () => {
            let hist = uncertainty.createCumulativeHistogram([0.78, 0.82, 0.74, 0.89, 0.85]);

            expect(hist.type).to.deep.equal("CDF");
            expect(hist.x.length).to.equal(5); // num of different values
            expect(hist.p.length).to.equal(5);
            expect(hist.unit).to.deep.equal("unknown");
        });

        it('some values equal => expect correct no. of samples', () => {
            let hist = uncertainty.createCumulativeHistogram([0.74, 0.82, 0.74, 0.89, 0.82]);

            expect(hist.type).to.deep.equal("CDF");
            expect(hist.x.length).to.equal(3); // num of different values
            expect(hist.p.length).to.equal(3);
            expect(hist.unit).to.deep.equal("unknown");
        });

    });

    describe('results check', () => {

        it('discrete values provided', () => {
            let hist = uncertainty.createCumulativeHistogram([0.78, 0.74, 0.80, 0.82, 0.74, 0.82, 0.85]);

            expect(hist.x).to.deep.equal([0.74, 0.78, 0.80, 0.82, 0.85]);
            expect(hist.p).to.deep.equal([2 / 7, 3 / 7, 4 / 7, 6 / 7, 1]);
            expect(hist.unit).to.deep.equal("unknown");
        });

        it('Signals provided', () => {
            let signals = [sig1, sig2, sig3];
            let evalFn = signal => signal.divide(9.81).values[3];

            let hist = uncertainty.createCumulativeHistogram(signals, evalFn); // [0.24, 0.25, 0.22]

            expect(hist.x).to.deep.equal([0.22, 0.24, 0.25]);
            expect(hist.p).to.deep.equal([1 / 3, 2 / 3, 1]);
            expect(hist.unit).to.deep.equal("m/s^2");
        });

    });

});


describe('createPBoxHistogram', () => {

    var hist1 = {
        type: "CDF",
        x: [50, 52, 53, 55, 56, 58],
        p: [0.1, 0.4, 0.6, 0.7, 0.9, 1.0],
        unit: "km/h"
    };
    var hist2 = {
        type: "CDF",
        x: [50, 54, 55, 56, 60],
        p: [0.2, 0.5, 0.6, 0.8, 1.0],
        unit: "km/h"
    };

    var histWrong1 = {
        type: "CDF",
        x: [50, 52, 52, 55, 57],
        p: [0.2, 0.4, 0.6, 1.2, 1.2], // contains values > 1 
        unit: "km/h"
    };
    var histWrong2 = {
        type: "CDF",
        x: [50, 52, 52, 55, 57],
        p: [0.2, 0.4, 0.2, 0.6, 1.0], // not monot. increasing
        unit: "km/h"
    };
    var histWrong3 = {
        type: "CDF",
        x: [50, 49, 52, 55, 57], // not monot. increasing
        p: [0.2, 0.4, 0.5, 0.6, 1.0], 
        unit: "km/h"
    };

    describe('input checks', () => {

        it('cdf contains p values > 1 => expect to throw', () => {
            expect(() => uncertainty.createPBoxes([hist1, histWrong1])).to.throw();
        }); 
        
        it('p values of cdf not monotonously increasing => expect to throw', () => {
            expect(() => uncertainty.createPBoxes([hist1, hist2, histWrong2])).to.throw();
        }); 

        it('x values of cdf not monotonously increasing => expect to throw', () => {
            expect(() => uncertainty.createPBoxes([hist1, hist2, histWrong3])).to.throw();
        }); 
        
    });

    it('predefined config', () => {
        let pBoxes = uncertainty.createPBoxes([hist1, hist2], {
            x_min: 48,
            x_max: 62,
            interval: 2
        });

        expect(pBoxes.x).to.deep.equal([48, 50, 52, 54, 56, 58, 60, 62]);
        expect(pBoxes.p_upper).to.deep.equal([0, 0.2, 0.4, 0.6, 0.9, 1.0, 1.0, 1.0]);
        expect(pBoxes.p_lower).to.deep.equal([0, 0.1, 0.2, 0.5, 0.8, 0.8, 1.0, 1.0]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('auto config', () => {
        let pBoxes = uncertainty.createPBoxes([hist1, hist2]);

        expect(pBoxes.x).to.deep.equal([50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);
        expect(pBoxes.p_upper).to.deep.equal([0.2, 0.2, 0.4, 0.6, 0.6, 0.7, 0.9, 0.9, 1.0, 1.0, 1.0]);
        expect(pBoxes.p_lower).to.deep.equal([0.1, 0.1, 0.2, 0.2, 0.5, 0.6, 0.8, 0.8, 0.8, 0.8, 1.0]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('offset with same interval defined => expect values adjusted to new boundaries', () => {
        let pBoxes = uncertainty.createPBoxes([hist1, hist2], 2);  

        expect(pBoxes.x).to.deep.equal([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]);
        expect(pBoxes.p_upper).to.deep.equal([0.2, 0.2, 0.4, 0.6, 0.6, 0.7, 0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
        expect(pBoxes.p_lower).to.deep.equal([0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.5, 0.6, 0.8, 0.8, 0.8, 0.8, 1.0]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('offset with smaller interval defined, no config given => expect values adjusted to interval', () => {
        let pBoxes = uncertainty.createPBoxes([hist1, hist2], 0.5);  

        expect(pBoxes.x[0]).to.equal(49.5);
        expect(pBoxes.x[pBoxes.x.length - 1]).to.equal(60.5);
        expect(pBoxes.x.length).to.equal(111); // interval will be adjusted to 0.1
        expect(pBoxes.p_upper.slice(19, 21)).to.deep.equal([0.2, 0.4]);
        expect(pBoxes.p_lower.slice(9, 11)).to.deep.equal([0.0, 0.1]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('offset and configuration given => expect corresponding subset', () => {
        let pBoxes = uncertainty.createPBoxes([hist1, hist2], 0.5, {
            interval: 1,
            x_min: 49,
            x_max: 52
        });  

        expect(pBoxes.x).to.deep.equal([49, 50, 51, 52]);
        expect(pBoxes.p_upper).to.deep.equal([0.0, 0.2, 0.2, 0.4]);
        expect(pBoxes.p_lower).to.deep.equal([0.0, 0.0, 0.1, 0.1]);
        expect(pBoxes.unit).to.deep.equal("km/h");
    });

    it('offset not given as number => expect to throw', () => {
        expect(() => uncertainty.createPBoxes([hist1, hist2], "1.2")).to.throw();
    });

    it('only one histogram => expect to throw', () => {
        expect(() => uncertainty.createPBoxes([hist1], {})).to.throw();
    });

    it('histogram not given as array => expect to throw', () => {
        expect(() => uncertainty.createPBoxes({histograms: [hist1, hist2]}, {})).to.throw();
    });

});

describe("getAreaValidationMetric", () => {

    

})