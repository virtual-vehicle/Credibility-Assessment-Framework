FROM ubuntu:22.04

# install necessary libraries
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y bc cmake git build-essential python-is-python3 python3-pip libxml2-dev zlib1g-dev libzstd-dev liblz4-dev && \
    apt-get clean

RUN pip3 install --upgrade pip

COPY ./dep/openmcx /openmcx
COPY ./dep/open-simulation-interface /open-simulation-interface

# build OpenMCx
RUN cd openmcx && ./build.sh

# install osi for python
RUN cd open-simulation-interface && pip3 install .

# Copy requirements.txt and install dependencies
COPY ./dep/requirements.txt /
RUN pip3 install -r requirements.txt

# copy runtime prerequisites
COPY ./src/calculation_lib.py /calculation_lib.py
COPY ./src/calculate_final_value.py /calculate_final_value.py
COPY ./tools/execute_workflow.sh /execute_workflow.sh
COPY ./tools/extract_user_params.py /extract_user_params.py
COPY ./tools/evaluate_results.sh /evaluate_results.sh
COPY ./tools/resimulation/configure_stop_time.sh /configure_stop_time.sh
COPY ./tools/resimulation/osi_count.py /osi_count.py
COPY ./tools/resimulation/osi_sd2sv.py /osi_sd2sv.py
COPY ./tools/resimulation/parametrize_input_location.py /parametrize_input_location.py
COPY ./tools/resimulation/parametrize_mounting_position.py /parametrize_mounting_position.py
COPY ./tools/resimulation/parametrize_osmp_location.py /parametrize_osmp_location.py
COPY ./tools/resimulation/parametrize_output_location.py /parametrize_output_location.py
COPY ./tools/resimulation/setup_simulation.sh /setup_simulation.sh
COPY ./tools/resimulation/run_simulation.sh /run_simulation.sh
COPY ./res/open_loop_system.ssd /open_loop_system.ssd
COPY ./res/sl-5-5-osi-trace-file-player.fmu /fmu/sl-5-5-osi-trace-file-player.fmu
COPY ./res/sl-5-6-osi-trace-file-writer.fmu /fmu/sl-5-6-osi-trace-file-writer.fmu

RUN chmod +x /run_simulation.sh
RUN chmod +x /evaluate_results.sh
RUN chmod +x /configure_stop_time.sh
RUN chmod +x /setup_simulation.sh
RUN chmod +x /execute_workflow.sh