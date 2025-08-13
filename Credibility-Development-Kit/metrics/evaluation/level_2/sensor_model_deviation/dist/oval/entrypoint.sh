#!/bin/bash

MOUNTED_INPUT_DATA_FOLDER=/data/inputs
RESULT_FILE_PATH=/data/outputs/result.txt
LOG_FILE_PATH=/data/outputs/log.txt
OSI_FILENAME_FALLBACK=20250101T12:00:00Z_sd_370_3200.osi

# get path of SensorData input
if ! osi_sensor_data_path=$(DIDS=$DIDS python3 /get_filepath.py --type osi); then
    echo "Error: Could not find the OSI SensorData file in the inputs." >> LOG_FILE_PATH
    exit 1
fi

# rename the file to standardized OSI naming convention to be compliant with all tools
if ! synth_osi_file_name=$(DIDS=$DIDS python3 /synthesize_osi_filename.py); then
    synth_osi_file_name=$OSI_FILENAME_FALLBACK
fi
cp $osi_sensor_data_path /data/outputs/raw/osi/$synth_osi_file_name
osi_sensor_data_path=/data/outputs/raw/osi/$synth_osi_file_name

# get path of OSMP input
if ! osmp_sensor_model_path=$(DIDS=$DIDS python3 /get_filepath.py --type sensor); then
    echo "Error: Could not find the OSMP SensorModel file in the inputs." >> LOG_FILE_PATH
    exit 1
fi

# get path of parameter file
parameter_file_path=$(find $MOUNTED_INPUT_DATA_FOLDER -type f -name "algoCustomData.json")
if [[ -z "$parameter_file_path" ]]; then
    echo "Error: Parameter file not found in the mounted input data folder!" >> LOG_FILE_PATH
    exit 1
fi

./execute_workflow.sh --osi $osi_sensor_data_path --osmp $osmp_sensor_model_path --param $parameter_file_path --res $RESULT_FILE_PATH --log $LOG_FILE_PATH

DIDS=$DIDS TRANSFORMATION_DID=$TRANSFORMATION_DID node ./create_vv_report_element.js