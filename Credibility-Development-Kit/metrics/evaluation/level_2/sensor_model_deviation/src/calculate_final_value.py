import sys
sys.path.append("./open-simulation-interface/osi3trace")
from osi3trace.osi_trace import OSITrace
import argparse
import json
from calculation_lib import DeviationCalculator 

def parse_arguments():
    parser = argparse.ArgumentParser(description="Calculate deviation of a target objects between reference and simulation traces")
    
    parser.add_argument("--ref", "-r", type=str, required=True, help="Path to the first OSI trace file")
    parser.add_argument("--sim", "-s", type=str, required=True, help="Path to the second OSI trace file")
    parser.add_argument("--params", "-p", type=str, required=True, help="Path to the parameters file")

    return parser.parse_args()

def calc_deviation_value():
    args = parse_arguments()

    traces_ref = OSITrace(args.ref, "SensorData")
    traces_sim = OSITrace(args.sim, "SensorData")
    with open(args.params, 'r') as params_file:
        parameters = json.load(params_file)

    calculator = DeviationCalculator(traces_ref, traces_sim, parameters)
    print(calculator.calculate_deviation())

    traces_ref.close()
    traces_sim.close()

if __name__ == "__main__":
    calc_deviation_value()