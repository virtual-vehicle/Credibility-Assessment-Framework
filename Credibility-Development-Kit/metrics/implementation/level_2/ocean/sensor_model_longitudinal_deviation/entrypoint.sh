#!/bin/bash

# Create required directories
mkdir -p /data/outputs/raw/simulation

mv ./trace_file_generation/open_loop_system.ssd open_loop_system.ssd

# run steps from setup to evaluation
DIDS=$DIDS ./setup_simulation.sh
DIDS=$DIDS ./run_simulation.sh
DIDS=$DIDS TRANSFORMATION_DID=$TRANSFORMATION_DID ./run_final_evaluation.sh