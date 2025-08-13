#!/bin/bash

ssd_file_path=$1

./openmcx/install/openmcx -v $ssd_file_path
mv simulation.log /data/outputs/raw/simulation/simulation.log