const { describe, it } = require('mocha');
const { expect } = require('chai');
const util = require('..');

describe('roundToDigit', () => {

    describe('argument tests', () => {

        it('all values as expected, no roundFn specified => expect not to throw', () => {
            expect(() => util.roundToDigit(1.477, 2)).to.not.throw();
        });

        it('all values as expected, roundFn = Math.ceil => expect not to throw', () => {
            expect(() => util.roundToDigit(789, -1, Math.ceil)).to.not.throw();
        });

        it('all values as expected, roundFn = Math.floor => expect not to throw', () => {
            expect(() => util.roundToDigit(789, -1, Math.floor)).to.not.throw();
        });

        it('value not number => expect to throw', () => {
            expect(() => util.roundToDigit([456.44], 1)).to.throw();
        });

        it('digit not number => expect to throw', () => {
            expect(() => util.roundToDigit(456.44, [1])).to.throw();
        });

        it('digit not integer => expect to throw', () => {
            expect(() => util.roundToDigit(456.44, 1.5)).to.throw();
        });

        it('roundFn not supported => expect to throw', () => {
            expect(() => util.roundToDigit(456.44, -2, Math.abs)).to.throw();
        });

    });

    describe('return test', () => {

        it('digit > 0 => expect to round to value after decimal point', () => {
            const roundedValue = util.roundToDigit(2500.7137, 3);
            expect(roundedValue).to.equal(2500.714);
        });

        it('digit = 0 => expect to round to integer', () => {
            const roundedValue = util.roundToDigit(-440.10000000002, 0);
            expect(roundedValue).to.equal(-440);
        });

        it('digit < 0 => expect to round to power of ten', () => {
            const roundedValue = util.roundToDigit(2742684.7489, -3);
            expect(roundedValue).to.equal(2743000);
        });

        it('roundFn = Math.floor => expect to round down', () => {
            const roundedValue = util.roundToDigit(9.8447e-2, 2, Math.floor);
            expect(roundedValue).to.equal(0.09);
        });

        it('roundFn = Math.ceil => expect to round up', () => {
            const roundedValue = util.roundToDigit(147123301, -2, Math.ceil);
            expect(roundedValue).to.equal(147123400);
        });

        it('floating point representation => expect to cut trailing digits', () => {
            const roundedValue = util.roundToDigit(0.2-0.02, 2);
            expect(roundedValue).to.equal(0.18);
        });

        it('big number => expect to return correct value', () => {
            const roundedValue = util.roundToDigit(-78e+16, -4, Math.floor);
            expect(roundedValue).to.equal(-78e16);
        });
        
    });
    
});

describe('getLsd', () => {

    describe('argument tests', () => {

        it('value numeric => expect to not throw', () => {
            expect(() => util.getLsd(-1.2478)).to.not.throw();            
        });

        it('value not numeric => expect to throw', () => {
            expect(() => util.getLsd([7.2557])).to.throw();            
        });

    });

    describe('return tests', () => {

        it('positive value with decimal point => expect lsd > 0', () => {
            const lsd = util.getLsd(1.005);
            expect(lsd).to.equal(3);
        });

        it('negative value with decimal point => expect lsd > 0', () => {
            const lsd = util.getLsd(-0.1110024);
            expect(lsd).to.equal(7);
        });     

        it('trailing zeroes after decimal point => expect to ignore trailing zeroes', () => {
            const lsd = util.getLsd(70.79900);
            expect(lsd).to.equal(3);
        });

        it('positive integer value => expect lsd == 0', () => {
            const lsd = util.getLsd(6503);
            expect(lsd).to.equal(0);  
        });

        it('negative integer value => expect lsd == 0', () => {
            const lsd = util.getLsd(-9654);
            expect(lsd).to.equal(0);  
        });

        it('positive integer with trailing zeroes => expect lsd < 0', () => {
            const lsd = util.getLsd(6500);
            expect(lsd).to.equal(-2);  
        });

        it('small number => expect lsd > 0', () => {
            const lsd = util.getLsd(1.43e-57);
            expect(lsd).to.equal(59);
        });

        it('bigger number => expect lsd < 0', () => {
            const lsd = util.getLsd(-7.8e+14);
            expect(lsd).to.equal(-13);
        });

        it('value is 0 => expect 0', () => {
            const lsd = util.getLsd(0);
            expect(lsd).to.equal(0);
        });
        
    });
    
});

