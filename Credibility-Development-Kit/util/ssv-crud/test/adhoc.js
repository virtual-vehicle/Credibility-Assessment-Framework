const parser = require('../src/parser');
const extractors = require('../src/extractors');
const crud = require('../src/crud')
const fs = require('fs');

const ssvString = fs.readFileSync('/mnt/c/clones/continuous_dynamic_sim_testing/systems/electrics.ssv', 'utf-8');

let ssvCrud = new crud.SsvCrud(ssvString);

ssvCrud.setParameterValue("R", 0.22);
console.log(ssvCrud.export());

