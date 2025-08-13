#!/bin/bash

MOUNTED_INPUT_DATA_FOLDER=/data/inputs
RESULT_FILE_PATH=/data/outputs/result.txt
LOG_FILE_PATH=/data/outputs/log.txt

# get path of input FMU
if ! fmu_path=$(DIDS=$DIDS python3 /get_filepath.py --type model); then
    echo "Error: Could not find the FMU in the inputs." >> LOG_FILE_PATH
    exit 1
fi

./execute_workflow.sh --fmu $osmp_sensor_model_path --res $RESULT_FILE_PATH --log $LOG_FILE_PATH

DIDS=$DIDS TRANSFORMATION_DID=$TRANSFORMATION_DID node ./create_vv_report_element.js