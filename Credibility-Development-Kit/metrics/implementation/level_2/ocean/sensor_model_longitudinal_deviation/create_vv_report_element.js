const fs = require('fs');

const algorithmDid = process.env.TRANSFORMATION_DID;
const ddoAlgorithmString = fs.readFileSync(`/data/ddos/${algorithmDid}`, 'utf8');
const ddoAlgorithm = JSON.parse(ddoAlgorithmString.replace(/\n/g, ' '));

const inputDataDids = JSON.parse(process.env.DIDS);
const ddosInputData = inputDataDids.map(did => {
    let ddoString = fs.readFileSync(`/data/ddos/${did}`, 'utf8');
    return JSON.parse(ddoString.replace(/\n/g, ' '));
});

const userParametersString = fs.readFileSync('/data/inputs/algoCustomData.json', 'utf8')
const userParameters = JSON.parse(userParametersString);

const result = fs.readFileSync('/data/outputs/result.txt', 'utf8').trim() === 'true';
const log = fs.readFileSync('/data/outputs/log.txt', 'utf8');

function getConsumerParameterMetadata(parameterName) {
    return ddoAlgorithm.metadata.algorithm.consumerParameters.find(consumerParameter => consumerParameter.name === parameterName);
}

function consumerParameterType2XsdType(consumerParameter) {
    switch (consumerParameter.type) {
        case 'text':
            return 'xsd:string';
        case 'number':
            if (Number.isInteger(userParameters[consumerParameter.name])) {
                return 'xsd:integer';
            }
            else {
                return 'xsd:double';
            }
        case 'boolean':
            return 'xsd:boolean';
        default:
            return 'xsd:string';
    }
}

let evaluation = {
    "@type": "vv-report:Evaluation",
    "vv-report:metric": {
        "@type": "vv-report:Metric",
        "vv-report:metricTitle": {
            "@value": ddoAlgorithm.metadata.name,
            "@type": "xsd:string"
        },
        "vv-report:metricDescription": {
            "@value": ddoAlgorithm.metadata.description,
            "@type": "xsd:string"
        },
        "vv-report:metricReference": {
            "@value": algorithmDid,
            "@type": "xsd:anyURI"
        }
    },
    "vv-report:inputData": ddosInputData.map(input => { return {
            "@type": "vv-report:InputData",
            "vv-report:inputDescription": {
                "@value": input.metadata.description,
                "@type": "xsd:string"
            },
            "vv-report:inputReference": {
                "@value": input.id,
                "@type": "xsd:anyURI"
            }
        };
    }),
    "vv-report:parameters": Object.keys(userParameters).map(paramName => {
        return {
            "@type": "vv-report:Parameter",
            "vv-report:parameterName": {
                "@value": paramName,
                "@type": "xsd:string"
            },
            "vv-report:parameterDescription": {
                "@value": getConsumerParameterMetadata(paramName)["description"],
                "@type": "xsd:string"
            },
            "vv-report:parameterValue": {
                "@value": userParameters[paramName],
                "@type": consumerParameterType2XsdType(getConsumerParameterMetadata(paramName))
            }
        }
    }),
    "vv-report:result": {
        "@type": "vv-report:Result",
        "vv-report:resultTestPassed": {
            "@value": result,
            "@type": "xsd:boolean"
        },
        "vv-report:resultLog": {
            "@value": log,
            "@type": "xsd:string"
        },
        "vv-report:resultVerifiable": {
            "@value": true,
            "@type": "xsd:boolean"
        },
        "vv-report:resultVerification": {
            "@type": "vv-report:ResultVerification",
            "vv-report:resultVerificationDescription": {
                "@value": "Result can be verified in the history of the according compute job of the OVAL ecosystem.",
                "@type": "xsd:string"
            },
            "vv-report:resultVerificationReference": {
                "@value": "https://gaiax4plcaad.dlr.de/history/addJobIdHere",
                "@type": "xsd:anyURI"
            }
        }
    }
};

fs.writeFileSync('/data/outputs/vvreport_evaluation.json', JSON.stringify(evaluation, null, 4));