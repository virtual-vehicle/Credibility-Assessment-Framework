const fs = require('fs');
const helper = require('./src/helper');

exports.translate = translate;

/**
 * 
 * @param {string} csvPath 
 * @returns {string} an stringified array of stringified Signals
 */
function translate(csvPath) {
    try {
        var csvString = fs.readFileSync(csvPath, 'utf8');
    }
    catch (err) {
        return JSON.stringify({error : "Could not open specified CSV file"});
    }

    let signals = helper.extractSignals(csvString);

    return JSON.stringify(signals.map(signal => signal.export()));
}