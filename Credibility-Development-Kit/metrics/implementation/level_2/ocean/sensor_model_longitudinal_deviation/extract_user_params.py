import json
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description="Specify the parameter you want to extract")
    parser.add_argument("--name", "-n", type=str, required=True, help="parameter name (key of key-value pair)")
    parser.add_argument("--file", "-f", type=str, required=True, help="parameter name (key of key-value pair)")
    return parser.parse_args()

def main():
    args = parse_arguments()
    with open(args.file, 'r') as file:
        key_values_pairs = json.load(file)
        print(key_values_pairs[args.name])

if __name__ == "__main__":
    main()