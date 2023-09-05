const { describe, it } = require('mocha');
const { expect } = require('chai');
const uncertainty_util = require('../../../../util/uncertainty')
const uncertainty = require('../src/uncertainty');

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
            expect(uncertainty.calcAreaValidationMetricNasa(edf1, edf1)).to.equal(0);        
   
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
            expect(uncertainty.calcAreaValidationMetricNasa(edf1, edf2)).to.equal(10);        
      
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
            expect(uncertainty.calcAreaValidationMetricNasa(edf1, edf2)).to.equal(10);        

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
            expect(uncertainty.calcAreaValidationMetricNasa(edf1, edf2)).to.equal(20);        
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
            expect(uncertainty.calcAreaValidationMetricNasa(edf1, edf2)).to.equal(36);        
     
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
            expect(uncertainty.calcAreaValidationMetricNasa(edf1, edf2)).to.equal(3);        
  
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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, edf)).to.equal(0);

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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, edf)).to.equal(17);

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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, edf)).to.equal(5);

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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, edf)).to.equal(1.5);

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
            expect(uncertainty.calcAreaValidationMetricNasa(edf, pBoxes)).to.equal(47);        
      
        });
        
        it('reference p-box completely wraps EDF => expect AVM = 0 and AVM ver 2 > 0', () => {
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
            expect(uncertainty.calcAreaValidationMetricNasa(edf, pBoxes)).to.equal(26);        
   
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
            expect(uncertainty.calcAreaValidationMetricNasa(edf, pBoxes)).to.equal(30);        
      
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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(0); 

        });
    
        it('ref p-box wraps sim p-box completely => expect AVM = 0 and AVM ver 2 > 0', () => {
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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(13); 

        });
    
        it('left border of ref p-box outside, but right border inside => expect AVM = 0 and AVM > 0', () => {
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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(3); 

        });
    
        it('left and right border of ref p-box outside, right border matches left border of sim => expect AVM = 0 and AVM ver 2 > 0', () => {
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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(3); 

        });
    
        it('left border of ref p-box outside left sim border, right ref border outside right sim border => expect AVM = 0 and AVM ver 2 > 0', () => {
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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(12); 

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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(6); 

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
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxesSim, pBoxesRef)).to.equal(24); 

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
            let pBoxes = uncertainty_util.createPBoxes([edf1, edf2], {
                x_min: 48,
                x_max: 62,
                interval: 2
            }); // Maurizio: I would consider create a p-box instance directly to better control the outcome!
    
            let histCheck = {
                type: "CDF",
                x: [50,  51,  52,  53,  54,  56,  62],
                p: [0.0, 0.0, 0.4, 0.6, 0.8, 1.0, 1.0],
                unit: "km/h"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(1.0);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(1.0); 

        });
    
        it('Case 1', () => {
            let pBoxes = uncertainty_util.createPBoxes([edf1, edf2], {
                x_min: 48,
                x_max: 62,
                interval: 2
            });
    
            let histCheck = {
                type: "CDF",
                x: [50,  51,  52,  53,  54,  56,  62],
                p: [0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.0],
                unit: "km/h"
            };
    
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(0.8);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(0.8); 

        });
    
        it('Case 2', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let histCheck = {
                type: "CDF",
                x: [980],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(11);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(11); 

        });
        it('Case 3', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let histCheck = {
                type: "CDF",
                x: [1020],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(0);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(0); 

        });
        it('Case 4', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let histCheck = {
                type: "CDF",
                x: [1050],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(17);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(17); 

        });
        it('Case 5', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.7, 1],
                p_left: [0, 0, 0.2, 0.2, 0.4, 0.7, 0.9, 0.9, 1, 1, 1, 1]
            }
    
            let histCheck = {
                type: "CDF",
                x: [950],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(37);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(37); 

        });
        it('Case 6', () => {
            let pBoxes = {
                x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
                unit: "rad/s",
                p_right: [0, 0, 0, 0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1, 1],
                p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9, 1, 1, 1, 1, 1]
            }
    
            let histCheck = {
                type: "CDF",
                x: [1000],
                p: [1.0],
                unit: "rad/s"
            };
            expect(uncertainty.calcAreaValidationMetric(pBoxes, histCheck)).to.equal(5);
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxes, histCheck)).to.equal(5); 

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
            expect(uncertainty.calcAreaValidationMetric(pBoxData, pBoxExp)).to.equal(0); 
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxData, pBoxExp)).to.equal(3); 
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
            expect(uncertainty.calcAreaValidationMetric(pBoxData, pBoxExp)).to.equal(12); 
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxData, pBoxExp)).to.equal(27); 

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
            expect(uncertainty.calcAreaValidationMetric(pBoxData, pBoxExp)).to.equal(9); 
            expect(uncertainty.calcAreaValidationMetricNasa(pBoxData, pBoxExp)).to.equal(19); 
        })
    });
    
});

