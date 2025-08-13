# FMU Checker

The FMU Checker used to validate the standard compliancy of the FMUs interface. 
It supports FMU version 1.x, 2.x, as well as 3.x.

## Description

This quality metric is used to validate the following aspects of the FMU's interface description (modelDescription.xml):
- validation against the XML schema
- uniqueness and validity of variable names
- completeness and integrity of the ModelStructure
- required start values
- combinations of causality and variability
- units

## Input

This quality metric expects 1 input dataset: 
- FMU using version 1.x, 2.x, or 3.x. FMU for ModelExchange and CoSimulation are supported both

## Parameters

Currently, there are no parameters to configure the quality metric.

## Usage

### OVAL

If you want to register this quality metric as an algorithm on [OVAL](https://oval.pepro.io/), run the following command to build the required images:
```bash
./build_image.sh --dist oval --user <your docker hub username>
```
Register both created images in the Docker Hub Registry.

Example for user `jondoequalitymaster`
```bash
./build_image.sh --dist oval --user jondoequalitymaster
docker push jondoequalitymaster/fmu_checker_metric
docker push jondoequalitymaster/fmu_checker_oval
```
And register the `fmu_checker_oval` image in the OVAL ecosystem.

### Arbitrary environment

To run the quality metric in your arbitrary environment, run the following command to build the required images:
```bash
./build_image.sh --dist local
```

To run the metric in your environment, execute the following command:
```bash
docker run --rm -it -v /path/to/your/mounted_folder:/data fmu_checker_local
```
Change the mounted volume */path/to/your/mounted_folder* to the folder that contains your input data, using the following structure:
```
mounted_folder/
 ├───────── inputs/
 │           ├──── my_simulation_model.fmu   # FMU to check
```
After successful execution of the quality metric, the outputs folder will contain the following files
```
mounted_folder/
 ├───────── inputs/
 │           ├──── ...
 ├───────── outputs/   
 │           ├──── result.txt                                           # Final result of the quality metric execution containing a boolean value
 │           ├──── log.txt                                              # Further information about the quality metric execution
```