# Initialize input variable
distribution=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --dist)
      distribution="$2"
      shift # past argument
      shift # past value
      ;;
    --user)
      dockerhubusername="$2"
      shift # past argument
      shift # past value
      ;;
    *)
      echo "Unknown option: $key"
      exit 1
      ;;
  esac
done

if [ "$distribution" == "local" ]; then
    docker build -t sensor_model_deviation_metric .
    docker build -t sensor_model_deviation_local ./dist/local
    echo "Docker image sensor_model_deviation_local for local distribution built successfully."
elif [ "$distribution" == "oval" ]; then
    docker build -t $dockerhubusername/sensor_model_deviation_metric .
    docker build --build-arg DOCKER_HUB_USER=$dockerhubusername -t $dockerhubusername/sensor_model_deviation_oval ./dist/oval
    echo "Container images $dockerhubusername/sensor_model_deviation_metric and $dockerhubusername/sensor_model_deviation_oval for OVAL distribution built successfully. Push both images in a docker registry to register it in the OVAL ecosystem!"
elif [[ -z "$distribution" ]]; then
    echo "Error: Choose a distribution by using the --dist argument"
    exit 1
else
    echo "Error: Unsupported distribution (must be either local or oval)"
    exit 1
fi