# Description:  The OSMP sensor model consumes and provides binary OSI messages. 
#               The discrete timestamps are read from the SensorView input, 
#               therefore the step size of the simulation, which is configured in the SSD file
#               does not affect the actual step size of the simulation, thus it is a dummy value
#               for this sensor simulation.
#               But: We need to make sure that the total number of steps from the SensorView file 
#               are executed. To ensure this we need to read the total number of steps from the 
#               SensorView file and replace the stopTime value in the SSD file with this
#               calculated value: stopTime=(configured dummy step size * total number of steps).
#               For instance: The SensorView file has 1200 steps and the dummy step size is configured 
#               to 0.02 s. The stopTime value in the SSD file must be set to 1200 * 0.02 s = 24.0 s.

#!/bin/bash

osi_sensor_view_path=$1
ssd_file_path=$2

# Get python osi size
osi_size=$(python3 osi_count.py -d $osi_sensor_view_path -t SensorView)

# Extract deltaTime value from the XML file
delta_time=$(grep -oP '(?<=deltaTime=")[^"]*' "$ssd_file_path")

# Calculate the new stopTime value using Python
new_stop_time=$(python3 -c "print($osi_size * $delta_time)")

# Use sed to replace the stopTime value in the XML file
sed -i "s/stopTime=\"[^\"]*\"/stopTime=\"$new_stop_time\"/" "$ssd_file_path"
