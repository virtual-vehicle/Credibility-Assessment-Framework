import argparse
import os
from lxml import etree

def command_line_arguments():
    """Define and handle command line interface"""

    parser = argparse.ArgumentParser(
        description="Parametrize sensor model.",
        prog="parametrize_input_location",
    )
    parser.add_argument(
        "--osisensorview",
        "-v",
        help="Path to OSI SensorView input file.",
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
    directory, file_name = os.path.split(file_path)

    for comp in ssd_root.xpath('//ssd:Component[@name="trace file player"]', namespaces={'ssd': 'http://ssp-standard.org/SSP1/SystemStructureDescription'}):
        for elem in comp.xpath('.//ssv:Parameter[@name="trace_path"]/ssv:String', namespaces={'ssv': 'http://ssp-standard.org/SSP1/SystemStructureParameterValues'}):
            elem.attrib['value'] = directory
        for elem in comp.xpath('//ssv:Parameter[@name="trace_name"]/ssv:String', namespaces={'ssv': 'http://ssp-standard.org/SSP1/SystemStructureParameterValues'}):
            elem.attrib['value'] = file_name

def main():
    # Handling of command line arguments
    args = command_line_arguments()

    # replace mounting position in SSD file
    with open(args.ssd, "r") as f:
        ssd = f.read()
        ssd_bytestr = ssd.encode('utf-8')
        parser = etree.XMLParser(encoding='utf-8')
        root = etree.fromstring(ssd_bytestr, parser=parser)
        replace_location(root, args.osisensorview)
    
    # overwrite SSD file
    tree = etree.ElementTree(root)
    tree.write(args.ssd, pretty_print=True, xml_declaration=True, encoding='UTF-8')

if __name__ == "__main__":
    main()