from fmpy.validation import validate_fmu
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description="Calculate deviation of a target objects between reference and simulation traces")
    parser.add_argument("--fmu", "-f", type=str, required=True, help="Path to the FMU file")

    return parser.parse_args()

################################ core algorithm ################################

def check_fmu_model_description(fmu_path):
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
    
    problems = validate_fmu(fmu_path)    

    logs = ""
    
    if len(problems) > 0:
        logs = " // ".join([f"{i+1}: {problem}" for i, problem in enumerate(problems)])

    return logs

if __name__ == "__main__":
    args = parse_arguments()
    check_fmu_model_description(args.fmu)