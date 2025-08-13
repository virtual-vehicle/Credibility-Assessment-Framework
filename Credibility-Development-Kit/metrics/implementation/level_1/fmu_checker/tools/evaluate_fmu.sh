#!/bin/bash

# paths
fmu_path=$1
result_file_path=$2
log_file_path=$3

# calculate final value
logs=$(python3 algorithm.py --fmu $fmu_path)

# compare evaluated value to threshold and write result to output file
if [[ -z "$logs" ]]; then
    echo 'true' > $result_file_path
    echo "The modelDescription.xml of the FMU does not contain any errors." > $log_file_path
else
    echo 'false' > $result_file_path
    echo $logs >> $log_file_path
fi