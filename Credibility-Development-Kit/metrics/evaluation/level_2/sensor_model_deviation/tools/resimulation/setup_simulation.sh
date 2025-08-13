#!/bin/bash

osi_sensor_data_path=$1
ssd_file_path=$2
osmp_target_path=$3
sim_result_path=$4
osi_sv_folder=$5

# extract SensorView from SensorData
osi_sensor_view_path=$(python3 osi_sd2sv.py -d $osi_sensor_data_path -t $osi_sv_folder)

# configure number of steps and stop time
./configure_stop_time.sh $osi_sensor_view_path $ssd_file_path

# parametrize sensor model according to utilized mounting position in the SensorData
python3 parametrize_mounting_position.py --osisensordata $osi_sensor_data_path --ssd $ssd_file_path

# parametrize location of OSI SensorView inputs
python3 parametrize_input_location.py --osisensorview $osi_sensor_view_path --ssd $ssd_file_path

# parameterize location of OSMP sensor model
python3 parametrize_osmp_location.py --targetpath $osmp_target_path --ssd $ssd_file_path

# parametrize location where OSI SensorData outputs shall be stored
python3 parametrize_output_location.py --targetfolder $sim_result_path --ssd $ssd_file_path