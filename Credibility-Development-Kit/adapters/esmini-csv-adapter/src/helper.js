const { Signal } = require('../../../util/signal');

exports.extractSignals = extractSignals;

/**
 * @param {string} csvString 
 * @returns {Signal[]}
 */
function extractSignals(csvString) {
    let signals = [];

    let csvLines = extractLines(csvString);
    const signalNamesAndUnits = extractSignalNamesAndUnits(csvLines[6]);
    let signalNames = signalNamesAndUnits.names;
    let units = signalNamesAndUnits.units;
    let values = extractValues(csvLines);

    // postprocessing
    // first do postprocessing of signal names (e.g. '#1 Current_Speed' --> 'pedestrian_Current_Speed' )
    signalNames = replaceEntityNames(signalNames, values);

    // remove "Index" signal
    const idxIndex = signalNames.indexOf("Index");
    signalNames.splice(idxIndex, 1);
    units.splice(idxIndex, 1);
    values.splice(idxIndex, 1);

    // remove empty signal name, due to trailing comma (bug in esmini)
    const idxEmpty = signalNames.indexOf("");
    signalNames.splice(idxEmpty, 1);
    units.splice(idxEmpty, 1);
    values.splice(idxEmpty, 1);

    // remove all "Entity_Name" signals (they became part of the signal name!)
    let entityNameSignalNames = signalNames.filter(sname => sname.includes('Entity_Name'));
    for (let entityNameSignalName of entityNameSignalNames) {
        let idxEntityName = signalNames.findIndex(sname => sname === entityNameSignalName);
        signalNames.splice(idxEntityName, 1);
        units.splice(idxEntityName, 1);
        values.splice(idxEntityName, 1);
    }

    // extract time
    const idxTime = signalNames.indexOf("TimeStamp");
    signalNames.splice(idxTime, 1);
    let unitTime = units.splice(idxTime, 1)[0];
    let time = values.splice(idxTime, 1).flat();

    // adapt units (e.g., make m/s2 to m/s^2)
    const regexpUnit = new RegExp(/([a-zA-Z]+)(\d)/, "g");
    units = JSON.parse(JSON.stringify(units).replaceAll(regexpUnit, "$1^$2"));

    for (let i = 0; i < signalNames.length; i++) {
        let signal = new Signal(time, values[i], {
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

function extractSignalNamesAndUnits(namesLine) {
    let signalNames = [];
    let units = [];

    let namesRaw = namesLine.split(",");

    for (let nameRaw of namesRaw) {
        
        // split the raw name into the signal name and unit
        // example: ' #2 Current_Speed [m/s] ' --> [ ' #2 Current_Speed ', 'm/s', ' ' ]
        let nameSplitted = nameRaw.split(/\[(.+)\]/);
        let signalName = nameSplitted[0].trim();
        let unit = nameSplitted.length > 1 ? nameSplitted[1].trim() : '-';
        units.push(unit);

        // replace '#NUM ' in signal name by 'TP_NUM_' in naming
        // example: '#2 Entitity_Name' --> 'TP_2_Entity_Name'
        signalNames.push(signalName);
    }

    return {
        names: signalNames,
        units: units
    };
}

function removeHeaderLines(csvLines) {
    return csvLines.slice(7);
}

function extractValues(csvLines) {
    let linesWoHeader = removeHeaderLines(csvLines);
    let convertedLines = [];
    let valueArray = [];

    for (let line of linesWoHeader) {
        if (line==0) continue;
        // check if value is a numeric value or a naming ("like the 'Ego'")
        convertedLines.push(line.split(",").map(strVal => {if (!isNaN(Number(strVal))) { return Number(strVal); } else { return strVal; } }));
    }
        
    
    for (let i = 0; i < convertedLines[0].length; i++)
        valueArray.push(convertedLines.map(val => val[i]))
    
    return valueArray;
}

function replaceEntityNames(signalNames, values) {
    // Note: In esmini, the typo 'Entitity' is used
    signalNames = JSON.parse(JSON.stringify(signalNames).replaceAll('Entitity', 'Entity'));

    let entityNames = signalNames.filter(sname => sname.includes('Entity_Name'));
    
    for (let entityName of entityNames) {
        let idx = signalNames.findIndex(sname => sname === entityName);
        let nameOfEntity = values[idx][0].trim();
        let entityNum = entityName.split(/(#\d+)/)[1]; // returns e.g. "#2"
        signalNames = JSON.parse(JSON.stringify(signalNames).replaceAll(entityNum+" ", nameOfEntity+"_"));
    }
    
    return signalNames;
}