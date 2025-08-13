from abc import ABC, abstractmethod
import numpy as np

TARGET_QUANTITY_PARAM_NAME = "target_quantity"
REDUCTION_METHOD_PARAM_NAME = "reduction_method"
TARGET_ID_PARAM_NAME = "target_vehicle_id"

class DeviationCalculator:
    def __init__(self, sensor_data_trace_ref, sensor_data_trace_sim, parameters):
        self.sensor_data_trace_ref = sensor_data_trace_ref
        self.sensor_data_trace_sim = sensor_data_trace_sim
        self.target_extractor = self.target_extractor_factory(parameters[TARGET_QUANTITY_PARAM_NAME])
        self.method_provider = self.method_provider_factory(parameters[REDUCTION_METHOD_PARAM_NAME])
        self.target_id = int(parameters[TARGET_ID_PARAM_NAME])

    def target_extractor_factory(self, target_quantity):
        if target_quantity == "longitudinal_position":
            return LongitudinalPositionExtractor()
        elif target_quantity == "lateral_position":
            return LateralPositionExtractor()
        elif target_quantity == "longitudinal_velocity":
            return LongitudinalVelocityExtractor()
        elif target_quantity == "lateral_velocity":
            return LateralVelocityExtractor()
        elif target_quantity == "yaw_orientation":
            return YawOrientationExtractor()
        elif target_quantity == "yaw_rate":
            return YawRateExtractor()
        else:
            raise ValueError(f"Unknown target quantity: {target_quantity}")
    
    def method_provider_factory(self, reduction_method):
        if reduction_method.lower() == "rmse":
            return RMSEProvider()
        elif reduction_method.lower() == "mae":
            return MAEProvider()
        elif reduction_method.lower() == "mse":
            return MSEProvider()
        elif reduction_method.lower() == "max":
            return MaxProvider()
        else:
            raise ValueError(f"Unknown reduction method: {reduction_method}")
        
    def calculate_deviation(self):
        target_quantities_ref = self.target_extractor.extract_target_quantities(self.target_id, self.sensor_data_trace_ref)
        target_quantities_sim = self.target_extractor.extract_target_quantities(self.target_id, self.sensor_data_trace_sim)
        return self.method_provider.calculate_deviation(target_quantities_ref, target_quantities_sim)

class TargetExtractor(ABC):
    def extract_target_quantities(self, target_id, sensor_data_trace):
        target_quantites = []
        time_step_counter = 0

        for sensor_data in sensor_data_trace:
            time_step_quantity = self.extract_target_quantity_from_message(sensor_data, target_id)

            # Only add if data exists for this timestamp
            if time_step_quantity:
                quantity_value = time_step_quantity[0]
                target_quantites.append((time_step_counter, quantity_value))

            time_step_counter += 1

        return target_quantites

    @abstractmethod
    def extract_target_quantity_from_message(self, target_id):
        pass

class LongitudinalPositionExtractor(TargetExtractor):
    def extract_target_quantity_from_message(self, sensor_data, target_id):
        return [obj.base.position.x for obj in sensor_data.moving_object if any(gt_id.value == target_id for gt_id in obj.header.ground_truth_id)]

class LateralPositionExtractor(TargetExtractor):
    def extract_target_quantity_from_message(self, sensor_data, target_id):
        return [obj.base.position.y for obj in sensor_data.moving_object if any(gt_id.value == target_id for gt_id in obj.header.ground_truth_id)]

class LongitudinalVelocityExtractor(TargetExtractor):
    def extract_target_quantity_from_message(self, sensor_data, target_id):
        return [obj.base.velocity.x for obj in sensor_data.moving_object if any(gt_id.value == target_id for gt_id in obj.header.ground_truth_id)]
    
class LateralVelocityExtractor(TargetExtractor):
    def extract_target_quantity_from_message(self, sensor_data, target_id):
        return [obj.base.velocity.y for obj in sensor_data.moving_object if any(gt_id.value == target_id for gt_id in obj.header.ground_truth_id)]
    
class YawOrientationExtractor(TargetExtractor):
    def extract_target_quantity_from_message(self, sensor_data, target_id):
        return [obj.base.orientation.yaw for obj in sensor_data.moving_object if any(gt_id.value == target_id for gt_id in obj.header.ground_truth_id)]
    
class YawRateExtractor(TargetExtractor):
    def extract_target_quantity_from_message(self, sensor_data, target_id):
        return [obj.base.orientation_rate.yaw for obj in sensor_data.moving_object if any(gt_id.value == target_id for gt_id in obj.header.ground_truth_id)]

class MethodProvider(ABC):
    def calculate_deviation(self, values_ref, values_sim):
        values_ref_dict = {timestep: quantity for timestep, quantity in values_ref}
        values_sim_dict = {timestep: quantity for timestep, quantity in values_sim}

        common_timesteps = set(values_ref_dict.keys()).intersection(set(values_sim_dict.keys()))

        final_value_pairs = []

        for timestep in common_timesteps:
            frame_val_1 = values_ref_dict[timestep]
            frame_val_2 = values_sim_dict[timestep]

            # Skip if no data for the timestamp in either file
            if frame_val_1 and frame_val_2:  
                final_value_pairs.append((frame_val_1, frame_val_2))

        return self.reduce(final_value_pairs)
    
    @abstractmethod
    def reduce(self, final_value_pairs):
        pass
    
class RMSEProvider(MethodProvider):
    """
    Provides the Root Mean Squared Error (RMSE) method for reducing a list of value pairs.
    The RMSE is a commonly used metric to measure the differences between values predicted by a model 
    and the values actually observed. It is calculated as the square root of the mean of the squared 
    deviations between paired values.
    """
    def reduce(self, final_value_pairs):
        squared_deviation = []

        for val1, val2 in final_value_pairs:
            squared_deviation.append((val1 - val2) ** 2)

        return np.sqrt(np.mean(squared_deviation)) if squared_deviation else float('nan')
    
class MAEProvider(MethodProvider):
    """
    Provides the Mean Absolute Error (MAE) method for reducing a list of value pairs.
    The `reduce` method calculates the mean absolute error by computing the absolute 
    deviation between corresponding elements in the provided value pairs and then 
    averaging these deviations.
    """
    def reduce(self, final_value_pairs):
        absolute_deviation = []

        for val1, val2 in final_value_pairs:
            absolute_deviation.append(np.abs(val1 - val2))

        return np.mean(absolute_deviation) if absolute_deviation else float('nan')
    
class MSEProvider(MethodProvider):
    def reduce(self, final_value_pairs):
        squared_deviation = []

        for val1, val2 in final_value_pairs:
            squared_deviation.append((val1 - val2) ** 2)

        return np.mean(squared_deviation) if squared_deviation else float('nan')
    
class MaxProvider(MethodProvider):
    def reduce(self, final_value_pairs):
        max_deviation = []

        for val1, val2 in final_value_pairs:
            max_deviation.append(np.abs(val1 - val2))

        return np.max(max_deviation) if max_deviation else float('nan')