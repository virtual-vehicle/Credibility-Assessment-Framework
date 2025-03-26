FROM ubuntu:20.04

# install necessary libraries
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y bc cmake git build-essential python-is-python3 python3-numpy python3-pip libxml2-dev zlib1g-dev libzstd-dev liblz4-dev nodejs

COPY ./openmcx ./openmcx
COPY ./open-simulation-interface ./open-simulation-interface

# build OpenMCx
RUN cd openmcx && ./build.sh

# install osi for python
RUN cd open-simulation-interface && pip3 install .

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

# copy runtime prerequisites
COPY ./calculate_rmse_X_osi.py /calculate_rmse_X_osi.py
COPY ./create_vv_report_element.js /create_vv_report_element.js
COPY ./entrypoint.sh /entrypoint.sh
COPY ./extract_user_params.py /extract_user_params.py
COPY ./get_filepath.py /get_filepath.py
COPY ./osi_count.py /osi_count.py
COPY ./osi_sd2sv.py /osi_sd2sv.py
COPY ./parametrize_sensor_model.py /parametrize_sensor_model.py
COPY ./trace_file_generation /trace_file_generation
COPY ./replace_stop_time.sh /replace_stop_time.sh
COPY ./run_simulation.sh /run_simulation.sh
COPY ./run_final_evaluation.sh /run_final_evaluation.sh
COPY ./setup_simulation.sh /setup_simulation.sh


RUN chmod +x /run_simulation.sh
RUN chmod +x /run_final_evaluation.sh
RUN chmod +x /replace_stop_time.sh
RUN chmod +x /setup_simulation.sh
RUN chmod +x /entrypoint.sh