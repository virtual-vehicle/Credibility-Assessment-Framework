import os
import sys
import json

def main():
    # Get the DDOs from the environment variable
    dataset_dids = json.loads(os.getenv('DIDS', None))

    file_found = False
    if dataset_dids is not None:
        for did in dataset_dids:
            filename = '/data/ddos/' + did
            with open(filename) as ddo_file:
                ddo = json.load(ddo_file)
                if ddo['metadata']['additionalInformation']['datasettype'].lower() == "osi":
                    file_found = True
                    metadata = {
                        'datetime': ddo['metadata']['additionalInformation']['osimetadata']['osirecordingTime'],
                        'osiversion': ddo['metadata']['additionalInformation']['osimetadata']['version'],
                        'frames': ddo['metadata']['additionalInformation']['osimetadata']['numberFrames']
                    }
                    break

    
    if file_found:
        date_converted = metadata['datetime'].replace("-", "").replace(":", "")
        version_converted = metadata['osiversion'].replace(".", "")
        osi_file_name_synth = date_converted + "_sd_" + version_converted + "_3200_" + str(metadata['frames']) + "_synthname.osi" 
        sys.stdout.write(osi_file_name_synth + '\n')
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()