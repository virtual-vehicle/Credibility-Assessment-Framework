import argparse
import sys

sys.path.append("./open-simulation-interface/osi3trace")
from osi3trace.osi_trace import OSITrace

def command_line_arguments():
    """Define and handle command line interface"""

    parser = argparse.ArgumentParser(
        description="Parametrize sensor model.",
        prog="parametrize_sensor_model",
    )
    parser.add_argument(
        "--osisensordata",
        "-o",
        help="Path to the OSI SensorData file.",
        type=str,
        required=True
    )
    parser.add_argument(
        "--ssd",
        "-s",
        help="Path to the SSD file.",
        type=str,
        required=True
    )

    return parser.parse_args()

def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # Initialize the OSI trace class
    trace = OSITrace(args.osisensordata, "SensorData")

    # Init mounting position
    mp_x = 0.0
    mp_y = 0.0
    mp_z = 0.0
    mp_yaw = 0.0
    mp_pitch = 0.0
    mp_roll = 0.0

    # Get mounting position if available
    for sensor_data in trace:
        if sensor_data.mounting_position:
            mp_x = sensor_data.mounting_position.position.x
            mp_y = sensor_data.mounting_position.position.y
            mp_z = sensor_data.mounting_position.position.z
            mp_yaw = sensor_data.mounting_position.orientation.yaw
            mp_pitch = sensor_data.mounting_position.orientation.pitch
            mp_roll = sensor_data.mounting_position.orientation.roll
        break

    trace.close()

    with open(args.ssd, "r") as f:
        ssd = f.read()
        ssd = ssd.replace('$_x_$', str(mp_x))
        ssd = ssd.replace('$_y_$', str(mp_y))
        ssd = ssd.replace('$_z_$', str(mp_z))
        ssd = ssd.replace('$_yaw_$', str(mp_yaw))
        ssd = ssd.replace('$_pitch_$', str(mp_pitch))
        ssd = ssd.replace('$_roll_$', str(mp_roll))
    
    with open(args.ssd, "w") as f:
        f.write(ssd)

if __name__ == "__main__":
    main()