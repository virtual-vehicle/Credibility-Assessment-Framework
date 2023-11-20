const fs = require('fs');
const helper = require('./src/helper');

exports.translate = translate;

/**
 * 
 * @param {string} csvPath 
 * @returns {Signal[]}
 */
function translate(csvPath) {
    try {
        var csvString = fs.readFileSync(csvPath, 'utf8');
    }
    catch (err) {
        return JSON.stringify({error : "Could not open specified CSV file"});
    }

    return helper.extractSignals(csvString);
}