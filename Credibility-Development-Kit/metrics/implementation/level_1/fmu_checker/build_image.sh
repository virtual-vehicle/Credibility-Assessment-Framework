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
    docker build -t fmu_checker_metric .
    docker build -t fmu_checker_local ./dist/local
    echo "Docker image fmu_checker_local for local distribution built successfully."
elif [ "$distribution" == "oval" ]; then
    docker build -t $dockerhubusername/fmu_checker_metric .
    docker build --build-arg DOCKER_HUB_USER=$dockerhubusername -t $dockerhubusername/fmu_checker_oval ./dist/oval
    echo "Container images $dockerhubusername/fmu_checker_metric and $dockerhubusername/fmu_checker_oval for OVAL distribution built successfully. Push both images in a docker registry to register it in the OVAL ecosystem!"
elif [[ -z "$distribution" ]]; then
    echo "Error: Choose a distribution by using the --dist argument"
    exit 1
else
    echo "Error: Unsupported distribution (must be either local or oval)"
    exit 1
fi