describe('roundToInterval', () => {

    describe('argument tests', () => {

        it('all args valid => expect to not throw', () => {
            expect(() => util.roundToInterval(-24.786, 0.05)).to.not.throw();
        });

        it('value not a number => expect to throw', () => {
            expect(() => util.roundToInterval('1.4', 0.05)).to.throw();
        });

        it('interval not a number => expect to throw', () => {
            expect(() => util.roundToInterval(1.4, '0.05')).to.throw();
        });

        it('interval 0 => expect to throw', () => {
            expect(() => util.roundToInterval(1.4, 0)).to.throw();
        });

        it('interval < 0 => expect to throw', () => {
            expect(() => util.roundToInterval(741.4, -5)).to.throw();
        });
        
    });

    describe('return tests', () => {

        it('positive number, interval is integer => expect integer rounding', () => {
            const rounded = util.roundToInterval(24.786, 2);
            expect(rounded).to.equal(24);
        });

        it('negative number, interval is integer => expect integer rounding', () => {
            const rounded = util.roundToInterval(-7424.786, 5);
            expect(rounded).to.equal(-7425);
        });

        it('interval < 1 => round to decimal', () => {
            const rounded = util.roundToInterval(254.71, 0.5);
            expect(rounded).to.equal(254.5);
        });

        it('positive number nearer to smaller number => round down to next interval', () => {
            const rounded = util.roundToInterval(2.2, 0.5);
            expect(rounded).to.equal(2.0);
        });

        it('positive number exactly between two intervals => round up to next interval', () => {
            const rounded = util.roundToInterval(2.25, 0.5);
            expect(rounded).to.equal(2.5);
        });

        it('positive number nearer to higher number => round up to next interval', () => {
            const rounded = util.roundToInterval(2.3, 0.5);
            expect(rounded).to.equal(2.5);
        });

        it('number slightly smaller than being between two intervals => round down to next interval', () => {
            const rounded = util.roundToInterval(17689.7499999, 0.1);
            expect(rounded).to.equal(17689.7);
        });

        it('negative number nearer to higher number => round up to next interval', () => {
            const rounded = util.roundToInterval(-2.2, 0.5);
            expect(rounded).to.equal(-2.0);
        });

        it('negative number exactly between two intervals => round down to next interval', () => {
            const rounded = util.roundToInterval(-2.25, 0.5);
            expect(rounded).to.equal(-2.0);
        });

        it('negative number nearer to smaller number => round up down next interval', () => {
            const rounded = util.roundToInterval(-2.3, 0.5);
            expect(rounded).to.equal(-2.5);
        });

        it('positive number matches exactly the interval => expect no rounding', () => {
            const rounded = util.roundToInterval(58, 1);
            expect(rounded).to.equal(58);
        });

        it('negative number matches exactly the interval => expect no rounding', () => {
            const rounded = util.roundToInterval(-58, 1);
            expect(rounded).to.equal(-58);
        });
        
    });
    
});

describe('floorToInterval', () => {

    describe('return tests (other scope is the same as roundToInterval)', () => {

        it('positive number, interval is integer => expect integer flooring', () => {
            const rounded = util.floorToInterval(25.786, 2);
            expect(rounded).to.equal(24);
        });

        it('negative number, interval is integer => expect integer flooring', () => {
            const rounded = util.floorToInterval(-7421.786, 5);
            expect(rounded).to.equal(-7425);
        });

        it('interval < 1 => floor to decimal', () => {
            const rounded = util.floorToInterval(254.76, 0.5);
            expect(rounded).to.equal(254.5);
        });

        it('positive number exactly between two intervals => floor to next interval', () => {
            const rounded = util.floorToInterval(2.25, 0.5);
            expect(rounded).to.equal(2.0);
        });

        it('positive number nearer to higher number => floor to next interval', () => {
            const rounded = util.floorToInterval(2.3, 0.5);
            expect(rounded).to.equal(2.0);
        });

        it('negative number nearer to higher number => floor to next interval', () => {
            const rounded = util.floorToInterval(-2.2, 0.5);
            expect(rounded).to.equal(-2.5);
        });

        it('negative number exactly between two intervals => floor to next interval', () => {
            const rounded = util.floorToInterval(-2.25, 0.5);
            expect(rounded).to.equal(-2.5);
        });

        it('positive number matches exactly the interval => expect no flooring', () => {
            const rounded = util.floorToInterval(58, 1);
            expect(rounded).to.equal(58);
        });

        it('positive number matches exactly the interval => expect no flooring', () => {
            const rounded = util.floorToInterval(-58, 1);
            expect(rounded).to.equal(-58);
        });

    });
    
});

