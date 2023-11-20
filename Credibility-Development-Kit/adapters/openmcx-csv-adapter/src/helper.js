const { Signal } = require('../../../util/signal');

exports.extractSignals = extractSignals;

const UNIT_REPLACEMENTS = [
    {mc: "none", mathjs: "-"},
    {mc: "_", mathjs: " / "},
    {mc: ".", mathjs: " * "},
    {mc: "Nm", mathjs: "N m"},
    {mc: "Nms", mathjs: "N m s"},
    {mc: "kWh", mathjs: "kW h"},
    {mc: "kgm", mathjs: "kg m"},
    {mc: "kgmm", mathjs: "kg mm"},
    {mc: "Vs", mathjs: "V s"},
    {mc: "Ohm", mathjs: "ohm"}
];

/**
 * @param {string} csvString 
 * @returns {Signal[]}
 */
function extractSignals(csvString) {
    let signals = [];

    let csvLines = extractLines(csvString);
    const separator = getSeparator(csvLines[0]);
    let signalNames = extractSignalNames(csvLines[1], separator);
    let units = extractUnits(csvLines[2], separator);
    let values = extractValues(csvLines);

    const idxTime = signalNames.indexOf("Time");
    signalNames.splice(idxTime, 1);
    let unitTime = units.splice(idxTime, 1)[0];
    let time = values.splice(idxTime, 1);

    for (let i = 0; i < signalNames.length; i++) {
        let signal = new Signal(time.flat(), values[i], {
            name: signalNames[i],
            unit_time: unitTime,
            unit_values: units[i],
        });

        signals.push(signal);
    }

    return signals;
}

function extractLines(csvString) {
    return csvString.split("\n")
}

function getSeparator(separatorDefLine) {
    return separatorDefLine.split("sep=")[1].trim();
}

function extractSignalNames(namesLine, separator) {
    let signalNames = [];

    let namesRaw = namesLine.split(",");

    for (let nameRaw of namesRaw) {
        signalNames.push(nameRaw.split("\"")[1]);
    }

    return signalNames;
}

function extractUnits(unitsLine, separator) {
    let units = [];

    let unitsRaw = unitsLine.split(separator);

    for (let unitRaw of unitsRaw) {
        units.push(mcUnit2MathjsUnit(unitRaw));
    }

    return units;
}

function removeHeaderLines(csvLines) {
    return csvLines.slice(3);
}

function extractValues(csvLines) {
    let linesWoHeader = removeHeaderLines(csvLines);
    let convertedLines = [];
    let valueArray = [];

    for (let line of linesWoHeader) {
        if (line==0) continue;
        convertedLines.push(line.split(",").map(strVal => Number(strVal)));
    }
        
    
    for (let i = 0; i < convertedLines[0].length; i++)
        valueArray.push(convertedLines.map(val => val[i]))
    
    return valueArray;
}

function mcUnit2MathjsUnit(mcUnit) {
    for (let repl of UNIT_REPLACEMENTS) {
        mcUnit = mcUnit.replaceAll(repl.mc, repl.mathjs);
    }

    return mcUnit.trim();
}