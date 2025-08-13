FROM ubuntu:22.04

# install necessary libraries
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y python-is-python3 python3-pip && \
    apt-get clean

RUN pip3 install --upgrade pip

COPY ./dep/requirements.txt /
RUN pip3 install -r requirements.txt

COPY ./src/algorithm.py /algorithm.py
COPY ./tools/execute_workflow.sh /execute_workflow.sh
COPY ./tools/evaluate_fmu.sh /evaluate_fmu.sh

RUN chmod +x /execute_workflow.sh
RUN chmod +x /evaluate_fmu.sh