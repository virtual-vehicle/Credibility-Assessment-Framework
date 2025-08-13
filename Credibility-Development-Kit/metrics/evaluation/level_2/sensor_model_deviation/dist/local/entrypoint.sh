#!/bin/bash

MOUNTED_DATA_FOLDER=/data
RESULT_FILE_PATH=/data/outputs/result.txt
LOG_FILE_PATH=/data/outputs/log.txt

mkdir /data/outputs

# get path of SensorData input
osi_sensor_data_path=$(find $MOUNTED_DATA_FOLDER -type f -name "*.osi")
if [[ -z "$osi_sensor_data_path" ]]; then
    echo 'OSI SensorData not found in the mounted input data folder!'
    exit 1
fi

# get path of OSMP input
osmp_sensor_model_path=$(find $MOUNTED_DATA_FOLDER -type f -name "*.fmu")
if [[ -z "$osmp_sensor_model_path" ]]; then
    echo 'OSMP sensor model not found in the mounted input data folder!'
    exit 1
fi

parameter_file_path=$(find $MOUNTED_DATA_FOLDER -type f -name "*.json")
if [[ -z "$parameter_file_path" ]]; then
    echo 'Parameter file not found in the mounted input data folder!'
    exit 1
fi

./execute_workflow.sh --osi $osi_sensor_data_path --osmp $osmp_sensor_model_path --param $parameter_file_path --res $RESULT_FILE_PATH --log $LOG_FILE_PATH