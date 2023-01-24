const { describe, it } = require('mocha');
const { expect } = require('chai');
const helper = require('../src/uncertainty_helper');

describe('uncertainty_helper', () => {

    var edf1 = {
        type: "CDF",
        x: [49.2, 52.14, 53.000, 55, 56.9, 58],
        p: [0.1, 0.4, 0.5, 0.6, 0.9, 1.0],
        unit: "km/h"
    };
    var edf2 = {
        type: "CDF",
        x: [50, 54.1, 55, 56, 57],
        p: [0.2, 0.5, 0.6, 0.8, 1.0],
        unit: "km/h"
    };
    var edf3 = {
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

    describe('checkEdfArray', () => {

        it('inputs as expected => expect to not throw', () => {
            expect(() => helper.checkEdfArray([edf1, edf2])).to.not.throw();
        });

        it('unit different for one edfogramd => expect to throw', () => {
            expect(() => helper.checkEdfArray([edf1, edf2, edf3])).to.throw();
        });

        it('unit missing for one edfogram => expect to throw', () => {
            expect(() => helper.checkEdfArray([edf1, edf2, unitMissing])).to.throw();
        });

        it('x missing for one edfogram => expect to throw', () => {
            expect(() => helper.checkEdfArray([edf1, edf2, xMissing])).to.throw();
        });

        it('p missing for one edfogram => expect to throw', () => {
            expect(() => helper.checkEdfArray([edf1, edf2, pMissing])).to.throw();
        });

        it('Check array of x and p are not the same', () => {
            var edfCheck = {
                type: "CDF",
                x: [50, 54.1, 55, 56, 57],
                p: [0.2, 0.3, 0.6, 0.8, 1.0, 1.0],
                unit: "km/h"
            };
            expect(() => helper.checkEdfArray([edfCheck])).to.throw();
        });

        it('Check type of edfogram', () => {
            var edfCheck = {
                type: "CDF",
                x: [50, 54.1, 55, 56, 57],
                p: [0.2, 0.1, 0.6, 0.8, 1.0],
                unit: "km/h"
            };
            expect(() => helper.checkEdfArray([edfCheck])).to.throw();

            edfCheck = {
                type: "CDF",
                x: [50, 54.1, 55, 56, 57],
                p: [0.2, 0.3, 0.6, 0.8, 1.0],
                unit: "km/h"
            };
            expect(() => helper.checkEdfArray([edfCheck])).to.not.throw();

            edfCheck = {
                type: "Test",
                x: [50, 54.1, 55, 56, 57],
                p: [0.2, 0.1, 0.6, 0.8, 1.0],
                unit: "km/h"
            };
            expect(() => helper.checkEdfArray([edfCheck])).to.not.throw();
        });
    });

    describe('postprocessConfig', () => {

        it('all values given => expect adjust to do nothing', () => {
            const config = {
                x_max: 60,
                x_min: 50,
                interval: 1
            };
            const configUpdated = helper.postprocessConfig([edf1, edf2], config, 0);

            expect(configUpdated).to.deep.equal(config);
        });

        it('x_min not given => expect to use nearest interval to minimum x of given edfograms', () => {
            let config = {
                x_max: 60,
                interval: 1
            };
            config = helper.postprocessConfig([edf1, edf2], config, 0);

            expect(config.x_min).to.equal(49);
        });

        it('x_max not given => expect to use nearest interval to minimum x of given edfograms', () => {
            let config = {
                x_min: 50,
                interval: 1
            };
            config = helper.postprocessConfig([edf1, edf2], config, 0);

            expect(config.x_max).to.equal(58);
        });

        it('interval not given => expect to use least significant digit as interval', () => {
            let config = {
                x_min: 50,
                x_max: 60,
            };
            config = helper.postprocessConfig([edf1, edf2], config, 0);

            expect(config.interval).to.equal(0.01);
        });

        it('nothing given => expect to use x_min, x_max of edfograms and lsd for interval', () => {
            let config = helper.postprocessConfig([edf1, edf2], {}, 0);

            expect(config.x_min).to.equal(49.2);
            expect(config.x_max).to.equal(58);
            expect(config.interval).to.equal(0.01);
        });

        it('x_min >= x_max => expect to throw', () => {
            const config = {
                x_min: 60,
                x_max: 60,
            };

            expect(() => helper.postprocessConfig([edf1, edf2], config, 0)).to.throw();
        });

        it('interval < 0 => expect to throw', () => {
            const config = {
                interval: -0.2
            };

            expect(() => helper.postprocessConfig([edf1, edf2], config, 0)).to.throw();
        });

    });

    describe('calcPBoxes', () => {

        it('limits out of range of given edfograms', () => {
            const pBoxes = helper.calcPBoxes([edf1, edf2], 49, 59, 1);

            expect(pBoxes.x).to.deep.equal([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
            expect(pBoxes.p_right).to.deep.equal([0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.6, 0.6, 0.9, 1.0, 1.0]);
            expect(pBoxes.p_left).to.deep.equal([0, 0.2, 0.2, 0.2, 0.5, 0.5, 0.6, 0.8, 1.0, 1.0, 1.0]);
        });

        it('limits within range of given edfograms', () => {
            const pBoxes = helper.calcPBoxes([edf1, edf2], 52, 54, 0.5);

            expect(pBoxes.x).to.deep.equal([52.0, 52.5, 53.0, 53.5, 54.0]);
            expect(pBoxes.p_right).to.deep.equal([0.1, 0.2, 0.2, 0.2, 0.2]);
            expect(pBoxes.p_left).to.deep.equal([0.2, 0.4, 0.5, 0.5, 0.5]);
        });

    });

});