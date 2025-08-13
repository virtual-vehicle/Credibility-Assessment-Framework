import argparse
import sys
from lxml import etree

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

def get_mounting_position(sensor_data_trace):
    # Init mounting position
    mp_x = 0.0
    mp_y = 0.0
    mp_z = 0.0
    mp_yaw = 0.0
    mp_pitch = 0.0
    mp_roll = 0.0

    # Get mounting position if available
    for sensor_data in sensor_data_trace:
        if sensor_data.mounting_position:
            mp_x = sensor_data.mounting_position.position.x
            mp_y = sensor_data.mounting_position.position.y
            mp_z = sensor_data.mounting_position.position.z
            mp_yaw = sensor_data.mounting_position.orientation.yaw
            mp_pitch = sensor_data.mounting_position.orientation.pitch
            mp_roll = sensor_data.mounting_position.orientation.roll
        break

    return { "x": mp_x, "y": mp_y, "z": mp_z, "yaw": mp_yaw, "pitch": mp_pitch, "roll": mp_roll }
    
def replace_parameter(root, mounting_position, quantity):
    for elem in root.xpath('//ssv:Parameter[@name="mounting_position_' + quantity + '"]/ssv:Real', namespaces={'ssv': 'http://ssp-standard.org/SSP1/SystemStructureParameterValues'}):
        elem.attrib['value'] = str(mounting_position[quantity])

def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # Initialize the OSI trace class
    trace = OSITrace(args.osisensordata, "SensorData")
    mounting_position = get_mounting_position(trace)
    trace.close()

    # replace mounting position in SSD file
    with open(args.ssd, "r") as f:
        ssd = f.read()
        ssd_bytestr = ssd.encode('utf-8')
        parser = etree.XMLParser(encoding='utf-8')
        root = etree.fromstring(ssd_bytestr, parser=parser)

        for quantity in mounting_position.keys():
            replace_parameter(root, mounting_position, quantity)
    
    # overwrite SSD file
    tree = etree.ElementTree(root)
    tree.write(args.ssd, pretty_print=True, xml_declaration=True, encoding='UTF-8')

if __name__ == "__main__":
    main()