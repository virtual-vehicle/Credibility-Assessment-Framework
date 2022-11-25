const { describe, it } = require('mocha');
const { expect } = require('chai');
const { ScalarParameter } = require('..');
const util = require('../../util-common');
const helper = require('../src/helper');

describe('extractParameterCombination', () => {

    var aleatoryParam = new ScalarParameter(10, {
        name: "test aleatory",
        tolerance_absolute: 1,
        standard_deviation: 0.5
    });

    var epistemicParam = new ScalarParameter(100, {
        name: "test epistemic",
        lower_limit: 97,
        upper_limit: 105
    });
    
    var discreteParam = new ScalarParameter(50, {
        name: "discrete test"
    });

    it('single aleatory', () => {
        let combination = helper.extractParameterCombination([aleatoryParam]);
        
        expect(combination).to.deep.equal({
            aleatory: 1,
            epistemic: 0,
            discrete: 0
        });
    });

    it('single epistemic', () => {
        let combination = helper.extractParameterCombination([epistemicParam]);
        
        expect(combination).to.deep.equal({
            aleatory: 0,
            epistemic: 1,
            discrete: 0
        });
    });

    it('multi aleatory', () => {
        let combination = helper.extractParameterCombination([aleatoryParam, aleatoryParam]);
        
        expect(combination).to.deep.equal({
            aleatory: 2,
            epistemic: 0,
            discrete: 0
        });
    });

    it('multi epistemic', () => {
        let combination = helper.extractParameterCombination([epistemicParam, epistemicParam]);
        
        expect(combination).to.deep.equal({
            aleatory: 0,
            epistemic: 2,
            discrete: 0
        });
    });

    it('mixed aleatory and epistemic', () => {
        let combination = helper.extractParameterCombination([aleatoryParam, epistemicParam]);
        
        expect(combination).to.deep.equal({
            aleatory: 1,
            epistemic: 1,
            discrete: 0
        });
    });

    it('discrete contained => expect to ignore', () => {
        let combination = helper.extractParameterCombination([aleatoryParam, epistemicParam, discreteParam]);
        
        expect(combination).to.deep.equal({
            aleatory: 1,
            epistemic: 1,
            discrete: 1
        });
    });

    it('single discrete', () => {
        let combination = helper.extractParameterCombination([discreteParam]);

        expect(combination).to.deep.equal({
            aleatory: 0,
            epistemic: 0,
            discrete: 1
        });
    });

    it('multi discrete', () => {
        let combination = helper.extractParameterCombination([discreteParam, discreteParam]);

        expect(combination).to.deep.equal({
            aleatory: 0,
            epistemic: 0,
            discrete: 2
        });
    });

});

