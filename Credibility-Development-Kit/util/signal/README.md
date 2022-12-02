# SIGNAL

The Signal class is a wrapper for timeseries data. It allows for uniform and reproducable processing of time-value data.

## USAGE

1. [Instantiation](#instantiation)
    - [Basic Instantiation](#basic-instantiation)
    - [Verbose instatiation](#verbose-instatiation)
2. [Get properties](#property-getters)
3. [Set properties](#property-setters) 
4. [Methods](#methods)
    - [Utilities](#utilities)
        - [`copy`](#copy)
        - [`print`](#print)
        - [`revert`](#revert)
    - [Calculus](#calculus)
        - [`value`](#value)
        - [`convert`](#convert)
        - [`add / subtract`](#add--subtract)
        - [`multiply / divide`](#multiply--divide)
        - [`sliceToIndex`](#slicetoindex)
        - [`sliceToTime`](#slicetotime)
        - [`interpolate`](#interpolate)
    - [Logic](#logic)
        - [`compare`](#compare)

### Instantiation

`new Signal(...)`

To instantiate a Signal use the following three arguments:
* time array
* value array
* configuration object

#### **Basic instantiation**

`time` and `values` must be **numeric arrays** of the same length. The `config` must at least contain a declaration of the signal's name:

```javascript
time = [0.2, 0.3, 0.4, 0.5, 0.6];
values = [143.5, 145.7, 151.0, 151.9, 150.4];
config = {
    name: "velocity"
};

signal = new Signal(time, values, config);
```

This will create a valid instance with the following properties (that can be retrieved by calling `signal.print()`):

```json
{
    ...
    "time": [0.2, 0.3, 0.4, 0.5, 0.6],
    "values": [143.5, 145.7, 151, 151.9, 150.4],
    "unit_time": "s",
    "unit_values": "-",
    ...
}
```
#### **Verbose instatiation**

As can be observed, information about the units are stored. The value of the time will by default set to `"s"` and the values to be dimensionless (`"-"`).
We can set the units with the `config` argument. Signal units follow the [conventions from the mathjs library](https://mathjs.org/docs/datatypes/units.html#reference).

```javascript
time = [200, 300, 400, 500, 600];
values = [143.5, 145.7, 151.0, 151.9, 150.4];
config = {
    name: "velocity",
    unit_time: "ms",
    unit_values: "km/h"
};

signal = new Signal(time, values, config);
```

All time and value array samples will keep a defined precision. The precision will by default be set to 6 significant digits, but can be set to any arbitrary integer between 1 and 100 (inclusive). "Significant digits" means rounding to the specified number of digits without leading zeroes, so applying a precision of 2 to `0.0001453` will result in `0.00015` and not in `0.00` like ordinary rounding would return (cf. [JavaScript's toPrecision()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision?retiredLocale=de) ).

So, the following instantiation with a precision of 2...

```javascript
time = [201, 300, 399, 502, 599];
values = [143.5, 145.7, 150.0, 151.9, 150.4];
config = {
    name: "velocity",
    unit_time: "ms",
    unit_values: "km/h",
    precision: 2
};

signal = new Signal(time, values, config);
```
...would result in the following Signal:
```json
{
    "time": [200,300,400,500,600],
    "values": [140,150,150,150,150],
    "unit_time": "ms",
    "unit_values": "km/h"
}
```

### Property Getters

Let's consider the following Signal instance

```javascript
time = [0.2, 0.3, 0.4, 0.5, 0.6];
values = [143.5, 145.7, 151.0, 151.9, 150.4];
config = {
    name: "velocity",
    unit_time: "s",
    unit_values: "km/h",
    precision: 3
};

signal = new Signal(time, values, config);
```
The following getters are available:

`time`
```javascript
signal.time // [ 0.2, 0.3, 0.4, 0.5, 0.6 ]
```

`values`
```javascript
signal.values // [ 144, 146, 151, 152, 150 ]
```

`units`
```javascript
signal.units // { time: 's', values: 'km/h' }
```

`precision`
```javascript
signal.precision // 3
```

`length`
```javascript
signal.length // 5 (number of samples)
```

`duration`
```javascript
signal.duration // 0.4 (time duration)
```

`timestep`
```javascript
signal.timestep // 0.1 (returns the time interval between two samples; throws if signal.length < 2 or intervals are not consistent)
```

`history`

A special getter is the `history` getter. Each processing step will be documented in an internal record that can be retrieved by calling

```javascript
signal.history
// [
//   {
//     step: 1,
//     date: 2022-11-04T07:32:20.480Z,
//     time: [ 0.2, 0.3, 0.4, 0.5, 0.6 ],
//     values: [ 144, 146, 151, 152, 150 ],
//     processing: 'initialized signal'
//   }
// ]
```
### Property Setters

There is the possibility to change the `time` and `value` array:

Consider the following signal

```javascript
time = [0.200, 0.301, 0.400, 0.499, 0.600];
values = [143.5, 299.9, 151.0, 151.9, 150.4];
config = {
    name: "velocity",
    unit_time: "s",
    unit_values: "km/h",
    precision: 3
};

signal = new Signal(time, values, config);
```
Let's remove the jitter in the time array and the obviosly erroneous velocity in the value array:

```javascript 

// before:
// time: [0.2, 0.301, 0.4, 0.499, 0.6],
// values: [144, 300, 151, 152, 150]

signal.time = [0.2, 0.3, 0.4, 0.5, 0.6]; // throws if array length != 5
signal.values = [143.5, 147.0, 151.0, 151.9, 150.4]; // throws if array length != 5

// after:
// time: [0.2, 0.3, 0.4, 0.5, 0.6],
// values: [144, 147, 151, 152, 150]
```

### Methods

#### **Utilities**

#### `copy`

As making deep copies of nested JavaScript objects is cumbersome, `copy` will provide a method to make a deep copy of the Signal instance:

```javascript 
newSignal = signal.copy(); // newSignal is a deep copy of signal
```

#### `print`

To transfer the Signal properties to a JSON string, use the `print` method:

```javascript
signalJson = signal.print(); // signalJson is a stringified JSON, embracing time, values and units
signalJsonVerbose = signal.print(true); // provides precision and history on top
```

```json
// signalJson
{
    "name": "velocity",
    "length": 5,
    "time": [0.2, 0.3, 0.4, 0.5, 0.6],
    "duration": 0.4,
    "values": [144, 147, 151, 152, 150],
    "unit_time": "s",
    "unit_values": "km/h"
}

// signalJsonVerbose
{
    "name": "velocity",
    "length": 5,
    "time": [0.2, 0.3, 0.4, 0.5, 0.6],
    "duration": 0.4,
    "values": [144, 147, 151, 152, 150],
    "unit_time": "s",
    "unit_values": "km/h",
    "precision": 3,
    "history": [{
        "step": 1,
        "date": "2022-11-04T08:39:23.537Z",
        "time": [0.2, 0.301, 0.4, 0.499, 0.6],
        "values": [144, 300, 151, 152, 150],
        "processing": "initialized signal"
    }, {
        "step": 2,
        "date": "2022-11-04T08:39:23.537Z",
        "time": [0.2, 0.3, 0.4, 0.5, 0.6],
        "values": [144, 300, 151, 152, 150],
        "processing": "manual change of time"
    }, {
        "step": 3,
        "date": "2022-11-04T08:39:23.537Z",
        "time": [0.2, 0.3, 0.4, 0.5, 0.6],
        "values": [144, 147, 151, 152, 150],
        "processing": "manual change of values"
    }]
}
```

#### `revert`

To undo certain processing steps of the Signal, the `revert` method provides a possibility to reset the signal time/values to a certain step.

For instance, consider the signal above (see its history in `signalJsonVerbose` above). Let's undo the last processing step:

```javascript

signalUndoLast = signal.revert(); // revert to former step
signalStep1 = signal.revert(1); // revert to step 1
```

```json
// signalUndoLast.print(true)
{
    "time": [0.2, 0.3, 0.4, 0.5, 0.6],
    "values": [144, 300, 151, 152, 150],
    "unit_time": "s",
    "unit_values": "km/h",
    "precision": 3,
    "history": [{
        "step": 1,
        "date": "2022-11-04T09:27:28.738Z",
        "time": [0.2, 0.301, 0.4, 0.499, 0.6],
        "values": [144, 300, 151, 152, 150],
        "processing": "initialized signal"
    }, {
        "step": 2,
        "date": "2022-11-04T09:27:28.738Z",
        "time": [0.2, 0.3, 0.4, 0.5, 0.6],
        "values": [144, 300, 151, 152, 150],
        "processing": "manual change of time"
    }]
}

// signalStep1.print(true)
{
    "time": [0.2, 0.301, 0.4, 0.499, 0.6],
    "values": [144, 300, 151, 152, 150],
    "unit_time": "s",
    "unit_values": "km/h",
    "precision": 3,
    "history": [{
        "step": 1,
        "date": "2022-11-04T09:27:28.738Z",
        "time": [0.2, 0.301, 0.4, 0.499, 0.6],
        "values": [144, 300, 151, 152, 150],
        "processing": "initialized signal"
    }]
}
```

#### **Calculus**

There are some basic math operations available for Signals.

#### `value`

From a given time point, this method is returning the corresponding signal value. If the time does not match any value exactly, 
linear interpolation will be used to determine the value.

```javascript
time = [0.0, 30.0, 60.0, 90.0, 120.0];
values = [267.2, 275.2, 269.8, 271.8, 268];
config = {
    name: "water volume flow",
    unit_values: "l/min",
    precision: 4
};

flow = new Signal(time, values, config);

flow.value(90.0) // 271.8
flow.value(10.0) // 269.9 (linear interpolated)
```

#### `convert`

It is possible to convert the Signal's time or value array into another unit, as long as the physical base corresponds. As unit conversion uses the [mathjs library](https://mathjs.org), naming conventions will of units will stick to the conventions of the [mathjs unit reference](https://mathjs.org/docs/datatypes/units.html#reference).

Use the keyword "time" or "values" to identify the target vector you want to convert:

```javascript
time = [0.0, 30.0, 60.0, 90.0, 120.0];
values = [0.004453768, 0.004587468, 0.004496971, 0.004530042, 0.004465700];
config = {
    name: "water volume flow",
    unit_values: "m^3/s",
    precision: 4
};

flow = new Signal(time, values, config);

flow = flow.convert("time", "min"); // flow.time = [0, 0.5, 1, 1.5, 2]
flow = flow.convert("values", "l/min"); // flow.values = [267.2, 275.2, 269.8, 271.8, 268]
```

#### `add` / `subtract`

You can add and subtract a plain number or another Signal instance. 

For the subsequent descriptions, let's take the following Signal as a starting point:

```javascript
time = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];
values = [-0.40, -0.40, -0.40, 1.47, 2.51, 3.40, 3.54];
config = {
    name: "acceleration of vehicle",
    unit_values: "m/s^2",
    precision: 3
};

signal = new Signal(time, values, config);
```

If a plain number is added, it will act like an offset to the values:

```javascript
correctedSignalStep1 = signal.add(0.40); // correctedSignalStep1.values: [0, 0, 0, 1.87, 2.91, 3.8, 3.94]
```

If another Signal instance is added, the addition will be element-wise:

```javascript
time = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];
values = [0.00, 0.00, 0.00, 0.16, 0.27, 0.32, 0.35];
config = {
    name: "correction due to pitch angle",
    unit_values: "m/s^2",
    precision: 3
};
pitchCorr = new Signal(time, values, config);

correctedSignalStep2 = correctedSignalStep1.subtract(pitchCorr); // correctedSignalStep2.values: [0, 0, 0, 1.71, 2.64, 3.48, 3.59]
```

If the Signal that will be added is given in another unit, it will automatically be converted to the unit of the root Signal. However, the physical base must correspond (cf. `convert`).

```javascript
time = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];
values = [0.00, 0.00, 0.00, 0.12, 0.18, 0.15, 0.17]; // [0, 0, 0, 0.0333333333, 0.05, 0.0416666667, 0.0472222222] m/s²
config = {
    name: "another correction",
    unit_values: "(km/h)/s",
    precision: 2
};
anotherCorr = new Signal(time, values, config);

correctedSignalStep3 = correctedSignalStep2.add(anotherCorr); // correctedSignalStep3.values: [0, 0, 0, 1.74, 2.69, 3.52, 3.64]
```

Note, that the precision is always taken from the root Signal. The precision will be applied after the addition of the signals.

If the sample rate of the Signal to add is different, it will be adjusted to the sample rate of the root Signal (linear interpolation). However, the duration of the two Signals must match!

```javascript
time = [1.5, 1.6, 1.7, 1.8];
values = [0, 0, 2.79, 3.97]; // sample rate-adjusted values: [0, 0, 0, 1.40, 2.79, 4.38, 3.97]
config = {
    name: "acceleration reference",
    unit_values: "m/s^2",
    precision: 3
};
reference = new Signal(time, values, config);

comparison = correctedSignalStep3.subtract(reference); // comparison.values: [0, 0, 0, 0.47, 0.09, 0.37, -0.08]
```

#### `multiply` / `divide`

Multiplication and division of a Signal is possible with a plain number or another Signal instance.

Let's start from the acceleration signal again:

```javascript
time = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];
values = [0, 0, 0, 1.74, 2.69, 3.52, 3.64];
config = {
    name: "vehicle drive-off",
    unit_values: "m/s^2",
    precision: 3
};
acceleration = new Signal(time, values, config);
```

Let's divide the acceleration by a correcting factor. The factor is assumed as non-dimensional. The divisor must not be equal to zero.

```javascript
accelerationCorr = acceleration.divide(1.02); // accelerationCorr.values: [0, 0, 0, 1.71, 2.64, 3.45, 3.57]
```

If you want to mulitiply or divide the signal with a single value and assign this value a unit, it can be done the following way:

```javascript
force = accelerationCorr.multiply(1745, "kg"); // force.values: [0, 0, 0, 2980, 4610, 6020, 6230], force.units { time: 's', values: '(m kg) / s^2' }
```

Multiplication and division with another Signal instance works element-wise. For divisions, make sure that no element of the divisor signal is equal to zero!

```javascript
time = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];
values = [0, 0, 0, 0.0435, 0.1542, 0.3095, 0.4885];
config = {
    name: "vehicle drive-off velocity",
    unit_values: "m/s",
    precision: 3
};
velocity = new Signal(time, values, config);

power = force.multiply(velocity); // power.values: [0, 0, 0, 130, 710, 1860, 3040]
```

Analogously to add / sutract: The precision is always taken from the root Signal. The precision will be applied after the multipliction of the Signals. If the sample rates differ, the sample rate will be adjusted to the sample rate of the root Signal (linear interpolation).

#### **Adjustment**

There are currently two slice functions, that cut a subset out of the Signal.

Consider the following Signal:
```javascript
time = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
values = [1.045, 0.903, 0.942, 0.988, 1.038, 1.190, 1.298, 1.210, 1.127, 1.256, 1.287, 1.256];
config = {
    name: "global temperature change",
    unit_time: "year",
    unit_values: "degC"
};
globalTemp = new Signal(time, values, config);
```

#### `sliceToIndex`

To cut the Signal according to start and end indices, `sliceToIndex` follows the same logic as [JavaScript's `Array.slice()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice?retiredLocale=de). 

In addition, there's the option to include/exclude the start/end sample. Default, like in `Array.slice()`: Include start sample, exclude end sample.


```javascript
subset = globalTemp.sliceToIndex(1, 5); // time: [2011, 2012, 2013, 2014], values: [0.903, 0.942, 0.988, 1.038]
subset = globalTemp.sliceToIndex(1, 5, false); // excludes start sample; time: [2012, 2013, 2014], values:[0.942, 0.988, 1.038]
subset = globalTemp.sliceToIndex(-5, -2); // time: [2017, 2018,2019], values:[1.21, 1.127, 1.256]
subset = globalTemp.sliceToIndex(-5, -2, true, true); // include end sample; time: [2017, 2018,2019, 2020], values:[1.21, 1.127, 1.256, 1.287]
```

#### `sliceToTime`

To cut the Signal according to start and end time, `sliceToTime` will cut out the subset of the Signal that's inside the given time boundaries. 

Similar to `sliceToIndex`, there's an option to include/exclude the start/end sample if a given time boundary matches a time sample exactly. Unlike `sliceToIndex`, start and end sample will be **included** by default!

```javascript
subset = globalTemp.sliceToTime(2018, 2021); // time: [2018, 2019, 2020, 2021], values: [1.127, 1.256, 1.287, 1.256]
subset = globalTemp.sliceToTime(2017.5, 2025); // same as above
subset = globalTemp.sliceToTime(2018, 2021, false, true); // time: [2019, 2020, 2021], values: [1.256, 1.287, 1.256]
subset = globalTemp.sliceToTime(2018, 2021, false, false); // time: [2019, 2020], values: [1.256, 1.287]
```

#### `interpolate`

To adjust a Signal to another sampling rate, use the `interpolate` method by handing over a new time vector. The new time vector does not necessarily need to be equally-spaced, but must be monotonously increasing.

Currently only the method "linear" is supported for interpolation, which is set by default.

```javascript
time = [0.0, 30.0, 60.0, 90.0, 120.0];
values = [267.2, 275.2, 269.8, 271.8, 268];
config = {
    name: "water volume flow",
    unit_values: "l/min",
    precision: 4
};

flow = new Signal(time, values, config);

detailedFlow = flow.interpolate([0, 10, 20, 30, 60, 120]); // values: [267.2, 269.9, 272.5, 275.2, 269.8, 268]
```
#### **Logic**

#### `compare`

To compare Signal values against another value or values of another Signal, the method `compare` can be used.

If a comparison against a single value is used, each sample of the Signal values is compared against it. In case another Signal is used,
the comparison will be element-wise. The result is a new Signal with the comparison values (0 = false, 1 = true).

```javascript
time = [0.0, 5.0, 10.0, 15.0, 20.0, 25.0];
values = [52.3, 50.1, 47.4, 52.0, 50.0, 51.2];
config = {
    name: "vehicle velocity",
    unit_values: "km/h",
    precision: 3
};
velocity = new Signal(time, values, config);

time = [0.0, 5.0, 10.0, 15.0, 20.0, 25.0];
values = [30.0, 50.0, 50.0, 50.0, 70.0, 70.0];
config = {
    name: "speed limit",
    unit_values: "km/h",
    precision: 3
};
speedLimit = new Signal(time, values, config)

comparison = velocity.compare("<=", 50.0); // values = [0, 0, 1, 0, 1, 0]
comparison = velocity.compare("<=", speedLimit);  // values = [0, 0, 1, 0, 1, 1]
```

If the signal is compared against a single value, a unit of this value can be specified in addition:
```javascript 
comparison = velocity.compare("<=", 30.0, {unit: "mi/h"}); // 30 mph = 48.28 km/h. comparison.values = [0, 0, 1, 0, 0, 0]
```

Further, there's the option to apply a precision to the single value, before the comparison will be carried out:
```javascript 
comparison = velocity.compare("<=", 49.9, {precision: 2}); // same as compare("<=", 50.0)
```

If the result values shall be reduced to a single boolean value, it can be done with the `reduce` option. In this case a boolean value is returned, that will be true if the comparison is true for **all** values:
```javascript 
comparison = velocity.compare("<=", 50.0, {reduce: true}); // returns false
```

There are further options to define tolerances and thresholds:
```javascript 
comparison = velocity.compare("<=", 50.0, {tolerance: 3.0, reduce: true}); // <= 53.0 km/h. Returns true
```

In case a relative comparison is desired, it can be defined with the `comparison` option. In addition, a tolerance must be defined:
```javascript 
comparison = velocity.compare("<=", 50.0, {comparison: "relative", tolerance: 0.02}); // (velocity - 50) / 50 <= 2%. values: [0, 1, 1, 0, 1, 0]
```

Overall, there are plenty of possible combinations of logical operators and tolerances/thresholds, that are listed below:

```javascript 
result = val.compare(operator, ref, {threshold: ..., tolerance: ..., comparison: ...})
```

| operator | threshold | tolerance | comparison | result.values |
|:--------:|:---------:|:---------:|:----------:|:--------------|
| <        | 0         | 0         | any        | `val - ref < 0` 
| <        | >0        | 0         | absolute   | `val - ref < -threshold`
| <        | >0        | 0         | relative   | `(val - ref) / \|ref\| < -threshold`
| <        | 0         | >0        | absolute   | `val - ref < tolerance`
| <        | 0         | >0        | relative   | `(val - ref) / \|ref\| < tolerance`
|<=        | 0         | 0         | any        | `val - ref <= 0`
|<=        | >0        | 0         | absolute   | `val - ref <= -threshold`
|<=        | >0        | 0         | relative   | `(val - ref) / \|ref\| <= -threshold`
|<=        | 0         | >0        | absolute   | `val - ref <= tolerance`
|<=        | 0         | >0        | relative   | `(val - ref) / \|ref\| <= tolerance`
|>         | 0         | 0         | any        | `val - ref > 0`
|>         | >0        | 0         | absolute   | `val - ref > threshold`
|>         | >0        | 0         | relative   | `(val - ref) / \|ref\| > threshold`
|>         | 0         | >0        | absolute   | `val - ref > -tolerance`
|>         | 0         | >0        | relative   | `(val - ref) / \|ref\| > -tolerance`
|>=        | 0         | 0         | any        | `val - ref >= 0`
|>=        | >0        | 0         | absolute   | `val - ref >= threshold`
|>=        | >0        | 0         | relative   | `(val - ref) / \|ref\| >= threshold`
|>=        | 0         | >0        | absolute   | `val - ref >= -tolerance`
|>=        | 0         | >0        | relative   | `(val - ref) / \|ref\| >= -tolerance`
|!=        | 0         | 0         | any        | `val - ref != 0`
|!=        | >0        | 0         | absolute   | `\|val - ref\| > threshold`
|!=        | >0        | 0         | relative   | `\|val - ref\| / \|ref\| > threshold`
|!=        | 0         | >0        | absolute   | `error`
|!=        | 0         | >0        | relative   | `error`
|==        | 0         | 0         | any        | `val - ref == 0`
|==        | >0        | 0         | absolute   | `error`
|==        | >0        | 0         | relative   | `error`
|==        | 0         | >0        | absolute   | `\|val - ref\| <= tolerance`
|==        | 0         | >0        | relative   | `\|val - ref\| / \|ref\| <= tolerance`
|any       | >0        | >0        | any        | `error`

## EXAMPLE

Let's load a [sample dataset](./examples/data/global_temperature.json) on global warming that indicates the mean global temperature difference to the year 1901. This dataset contains measured data and data from a simulation. 

run
```
npm run example
```
in a terminal to run this example interactively in parallel.

Our goal in this example is to assess the accuracy of the simulation w.r.t. the last 30 years. First, let's create two Signals from that data (see the full example [here](./examples/example.js)):

```javascript
reference = new Signal(referenceTime, referenceValues, {
    name: "global temperature difference measurement",
    unit_time: "year",
    unit_values: "degC",
    precision: 4,
});

simulation = new Signal(simTime, simValues, {
    name: "global temperature difference simulation",
    unit_time: "year",
    unit_values: "degC",
    precision: 4,
});
```

Having a look at the data, we see that they have different sample rates and different starting points:

```javascript 
console.log(reference.print());
// {
//     "name": "global temperature difference measurement",
//     "length": 100,
//     "time": [1922, 1923, ..., 2020, 2021],
//     "duration": 99,
//     "values": [0.02544, 0.04674, ..., 1.287, 1.256],
//     "unit_time": "year",
//     "unit_values":"degC"
// }

console.log(simulation.print());
// {
//     "name": "global temperature difference simulation",
//     "length": 11,
//     "time": [1921, 1931, ..., 2011, 2021],
//     "duration": 100,
//     "values": [0.057, 0.061, ..., 1.085, 1.422],
//     "unit_time": "year",
//     "unit_values":"degC"
// }
```

So, let's tidy up the data. First, we are only interested in the last 30 years from 1992 to 2021:
```javascript
reference = reference.sliceToTime(1992, 2021);
```

Next, let's adjust the simulation data to that time vector:
```javascript
simulation = simulation.interpolate(reference.time);
```

We want to check if the accuracy is within a tolerance for all values. The tolerance is 0.15 °C. Let's use the compare function for that!
```javascript
isAccuracyOkay = simulation.compare("==", reference, {
    tolerance: 0.15, // °C
    reduce: true 
});
console.log(isAccuracyOkay); // false
```

The accuracy requirement is not fulfilled. Finally, let's check which values are not inside that tolerance by subtracting the two Signals:
```javascript
difference = simulation.subtract(reference);
console.log(difference.values); // [0.1072, 0.0913, 0.0482, -0.0703, 0.0546, -0.0662, -0.1964, 0.0812, 0.0994, -0.0339, -0.0616, -0.0358, 0.0675, -0.0455, 0.0153, 0.0226, 0.1757, 0.0706, 0.013, 0.1826, 0.1767, 0.1638, 0.148, 0.03, -0.045, 0.077, 0.194, 0.099, 0.101, 0.166]
```