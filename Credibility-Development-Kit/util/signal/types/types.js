/**
 * Signal Config type definition
 * @typedef {Object} SignalConfig
 * @property {string} name Unique name of the signal within its application 
 * @property {string} [unit_time=s] The unit of the given time points. Default: s
 * @property {string} [unit_values=-] he unit of the observed quantity. Default: -
 * @property {number} [precision=6] Must be integer >= 1. All time and value points will be rounded to this precision. Default: 6
 */

/**
  * Signal history type definition
  * @typedef {Object} History
  * @property {number} step The number of the processing the Signal has undergone
  * @property {Date} date Date object of when the process step has been done
  * @property {number[]} time The time array after this step
  * @property {number[]} values The values array after this step
  * @property {string} processing description of what has been done in this step
  */

/**
  * Units type definition
  * @typedef {Object} Units
  * @property {string} time unit of time
  * @property {string} values unit of values
  */

/**
  * CompareOptions type definition
  * @typedef {Object} CompareOptions
  * @property {string} comparison decides on either "absolute" or "relative" comparison
  * @property {number} threshold threshold on unequality operations (must be >= 0)
  * @property {number} tolerance tolerance on equality operations (must be >= 0)
  * @property {string} unit phsyical unit, if a plain number will be the reference
  * @property {number} precision precision to apply, if a plain number will be the reference (must be an integer > 0)
  * @property {boolean} reduce if set to true, a boolean will be returned for the compare function, 
  *                            stating if comparison is true for each element-wise comparison
 /* 

 /**
  * ComparisonData type definition
  * @typedef {Object} ComparisonData 
  * @property {string} operator the operator (<, <=, ==, !=, >= or >) that is placed between LHS and RHSs values
  * @property {string} comparison information if "absolute" or "relative" comparison
  * @property {number[]} lhsValues left-hand-side values of the comparison; aligned unit and precised
  * @property {number[]} rhsValues left-hand-side values of the comparison; aligned unit and precised
  * @property {number} tolerance tolerance of the comparison; aligned unit and precised
  * @property {number} threshold threshold of the comparison; aligned unit and precised
  * @property {number} precision applied precision for the comparison
  */

 module.exports = {
    /**
     * @type {History}
     * @type {Units}
     * @type {CompareOptions}
     * @type {ComparisonData}
     */
}