#!/bin/bash

MOUNTED_DATA_FOLDER=/data
RESULT_FILE_PATH=/data/outputs/result.txt
LOG_FILE_PATH=/data/outputs/log.txt

mkdir /data/outputs

# get path of input FMU 
fmu_path=$(find $MOUNTED_DATA_FOLDER -type f -name "*.fmu")
if [[ -z "$fmu_path" ]]; then
    echo 'FMU path not found in the mounted input data folder!'
    exit 1
fi

./execute_workflow.sh --fmu $fmu_path --res $RESULT_FILE_PATH --log $LOG_FILE_PATH