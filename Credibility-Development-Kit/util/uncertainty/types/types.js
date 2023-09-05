/**
  * EmpiricalDistribution type definition
  * @typedef {Object} EmpiricalDistribution
  * @property {string} type Type of the distribution function ("PDF" -> histogram / "CDF" -> cumulative distribution)
  * @property {number[]} x Samples of the random variable
  * @property {number[]} p probability for each sample (relative probability for PDF or accumulated probability for CDF)
  * @property {string} unit Unit of the random variable
  */

/**
  * PBoxes type definition
  * @typedef {Object} PBoxes
  * @property {number[]} p_left left boundary of EDFs
  * @property {number[]} p_right right boundary of EDFs
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
     * @type {EmpiricalDistribution}
     * @type {PBoxes}
     */
}