#!/bin/bash

osi_sensor_data_path=$(DIDS=$DIDS python3 get_filepath.py -t osi)
osi_sensor_view_target_path=./trace_file_generation/2025_sv_370_361_1000.osi
ssd_file_path=./open_loop_system.ssd

# extract SensorView from SensorData
python3 osi_sd2sv.py -d $osi_sensor_data_path -o $osi_sensor_view_target_path

# configure number of steps and stop time
./replace_stop_time.sh $osi_sensor_view_target_path $ssd_file_path

# parametrize sensor model according to utilized mounting position in the SensorData
python3 parametrize_sensor_model.py -o $osi_sensor_data_path -s $ssd_file_path