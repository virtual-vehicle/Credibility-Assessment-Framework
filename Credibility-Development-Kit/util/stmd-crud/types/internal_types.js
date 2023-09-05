 /**
 * @typedef {import('./specification').ResourceType} ResourceType
 * @typedef {import('./specification').ResourceReference} ResourceReference
 * @typedef {import('./specification').Link} Link
 * @typedef {import('./specification').Classification} Classification
 * @typedef {import('./specification').LifeCycleEntryType} LifeCycleEntryType
 */

/**
 * AvailableResource
 * 
 * This internal type is a representative of a concrete Resource, as available in the specific STMD file. Next to the
 * Resource itself, it gives information about the location of the Resource
 * 
 * @typedef {object} AvailableResource
 * @property {string} uid               a unique id of the resource to identify the resource in the document 
 *                                      (this is needed, because resource.attributes.id is optional!)
 * @property {string[]} location        the location inside the STMD, where this Resource is located. Must be given as
 *                                      an array of all parent elements
 *                                      Example: ['stmd:SimulationTaskMetaData', 'stmd:ImplementationPhase',
 *                                                'stmd:ImplementParameter', 'stc:Output']
 * @property {ResourceType} resource    the converted Resource
 */

/**
 * AvailableResourceReference 
 * 
 * This internal type is a representative of a concrete ResourceReference, as available in the specific STMD file.
 * Next to the ResourceReference itself, it gives information about the location of the ResourceReference
 * 
 * @typedef {object} AvailableResourceReference
 * @property {string} uid               a unique id of the reference to identify the reference in the document 
 *                                      (this is needed, because resource.attributes.id is optional!)
 * @property {string[]} location        the location inside the STMD, where this Resource is located. Must
 *                                      be given as an array of all parent elements
 *                                      Example: ['stmd:SimulationTaskMetaData', 'stmd:RequirementsPhase',
 *                                                'stmd:VerifyRequirements', 'stc:Output']
 * @property {ResourceReference} resourceReference  the converted ResourceReference
 */

/**
 * AvailableLink
 * 
 * This internal type is a representative of a concrete Link, as available in the specific STMD file.
 * Next to the Link itself, it gives information about the location of the Link
 * 
 * @typedef {object} AvailableLink
 * @property {string} uid           a unique id of the link to identify the link in the document 
 * @property {string[]} location    the location inside the STMD, where this Link is located. Must be given as
 *                                  an array of all parent elements.
 *                                  Example: ['stmd:SimulationTaskMetaData', 'stmd:ImplementationPhase',
 *                                            'stmd:ImplementParameter', 'stc:Output']
 * @property {Link} link            the converted Link
 */

/**
 * AvailableClassification
 * 
 * This internal type is a representative of a concrete Classification, as available in the specific STMD file.
 * Next to the Classification itself, it gives information about the location of the Classification
 * 
 * @typedef {object} AvailableClassification
 * @property {string} uid                       a unique id of the Classification to identify the Classification in the
 *                                              document 
 * @property {string[]} location                the location inside the STMD, where this Classification is located. 
 *                                              Must be given as an array of all parent elements
 *                                              Example: ['stmd:SimulationTaskMetaData', 'stmd:AnalysisPhase',
 *                                                        'stmd:VerifyAnalysis']
 * @property {Classification} classification    the converted classification
 */

/**
 * AvailableAnnotation
 * 
 * This internal type is a representative of a concrete Annotation, as available in the specific STMD file.
 * Next to the Annotation itself, it gives information about the location of the Annotation
 * 
 * @typedef {object} AvailableAnnotation
 * @property {string} uid                       a unique id of the Annotation to identify the Annotation in the
 *                                              document 
 * @property {string[]} location                the location inside the STMD, where this Classification is located. 
 *                                              Must be given as an array of all parent elements
 *                                              Example: ['stmd:SimulationTaskMetaData', 'stmd:AnalysisPhase',
 *                                                        'stmd:VerifyAnalysis']
 * @property {Annotation} annotation            the converted Annotation
 */

/**
 * AvailableLifeCycleEntry
 * 
 * This internal type is a representative of a Lifecycle entry, as available in the specific STMD file
 * 
 * @typedef {object} AvailableLifeCycleEntry
 * @property {string[]} location                 the location of the LifeCycleInformation inside the STMD. Must be given 
 *                                               as an array of all parent elements, without the root element.
 * @property {string} status                     the status of the LifeCycleEntry. Must be one of the following: 
 *                                               Drafted, Defined, Validated, Approved, Archived, Retraced
 * @property {LifeCycleEntryType} lifeCycleEntry the LifeCycleEntryType object          
 */

/**
 * ContextEntry
 * 
 * This internal type is a specific key-value-pair representative that can be used for JSON-LD context.
 * 
 * A context is used to map terms to [IRIs](https://www.rfc-editor.org/rfc/rfc3987#section-2). Terms are case sensitive
 * and most valid strings that are not JSON-LD keywords can be used as a term.
 * Exceptions are the empty string "" and strings that have the form of a keyword (i.e., starting with "@" followed 
 * exclusively by one or more ALPHA characters (see [RFC5234])), which must not be used as terms. Strings that have the
 * form of an IRI (e.g., containing a ":") should not be used as terms.
 * 
 * @typedef {object} ContextEntry
 * @property {string} term          valid strings (no JSON-LD keywords, no empty strings, no strings starting
 *                                  with "@", no strings containing ":")
 * @property {string} iri           must be an [IRI](https://www.rfc-editor.org/rfc/rfc3987#section-2)
 */

module.exports = {
    /**
     * @type {AvailableResource}
     * @type {AvailableResourceReference}
     * @type {AvailableLink}
     * @type {AvailableClassification}
     * @type {AvailableAnnotation}
     * @type {ContextEntry}
     * @type {AvailableLifeCycleEntry}
     */
}