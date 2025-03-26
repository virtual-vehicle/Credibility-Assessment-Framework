"""
This program converts serialized osi trace files into a SensorView OSI file. 

Example usage:
    python3 osi_sd2sv.py -d trace.osi
"""

import argparse
import struct
import sys

sys.path.append("./open-simulation-interface/osi3trace")
from osi3trace.osi_trace import OSITrace

def command_line_arguments():
    """Define and handle command line interface"""

    parser = argparse.ArgumentParser(
        description="Convert a serialized osi trace file to a readable txth output.",
        prog="osi_count",
    )
    parser.add_argument(
        "--data",
        "-d",
        help="Path to the file with serialized data.",
        type=str,
        required=True,
    )
    parser.add_argument(
        "--output",
        "-o",
        help="Path to the output file.",
        type=str,
        required=True,
        default="extracted_sv.osi",
    )

    return parser.parse_args()


def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # Initialize the OSI trace class
    trace = OSITrace(args.data, "SensorData")

    # Open the file to write the extracted SensorView data
    f = open(args.output, "ab")

    for sensor_data in trace:
        sensor_view = sensor_data.sensor_view[0]
        bytes_buffer = sensor_view.SerializeToString()
        f.write(struct.pack("<L", len(bytes_buffer)))
        f.write(bytes_buffer)
        
    f.close()
    trace.close()

if __name__ == "__main__":
    main()