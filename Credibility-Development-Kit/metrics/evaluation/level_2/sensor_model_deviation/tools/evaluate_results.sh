#!/bin/bash

# parameter names
TARGET_QUANTITY_PARAM_NAME=target_quantity
REDUCTION_METHOD_PARAM_NAME=reduction_method
FINAL_VALUE_THRESHOLD_PARAM_NAME=allowed_deviation

# paths
osi_real_data_path=$1
osi_simulation_data_path=$2
param_file_path=$3
result_file_path=$4
log_file_path=$5

# calculate final value
final_value=$(python3 calculate_final_value.py --sim $osi_simulation_data_path --ref $osi_real_data_path --params $param_file_path)

# get quality criterion (RMSE threshold) from algoCustomData.json
final_value_threshold=$(python3 extract_user_params.py -f $param_file_path -n $FINAL_VALUE_THRESHOLD_PARAM_NAME)

# get target quantity and reduction method for making the statement in the log
target_quantity=$(python3 extract_user_params.py -f $param_file_path -n $TARGET_QUANTITY_PARAM_NAME)
reduction_method=$(python3 extract_user_params.py -f $param_file_path -n $REDUCTION_METHOD_PARAM_NAME)

# compare evaluated value to threshold and write result to output file
if (( $(echo "$final_value <= $final_value_threshold" | bc -l) )); then
    echo 'true' > $result_file_path
    echo "Deviation test has been passed ($reduction_method of $target_quantity is $final_value)" > $log_file_path
else
    echo 'false' > $result_file_path
    echo "Deviation test has not been passed ($reduction_method of $target_quantity is $final_value, but the threshold is $final_value_threshold). For details, see log files in data/outputs/raw" >> $log_file_path
fi