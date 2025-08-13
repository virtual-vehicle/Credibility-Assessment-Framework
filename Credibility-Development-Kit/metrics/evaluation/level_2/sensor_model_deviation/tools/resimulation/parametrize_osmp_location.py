import argparse
import os
from lxml import etree

def command_line_arguments():
    """Define and handle command line interface"""

    parser = argparse.ArgumentParser(
        description="Parametrize sensor model.",
        prog="parametrize_sensor_model_location",
    )
    parser.add_argument(
        "--targetpath",
        "-p",
        help="Target path of sensor model",
        type=str,
        required=True
    )
    parser.add_argument(
        "--ssd",
        "-s",
        help="Path to SSD file.",
        type=str,
        required=True
    )

    return parser.parse_args()
    
def replace_location(ssd_root, file_path):
    for comp in ssd_root.xpath('//ssd:Component[@name="sensor model"]', namespaces={'ssd': 'http://ssp-standard.org/SSP1/SystemStructureDescription'}):
        comp.attrib['source'] = file_path

def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # replace mounting position in SSD file
    with open(args.ssd, "r") as f:
        ssd = f.read()
        ssd_bytestr = ssd.encode('utf-8')
        parser = etree.XMLParser(encoding='utf-8')
        root = etree.fromstring(ssd_bytestr, parser=parser)
        replace_location(root, args.targetpath)
    
    # overwrite SSD file
    tree = etree.ElementTree(root)
    tree.write(args.ssd, pretty_print=True, xml_declaration=True, encoding='UTF-8')

if __name__ == "__main__":
    main()