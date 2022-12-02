/**
  * DiscreteDistribution type definition
  * @typedef {Object} DiscreteDistribution
  * @property {string} type Type of the distribution function ("PDF/CDF")
  * @property {number[]} x Samples of the random variable
  * @property {number[]} p probability for each sample (relative probability for PDF or accumulated probability for CDF)
  * @property {string} unit Unit of the random variable
  */

/**
  * PBoxes type definition
  * @typedef {Object} PBoxes
  * @property {number[]} p_upper upper boundary of cumulative probabilities
  * @property {number[]} p_lower lower boundary of cumulative probabilities
  * @property {number[]} x samples of the random variable
  * @property {string} unit unit of the random variable
  */

/**
 * PBoxesConfig type definition
 * @typedef {Object} PBoxesConfig
 * @property {number} [x_min]
 * @property {number} [x_max]
 * @property {number} [interval]
 */

module.exports = {
    /**
     * @type {DiscreteDistribution}
     * @type {PBoxes}
     */
}