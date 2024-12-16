'''
--------------------------------------------------------------------------------
USE THIS FILE AS THE ALGORITHM IN THE OCEAN ECOSYSTEM, BASED ON THE DOCKER 
IMAGE, CREATED WITH THE ATTACHED DOCKERFILE
--------------------------------------------------------------------------------
'''

from fmpy.validation import validate_fmu
import json
import os

########## wrapper for seamless interaction with the OCEAN ecosystem ##########

INPUT_DIR = './data/inputs/'
OUTPUT_DIR = './data/outputs/'

def _find_fmu_files(directory):
    fmu_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.fmu'):
                fmu_files.append(os.path.join(root, file))
    return fmu_files

def _write_result(directory, result):
    f = open(directory + "result.json", "w")
    f.write(result)
    f.close()

def ocean_wrapper_check_fmu_model_description(metric_fcn):
    def get_inputs_write_output():
        # get location of FMU file(s)
        fmu_files = _find_fmu_files(INPUT_DIR)

        # if FMU is available, use its path, otherwise return a negative result
        if len(fmu_files) > 0:
            result_log = metric_fcn(fmu_files[0])
        else:
            result_log = json.dumps({ "result": False, "log": "No FMU file provided"})

        # write results to target location
        _write_result(OUTPUT_DIR, result_log)

    return get_inputs_write_output

################################ core algorithm ################################

# Decorator does the following:
# - it searches for the FMU in the mounted /data/inputs/ and provides it as
#    fmu_path for check_model_description
# - it writes the output to the mounted /data/outputs/
# -> Therefore, check_model_description must be called without arguments!
@ocean_wrapper_check_fmu_model_description
def check_fmu_model_description(fmu_path=None):
    """
    Checks the modelDescription.xml of a Functional Mockup Unit (FMU):
        - validation against the XML schema, uniqueness and validity of variable
           names
        - completeness and integrity of the ModelStructure
        - required start values-
        - combinations of causality and variability-
        - units

    It uses the FMPy library (https://github.com/CATIA-Systems/FMPy).

    FMPy is released under the 2-Clause BSD license:

    Copyright (c) 2017-2024 Dassault Systemes. All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above
        copyright notice, this list of conditions and the following disclaimer
        in the documentation and/or other materials provided with the
        distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    Args:
        fmu_path (str): The absolute path of the FMU to check

    Returns:
        str: A stringified dictionary with the attributes 'result' (giving 
             information if the quality metric has been
             passed or not) and 'log' (providing additional information)
    """
    if fmu_path == None:
        reslog = { "result": False, "log": "The path to the FMU is missing" }
        return json.dumps(reslog)
        
    if os.path.isfile(fmu_path) == False:
        reslog = { "result": False, "log": "For the given path to the FMU, no FMU could be found" }
        return json.dumps(reslog)
    
    problems = validate_fmu(fmu_path)

    if len(problems) == 0:
        reslog = { "result": True, "log": "The modelDescription.xml of the FMU does not contain any errors." }
    else:
        logs = " // next error: ".join(problems)
        reslog = { "result": False, "log": logs}

    return json.dumps(reslog)

# execute metric
check_fmu_model_description()