describe('evaluateAvm', () => {

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
    
    describe('wrong inputs', () => {

        it('first input parsed => expect false', () => {
            const resultLog = uncertainty.evaluateAvm(pBoxesSim, JSON.stringify(pBoxesRef), 100);

            expect(resultLog.result).to.be.false;            
        });

        it('second input parsed => expect false', () => {
            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSim), pBoxesRef, 100);

            expect(resultLog.result).to.be.false;            
        });

        it('schema of first pBox not fulfilled => expect false', () => {
            const pBoxesSimFalse = {
                x: [950, 970, 980, 1010, 1020, 1030, 1040, "1050"],
                p_left: [0.2, 0.3, 0.5, 1, 1, 1, 1],
                p_right: [0, 0, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };

            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSimFalse), JSON.stringify(pBoxesRef), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of second pBox not fulfilled => expect false', () => {
            let pBoxesRefFalse = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.7, 0.7, 0.9, 0.9, 1],
                // unit: "rad/s",
            };
            
            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRefFalse), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of first CDF not fulfilled => expect false', () => {
            const edfSimFalse = {
                type: "CDF",
                x: [960, 1020],
                p: [0.4, "0.7", 1.0],
                unit: "rad/s"
            };
        
            const edfRef = {
                type: "CDF",
                x: [960, 970, 1020, 1030],
                p: [0.2, 0.4, 0.9, 1.0],
                unit: "rad/s"
            }; 

            const resultLog = uncertainty.evaluateAvm(JSON.stringify(edfSimFalse), JSON.stringify(edfRef), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of second CDF not fulfilled => expect false', () => {
            const edfSim = {
                type: "CDF",
                x: [960, 1020],
                p: [0.4, 1.0],
                unit: "rad/s"
            };
        
            const edfRefFalse = {
                x: [960, 970, 1020, 1030],
                p: [0.2, 0.4, 0.9, 1.0],
                unit: "rad/s"
            }; 

            const resultLog = uncertainty.evaluateAvm(JSON.stringify(edfSim), JSON.stringify(edfRefFalse), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of second CDF not fulfilled => expect false', () => {
            let pBoxesRefFalse = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.7, 0.7, 0.9, 0.9, 1],
                // unit: "rad/s",
            };
            
            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRefFalse), 100);

            expect(resultLog.result).to.be.false;  
        });

    });
        
    describe('threshold tests', () => {

        it('avm smaller than threshold => expect true', () => {
            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRef), 100);
            expect(resultLog.result).to.be.true; 
        });

        it('avm equal to threshold => expect true', () => {
            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRef), 2);
            expect(resultLog.result).to.be.true; 
        });

        it('avm greater to threshold => expect false', () => {
            const resultLog = uncertainty.evaluateAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRef), 1.9);

            expect(resultLog.result).to.be.false; 
        });
        
    });

});

describe('evaluateNasaAvm', () => {

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
    
    describe('wrong inputs', () => {

        it('first input parsed => expect false', () => {
            const resultLog = uncertainty.evaluateNasaAvm(pBoxesSim, JSON.stringify(pBoxesRef), 100);

            expect(resultLog.result).to.be.false;            
        });

        it('second input parsed => expect false', () => {
            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSim), pBoxesRef, 100);

            expect(resultLog.result).to.be.false;            
        });

        it('schema of first pBox not fulfilled => expect false', () => {
            const pBoxesSimFalse = {
                x: [950, 970, 980, 1010, 1020, 1030, 1040, "1050"],
                p_left: [0.2, 0.3, 0.5, 1, 1, 1, 1],
                p_right: [0, 0, 0.1, 0.5, 0.8, 0.8, 1],
                unit: "rad/s",
            };

            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSimFalse), JSON.stringify(pBoxesRef), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of second pBox not fulfilled => expect false', () => {
            let pBoxesRefFalse = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.7, 0.7, 0.9, 0.9, 1],
                // unit: "rad/s",
            };
            
            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRefFalse), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of first CDF not fulfilled => expect false', () => {
            const edfSimFalse = {
                type: "CDF",
                x: [960, 1020],
                p: [0.4, "0.7", 1.0],
                unit: "rad/s"
            };
        
            const edfRef = {
                type: "CDF",
                x: [960, 970, 1020, 1030],
                p: [0.2, 0.4, 0.9, 1.0],
                unit: "rad/s"
            }; 

            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(edfSimFalse), JSON.stringify(edfRef), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of second CDF not fulfilled => expect false', () => {
            const edfSim = {
                type: "CDF",
                x: [960, 1020],
                p: [0.4, 1.0],
                unit: "rad/s"
            };
        
            const edfRefFalse = {
                x: [960, 970, 1020, 1030],
                p: [0.2, 0.4, 0.9, 1.0],
                unit: "rad/s"
            }; 

            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(edfSim), JSON.stringify(edfRefFalse), 100);

            expect(resultLog.result).to.be.false;  
        });

        it('schema of second CDF not fulfilled => expect false', () => {
            let pBoxesRefFalse = {
                x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
                p_left: [0.1, 0.3, 0.3, 0.8, 0.8, 1, 1, 1, 1],
                p_right: [0, 0, 0.2, 0.2, 0.7, 0.7, 0.9, 0.9, 1],
                // unit: "rad/s",
            };
            
            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRefFalse), 100);

            expect(resultLog.result).to.be.false;  
        });

    });
        
    describe('threshold tests', () => {

        it('avm smaller than threshold => expect true', () => {
            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRef), 100);
            expect(resultLog.result).to.be.true; 
        });

        it('avm equal to threshold => expect true', () => {
            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRef), 6);
            expect(resultLog.result).to.be.true; 
        });

        it('avm greater to threshold => expect false', () => {
            const resultLog = uncertainty.evaluateNasaAvm(JSON.stringify(pBoxesSim), JSON.stringify(pBoxesRef), 5.99);

            expect(resultLog.result).to.be.false; 
        });
        
    });

});