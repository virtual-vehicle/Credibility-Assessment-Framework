const Ajv = require("ajv");
const ajv = new Ajv({$data: true, allErrors: true})
require("ajv-keywords")(ajv);

exports.isStructureValid = isStructureValid

/**
 * Validates if the passed object fulfills the given JSON schema
 * 
 * @author  localhorst87
 * @function
 * @param   {Object} obj    The object to be validated 
 * @param   {Object} schema The schema the object is validated against
 * @return  {Boolean}       returns true if the object fulfills the schema
*/
function isStructureValid(obj, schema) {
    const validate = ajv.compile(schema);
    return validate(obj);
}