import argparse
import json
import os
import sys

def command_line_arguments():
    """Define and handle command line interface"""

    parser = argparse.ArgumentParser(
        description="Get the path of a file according to matching search in the DDO of the file",
        prog="get_filepath",
    )
    parser.add_argument(
        "--name",
        "-n",
        help="specifies the string to search in the name of the dataset",
        type=str,
        required=False,
    )
    parser.add_argument(
        "--description",
        "-d",
        help="specifies the string to search in the description of the dataset",
        type=str,
        required=False,
    )
    parser.add_argument(
        "--label",
        "-l",
        help="specifies the string to search in the labels (tags) of the dataset",
        type=str,
        required=False,
    )
    parser.add_argument(
        "--type",
        "-t",
        help="specifies the string to search in the datasettype of the dataset",
        type=str,
        required=False,
    )

    return parser.parse_args()

def main():
    # Handling of command line arguments
    args = command_line_arguments()

    if args.name is None and args.description is None and args.label is None and args.type is None:
        sys.stderr.write("Error: Please specify at least one search parameter\n")
        sys.exit(1)

    # Get the DDOs from the environment variable
    dataset_dids = json.loads(os.getenv('DIDS', None))

    file_found = False
    if dataset_dids is not None:
        for did in dataset_dids:
            filename = './data/ddos/' + did
            with open(filename) as ddo_file:
                ddo = json.load(ddo_file)
                if args.name is not None and args.name.lower() in ddo['metadata']['name'].lower():
                    file_found = True
                    break
                elif args.description is not None and args.description.lower() in ddo['metadata']['description'].lower():
                    file_found = True
                    break
                elif args.type is not None and args.type.lower() == ddo['metadata']['additionalInformation']['datasettype'].lower():
                    file_found = True
                    break
            
    if file_found:
        sys.stdout.write('/data/inputs/' + did + '/0' + '\n')
    else:
        sys.stderr.write("Error: No file found\n")
        sys.exit(1)

if __name__ == "__main__":
    main()