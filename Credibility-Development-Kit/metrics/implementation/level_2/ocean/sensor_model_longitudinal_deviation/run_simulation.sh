#!/bin/bash

# find sensor model and move/rename it
sensor_model_path=$(DIDS=$DIDS python3 get_filepath.py -t sensor)
if [[ -n sensor_model_path ]]; then
    cp $sensor_model_path ./trace_file_generation/sensormodel.fmu
else
    echo 'false' > /data/outputs/result.txt
    echo 'Sensor model not found in the input data' >> /data/outputs/log.txt
    exit 1
fi

# simulate
./openmcx/install/openmcx -v ./open_loop_system.ssd
mv simulation.log /data/outputs/raw/simulation/simulation.log