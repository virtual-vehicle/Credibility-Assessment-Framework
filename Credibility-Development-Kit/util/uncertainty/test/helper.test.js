const { describe, it } = require('mocha');
const { expect } = require('chai');
const histHelper = require('../src/histogram_helper');

describe('histogram_helper', () => {

    var hist1 = {
        type: "CDF",
        x: [49.2, 52.14, 53.000, 55, 56.9, 58],
        p: [0.1, 0.4, 0.5, 0.6, 0.9, 1.0],
        unit: "km/h"
    };
    var hist2 = {
        type: "CDF",
        x: [50, 54.1, 55, 56, 57],
        p: [0.2, 0.5, 0.6, 0.8, 1.0],
        unit: "km/h"
    };
    var hist3 = {
        type: "CDF",
        x: [13, 14.5, 15.0, 16.0],
        p: [0.1, 0.4, 0.7, 1.0],
        unit: "m/s"
    };
    var unitMissing = {
        type: "CDF",
        x: [50, 54, 55, 56, 57],
        p: [0.2, 0.5, 0.6, 0.8, 1.0],
    };
    var pMissing = {
        type: "CDF",
        x: [50, 54, 55, 56, 57],
        unit: "km/h"
    };
    var xMissing = {
        type: "CDF",
        p: [0.2, 0.5, 0.6, 0.8, 1.0],
        unit: "km/h"
    };

    describe('checkHistogramArray', () => {
    
        it('inputs as expected => expect to not throw', () => {
            expect(() => histHelper.checkHistogramArray([hist1, hist2])).to.not.throw();
        });
    
        it('unit different for one histogramd => expect to throw', () => {
            expect(() => histHelper.checkHistogramArray([hist1, hist2, hist3])).to.throw();
        });
    
        it('unit missing for one histogram => expect to throw', () => {
            expect(() => histHelper.checkHistogramArray([hist1, hist2, unitMissing])).to.throw();
        });
    
        it('x missing for one histogram => expect to throw', () => {
            expect(() => histHelper.checkHistogramArray([hist1, hist2, xMissing])).to.throw();
        });
    
        it('p missing for one histogram => expect to throw', () => {
            expect(() => histHelper.checkHistogramArray([hist1, hist2, pMissing])).to.throw();
        });
        
    });
    
    describe('postprocessConfig', () => {
        
        it('all values given => expect adjust to do nothing', () => {
            const config = {
                x_max: 60,
                x_min: 50,
                interval: 1
            };
            const configUpdated = histHelper.postprocessConfig([hist1, hist2], config, 0);
            
            expect(configUpdated).to.deep.equal(config);
        });

        it('x_min not given => expect to use nearest interval to minimum x of given histograms', () => {
            let config = {
                x_max: 60,
                interval: 1
            };
            config = histHelper.postprocessConfig([hist1, hist2], config, 0);
            
            expect(config.x_min).to.equal(49);
        });

        it('x_max not given => expect to use nearest interval to minimum x of given histograms', () => {
            let config = {
                x_min: 50,
                interval: 1
            };
            config = histHelper.postprocessConfig([hist1, hist2], config, 0);
            
            expect(config.x_max).to.equal(58);
        });

        it('interval not given => expect to use least significant digit as interval', () => {
            let config = {
                x_min: 50,
                x_max: 60,
            };
            config = histHelper.postprocessConfig([hist1, hist2], config, 0);
            
            expect(config.interval).to.equal(0.01);
        });

        it('nothing given => expect to use x_min, x_max of histograms and lsd for interval', () => {
            let config = histHelper.postprocessConfig([hist1, hist2], {}, 0);
            
            expect(config.x_min).to.equal(49.2);
            expect(config.x_max).to.equal(58);
            expect(config.interval).to.equal(0.01);
        });

        it('offset given => expect to adjust max and min values', () => {
            let config = histHelper.postprocessConfig([hist1, hist2], {}, 0.5);
            
            expect(config.x_min).to.equal(48.7);
            expect(config.x_max).to.equal(58.5);
        });

        it('offset given (with a finer resolution than histogram values) => expect to also adjust interval', () => {
            let config = histHelper.postprocessConfig([hist1, hist2], {}, 1.005);
            
            expect(config.interval).to.equal(0.001);
        });        

        it('x_min >= x_max => expect to throw', () => {
            const config = {
                x_min: 60,
                x_max: 60,
            };
            
            expect(() => histHelper.postprocessConfig([hist1, hist2], config, 0)).to.throw();
        });

        it('interval < 0 => expect to throw', () => {
            const config = {
                interval: -0.2
            };
            
            expect(() => histHelper.postprocessConfig([hist1, hist2], config, 0)).to.throw();
        });

    });

    describe('calcPBoxes', () => {

        it('limits out of range of given histograms', () => {
            const pBoxes = histHelper.calcPBoxes([hist1, hist2], 49, 59, 1);

            expect(pBoxes.x).to.deep.equal([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
            expect(pBoxes.p_lower).to.deep.equal([0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.6, 0.6, 0.9, 1.0, 1.0]);
            expect(pBoxes.p_upper).to.deep.equal([0, 0.2, 0.2, 0.2, 0.5, 0.5, 0.6, 0.8, 1.0, 1.0, 1.0]);            
        });

        it('limits within range of given histograms', () => {
            const pBoxes = histHelper.calcPBoxes([hist1, hist2], 52, 54, 0.5);

            expect(pBoxes.x).to.deep.equal([52.0, 52.5, 53.0, 53.5, 54.0]);
            expect(pBoxes.p_lower).to.deep.equal([0.1, 0.2, 0.2, 0.2, 0.2]);
            expect(pBoxes.p_upper).to.deep.equal([0.2, 0.4, 0.5, 0.5, 0.5]);            
        });
        
    });

    describe('addUncertainty', () => {
        const pBoxes = {
            p_upper: [0.15, 0.35, 0.70, 0.90, 1.00, 1.00],
            p_lower: [0.10, 0.25, 0.55, 0.70, 0.80, 0.85],
            x: [0.90, 0.92, 0.94, 0.96, 0.98, 1.00],
            unit: "s"                
        };
        
        it('uncertainty matches interval', () => {
            let pBoxesUpdated = histHelper.addUncertainty(pBoxes, 0.02);

            expect(pBoxesUpdated.x).to.deep.equal([0.90, 0.92, 0.94, 0.96, 0.98, 1.00]);
            expect(pBoxesUpdated.p_upper).to.deep.equal([0.35, 0.70, 0.90, 1.00, 1.00, 1.00]);
            expect(pBoxesUpdated.p_lower).to.deep.equal([0.00, 0.10, 0.25, 0.55, 0.70, 0.80]);
            expect(pBoxesUpdated.unit).to.deep.equal("s");            
        });

        it('uncertainty smaller than interval => expect only p_lower to be changed', () => {
            let pBoxesUpdated = histHelper.addUncertainty(pBoxes, 0.01);

            expect(pBoxesUpdated.p_upper).to.deep.equal(pBoxes.p_upper);
            expect(pBoxesUpdated.p_lower).to.deep.equal([0.00, 0.10, 0.25, 0.55, 0.70, 0.80]);         
        });

    });

});