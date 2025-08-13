#!/bin/bash

# Initialize constants
# TARGET_PATH_FMU specifies the location where FMU shall be copied to
TARGET_PATH_FMU=/fmu/model_under_test.fmu

# Initialize input variables
fmu_path=""
result_file_path=""
log_file_path=""

fmu_set=false
res_set=false
log_set=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    --fmu)
      fmu_path="$2"
      fmu_set=true
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

if [[ $fmu_set == false ]]; then
  echo "Error: --fmu argument is required."
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

if [[ -z "$fmu_path" ]]; then
    echo 'false' > $result_file_path
    echo 'Input FMU not found!' >> $log_file_path
    exit 1
fi

# copy FMU to the target path
mkdir -p "$(dirname "$TARGET_PATH_FMU")"
cp "$fmu_path" "$TARGET_PATH_FMU"

# run the final evaluation, which means the actual quality metric
./evaluate_fmu.sh $TARGET_PATH_FMU $result_file_path $log_file_path