const { describe, it } = require('mocha');
const { expect } = require('chai');
const { ScalarParameter, N_SAMPLES_MAX } = require('..');
const { Signal } = require('../../signal');

// helper methods for arrays to find last index according to a condition
// based on current proposal: https://github.com/tc39/proposal-array-find-from-last
Array.prototype.findLastIndex = function (fn) {
    return this.length - 1 - [...this].reverse().findIndex(fn);
}

// find the value in an array that comes closest to a target value
Array.prototype.findClosest = function (target) {
    return this.reduce((prev, curr) => {
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
    });
}

Array.prototype.findIndexClosest = function (target) {
    return this.findIndex(el => el == this.findClosest(target));
}

describe('ScalarParameter unit tests', () => {

    describe('constructor', () => {

        describe('valid instantiation', () => {

            it('instantiate with nominal value only => expect fixed type', () => {
                let parameter = new ScalarParameter(3, { name: 'no. of pole pairs', interval: 1 });

                expect(parameter.nominal_value).to.equal(3);
                expect(parameter.limits).to.deep.equal([3, 3]);
                expect(parameter.uncertainty_type).to.deep.equal('fixed');
            });

            it('instantiate with nominal value and limits => expect range type', () => {
                let parameter = new ScalarParameter(1670, {
                    name: 'vehicle mass',
                    unit: 'kg',
                    lower_limit: 1525,
                    upper_limit: 1900,
                    source_value: 'provided'
                });

                expect(parameter.nominal_value).to.equal(1670);
                expect(parameter.limits).to.deep.equal([1525, 1900]);
                expect(parameter.uncertainty_type).to.deep.equal('range');
            });

            it('instantiate with nominal value and absolute tolerance => expect range type with symmetric limits', () => {
                let parameter = new ScalarParameter(-440, {
                    name: 'freezing temperature',
                    unit: 'degC',
                    interval: 0.1,
                    tolerance_absolute: 3,
                    source_value: 'measured'
                });

                expect(parameter.nominal_value).to.equal(-440);
                expect(parameter.limits).to.deep.equal([-443, -437]);
                expect(parameter.uncertainty_type).to.deep.equal('range');
            });

            it('instantiate with nominal value and relative tolerance => expect range type with symmetric limits', () => {
                let parameter = new ScalarParameter(-400, {
                    name: 'freezing temperature',
                    unit: 'degC',
                    tolerance_relative: 0.5 / 100,
                });

                expect(parameter.nominal_value).to.equal(-400);
                expect(parameter.limits).to.deep.equal([-402, -398]);
                expect(parameter.uncertainty_type).to.deep.equal('range');
            });

            it('instantiate with nominal value, absolute tolerance and standard deviation => expect truncated normal type with symmetric limits', () => {
                let parameter = new ScalarParameter(0.2, {
                    name: 'resistance',
                    unit: 'ohm',
                    interval: 1e-4,
                    tolerance_absolute: 0.02,
                    standard_deviation: 0.005,
                    source_uncertainty: 'estimated'
                });

                expect(parameter.nominal_value).to.equal(0.2);
                expect(parameter.limits).to.deep.equal([0.18, 0.22]);
                expect(parameter.uncertainty_type).to.deep.equal('truncated normal');
            });

            it('instantiate with nominal value, relative tolerance and standard deviation => expect truncated normal type with symmetric limits', () => {
                let parameter = new ScalarParameter(0.2, {
                    name: 'resistance',
                    unit: 'ohm',
                    interval: 1e-4,
                    tolerance_relative: 10 / 100,
                    standard_deviation: 0.005
                });

                expect(parameter.nominal_value).to.equal(0.2);
                expect(parameter.limits).to.deep.equal([0.18, 0.22]);
                expect(parameter.uncertainty_type).to.deep.equal('truncated normal');
            });

            it('instantiate with nominal value, absolute tolerance and standard deviation factor => expect truncated normal type with symmetric limits', () => {
                let parameter = new ScalarParameter(0.2, {
                    name: 'resistance',
                    unit: 'ohm',
                    interval: 1e-4,
                    tolerance_absolute: 0.02,
                    standard_deviation_factor: 4
                });

                expect(parameter.nominal_value).to.equal(0.2);
                expect(parameter.limits).to.deep.equal([0.18, 0.22]);
                expect(parameter.standard_deviation).to.equal(0.005);
                expect(parameter.uncertainty_type).to.deep.equal('truncated normal');
            });

            it('instantiate with nominal value, relative tolerance and standard deviation factor => expect truncated normal type with symmetric limits', () => {
                let parameter = new ScalarParameter(0.2, {
                    name: 'resistance',
                    unit: 'ohm',
                    interval: 1e-4,
                    tolerance_relative: 10 / 100,
                    standard_deviation_factor: 2
                });

                expect(parameter.nominal_value).to.equal(0.2);
                expect(parameter.limits).to.deep.equal([0.18, 0.22]);
                expect(parameter.standard_deviation).to.equal(0.01);
                expect(parameter.uncertainty_type).to.deep.equal('truncated normal');
            });

            it('instantiate with nominal value, limits and standard deviation => expect truncated normal type', () => {
                let parameter = new ScalarParameter(0.2, {
                    name: 'resistance',
                    unit: 'ohm',
                    interval: 1e-4,
                    lower_limit: 0.19,
                    upper_limit: 0.22,
                    standard_deviation: 0.005
                });

                expect(parameter.nominal_value).to.equal(0.2);
                expect(parameter.limits).to.deep.equal([0.19, 0.22]);
                expect(parameter.uncertainty_type).to.deep.equal('truncated normal');
            });

            it('instantiate with given interval => expect values to use this interval', () => {
                let parameter = new ScalarParameter(950.897065, {
                    name: 'melting temperature',
                    unit: 'K',
                    source_value: 'computed',
                    source_uncertainty: 'estimated',
                    tolerance_relative: 0.5 / 100,
                    standard_deviation: 2.564,
                    interval: 1e-2
                });

                expect(parameter.nominal_value).to.equal(950.90);
                expect(parameter.limits).to.deep.equal([946.14, 955.65]);
                expect(parameter.standard_deviation).to.equal(2.564); // must NOT apply interval!
            });

        });

        describe('invalid instantiation', () => {

            it('no options provided => expect to throw', () => {
                expect(() => new ScalarParameter(50)).to.throw();
            });

            it('name not given => expect to throw', () => {
                expect(() => new ScalarParameter(50, { unit: 'kg' })).to.throw();
            });

            it('invalid unit given => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', unit: 'kilos' })).to.throw();
            });

            it('invalid interval given => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', interval: 0 })).to.throw();
            });

            it('invalid source_value given => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', source_value: 'measurement' })).to.throw();
            });

            it('invalid source_uncertainty given => expect to throw', () => {
                expect(() => new ScalarParameter(50, {
                    name: 'unsprung mass',
                    tolerance_absolute: 5,
                    source_uncertainty: 'approx'
                })
                ).to.throw();
            });

            it('lower limit greater than nominal value => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', lower_limit: 55, upper_limit: 60 })).to.throw();
            });

            it('upper limit lower than nominal value => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', lower_limit: 40, upper_limit: 45 })).to.throw();
            });

            it('only lower limit given => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', lower_limit: 40 })).to.throw();
            });

            it('only upper limit given => expect to throw', () => {
                expect(() => new ScalarParameter(50, { name: 'unsprung mass', upper_limit: 60 })).to.throw();
            });

            it('both, limits and absolute tolerance given => expect to throw', () => {
                expect(() => new ScalarParameter(50, {
                    name: 'unsprung mass',
                    lower_limit: 40,
                    upper_limit: 60,
                    tolerance_absolute: 5
                })
                ).to.throw();
            });

            it('both, limits and relative tolerance given => expect to throw', () => {
                expect(() => new ScalarParameter(50, {
                    name: 'unsprung mass',
                    lower_limit: 40,
                    upper_limit: 60,
                    tolerance_relative: 0.15
                })
                ).to.throw();
            });

            it('absolute tolerance negative => expect to throw', () => {
                expect(() => new ScalarParameter(50, {
                    name: 'unsprung mass',
                    tolerance_absolute: -5
                })
                ).to.throw();
            });

            it('relative tolerance negative => expect to throw', () => {
                expect(() => new ScalarParameter(50, {
                    name: 'unsprung mass',
                    tolerance_relative: -0.1
                })
                ).to.throw();
            });

            it('both, absolute and relative tolerance given => expect to throw', () => {
                expect(() => new ScalarParameter(50, {
                    name: 'unsprung mass',
                    tolerance_absolute: 5,
                    tolerance_relative: 0.012
                })
                ).to.throw();
            });

            it('both, std deviation and std deviation factor given => expect to throw', () => {
                expect(() => new ScalarParameter(100, {
                    name: 'unsprung mass',
                    tolerance_absolute: 4,
                    standard_deviation: 2,
                    standard_deviation_factor: 3
                })
                ).to.throw();
            });

            it('standard deviation given without any limits => expect to throw', () => {
                expect(() => new ScalarParameter(100, {
                    name: 'unsprung mass',
                    standard_deviation: 2
                })
                ).to.throw();
            });

            it('standard deviation factor given without tolerance => expect to throw', () => {
                expect(() => new ScalarParameter(100, {
                    name: 'unsprung mass',
                    standard_deviation_factor: 2
                })
                ).to.throw();
            });

            it('standard deviation factor given with limits instead tolerance => expect to throw', () => {
                expect(() => new ScalarParameter(100, {
                    name: 'unsprung mass',
                    lower_limit: 90,
                    upper_limit: 120,
                    standard_deviation_factor: 2
                })
                ).to.throw();
            });

            it('standard deviation negative => expect to throw', () => {
                expect(() => new ScalarParameter(100, {
                    name: 'unsprung mass',
                    lower_limit: 90,
                    upper_limit: 110,
                    standard_deviation: -4.5
                })
                ).to.throw();
            });

        });

    });

    describe('calcPdf', () => {

        describe('arguments and return tests', () => {

            var parameter = new ScalarParameter(200, {
                name: 'spring stiffness constant c',
                unit: 'N/cm',
                interval: 1e-3,
                tolerance_absolute: 5,
                standard_deviation: 0.8
            });

            it('valid call => expect properties to be defined accordingly', () => {
                let pdf = parameter.calcPdf(101);

                expect(pdf.type).to.deep.equal('PDF');
                expect(pdf.unit).to.deep.equal('N/cm');
                expect(pdf.x).to.not.be.undefined;
                expect(pdf.p).to.not.be.undefined;
            });

            it('no definition of sample number => expect maximum no. of samples by default', () => {
                let pdf = parameter.calcPdf();

                const expectedLength = Math.floor((parameter.limits[1] - parameter.limits[0]) / parameter.interval);

                expect(pdf.x.length).to.equal(expectedLength);
                expect(pdf.p.length).to.equal(expectedLength);
            });

            it('definition of sample number => expect defined no. of samples', () => {
                let pdf = parameter.calcPdf(80);

                expect(pdf.x.length).to.equal(80);
                expect(pdf.p.length).to.equal(80);
            });

        });

        describe('valid calls', () => {

            var parameter = new ScalarParameter(200, {
                name: 'spring stiffness constant c',
                unit: 'N/cm',
                interval: 1e-3,
                tolerance_absolute: 5,
                standard_deviation: 0.8
            });

            it('valid call => expect maximum at nominal value', () => {
                let pdf = parameter.calcPdf(101);
                let idxMax = pdf.p.findIndex(el => el == Math.max(...pdf.p));

                expect(pdf.x[idxMax]).to.equal(200);
            });

            it('symmetric limits => expect nominal value to be centered', () => {
                let pdf = parameter.calcPdf(11);

                expect(pdf.x[5]).to.equal(200);
            });

            it('symmetric limits => expect symmetric distribution', () => {
                let pdf = parameter.calcPdf(11);

                let pLeft = pdf.p.slice(0, 5)
                let pRight = pdf.p.slice(6);

                expect(pLeft).to.deep.equal(pRight.reverse());
            });

            it('symmetric limits => expect minimum at limits', () => {
                let pdf = parameter.calcPdf(100);
                let idxMinLeft = pdf.p.findIndex(el => el == Math.min(...pdf.p));
                let idxMinRight = pdf.p.findLastIndex(el => el == Math.min(...pdf.p))

                expect(pdf.x[idxMinLeft]).to.equal(195.05);
                expect(pdf.x[idxMinRight]).to.equal(204.95);
            });

            it('symmetric limits => expect limit probabilities to be equal', () => {
                let pdf = parameter.calcPdf(101);

                expect(pdf.p[0]).to.equal(pdf.p[100]);
            });

            it('asymmetric limits => expect closer limit to be greater than distant limit', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    lower_limit: 199,
                    upper_limit: 204,
                    standard_deviation: 0.8
                });

                let pdf = parameter.calcPdf(101);

                expect(pdf.p[0]).to.be.above(pdf.p[100])
            });

            it('asymmetric limits => expect maximum to be at nominal value', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    lower_limit: 199,
                    upper_limit: 204,
                    standard_deviation: 0.8
                });

                const pdf = parameter.calcPdf();
                const idxMax = pdf.p.findIndex(el => el == Math.max(...pdf.p));

                expect(pdf.x[idxMax]).to.equal(200);
            });

            it('valid call => expect interval to be applied', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 0.25,
                    tolerance_absolute: 5,
                    standard_deviation: 1
                });

                const pdf = parameter.calcPdf(25);

                expect(pdf.x[1]).to.equal(195.5); // 195.6 w/o interval
            });

            it('valid call => probabilities integral must be 1', () => {
                const pdf = parameter.calcPdf(41);

                dx = pdf.x[1] - pdf.x[0];
                const sum = pdf.p.reduce((prev, curr, i) => prev + curr * dx, 0);

                expect(sum).to.be.closeTo(1, 1e-3);
            });

            it('number of samples higher than theoretically possible number of samples => expect to adjust samples to max number', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 0.1,
                    tolerance_absolute: 2,
                    standard_deviation_factor: 1
                });

                const maxNOfSamples = (parameter.limits[1] - parameter.limits[0]) / parameter.interval;

                let cdf = parameter.calcPdf(maxNOfSamples + 1);

                expect(cdf.x.length).to.equal(maxNOfSamples);
            });

            it('number of samples higher than maximum allowed number of samples => expect to adjust samples to max number', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 1e-5,
                    tolerance_absolute: 2,
                    standard_deviation_factor: 1
                });

                let cdf = parameter.calcPdf(); // theoretic limit: 4e+5 samples

                expect(cdf.x.length).to.equal(N_SAMPLES_MAX);
            });

        });

        describe('invalid calls', () => {

            it('no standard deviation given => expect to throw', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 1e-3,
                    lower_limit: 199,
                    upper_limit: 202,
                });

                expect(() => parameter.calcPdf()).to.throw();
            });

        });

    });

    describe('calcCdf', () => {

        describe('arguments and return test', () => {

            var parameter = new ScalarParameter(200, {
                name: 'spring stiffness constant c',
                unit: 'N/cm',
                interval: 1e-2,
                tolerance_absolute: 5,
                standard_deviation: 0.8
            });

            it('valid call => expect properties to be defined accordingly', () => {
                const cdf = parameter.calcCdf(101);

                expect(cdf.type).to.deep.equal('CDF');
                expect(cdf.unit).to.deep.equal('N/cm');
                expect(cdf.x).to.not.be.undefined;
                expect(cdf.p).to.not.be.undefined;
            });

            it('no definition of sample number => expect maximum no. of possible samples by default', () => {
                const cdf = parameter.calcCdf();

                const expectedLength = Math.floor((parameter.limits[1] - parameter.limits[0]) / parameter.interval) + 1;

                expect(cdf.x.length).to.equal(expectedLength);
                expect(cdf.p.length).to.equal(expectedLength);
            });

            it('definition of sample number => expect defined no. of samples', () => {
                const cdf = parameter.calcCdf(80);

                expect(cdf.x.length).to.equal(80);
                expect(cdf.p.length).to.equal(80);
            });

        });

        describe('valid calls', () => {

            var parameter = new ScalarParameter(200, {
                name: 'spring stiffness constant c',
                unit: 'N/cm',
                interval: 1e-2,
                tolerance_absolute: 5,
                standard_deviation: 0.8
            });

            it('symmetric limits => expect 0.5 at nominal value', () => {
                const cdf = parameter.calcCdf(101);
                let idx05 = cdf.p.findIndexClosest(0.5);

                expect(cdf.x[idx05]).to.equal(200);
            });

            it('symmetric limits => expect 0 and 1 at limits', () => {
                let cdf = parameter.calcCdf(101);

                expect(cdf.p[0]).to.equal(0);
                expect(cdf.p[100]).to.equal(1);
            });

            it('symmetric limits => expect mirrored function w.r.t. (x = nominal, p = 0.5)', () => {
                let cdf = parameter.calcCdf(21);

                let pLeft = cdf.p.slice(0, 10)
                let pRight = cdf.p.slice(11);
                let pRightMirr = pRight.reverse().map(p => 1 - p); // mirrored at (nominal, 0.5)
                let pDiff = pLeft.map((pL, i) => Math.abs(pL - pRightMirr[i]));

                expect(pDiff.every(p => p < 1e-6)).to.be.true;
            });

            it('asymmetric limits => expect nominal value not to be centered', () => {
                let parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 1e-3,
                    upper_limit: 205,
                    lower_limit: 197,
                    standard_deviation: 0.8,
                });

                let cdf = parameter.calcCdf(1001);

                let idx05 = cdf.p.findIndexClosest(0.5);

                expect(idx05).to.not.equal(500);
                expect(cdf.x[idx05]).to.equal(200);
            });

            it('lower limit smaller => expect center value to be greater than 0.5 ', () => {
                let parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 1e-2,
                    upper_limit: 205,
                    lower_limit: 199,
                    standard_deviation: 0.8
                });

                let cdf = parameter.calcCdf(101);

                expect(cdf.p[50]).to.be.above(0.5);
            });

            it('upper limit smaller => expect center value to be lower than 0.5 ', () => {
                let parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 1e-2,
                    upper_limit: 201,
                    lower_limit: 195,
                    standard_deviation: 0.8
                });

                let cdf = parameter.calcCdf(101);

                expect(cdf.p[50]).to.be.below(0.5);
            });

            it('valid call => expect interval to be applied', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 0.2,
                    tolerance_absolute: 5,
                    standard_deviation: 1
                });

                let cdf = parameter.calcCdf(41);

                expect(cdf.x[1]).to.equal(195.2); // 195.25 w/o interval
            });

            
            it('number of samples higher than theoretically possible number of samples => expect to adjust samples to max number', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 0.1,
                    tolerance_absolute: 2,
                    standard_deviation_factor: 1
                });

                const maxNOfSamples = (parameter.limits[1] - parameter.limits[0]) / parameter.interval + 1;

                let cdf = parameter.calcCdf(maxNOfSamples + 1);

                expect(cdf.x.length).to.equal(maxNOfSamples);
            });

            it('number of samples higher than maximum allowed number of samples => expect to adjust samples to max number', () => {
                parameter = new ScalarParameter(200, {
                    name: 'spring stiffness constant c',
                    unit: 'N/cm',
                    interval: 1e-5,
                    tolerance_absolute: 2,
                    standard_deviation_factor: 1
                });

                let cdf = parameter.calcCdf(); // theoretic limit: 4e+5 + 1 samples

                expect(cdf.x.length).to.equal(N_SAMPLES_MAX + 1);
            });

        });

    });

});