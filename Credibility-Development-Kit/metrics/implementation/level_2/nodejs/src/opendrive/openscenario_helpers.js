const { XMLParser } = require("fast-xml-parser");
const fs = require('fs');
const path = require('path');
const util = require("util-common");

/**
 * @typedef {import('../../types/types').MapLocation} MapLocation
 * @typedef {import('../../types/types').OscParameterSet} OscParameterSet
 */

exports.parseOpenscenario = parseOpenscenario;
exports.getInitialPositions = getInitialPositions;
exports.isParameterDistributionFile = isParameterDistributionFile;
exports.getParameterSets = getParameterSets;
exports.getXoscTemplateFromDistributionFile = getXoscTemplateFromDistributionFile;
exports.integrateParameters = integrateParameters;

/**
 * Helper methods for arrays to make array unique, using deep equality 
 */
Array.prototype.deepUnique = function () {
    return this
        .map(val => JSON.stringify(val))
        .filter((val, i, self) => self.indexOf(val) === i)
        .map(val => JSON.parse(val));
}

const PARSE_AS_ARRAY = [
    "ScenarioObject",
    "Private",
    "PrivateAction",
    "DeterministicSingleParameterDistribution",
    "DeterministicMultiParameterDistribution",
    "ParameterValueSet",
    "ParameterAssignment",
    "Element",
];

/**
 * @param {string} xoscString 
 * @returns {object}
 */
function parseOpenscenario(xoscString) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (tagName, _) => {
            if(PARSE_AS_ARRAY.includes(tagName)) return true;
            else return false;
        }
    };
    const parser = new XMLParser(options);

    return parser.parse(xoscString);
}

/**
 * Returns true, if the parsed OpenSCENARIO is a parameter variation file
 * 
 * @param {object} xoscParsed 
 * @returns {boolean}
 */
function isParameterDistributionFile(xoscParsed) {
    return xoscParsed["OpenSCENARIO"]["ParameterValueDistribution"] !== undefined;
}

/**
 * Returns the associated OpenSCENARIO template from an OpenSCENARIO parameter distribution file
 * 
 * @param {object} parameterDistributionParsed 
 * @param {string} basePath 
 * @returns {string} According OpenSCENARIO template
 */
function getXoscTemplateFromDistributionFile(parameterDistributionParsed, basePath) {
    let filepath = parameterDistributionParsed["OpenSCENARIO"]["ParameterValueDistribution"]["ScenarioFile"]["@_filepath"];

    if (!path.isAbsolute(filepath) && basePath!== undefined)
        filepath = path.join(basePath, filepath);

    return fs.readFileSync(filepath, 'utf-8');
}

/**
 * From the OpenSCENARIO template and the according paramter sets, concrete scenarios (with inline parameters that have
 * been variables in the template) will be generated.
 * 
 * The number of concrete scenarios will be the number of given parameter sets.
 * 
 * @param {string} xoscTemplate 
 * @param {OscParameterSet[]} parameterSets
 * @returns {string[]} concrete OpenSCENARIO scenarios
 */
function integrateParameters(xoscTemplate, parameterSets) {
    let integratedXoscs = [];

    for (let parameterSet of parameterSets) {
        let xoscIntegratedString = xoscTemplate;

        for (let i = 0; i < parameterSet.parameters.length; i++) {
            let parameterToReplace = "$" + parameterSet.parameters[i];
            xoscIntegratedString = xoscIntegratedString.replaceAll(parameterToReplace, parameterSet.values[i]);
        }

        integratedXoscs.push(xoscIntegratedString);
    }
    
    return integratedXoscs;
}

/**
 * Returns all parameter sets from the given (parsed) parameter variation file
 * 
 * @param {object} parameterVariationFileParsed 
 * @returns {OscParameterSet[]}
 */
function getParameterSets(parameterVariationFileParsed) {
    let sets = [];

    // get deterministic elements
    const deterministic = parameterVariationFileParsed['OpenSCENARIO']['ParameterValueDistribution']['Deterministic'];
    
    // get single parameter distributions
    const singleDistributions = deterministic['DeterministicSingleParameterDistribution'];
    for (let singleDist of singleDistributions) {

        if (singleDist['DistributionSet'] !== undefined) {
            let singleSet = [];

            let values = singleDist['DistributionSet']['Element'].map(el => el['@_value']);

            for (let value of values)
            singleSet.push({
                parameters: [singleDist['@_parameterName']],
                values: [value]
            });

            sets.push(singleSet);
        }
        else if (singleDist['DistributionRange'] !== undefined) {
            let singleSet = [];

            let step = Number(singleDist['DistributionRange']['@_stepWidth']);
            let minVal = Number(singleDist['DistributionRange']['Range']['@_lowerLimit']);
            let maxVal = Number(singleDist['DistributionRange']['Range']['@_upperLimit']);

            let maxLsdLimits = Math.max(util.getLsd(minVal), util.getLsd(maxVal));
            let lsdStep = util.getLsd(step);
            let nVals = Math.floor(util.roundToDigit(maxVal - minVal, maxLsdLimits) / step) + 1;

            let values = Array.from({length: nVals}, (_, i) => String(util.roundToDigit(minVal + i*step, lsdStep)));

            for (let value of values) {
                singleSet.push({
                    parameters: [singleDist['@_parameterName']],
                    values: [value]
                });
            }

            sets.push(singleSet);
        }
    }

    // get multi parameter distributions
    const multiDistributions = deterministic['DeterministicMultiParameterDistribution'];
    for (let multiDist of multiDistributions) {
        let multiSet = [];
        const valueSets = multiDist['ValueSetDistribution']['ParameterValueSet'];

        for (let valueSet of valueSets) {
            let newSet = {
                parameters: [],
                values: []
            };
        
            for (let paramAssignment of valueSet['ParameterAssignment']) {
                newSet.parameters.push(paramAssignment['@_parameterRef']);
                newSet.values.push(paramAssignment['@_value']);        
            }
    
            multiSet.push(newSet);
        }

        sets.push(multiSet);
    }

    return createFullFactorialDesign(sets);
}

