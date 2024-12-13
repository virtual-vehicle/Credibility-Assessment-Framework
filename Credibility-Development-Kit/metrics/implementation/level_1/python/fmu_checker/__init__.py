from fmpy.validation import validate_fmu
import json
import os

__version__ = '0.0.1'
__author__ = 'Maurizio Ahmann (localhorst87)'

def check_fmu_model_description(fmu_path=None):
    """
    Checks the modelDescription.xml of a Functional Mockup Unit (FMU):
        - validation against the XML schema, uniqueness and validity of variable names
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
        str: A stringified dictionary with the attributes 'result' (giving information if the quality metric has been
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