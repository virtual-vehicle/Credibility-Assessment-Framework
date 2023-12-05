const { SsvCrud } = require('./src/crud');

/**
 * SSV Create, Read, Update, Delete
 * 
 * Currently a test release!
 */
exports.SsvCrud = SsvCrud;
exports.changeParameter = changeParameter;

/**
 * @param {string} ssvString 
 * @param {string} parameterName 
 * @param {string | number} value 
 * @returns {string}
 */
function changeParameter(ssvString, parameterName, value) {
    let crud = new SsvCrud(ssvString);
    crud.setParameterValue(parameterName, Number(value));
    
    return crud.export();
}