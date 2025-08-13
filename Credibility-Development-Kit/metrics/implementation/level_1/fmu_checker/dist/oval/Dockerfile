ARG DOCKER_HUB_USER
FROM ${DOCKER_HUB_USER}/fmu_checker_metric

# install nodejs
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get clean

COPY ./create_vv_report_element.js /create_vv_report_element.js
COPY ./get_filepath.py /get_filepath.py
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]