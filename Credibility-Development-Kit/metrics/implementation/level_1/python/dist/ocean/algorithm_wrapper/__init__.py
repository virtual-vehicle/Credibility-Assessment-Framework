import os

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