/**
 * Helper function to generate a full-factorial parameter design from a raw single parameter set.
 * A raw single parameter set here is the list of parameters that are permutated independently.
 * 
 * The output is a list of parameter sets, i.e., a merged list of parameter values for each run.
 * @example
 * singleParameterSets = 
 * [
 *   [
 *     {"parameters":["EgoSpeed"],"values":["70.0"]},
 *     {"parameters":["EgoSpeed"],"values":["110.0"]}
 *   ],
 *   [
 *     {"parameters":["TargetSpeedFactor"],"values":["1.1"]},
 *     {"parameters":["TargetSpeedFactor"],"values":["1.3"]},
 *     {"parameters":["TargetSpeedFactor"],"values":["1.5"]}
 *   ],
 *   [
 *     {"parameters":["HostVehicle","TargetVehicle"],"values":["car_blue","car_yellow"]},
 *     {"parameters":["TargetVehicle"],"values":["van_red"]}
 *   ]
 * ]
 * 
 * // returns
 * [
 *   { parameters: ["EgoSpeed", "TargetSpeedFactor", "HostVehicle", "TargetVehicle"], values: ["70.0", "1.1", "car_blue","car_yellow"] },
 *   { parameters: ["EgoSpeed", "TargetSpeedFactor", "TargetVehicle"], values: ["70.0", "1.1", "van_red"] },
 *   { parameters: ["EgoSpeed", "TargetSpeedFactor", "HostVehicle", "TargetVehicle"], values: ["70.0", "1.3", "car_blue","car_yellow"] },
 *   ... 9 more
 * ]
 * 
 * @param {OscParameterSet[][]} singleParameterSets raw single-parameter set
 * @returns {OscParameterSet[]} merged parameter set
 */
function createFullFactorialDesign(singleParameterSets) {
    let ranges = singleParameterSets
        .map(pSet => pSet.length)
        .map(nValues => Array.from({length: nValues}, (_, i) => i));

    const permutations = combine(ranges); // returns all combinations as index, e.g. [0,0,0], [0,0,1], ...
    
    let design = [];

    for (let permutation of permutations) {
        let combination = {
            parameters: [],
            values: []
        }

        for (let [paramIdx, permIdx] of permutation.entries()) {
            combination.parameters.push(...singleParameterSets[paramIdx][permIdx].parameters);
            combination.values.push(...singleParameterSets[paramIdx][permIdx].values);
        } 
        
        design.push(combination);
    }   

    return design;
}

/**
 * Recursive helper function to generate a full-factorial design
 * 
 * @param {number[]} ranges 
 * @param {number[]} currentCombi 
 * @param {number[][]} allCombinations 
 * @returns {number[][]}
 */
function combine(ranges, currentCombi, allCombinations) {
    if (currentCombi === undefined)
        currentCombi = [];
        
    if (allCombinations === undefined)
        allCombinations = [];
    
    let currentRange = ranges.shift();

    if (ranges.length > 0) {
        while (currentRange.length > 0) {
            let currentCombiCopy = util.makeDeepCopy(currentCombi);
            currentCombiCopy.push(currentRange.shift());
            combine(util.makeDeepCopy(ranges), currentCombiCopy, allCombinations);
        }
    }
    else {
        for (let val of currentRange) {
            let currentCombiCopy = [...currentCombi];
            currentCombiCopy.push(val)
            allCombinations.push(currentCombiCopy);
        }
    }
    
    return allCombinations;
}

/**
 * 
 * @param {string} xoscParsed 
 * @returns {MapLocation[]}
 */
function getInitialPositions(xoscParsed) {
    let initPositionsRaw = [];
    let entities = [];
    let privates = xoscParsed["OpenSCENARIO"]["Storyboard"]["Init"]["Actions"]["Private"];

    for (let private of privates) {
        let privateActions = private["PrivateAction"];
        privateActions = privateActions.filter(pa => pa["TeleportAction"] !== undefined);
        privateActions = privateActions.filter(pa => pa["TeleportAction"]["Position"] !== undefined);
        for (let privateAction of privateActions) {
            initPositionsRaw.push(privateAction["TeleportAction"]["Position"]);
            entities.push(private["@_entityRef"]);
        }
    }

    let mapLocations = [];

    for (let initPosition of initPositionsRaw) {
        if (initPosition["LanePosition"] !== undefined) {
            mapLocations.push({
                roadId: initPosition["LanePosition"]["@_roadId"],
                laneId: initPosition["LanePosition"]["@_laneId"],
                s: initPosition["LanePosition"]["@_s"]
            })
        }
        else if (initPosition["RelativeLanePosition"] !== undefined) {
            let idxRef = entities.findIndex(entity => entity === initPosition["RelativeLanePosition"]["@_entityRef"]);
            let initPositionRef = initPositionsRaw[idxRef];
            mapLocations.push({
                roadId: initPositionRef["LanePosition"]["@_roadId"],
                laneId: String(Number(initPositionRef["LanePosition"]["@_laneId"]) + Number(initPosition["RelativeLanePosition"]["@_dLane"])),
            })
        }
    }

    return mapLocations;
}