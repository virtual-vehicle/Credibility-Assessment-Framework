#!/bin/bash

# Initialize constants
# TARGET_PATH_OSMP specifies the location where sensor model shall be copied to
SSD_FILE_PATH=/open_loop_system.ssd
SIMULATION_RESULT_FOLDER=/data/outputs/raw/simulation
OSI_FOLDER=/data/outputs/raw/osi
TARGET_PATH_OSMP=/fmu/sensormodel.fmu
TARGET_VEHICLE_ID_PARAM_NAME=target_vehicle_id
RMSE_THRESHOLD_PARAM_NAME=allowed_deviation

# Initialize input variables
osi_sensor_data_path=""
osmp_sensor_model_path=""
parameter_file_path=""
result_file_path=""
log_file_path=""

osi_set=false
osmp_set=false
param_set=false
res_set=false
log_set=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    --osi)
      osi_sensor_data_path="$2"
      osi_set=true
      shift # past argument
      shift # past value
      ;;
    --osmp)
      osmp_sensor_model_path="$2"
      osmp_set=true
      shift # past argument
      shift # past value
      ;;
    --param)
      parameter_file_path="$2"
      param_set=true
      shift # past argument
      shift # past value
      ;;
    --res)
      result_file_path="$2"
      res_set=true
      shift # past argument
      shift # past value
      ;;
    --log)
      log_file_path="$2"
      log_set=true
      shift # past argument
      shift # past value
      ;;
    *)
      echo "Unknown option: $key"
      exit 1
      ;;
  esac
done

if [[ $osi_set == false ]]; then
  echo "Error: --osi argument is required."
  exit 1
fi
if [[ $osmp_set == false ]]; then
  echo "Error: --osmp argument is required."
  exit 1
fi
if [[ $param_set == false ]]; then
  echo "Error: --param argument is required."
  exit 1
fi
if [[ $res_set == false ]]; then
  echo "Error: --res argument is required."
  exit 1
fi
if [[ $log_set == false ]]; then
  echo "Error: --log argument is required."
  exit 1
fi

if [[ -z "$osi_sensor_data_path" ]]; then
    echo 'false' > $result_file_path
    echo 'OSI SensorData input not found!' >> $log_file_path
    exit 1
fi

if [[ -z "$osmp_sensor_model_path" ]]; then
    echo 'false' > $result_file_path
    echo 'OSMP sensor model input not found!' >> $log_file_path
    exit 1
fi

# copy sensor model to the target path
cp $osmp_sensor_model_path $TARGET_PATH_OSMP

# Create required directory for osi SensorView extraction and for simulation results
mkdir -p $OSI_FOLDER
mkdir -p $SIMULATION_RESULT_FOLDER

# parametrize and configure simulation in the SSD file
./setup_simulation.sh $osi_sensor_data_path $SSD_FILE_PATH $TARGET_PATH_OSMP $SIMULATION_RESULT_FOLDER $OSI_FOLDER

# run simulation. This will create the SensorData resimulation result
./run_simulation.sh $SSD_FILE_PATH

# get path of simulated SensorData
osi_sensor_data_simulation_path=$(find $SIMULATION_RESULT_FOLDER -type f -name "*.osi")
if [[ -z "$osi_sensor_data_simulation_path" ]]; then
    echo 'false' > $result_file_path
    echo 'OSI SensorData output has not been generated, see data/outputs/raw/simulation.log' >> $log_file_path
    exit 1
fi

# run the final evaluation, which means the actual quality metric
./evaluate_results.sh $osi_sensor_data_path $osi_sensor_data_simulation_path $parameter_file_path $result_file_path $log_file_path