describe('ceilToInterval', () => {

    describe('return tests (other scope is the same as roundToInterval)', () => {

        it('positive number, interval is integer => expect integer ceiling', () => {
            const rounded = util.ceilToInterval(24.786, 2);
            expect(rounded).to.equal(26);
        });

        it('negative number, interval is integer => expect integer ceiling', () => {
            const rounded = util.ceilToInterval(-7424.786, 5);
            expect(rounded).to.equal(-7420);
        });

        it('interval < 1 => ceil to decimal', () => {
            const rounded = util.ceilToInterval(254.74, 0.5);
            expect(rounded).to.equal(255.0);
        });

        it('positive number, remainder cloaser to lower interval => ceil to next interval', () => {
            const rounded = util.ceilToInterval(2.2, 0.5);
            expect(rounded).to.equal(2.5);
        });

        it('negative number, remainder closer to lower interval => ceil to next interval', () => {
            const rounded = util.ceilToInterval(-2.3, 0.5);
            expect(rounded).to.equal(-2.0);
        });

        it('negative number exactly between two intervals => ceil to next interval', () => {
            const rounded = util.ceilToInterval(-2.25, 0.5);
            expect(rounded).to.equal(-2.0);
        });

        it('positive number matches exactly the interval => expect no ceiling', () => {
            const rounded = util.ceilToInterval(58, 1);
            expect(rounded).to.equal(58);
        });

        it('negative number matches exactly the interval => expect no ceiling', () => {
            const rounded = util.ceilToInterval(58, 1);
            expect(rounded).to.equal(58);
        });

    });
    
});

describe('mod', () => {
    
    describe('argument tests', () => {
        
        it('all args valid => expect to not throw', () => {
            expect(() => util.mod(12.5, 0.2)).to.not.throw();
        });

        it('value not a number => expect to throw', () => {
            expect(() => util.mod('12.5', 0.2)).to.throw();
        });

        it('divisor not a number => expect to throw', () => {
            expect(() => util.mod(12.5, '0.2')).to.throw();
        });

    });

    describe('return tests', () => {

        it('positive number, positive integer', () => {
            const rem = util.mod(7.4, 2); 
            expect(rem).to.equal(1.4); // 1.4000000000000004 for 7.4 % 2
        });

        it('positive number, negative integer', () => {
            const rem = util.mod(-45.1e-1, -3); 
            expect(rem).to.equal(-1.51); // -1.5099999999999998 for -45.1e-1 % -3   
        });

        it('negative number, positive integer', () => {
            const rem = util.mod(-58.7, 3); 
            expect(rem).to.equal(-1.7); // -1.7000000000000028 for -58.7 % 3    
        });

        it('negative number, negative integer', () => {
            const rem = util.mod(-147.7, -4); 
            expect(rem).to.equal(-3.7); // -3.6999999999999886 for -58.7 % -4    
        });
        
        it('positive number, positive decimal point value', () => {
            const rem = util.mod(2.89, 0.1);
            expect(rem).to.equal(0.09); // 0.08999999999999997 for 2.89 % 0.1            
        });

        it('positive number, negative decimal point value', () => {
            const rem = util.mod(2.89, -0.1);
            expect(rem).to.equal(0.09); // 0.08999999999999997 for 2.89 % -0.1            
        });

        it('negative number, positive decimal point value', () => {
            const rem = util.mod(-28, 0.378);
            expect(rem).to.equal(-0.028); // -0.027999999999999803 for -28 % 0.378           
        });

        it('negative number, negative decimal point value', () => {
            const rem = util.mod(-74, -0.101);
            expect(rem).to.equal(-0.068); // -0.06799999999999529 for -74 % -0.101     
        });

    });

});