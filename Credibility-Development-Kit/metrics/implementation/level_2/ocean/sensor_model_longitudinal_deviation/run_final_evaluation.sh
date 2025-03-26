#!/bin/bash

# paths
PARAM_FILE_PATH=/data/inputs/algoCustomData.json
OUTPUT_FILE_PATH=/data/outputs/result.txt

# parameter names
TARGET_VEHICLE_ID_PARAM_NAME=target_vehicle_id
RMSE_THRESHOLD_PARAM_NAME=allowed_deviation

# get path of simulated SensorData
osi_sensor_data_simulation_path=$(find /data/outputs/raw/simulation -type f -name "*.osi")
if [[ -z osi_sensor_data_path ]]; then
    echo 'false' > /data/outputs/result.txt
    echo 'OSI SensorData output has not been generated, see data/outputs/raw/simulation.log' >> /data/outputs/log.txt
    exit 1
fi

# get path of real SensorData
osi_sensor_data_real_path=$(DIDS=$DIDS python3 get_filepath.py -t osi)

# get user-parametrized target vehicle ID
target_vehicle_id=$(python3 extract_user_params.py -f $PARAM_FILE_PATH -n $TARGET_VEHICLE_ID_PARAM_NAME)

# calculate RMSE
rmse=$(python3 calculate_rmse_X_osi.py --file1 $osi_sensor_data_simulation_path --file2 $osi_sensor_data_real_path --targetid $target_vehicle_id)

# get quality criterion (RMSE threshold) from algoCustomData.json
rmse_threshold=$(python3 extract_user_params.py -f $PARAM_FILE_PATH -n $RMSE_THRESHOLD_PARAM_NAME)

# compare RMSE to RMSE threshold and write result to output file
if (( $(echo "$rmse <= $rmse_threshold" | bc -l) )); then
    echo 'true' > $OUTPUT_FILE_PATH
    echo 'RMSE test has been passed' > /data/outputs/log.txt
else
    echo 'false' > $OUTPUT_FILE_PATH
    echo 'RMSE test has not been passed (RMSE is' $rmse 'm and threshold is' $rmse_threshold 'm). For details, see log files in data/outputs/raw' >> /data/outputs/log.txt
fi

# write evaluation meta data
DIDS=$DIDS TRANSFORMATION_DID=$TRANSFORMATION_DID node create_vv_report_element.js