FROM python:3.13

RUN pip install fmpy==0.3.22
COPY algorithm_wrapper /usr/local/lib/python3.13/site-packages/algorithm_wrapper

# ENTRYPOINT will be set when registering the image in the OCEAN ecosystem
# using the following command: ENTRYPOINT python $ALGO