describe('checkSamplingInputs', () => {

    var aleatoryParameter1 = new ScalarParameter(40, {
        name: 'spring stiffness constant c',
        unit: 'N/cm',
        tolerance_absolute: 2,
        standard_deviation: 1,
    });

    var aleatoryParameter2 = new ScalarParameter(1000, {
        name: "damping coefficient k",
        unit: "N/(cm/s)",
        tolerance_relative: 0.04,
        standard_deviation_factor: 2
    });

    var epistemicParameter1 = new ScalarParameter(1570, {
        name: "vehicle mass m",
        unit: "kg",
        lower_limit: 1490,
        upper_limit: 1800
    });

    var epistemicParameter2 = new ScalarParameter(0.55, {
        name: "front-axle load, relative",
        unit: "-",
        lower_limit: 0.47,
        upper_limit: 0.59
    });

    var discreteParameter = new ScalarParameter(75, {
        name: "normed passenger weight",
        unit: "kg"
    });

    describe('valid inputs', () => {

        it('only aleatory; total samples given, general method given => expect to take total/general values', () => {
            let parameters = [aleatoryParameter1, aleatoryParameter2];
            let config = {
                samples: 10,
                method: "monte_carlo"
            };

            config = helper.checkSamplingInputs(parameters, config);

            expect(config.samples_aleatory).to.equal(10);
            expect(config.method_aleatory).to.deep.equal("monte_carlo");            
        });

        it('only aleatory; total and indiv. samples given, general and indiv. method given => expect not to throw, total/general will be ignored', () => {
            let parameters = [aleatoryParameter1, aleatoryParameter2];
            let config = {
                samples: 10,
                samples_aleatory: 9,
                method: "monte_carlo",
                method_aleatory: "equally_spaced"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.not.throw(); 
        });

        it('only epistemic; total number given, general method given => expect not to throw', () => {
            let parameters = [epistemicParameter1, epistemicParameter2];
            let config = {
                samples: 100,
                method: "equally_spaced"
            };

            config = helper.checkSamplingInputs(parameters, config);

            expect(config.samples_epistemic).to.equal(100);
            expect(config.method_epistemic).to.deep.equal("equally_spaced");    
        });

        it('only epistemic; total and indiv. samples given, general and indiv. method given => expect not to throw, total/general will be ignored', () => {
            let parameters = [epistemicParameter1, epistemicParameter2];
            let config = {
                samples: 10,
                samples_epistemic: 9,
                method: "monte_carlo",
                method_epistemic: "equally_spaced"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.not.throw(); 
        });

        it('mixed aleatory and epistemic; indiv. samples given, indiv. method given => expect not to throw', () => {
            let parameters = [epistemicParameter1, epistemicParameter2];
            let config = {
                samples_epistemic: 9,
                samples_aleatory: 20,
                method_epistemic: "equally_spaced",
                method_aleatory: "equally_spaced"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.not.throw(); 
        });

        it('mixed aleatory and epistemic; total + indiv. samples given, general + indiv. method given => expect not to throw, total/general will be ignored', () => {
            let parameters = [epistemicParameter1, epistemicParameter2];
            let config = {
                samples: 100,
                samples_epistemic: 9,
                samples_aleatory: 20,
                method: "monte_carlo",
                method_epistemic: "equally_spaced",
                method_aleatory: "equally_spaced"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.not.throw(); 
        });

        it('only aleatory; no information given => expect to take default values', () => {
            let parameters = [aleatoryParameter1, aleatoryParameter2];
            let config = { };

            config = helper.checkSamplingInputs(parameters, config);

            expect(config.samples_aleatory).to.equal(helper.N_SAMPLES_DEFAULT);
            expect(config.method_aleatory).to.deep.equal(helper.METHOD_DEFAULT);
        });

        it('only epistemic; no information given => expect to take default values', () => {
            let parameters = [epistemicParameter1, epistemicParameter2];
            let config = { };

            config = helper.checkSamplingInputs(parameters, config);

            expect(config.samples_epistemic).to.equal(helper.N_SAMPLES_DEFAULT);
            expect(config.method_epistemic).to.deep.equal(helper.METHOD_DEFAULT);
        });

        it('mixed parameters; no information given => expect to take default values', () => {
            let parameters = [epistemicParameter1, aleatoryParameter1, aleatoryParameter1, discreteParameter];
            let config = { };

            config = helper.checkSamplingInputs(parameters, config);

            expect(config.samples_epistemic).to.equal(helper.N_SAMPLES_DEFAULT);
            expect(config.samples_epistemic).to.equal(helper.N_SAMPLES_DEFAULT);
            expect(config.method_epistemic).to.deep.equal(helper.METHOD_DEFAULT);
            expect(config.method_aleatory).to.deep.equal(helper.METHOD_DEFAULT);
        });

    });

    describe('invalid inputs', () => {

        it('parameter class wrong', () => {
            let parameters = [aleatoryParameter1, aleatoryParameter1, epistemicParameter1, {name: "fancy parameter"}];
            let config = {
                samples_epistemic: 10,
                samples_aleatory: 10,
                method_aleatory: "monte_carlo",
                method_epistemic: "monte_carlo"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.throw(); 
        });

        it('only discrete parameters => expect to throw', () => {
            let parameters = [discreteParameter, discreteParameter];
            let config = {
                samples: 10,
                method: "monte_carlo",
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.throw(); 
        });

        it('mixed parameters, samples inconsistent => expect to throw', () => {
            let parameters = [aleatoryParameter1, epistemicParameter1, epistemicParameter2, discreteParameter];
            let config = {
                samples: 10,
                samples_aleatory: 6,
                method_epistemic: "equally_spaced",
                method_aleatory: "monte_carlo"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.throw(); 
        });

        it('mixed parameters, method inconsistent => expect to throw', () => {
            let parameters = [aleatoryParameter1, epistemicParameter1, epistemicParameter2, discreteParameter];
            let config = {
                samples_epistemic: 10,
                samples_aleatory: 6,
                method: "monte_carlo",
                method_aleatory: "monte_carlo"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.throw(); 
        });

        it('mixed parameters, invalid number of samples for epistemic => expect to throw', () => {
            let parameters = [aleatoryParameter1, epistemicParameter1, epistemicParameter2, discreteParameter];
            let config = {
                samples_aleatory: 10,
                samples_epistemic: 0,
                method_epistemic: "equally_spaced",
                method_aleatory: "monte_carlo"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.throw(); 
        });

        it('mixed parameters, invalid number of samples for aleatory => expect to throw', () => {
            let parameters = [aleatoryParameter1, epistemicParameter1, epistemicParameter2, discreteParameter];
            let config = {
                samples_aleatory: -5,
                samples_epistemic: 10,
                method_epistemic: "equally_spaced",
                method_aleatory: "monte_carlo"
            };

            expect(() => helper.checkSamplingInputs(parameters, config)).to.throw(); 
        });
        
    });
    
});

describe('shuffle', () => {
    
    it('empty array => empty back', () => {
        let array = [];

        expect(helper.shuffle(array)).to.deep.equal([]);
    });

    it('one element => same array back', () => {
        let array = [5.453];
        
        expect(helper.shuffle(array)).to.deep.equal(array);
    });

    it('more than one element => expect shuffled array', () => {
        // stubbing of randomInt prohibited...
        let array = [1.4, 7.6, 10.3, 5.0];
        let shuffledArray = helper.shuffle(array);

        array.forEach(el => expect(shuffledArray.includes(el)).to.be.true);
    });
    
});

describe('getXFromPSamples', () => {

    var parameterSymmetric = new ScalarParameter(40, {
        name: 'spring stiffness constant c',
        unit: 'N/cm',
        tolerance_absolute: 2,
        standard_deviation: 1,
        precision: 4
    });

    var parameterAsymmetric = new ScalarParameter(40, {
        name: 'spring stiffness constant c',
        unit: 'N/cm',
        lower_limit: 35,
        upper_limit: 42,
        standard_deviation: 1,
        precision: 4
    })

    it('symmetric, 0 and 1 as samples => expect boundary values', () => {
        let pSamples = [0, 0.99999];
        let xSamples = helper.getXFromPSamples(parameterSymmetric, pSamples);

        let expectedValues = [38.00, 42.00];
        let diff = xSamples.map((el, i) => Math.abs(el - expectedValues[i]));

        expect(diff.every(el => el < 1e-2)).to.be.true;
    });

    it('symmetric, 0.5 as sample => expect nominal value', () => {
        let pSamples = [0.5];
        let xSamples = helper.getXFromPSamples(parameterSymmetric, pSamples);
        let diff = Math.abs(xSamples[0] - 40.00);

        expect(diff).to.be.below(1e-2);
    });

    it('asymmetric, 0 and 1 as samples => expect boundary values', () => {
        let pSamples = [0, 0.99999];
        let xSamples = helper.getXFromPSamples(parameterAsymmetric, pSamples);

        let expectedValues = [35.00, 42.00];
        let diff = xSamples.map((el, i) => Math.abs(el - expectedValues[i]));

        expect(diff.every(el => el < 1e-2)).to.be.true;
    });

    it('asymmetric, 0.5 as sample => expect value to be below nominal value', () => {
        let pSamples = [0.5];
        let xSamples = helper.getXFromPSamples(parameterAsymmetric, pSamples);

        expect(xSamples[0]).to.be.below(40);
    });

    it('check random order of samples (not monot. increasing)', () => {
        let pSamples = [0.545, 0.174, 0.987];
        
        expect(() => helper.getXFromPSamples(parameterAsymmetric, pSamples)).to.not.throw();
    });
    
});

describe('makeEquallySpacedArray', () => {

    it('include boundaries => expect min and max as end samples', () => {
        let array = helper.makeEquallySpacedArray(2, 8, 5, true);

        expect(array).to.deep.equal([2.0, 3.5, 5.0, 6.5, 8.0]);
    });

    it('not include boundaries => expect first/last to have half interval length to min/max', () => {
        let array = helper.makeEquallySpacedArray(0, 10, 5, false);
        
        expect(array).to.deep.equal([1.0, 3.0, 5.0, 7.0, 9.0]);
    });

    it('shuffleArray = true => expect shuffled array as output', () => {
        let orderedArray = helper.makeEquallySpacedArray(0, 10, 1000, true, false);
        let shuffledArray = helper.makeEquallySpacedArray(0, 10, 1000, false, true);     

        expect(shuffledArray).to.not.deep.equal(orderedArray);     
    });
    
    
});

describe('makeMonteCarloArray', () => {
    
    it('check boundaries', () => {
        let array = helper.makeMonteCarloArray(-4.01, 2.547, 5);

        array.forEach(el => {
            let arg = el >= -4.01 && el < 2.547;
            expect(arg).to.be.true;
        });      
    });

    it('check array length', () => {
        let array = helper.makeMonteCarloArray(0, 10.4, 5);

        expect(array.length).to.equal(5);     
    });

});

describe('generateEpistemicSamples', () => {

    var epistemicParameter1 = new ScalarParameter(1570, {
        name: "vehicle mass m",
        unit: "kg",
        lower_limit: 1490,
        upper_limit: 1800
    });

    var epistemicParameter2 = new ScalarParameter(20, {
        name: "temperature range",
        unit: "degC",
        lower_limit: -30,
        upper_limit: 50,
        precision: 4
    });

    it('one parameter, equally-spaced', () => {
        let samples = helper.generateEpistemicSamples([epistemicParameter2], "equally_spaced", 5);
        let expectedSamples = [[-30], [50], [30], [10], [-10]];

        expect(samples.flat().sort((a,b)=>a-b)).to.deep.equal(expectedSamples.flat().sort((a,b)=>a-b));
    });
    
    it('one parameter, monte-carlo', () => {
        let samples = helper.generateEpistemicSamples([epistemicParameter2], "monte_carlo", 1000);

        expect(samples.every(val => 
            val[0] >= epistemicParameter2.limits[0] && val[0] <= epistemicParameter2.limits[1]
        )).to.be.true;   
    });

    it('check if interval is applied', () => {
        let samples = helper.generateEpistemicSamples([epistemicParameter2], "monte_carlo", 1);
        
        expect(samples.every(val => 
            util.mod(val[0], epistemicParameter2.interval) == 0
        )).to.be.true; 
    });

    it('multiple parameters', () => {
        let samples = helper.generateEpistemicSamples([epistemicParameter1, epistemicParameter2], "equally_spaced", 3);

        let samples1 = samples.map(tuple => tuple[0]);
        let samples2 = samples.map(tuple => tuple[1]);

        let expectedSamples1Sorted = [1490, 1645, 1800];
        let expectedSamples2Sorted = [-30, 10, 50];

        expect(samples1.sort((a,b)=>a-b)).to.deep.equal(expectedSamples1Sorted);
        expect(samples2.sort((a,b)=>a-b)).to.deep.equal(expectedSamples2Sorted);
    });

});

describe('generateAleatorySamples', () => {

    var aleatoryParameter1 = new ScalarParameter(40, {
        name: 'spring stiffness constant c',
        unit: 'N/cm',
        interval: 1e-3,
        tolerance_absolute: 2,
        standard_deviation: 1,
        precision: 4
    });

    var aleatoryParameter2 = new ScalarParameter(-10, {
        name: "operating temperature",
        unit: "degC",
        interval: 1e-3,
        tolerance_relative: 0.40,
        standard_deviation_factor: 2,
        precision: 4
    });

    it('one parameter, equally-spaced', () => {
        let samples = helper.generateAleatorySamples([aleatoryParameter1], "equally_spaced", 4);
        let samplesSorted = samples.flat().sort((a,b)=>a-b);

        let expectedSamplesSorted = [38.93, 39.70, 40.30, 41.07];
        let diff = samplesSorted.map((val, i) => Math.abs(val - expectedSamplesSorted[i]));

        expect(diff.every(val => val < 0.05)).to.be.true;               
    });

    it('one parameter, monte-carlo', () => {        
        let samples = helper.generateAleatorySamples([aleatoryParameter1], "monte_carlo", 1000);

        expect(samples.every(val => 
            val[0] >= aleatoryParameter1.limits[0] && val[0] <= aleatoryParameter1.limits[1]
        )).to.be.true;       
    });

    it('check if interval is applied', () => {        
        let samples = helper.generateAleatorySamples([aleatoryParameter1], "monte_carlo", 4);

        expect(samples.every(val => 
            util.mod(val[0], aleatoryParameter1.interval) == 0
        )).to.be.true; 
    });

    it('multiple parameters', () => {    
        let samples = helper.generateAleatorySamples([aleatoryParameter1, aleatoryParameter2], "monte_carlo", 100);

        expect(samples.every(val => 
            val[0] >= aleatoryParameter1.limits[0] && val[0] <= aleatoryParameter1.limits[1] && 
            val[1] >= aleatoryParameter2.limits[0] && val[1] <= aleatoryParameter2.limits[1]
        )).to.be.true;   
    });
});