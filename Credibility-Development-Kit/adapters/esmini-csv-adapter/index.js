const fs = require('fs');
const helper = require('./src/helper');

exports.translate = translate;

/**
 * Translates esmini csv results into Signal arrays.
 * 
 * Optionally, if only one Signal of each Signal set should be used to join, use signalToExtract to label the name of 
 * the Signal you want to extract from each Signal set.
 * 
 * @param {string} csvPath path to csv result file
 * @param {string} [signalToExtract] if only one Signal should be transformed, use signalToExtract to label the name of
 *                                   the Signal you want to extract
 * @returns {string} a stringified array of stringified Signals or - if signalToExtract is used - a stringified Signal
 */
function translate(csvPath, signalToExtract) {
    try {
        var csvString = fs.readFileSync(csvPath, 'utf8');
    }
    catch (err) {
        return JSON.stringify({error : "Could not open specified CSV file"});
    }

    let signals = helper.extractSignals(csvString);

    if (signalToExtract !== undefined) {
        let filteredSignals = signals.filter(signal => signal.name === signalToExtract);
        if (filteredSignals.length === 0) 
            throw(signalToExtract + " does not exist in the result file!");
    
        return filteredSignals[0].export();
    }
    else {
        return JSON.stringify(signals.map(signal => signal.export())); 
    }
}