# Description: This script calculates the new stopTime value for the XML file
#              based on the OSI file size and the deltaTime value in the XML file.
#              It then replaces the stopTime value in the XML file with the new value.

#!/bin/bash

osi_sensor_view_name=$1
ssd_file_path=$2

# Get python osi size
osi_size=$(python3 osi_count.py -d $osi_sensor_view_name -t SensorView)

# Extract deltaTime value from the XML file
delta_time=$(grep -oP '(?<=deltaTime=")[^"]*' "$ssd_file_path")

# Calculate the new stopTime value using Python
new_stop_time=$(python3 -c "print($osi_size * $delta_time)")

# Use sed to replace the stopTime value in the XML file
sed -i "s/stopTime=\"[^\"]*\"/stopTime=\"$new_stop_time\"/" "$ssd_file_path"
