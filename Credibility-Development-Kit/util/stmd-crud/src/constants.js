const particles = {
    'stc:Input': {},
    'stc:Procedure': {},
    'stc:Output': {},
    'stc:Rationale': {}
};

const PHASE_TREE = {
    'stmd:SimulationTaskMetaData': {
        'stmd:AnalysisPhase': {
            'stmd:AnalyzeSimulationTaskAndObjectives': particles,
            'stmd:VerifyAnalysis': particles
        },
        'stmd:RequirementsPhase': {
            'stmd:DefineModelRequirements': particles,
            'stmd:DefineParameterRequirements': particles,
            'stmd:DefineSimulationEnvironmentRequirements': particles,
            'stmd:DefineSimulationIntegrationRequirements': particles,
            'stmd:DefineTestCaseRequirements': particles,
            'stmd:DefineQualityAssuranceRequirements': particles,
            'stmd:VerifyRequirements': particles
        },
        'stmd:DesignPhase': {
            'stmd:DefineModelDesignSpecification': particles,
            'stmd:DefineParameterDesignSpecification': particles,
            'stmd:DefineSimulationEnvironmentDesignSpecification': particles,
            'stmd:DefineSimulationIntegrationDesignSpecification': particles,
            'stmd:DefineTestCaseDesignSpecification': particles,
            'stmd:DefineQualityAssuranceDesignSpecification': particles,
            'stmd:VerifyDesignSpecification': particles
        },
        'stmd:ImplementationPhase': {
            'stmd:ImplementModel': particles,
            'stmd:ImplementParameter': particles,
            'stmd:ImplementSimulationEnvironment': particles,
            'stmd:ImplementTestCase': particles,
            'stmd:IntegrateSimulation': particles,
            'stmd:AssureSimulationSetupQuality': particles,
            'stmd:DeriveSimulationSetupQualityVerdict': particles
        },
        'stmd:ExecutionPhase': {
            'stmd:ExecuteSimulation': particles
        },
        'stmd:EvaluationPhase': {
            'stmd:EvaluateSimulationResults': particles,
            'stmd:AssureSimulationQuality': particles,
            'stmd:DeriveSimulationQualityVerdict': particles
        },
        'stmd:FulfillmentPhase': {
            'stmd:DecideSimulationObjectiveFulfillment': particles
        }
    }
};     

const LIFECYCLE_ENTRY_NAMES = [
    'stc:Drafted',
    'stc:Defined',
    'stc:Validated',
    'stc:Approved',
    'stc:Archived',
    'stc:Retracted'
];

const STEP_CHILDREN = {
    'stc:Input': {},
    'stc:Procedure': {},
    'stc:Output': {},
    'stc:Rationale': {},
    'stc:Links': {},
    'stc:LifeCycleInformation': {},
    'stc:Classification': {},
    'stc:Annotations': {}
}

const STMD_TREE = {
    '?xml': {},
    'stmd:SimulationTaskMetaData': {
        'stmd:GeneralInformation': {
            'stc:DerivationChain': {},
            'stc:Links': {}
        },
        'stmd:AnalysisPhase': {
            'stmd:AnalyzeSimulationTaskAndObjectives': STEP_CHILDREN,
            'stmd:VerifyAnalysis': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stmd:RequirementsPhase': {
            'stmd:DefineModelRequirements': STEP_CHILDREN,
            'stmd:DefineParameterRequirements': STEP_CHILDREN,
            'stmd:DefineSimulationEnvironmentRequirements': STEP_CHILDREN,
            'stmd:DefineSimulationIntegrationRequirements': STEP_CHILDREN,
            'stmd:DefineTestCaseRequirements': STEP_CHILDREN,
            'stmd:DefineQualityAssuranceRequirements': STEP_CHILDREN,
            'stmd:VerifyRequirements': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stmd:DesignPhase': {
            'stmd:DefineModelDesignSpecification': STEP_CHILDREN,
            'stmd:DefineParameterDesignSpecification': STEP_CHILDREN,
            'stmd:DefineSimulationEnvironmentDesignSpecification': STEP_CHILDREN,
            'stmd:DefineSimulationIntegrationDesignSpecification': STEP_CHILDREN,
            'stmd:DefineTestCaseDesignSpecification': STEP_CHILDREN,
            'stmd:DefineQualityAssuranceDesignSpecification': STEP_CHILDREN,
            'stmd:VerifyDesignSpecification': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stmd:ImplementationPhase': {
            'stmd:ImplementModel': STEP_CHILDREN,
            'stmd:ImplementParameter': STEP_CHILDREN,
            'stmd:ImplementSimulationEnvironment': STEP_CHILDREN,
            'stmd:ImplementTestCase': STEP_CHILDREN,
            'stmd:IntegrateSimulation': STEP_CHILDREN,
            'stmd:AssureSimulationSetupQuality': STEP_CHILDREN,
            'stmd:DeriveSimulationSetupQualityVerdict': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stmd:ExecutionPhase': {
            'stmd:ExecuteSimulation': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stmd:EvaluationPhase': {
            'stmd:EvaluateSimulationResults': STEP_CHILDREN,
            'stmd:AssureSimulationQuality': STEP_CHILDREN,
            'stmd:DeriveSimulationQualityVerdict': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stmd:FulfillmentPhase': {
            'stmd:DecideSimulationObjectiveFulfillment': STEP_CHILDREN,
            'stc:Links': {},
            'stc:LifeCycleInformation': {},
            'stc:Classification': {},
            'stc:Annotations': {}
        },
        'stc:Classification': {},
        'stc:Annotations': {}
    }
};   

const ROOT_ELEMENT_NAME = 'stmd:SimulationTaskMetaData';
const LIFECYCLE_PARENT_NAME = 'stc:LifeCycleInformation';
const LINKS_PARENT_NAME = 'stc:Links';
const GENERAL_INFORMATION_NAME = 'stmd:GeneralInformation';
const CLASSIFICATION_PARENT_NAME = 'stc:Classification';
const ANNOTATIONS_PARENT_NAME = 'stc:Annotations';
const RESOURCE_NAME = 'stc:Resource';
const RESOUCE_REFERENCE_NAME = 'stc:ResourceReference';

exports.STMD_TREE = STMD_TREE;
exports.PHASE_TREE = PHASE_TREE;
exports.ROOT_ELEMENT_NAME = ROOT_ELEMENT_NAME;
exports.LIFECYCLE_ENTRY_NAMES = LIFECYCLE_ENTRY_NAMES;
exports.LIFECYCLE_PARENT_NAME = LIFECYCLE_PARENT_NAME;
exports.LINKS_PARENT_NAME = LINKS_PARENT_NAME;
exports.GENERAL_INFORMATION_NAME = GENERAL_INFORMATION_NAME;
exports.CLASSIFICATION_PARENT_NAME = CLASSIFICATION_PARENT_NAME;
exports.ANNOTATIONS_PARENT_NAME = ANNOTATIONS_PARENT_NAME;
exports.RESOURCE_NAME = RESOURCE_NAME;
exports.RESOUCE_REFERENCE_NAME = RESOUCE_REFERENCE_NAME;