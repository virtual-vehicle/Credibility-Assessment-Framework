# EVALUATION - LEVEL 3

Metrics to support the uncertainty quantification.

*If you're unsure, how to build up distributions from simulation results or experimental results (CDFs or P-Boxes) to use them as validation mass, take a look at the corresponding util package [`uncertainty`](../../../util/uncertainty/README.md)!*

* [`evaluateAvm`](#evaluateavm): Validate simulation results, using uncertainties in simulation results and/or reference results (so called "model form uncertainty") by calculating the minimum area between distributions from simulation and reference results.
* [`evaluateNasaAvm`](#evaluatenasaavm): Validate simulation results, using uncertainties in simulation results and/or reference results (so called "model form uncertainty") by calculating the disagreement between distributions from simulation and reference results.

---
## `evaluateAvm`

*Validate simulation results, using uncertainties in simulation results and/or reference results (so called "model form uncertainty") by calculating the minimum area between distributions from simulation and reference results.*

### I. METADATA
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Evaluation
Level                   | 3
Purpose                 | Validate simulation results, using uncertainties in simulation results and/or reference results.
Implements              | Uncertainty Quantification
Acceptance criteria     | Threshold 

### II. USAGE
---------------------------

This function calculates the smallest possible areas between two distributions and compares it against a given threshold. 

A distribution to be used can be either an EDF or P-Boxes. The smallest area between these combinations is examplary depicted in the following image:

![area validation metric examples](./docs/images/avm_01.png "area validation metric examples")

For further information, we refer to the publication of Ferson & Oberkampf[^1].

Next to a threshold, the function expects two (stringified) distributions that can be either two EDFs...

```javascript
edf1 = JSON.stringify({
    type: "CDF",
    x: [960, 1020],
    p: [0.4, 1.0],
    unit: "rad/s"
});

edf2 = JSON.stringify({
    type: "CDF",
    x: [960, 970, 1020, 1030],
    p: [0.2, 0.4, 0.9, 1.0],
    unit: "rad/s"
});

threshold = 5; // rad/s

evaluateAvm(edf1, edf2, 5);
// AVM = 3 rad/s --> returns {result: true, log: "..."}
```

...an EDF and a P-Boxes object...

```javascript
pBoxes = JSON.stringify({
    x: [940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050],
    unit: "rad/s",
    p_left: [0, 0.2, 0.2, 0.3, 0.5, 0.8, 0.9, 1, 1, 1, 1, 1],
    p_right: [0, 0, 0, 0, 0.1, 0.3, 0.3, 0.5, 0.7, 0.8, 1, 1]
});

edf = JSON.stringify({
    type: "CDF",
    x: [960, 990, 1000, 1025, 1030, 1040],
    p: [0.3, 0.4, 0.6, 0.7, 0.9, 1.0],
    unit: "rad/s"
});

threshold = 1; // rad/s

evaluateAvm(pBoxes, edf);
// AVM = 1.5 rad/s --> returns {result: false, log: "..."}
```

...or two P-Boxes objects:

```javascript
pBoxesSim = JSON.stringify({
    x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
    p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
    p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
    unit: "rad/s",
});

pBoxesRef = JSON.stringify({
    x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
    p_left: [0.1, 0.3, 0.3, 0.5, 0.8, 1, 1, 1, 1],
    p_right: [0, 0, 0.2, 0.2, 0.2, 0.7, 0.9, 0.9, 1],
    unit: "rad/s",
});

threshold = 1; // rad/s

evaluateAvm(pBoxesSim, pBoxesRef, threshold);
// AVM = 0 rad/s, as pBoxesSim "wraps" pBoxesRef completely --> returns {result: true, log: "..."}
```



### III. INPUTS
---------------------------

distributionSim || 
------------------------|---------------
Unserialized data type  | JSON object
Implements schema       | [EMPIRICAL_DISTRIBUTION_SCHEMA](./types/schemas.js) or [P_BOXES_SCHEMA](./types/schemas.js)
Interpretation          | A CDF or P-Boxes of the simulation results (stringified)   

distributionRef || 
------------------------|---------------
Unserialized data type  | JSON object
Implements schema       | [EMPIRICAL_DISTRIBUTION_SCHEMA](./types/schemas.js) or [P_BOXES_SCHEMA](./types/schemas.js)
Interpretation          | A CDF or P-Boxes of the reference results (stringified)   

threshold || 
------------------------|---------------
Unserialized data type  | number
Implements schema       | -
Interpretation          | The treshold the area validation metric is not allowed to exceed to pass the test

### IV. OUTPUTS
---------------------------

|| AVM does not exceed threshold
------------------------|---------------
Event                   | The calculated AVM does not exceed the threshold
Result                  | true
Log                     | Area validation metric fulfills evaluation criterion (AVM = (calculated value) <= (threshold))

|| AVM exceeds threshold
------------------------|---------------
Event                   | The calculated AVM exceeds the threshold
Result                  | true
Log                     | Area validation metric does not fulfill evaluation criterion (AVM = (calculated value) > (threshold))

|| Simulation distribution can't be parsed
------------------------|---------------
Event                   | The simulation distribution is not given as stringified object
Result                  | false
Log                     | Could not parse simulation distribution

|| Reference distribution can't be parsed
------------------------|---------------
Event                   | The reference distribution is not given as stringified object
Result                  | false
Log                     | Could not parse reference distribution

|| Schema of simulation distribution not valid
------------------------|---------------
Event                   | The simulation distribution violates their valid schemas (see [inputs](#ii-input-specification))
Result                  | false
Log                     | Simulation distribution must either implement the schema of the empirical distribution or of the p-boxes

|| Schema of reference distribution not valid
------------------------|---------------
Event                   | The reference distribution violates their valid schemas (see [inputs](#ii-input-specification))
Result                  | false
Log                     | Reference distribution must either implement the schema of the empirical distribution or of the p-boxes


## `evaluateNasaAvm`

*Validate simulation results, using uncertainties in simulation results and/or reference results (so called "model form uncertainty") by calculating the disagreement between distributions from simulation and reference results.[^2]*

### I. METADATA
---------------

Metric properties ||
------------------------|---------------
Domains                 | Domain-independent
Model types             | Model-independent
CSP phase               | Evaluation
Level                   | 3
Purpose                 | Validate simulation results, using uncertainties in simulation results and/or reference results.
Implements              | Uncertainty Quantification
Acceptance criteria     | Threshold

### II. USAGE
---------------------------

Compared to `evaluateAvm`, the function `evaluateNasaAvm` calculates not the minimum area between two distributions, but the disagreement between the left and right bounds of the distributions. This metric is more suitable to evaluate the model form uncertainty for mixed uncertainties (P-Boxes), as can be comprehended in the following image:

![The old AVM and Nasa-AVM](./docs/images/nasa-avm.png "The AVM and NASA AVM compared")

While the `calcAreaValidationMetric` shows `AVM=0`, the `calcAreaValidationMetricNasa` presents `AVM=13` that makes the `AVM` more meaningful in terms of the distribution disagreement.

The function expects two distributions that can be either two CDFs or P-Boxes. As the functions is suited best for two P-Boxes, the case of the image is shown examplary:

```javascript
pBoxesSim = JSON.stringify({
    x: [950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
    p_left: [0.2, 0.2, 0.3, 0.5, 0.5, 0.9, 1, 1, 1, 1],
    p_right: [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.8, 0.8, 1],
    unit: "rad/s",
});

pBoxesRef = JSON.stringify({
    x: [960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040],
    p_left: [0.1, 0.3, 0.3, 0.5, 0.8, 1, 1, 1, 1],
    p_right: [0, 0, 0.2, 0.2, 0.2, 0.7, 0.9, 0.9, 1],
    unit: "rad/s",
});

evaluateNasaAvm(pBoxesSim, pBoxesRef, 10);
// NASA AVM = 13 rad/s --> returns {result: false, log: "..."}
```

### III. INPUTS
---------------------------

distributionSim || 
------------------------|---------------
Unserialized data type  | JSON object
Implements schema       | [EMPIRICAL_DISTRIBUTION_SCHEMA](./types/schemas.js) or [P_BOXES_SCHEMA](./types/schemas.js)
Interpretation          | A CDF or P-Boxes of the simulation results (stringified)   

distributionRef || 
------------------------|---------------
Unserialized data type  | JSON object
Implements schema       | [EMPIRICAL_DISTRIBUTION_SCHEMA](./types/schemas.js) or [P_BOXES_SCHEMA](./types/schemas.js)
Interpretation          | A CDF or P-Boxes of the reference results (stringified)   

threshold || 
------------------------|---------------
Unserialized data type  | number
Implements schema       | -
Interpretation          | The treshold the area validation metric is not allowed to exceed to pass the test

### IV. OUTPUTS
---------------------------

|| NASA AVM does not exceed threshold
------------------------|---------------
Event                   | The calculated NASA AVM does not exceed the threshold
Result                  | true
Log                     | NASA Area validation metric fulfills evaluation criterion (NASA AVM = (calculated value) <= (threshold))

|| NASA AVM exceeds threshold
------------------------|---------------
Event                   | The calculated NASA AVM exceeds the threshold
Result                  | true
Log                     | NASA Area validation metric does not fulfill evaluation criterion (NASA AVM = (calculated value) > (threshold))

|| Simulation distribution can't be parsed
------------------------|---------------
Event                   | The simulation distribution is not given as stringified object
Result                  | false
Log                     | Could not parse simulation distribution

|| Reference distribution can't be parsed
------------------------|---------------
Event                   | The reference distribution is not given as stringified object
Result                  | false
Log                     | Could not parse reference distribution

|| Schema of simulation distribution not valid
------------------------|---------------
Event                   | The simulation distribution violates their valid schemas (see [inputs](#ii-input-specification))
Result                  | false
Log                     | Simulation distribution must either implement the schema of the empirical distribution or of the p-boxes

|| Schema of reference distribution not valid
------------------------|---------------
Event                   | The reference distribution violates their valid schemas (see [inputs](#ii-input-specification))
Result                  | false
Log                     | Reference distribution must either implement the schema of the empirical distribution or of the p-boxes

[^1]: Scott Ferson & William L. Oberkampf, 2009. "Validation of imprecise probability models,". *International Journal of Reliability and Safety*. Inderscience Enterprises Ltd, vol. 3(1/2/3), pages 3-22.

[^2]: Laura White & Thomas West. "Area Validation Metric for Applications with Mixed Uncertainty." (2019). [Access Link](https://testscience.org/wp-content/uploads/formidable/13/White_DATAWorks2019.pdf)
