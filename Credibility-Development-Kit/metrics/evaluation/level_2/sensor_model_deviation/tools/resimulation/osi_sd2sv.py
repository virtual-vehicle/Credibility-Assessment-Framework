"""
This program extracts the SensorView messages from OSI SensorData traces and provides a trace from each 

Example usage:
    python3 osi_sd2sv.py -d trace.osi
"""

import argparse
import struct
import sys
import os

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
        "--target",
        "-t",
        help="Target folder where to save the SensorView trace.",
        type=str,
        required=True,
    )

    return parser.parse_args()


def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # create output base path
    sv_path_old_folder = args.data.replace("_sd_", "_sv_")
    sv_filename = os.path.basename(sv_path_old_folder)
    sv_path = os.path.join(args.target, sv_filename)

    # Initialize the OSI trace class
    trace = OSITrace(args.data, "SensorData")

    f = open(sv_path, "ab")

    for sensor_data in trace:
        # only 1 SensorView per SensorData expected!
        sensor_view = sensor_data.sensor_view[0]
        sv_bytes_buffer = sensor_view.SerializeToString()
        f.write(struct.pack("<L", len(sv_bytes_buffer)))
        f.write(sv_bytes_buffer)
        
    f.close()               
    trace.close()

    print(sv_path)

if __name__ == "__main__":
    main()