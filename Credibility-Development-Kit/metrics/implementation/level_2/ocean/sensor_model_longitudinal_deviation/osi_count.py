"""
This program converts serialized osi trace files into a human readable txth file. 

Example usage:
    python3 osi_count.py -d trace.osi -t SensorData
"""

import argparse
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
        "--type",
        "-t",
        help="Name of the type used to serialize data.",
        choices=OSITrace.message_types(),
        default="SensorView",
        type=str,
        required=False,
    )

    return parser.parse_args()


def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # Initialize the OSI trace class
    trace = OSITrace(args.data, args.type)
    i = 0
    for _ in trace:
        i += 1
    trace.close()

    print(i)

if __name__ == "__main__":
    main()