 /**
  * ScalarParameter type definition
  * @typedef {Object} ScalarParameter
  * @property {string} name The description of the parameter
  * @property {string} nominal_value the nominal value of the parameter
  * @property {number[]} [limits] boundaries of the parameter [lower, upper]
  * @property {string} unit The unit of the parameter
  * @property {number} precision The precision of the values
  * @property {string} uncertainty_type The type of the uncertainty. Currently supported: ("fixed", "interval", or "truncated normal")
  * @property {string} uncertainty_classification The classification of the uncertainty ("discrete", "aleatory", "epistemic")
  * @property {number} [standard_deviation] The standard deviation of the parameter
  * @property {string} [source_value] The source of the nominal value of the parameter("unknown", "estimated", "provided", "computed", "measured", "calibrated")
  * @property {string} [source_uncertainty] The source of the uncertainties of the parameter("unknown", "estimated", "provided", "computed", "measured", "calibrated")
  */
 
 /**
  * ParameterConfig type definition
  * @typedef {Object} ParameterConfig 
  * @property {string} name A descriptive name for the parameter
  * @property {number} [unit=-] The unit of all given values
  * @property {number} [precision] The precision of all given values
  * @property {string} [source_value] The source of the nominal value (unknown, estimated, provided, computed, measured, calibrated)
  * @property {string} [source_uncertainty] The source of the uncertainty (unknown, estimated, provided, computed, measured, calibrated)
  * @property {number} [lower_limit] The lower limit of the parameter for interval and truncated distribution types
  * @property {number} [upper_limit] The upper limit of the parameter for interval and truncated distribution types
  * @property {number} [tolerance_absolute] The limits given as absolute tolerance for interval and truncated distribution types
  * @property {number} [tolerance_relative] The limits given as relative tolerance for interval and truncated distribution types
  * @property {number} [standard_deviation] The standard deviation
  * @property {number} [standard_deviation_factor] Standard deviation, given as factor of the tolerance (stddev = tol/stddev_factor)
  */

 /**
  * DiscreteDistribution type definition
  * @typedef {Object} DiscreteDistribution
  * @property {string} type Type of the distribution function ("PDF/CDF")
  * @property {number[]} x Samples of the random variable
  * @property {number[]} p probability for each sample (relative probability for PDF or accumulated probability for CDF)
  * @property {string} unit Unit of the random variable
  */

 /**
  * SamplingConfig type definition
  * @typedef {Object} SamplingConfig
  * @property {number} [samples] The number of samples to be generated, in case only one kind of uncertainty is present
  * @property {number} [samples_aleatory] The number of samples to be generated for parameters with aleatory uncertainty,
  *                                       in case aleatory and epistemic parameters are present
  * @property {number} [samples_epistemic] The number of samples to be generated for parameters with epistemic uncertainty,
  *                                        in case aleatory and epistemic parameters are present
  * @property {string} [method] The sampling method to be applied, in case only one kind of uncertainty is present
  * @property {string} [method_aleatory] The sampling method to be applied for parameters with aleatory uncertainty,
  *                                      in case aleatory and epistemic parameters are present
  * @property {string} [method_epistemic] The sampling method to be applied for parameters with epistemic uncertainty,
  *                                       in case aleatory and epistemic parameters are present
  */

 /**
  * ParameterSampling type defintion
  * @typedef {Object} ParameterSampling
  * @property {string[]} names
  * @property {number[][][]} values
  * @property {string[]} units
  */

  module.exports = {
    /**
     * @type {ScalarParameter}
     * @type {ParameterConfig}
     * @type {DiscreteDistribution}
     * @type {SamplingConfig}
     * @type {ParameterSampling}
     */
}