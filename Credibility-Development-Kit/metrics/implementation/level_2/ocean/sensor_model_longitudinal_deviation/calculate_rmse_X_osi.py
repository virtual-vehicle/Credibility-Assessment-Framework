import sys
import argparse
import numpy as np

sys.path.append("./open-simulation-interface/osi3trace")
from osi3trace.osi_trace import OSITrace

def parse_arguments():
    parser = argparse.ArgumentParser(description="Calculate RMSE between two OSI files")
    parser.add_argument("--file1", "-f1", type=str, required=True, help="Path to the first OSI trace file")
    parser.add_argument("--file2", "-f2", type=str, required=True, help="Path to the second OSI trace file")
    parser.add_argument("--targetid", "-t", type=str, required=True, help="Ground truth ID of the target vehicle")
    return parser.parse_args()

def extract_positions(trace_path, ground_truth_id):
    """first file is the one with the moving_object data, second file is the one with many moving objects and tracking number is needed"""
    osi_type = "SensorData"
    trace = OSITrace(trace_path, osi_type)
    positions = []

    time_step_counter = 0  # Counter to track every nth step

    for sensor_data in trace:
        time_step_positions = []

        if sensor_data.moving_object:
            time_step_positions = [
                obj.base.position.x for obj in sensor_data.moving_object if any(gt_id.value == ground_truth_id for gt_id in obj.header.ground_truth_id)
            ]

        if time_step_positions:  # Only add if data exists for this timestamp
            positions.append((time_step_counter, time_step_positions))  # Store timestep along with positions

        # if time_step_counter % print_every_n_steps == 0:
            # print(f"Time Step {time_step_counter}: {time_step_positions}")

        time_step_counter += 1

    trace.close()

    return positions

def compute_rmse(positions1, positions2):
    deviation = []

    positions1_dict = {timestep: pos for timestep, pos in positions1}
    positions2_dict = {timestep: pos for timestep, pos in positions2}

    common_timesteps = set(positions1_dict.keys()).intersection(set(positions2_dict.keys()))

    for timestep in common_timesteps:
        frame1 = positions1_dict[timestep]
        frame2 = positions2_dict[timestep]

        if not frame1 or not frame2:  # Skip if no position data for the timestamp in either file
            continue

        frame_deviations = [(x1 - x2) ** 2 for x1, x2 in zip(frame1, frame2)]
        deviation.extend(frame_deviations)

    rmse = np.sqrt(np.mean(deviation)) if deviation else float('nan')
    return rmse

def main():
    args = parse_arguments()
    positions1 = extract_positions(args.file1, int(args.targetid))
    positions2 = extract_positions(args.file2, int(args.targetid))
    rmse = compute_rmse(positions1, positions2)

    print(rmse)

if __name__ == "__main__":
    main()