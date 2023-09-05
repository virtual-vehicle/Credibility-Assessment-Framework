export interface FlexibleObject {
    [key: string]: any;
}

export interface SimulationTaskMetaDataAttributes {
    name: string;
    version: string;
    GUID: string;
    id?: string;
    description?: string;
    author?: string;
    fileversion?: string;
    copyright?: string;
    license?: string;
    generationTool?: string;
    generationDateAndTime?: string;
}

export interface GeneralInformationType {
    DerivationChain?: DerivationChain;
    Links?: LinksType;
}

export interface DerivationChain {
    DerivationChainEntry?: DerivationChainEntry[];
}

export interface DerivationChainEntry {
    attributes: DerivationChainEntryAttributes;
}

export interface DerivationChainEntryAttributes {
    GUID: string;
    author?: string;
    fileversion?: string;
    copyright?: string;
    license?: string;
    generationTool?: string;
    generationDateAndTime?: string;
}

export interface ResourceType {
    Content?: ContentType;
    Summary?: Summary;
    MetaData?: MetaData[];
    Signature?: SignatureType[];
    Classification?: Classification[];
    Annotations?: Annotations;
    attributes: ResourceTypeAttributes;
}

export interface ResourceTypeAttributes {
    kind: string;
    type: string;
    description?: string;
    id?: string;
    master?: string;
    scope?: string;
    source?: string;
}

export interface ResourceReference {
    Classification?: Classification[];
    Annotations?: Annotations;
    attributes: ResourceReferenceAttributes;
}

export interface ResourceReferenceAttributes {
    xlink_type: string;
    xlink_href: string;
    id?: string;
    descripton?: string;
}

export interface LinksType {
    Link: Link[];
}

export interface Link {
    Locator: Locator[]; 
    Arc?: Arc[];
    attributes: LinkAttributes;
}

export interface LinkAttributes {
    xlink_type: string;
    xlink_title?: string;
    xlink_role?: string;
}

export interface Locator {
    attributes: LocatorAttributes;
}

export interface LocatorAttributes {
    xlink_type: string;
    xlink_href: string;
    xlink_label?: string;
    xlink_title?: string;
    xlink_role?: string;
}

export interface Arc {
    attributes: ArcAttributes;
}

export interface ArcAttributes {
    xlink_type: string;
    xlink_from?: string;
    xlink_to?: string;
    xlink_title?: string;
    xlink_arcrole?: string;
}

export interface Classification {
    ClassificationEntry?: ClassificationEntry[];
    attributes: ClassificationAttributes;
}

export interface ClassificationAttributes {
    type?: string;
}

export interface ClassificationEntry {
    any?: FlexibleObject;
    attributes: ClassificationEntryAttributes;
}

export interface ClassificationEntryAttributes {
    keyword: string;
    xlink_type: string;
    xlink_href?: string;
}

export interface Annotations {
    Annotation: Annotation[];
}

export interface Annotation {
    any?: FlexibleObject;
    attributes: AnnotationAttributes;
}

export interface AnnotationAttributes {
    type: string;
}

export interface AvailableResource {
    uid: string;
    location: string[];
    resource: ResourceType;
}

export interface AvailableResourceReference {
    uid: string;
    location: string[];
    resourceReference: ResourceReference;
}

export interface AvailableLink {
    uid: string;
    location: string[];
    link: Link;
}

export interface AvailableClassification {
    uid: string;
    location: string[];
    classification: Classification;
}

export interface AvailableAnnotation {
    uid: string;
    location: string[];
    annotation: Annotation;
}

export interface AvailableLifeCycleEntry {
    location: string[];
    status: string;
    lifeCycleEntry: LifeCycleEntryType;
}

export interface ContentType {
    any?: string | FlexibleObject; 
}

export interface Summary {
    Content?: ContentType;
    Signature?: SignatureType[];
    Classification?: Classification[];
    Annotations?: Annotations;
    attributes: SummaryAttributes;
}

export interface SummaryAttributes {
    type: string;
    source?: string;
    sourceBase?: string;
}

export interface MetaData {
    Content?: ContentType;
    Signature?: SignatureType[];
    Classification?: Classification[];
    Annotations?: Annotations;
    attributes: MetaDataAttributes;
}

export interface MetaDataAttributes {
    kind: string;
    type: string;
    source?: string;
    sourceBase?: string;
}

export interface SignatureType {
    Content?: ContentType;
    Classification?: Classification[];
    Annotations?: Annotations;
    attributes: SignatureTypeAttributes;
}

export interface SignatureTypeAttributes {
    role: string;
    type: string;
    source?: string;
    sourceBase?: string;
}

export interface AvailableLifeCycleEntry {
    location: string[];
    status: string;
    lifeCycleEntry: LifeCycleEntryType;
}

export interface LifeCycleEntryType {
    Responsible: ResponsibleType;
    Signature?: SignatureType[];
    Resource?: ResourceType[];
    ResourceReference?: ResourceReference[];
    Classification?: Classification[];
    Annotations?: Annotations;
    attributes: LifeCycleEntryTypeAttributes;
}

export interface LifeCycleEntryTypeAttributes {
    date: string;
    checksum?: string;
    checksumType?: string;
}

export interface ResponsibleType {
    attributes: ResponsibleTypeAttributes;
}

export interface ResponsibleTypeAttributes {
    organization?: string;
    role?: string;
    name?: string;
}

export interface ContextEntry {
    term: string;
    iri: string;
}

export class StmdReader {
    /**
     * Creates an object to access any element inside a [STMD file](https://pmsfit.github.io/SSPTraceability/master/).
     * To use it, the string of the STMD file must be handed over on initialization of the StmdReader.
     * 
     * Please note: The conformance of the STMD file to its schema definition must be given for proper functionality
     * of the StmdReader.
     * 
     * @param stmdString the stringified STMD file
     */
    constructor(stmdString: string);

    /**
     * Exports the current STMD
     * 
     * @returns {string} the STMD XML-string
     */
    export(): string;

    /**
     * Returns the General Information of the STMD file.
     * 
     * @author localhorst87
     * @returns the General Information
     */
    getGeneralInformation(): GeneralInformationType;

    /**
     * Returns the top level information of the STMD file. That is all attributes, defined in the root element
     * (at least name, version and GUID)
     * 
     * @author localhorst87
     * @returns the top-level information
     */
    getTopLevelInformation(): SimulationTaskMetaDataAttributes;

    /**
     * Returns all Resource elements (converted stc:Resource) of a given element in the STMD, given by a location.
     * 
     * A Resource element defines the structure and attributes of information about a resource that is related to the 
     * particular step and particle.
     * 
     * The location must be given as an array of all parent elements, not including the root element.
     * 
     * @author localhorst87
     * @example getResources(['stmd:RequirementsPhase', 'stmd:VerifyRequirements', 'stc:Output'])
     * @param location the location as array of strings
     * @param ingestSubElements if true, all Resources from child elements will also be considered. Is false by default
     * @returns all Resources of the given location
     */
    getResources(location: string[], ingestSubElements?: boolean): AvailableResource[];

    /**
     * Adds a new Resource to the given location
     * 
     * @param resource the Resource to add
     * @param location the location where to add the Resource
     * @returns operation successful
     */
    addResource(resource: ResourceType, location: string[]): boolean;

    /**
     * Updates the Resource with the same UID. If the uid can not be found, the operation will be cancelled.
     * 
     * @author localhorst87
     * @param resource 
     * @param location 
     * @param uid
     * @returns operation successful
     */
    updateResource(resource: ResourceType, location: string[], uid: string): boolean;

    /**
     * Deletes the Resource with the given UID.
     * 
     * @param uid 
     * @returns operation successful
     */
    deleteResource(uid: string): boolean;

    /**
     * Returns all ResourceReference elements (converted stc:ResourceReference) of a given element in the STMD, given by
     * the location.
     * 
     * A ResourceReference element references a resource element defined in another place, that is related to the 
     * particular step and particle.
     * 
     * The location must be given as an array of all parent elements, not including the root element.
     * 
     * @author localhorst87
     * @example getResourceReferences(['stmd:RequirementsPhase', 'stmd:VerifyRequirements', 'stc:Output'])
     * @param location the location as array of strings
     * @param ingestSubElements if true, all Resources from child elements will also be considered. Is false by default
     * @returns all ResourceReferences of the given location
     */
    getResourceReferences(location: string[], ingestSubElements?: boolean): AvailableResourceReference[];

    /**
     * Adds a new ResourceReference to the given location
     * 
     * @param resourceReference
     * @param location 
     * @returns operation successful
     */
    addResourceReference(resourceReference: ResourceReference, location: string[]): boolean;

    /**
     * Deletes the ResourceReference with the given UID
     * 
     * @param uid the uid of the ResourceReference to delete
     * @returns true/false upon successful/failed deletion
     */
    deleteResourceReference(uid: string): boolean;

    /**
     * Returns all Link elements (converted stc:Link) of a given parent element in the STMD, given by a location.
     *  
     * The Link element represents a single link no mater if it is an STMD file internal link or a link targeted to the
     * outside of the STMD file.
     * 
     * The location must be given as an array of all parent elements, not including the root element.
     * 
     * Please note: The Link elements below the LinksType element (stc:Links) are returned here, so stc:Links must not 
     * be part of the location! 
     * 
     * @author localhorst87
     * @example getLinks(['stmd:ImplementationPhase', 'stmd:IntegrateSimulation'])
     * // returns all Link elements given in the stc:Links elements of the stmd:IntegrateSimulation step
     * @param location the location as array of strings
     * @param ingestSubElements if true, all Resources from child elements will also be considered. Is false by default
     * @returns all Links of the given location
     */
    getLinks(location: string[], ingestSubElements?: boolean): AvailableLink[];

    /**
     * Adds a new Link to the given location
     * 
     * @param link
     * @param location 
     * @returns
     */
    addLink(link: Link, location: string[]): boolean;

    /**
     * Updates the Link with the same UID. If the uid can not be found, the operation will be cancelled.
     * 
     * @param link 
     * @param location 
     * @param uid 
     * @returns
     */
    updateLink(link: Link, location: string[], uid: string): boolean;

    /**
     * Deletes the link with the given UID.
     * 
     * @param uid
     * @returns
     */
    deleteLink(uid: string): boolean;

    /**
     * Returns all Classification elements (converted stc:Classification) of a given parent element in the STMD, given
     * by a location.
     * 
     * The Classification element, which can occur multiple times inside the parent element, provides a set of 
     * ClassificationEntry elements of an STMD modeling element, provided as Keyword Value Pairs (KWP), the meaning of
     * which is interpreted according to the name of the classification provided in the name attribute. 
     * This approach is used, for example, to provide searchable keywords for content, or to assign and track quality or
     * validation level requirements across the STMD process, or to maintain variant or other classification content 
     * across the process.
     * 
     * The location must be given as an array of all parent elements, not including the root element.
     * 
     * Please note: Classifications inside Resources or ResourceReferences can not be requested with this method.
     * For this purpose, use getResources and explore its child elements
     * 
     * @author localhorst87
     * @example getClassifications(['stmd:RequirementsPhase', 'stmd:VerifyRequirements'])
     * // returns all stc:Classification elements of the stmd:VerifyRequirements step
     * @param location the location as array of strings (without the root element)
     * @returns all Classifications of the given location
     */
    getClassifications(location: string[]): Classification[];

    /**
     * Returns all Annotation elements (converted stc:Annotation) of a given parent element in the STMD, given
     * by a location.
     * 
     * The Annotations element is used to add a list of additional free style annotations.
     * 
     * Please note: Annotations inside Resources or ResourceReferences can not be requested with this method.
     * For this purpose, use getResources and explore its child elements.
     * 
     * Please note: The Annotation elements below the Annotations element (stc:Annotations) are returned here, so stc:Annotations 
     * must not be part of the location!
     * 
     * @author localhorst87
     * @example getAnnotations(['stmd:RequirementsPhase', 'stmd:VerifyRequirements'])
     * // 
     * @param location the location as array of strings
     * @returns all Annotations of the given location
     */
    getAnnotations(location: string[]): Annotation[];

    /**
     * Returns all LifeCycleEntry elements as AvailableLifeCycleEntry element of a given parent element in the STMD,
     * given by a location. The location should point to a phase, as only phases contain lifecycle information.
     * 
     * @param location the location as array of strings (should be a phase)
     * @returns all AvailableLifeCycleEntry elements of the given location
     */
    getLifeCycleEntries(location: string[]): AvailableLifeCycleEntry[];

    /**
     * Returns the Resource the given ResourceReference is referencing to
     * 
     * @param resourceReference the ResourceReference with the reference to the target Resource
     * @returns the target Resource
     */
    getResourceFromReference(resourceReference: ResourceReference): AvailableResource;

    /**
     * Returns the Resource with the given ID
     * 
     * @param id the target ID of the Resource
     * @returns the target Resource or undefined if a Resource with the given ID does not 
     *                                     exist
     */
    getResourceFromId(id: string): AvailableResource | undefined;

    /**
     * Returns a CredibilityType object from a cdk:Credibility element of a specific location
     *  
     * @param location 
     * @returns
     */
    getCdkElement(location: string[]): CredibilityType;

    /**
     * Creates a JSON-LD graph from the given link, using the given vocabulary
     * 
     * @author localhorst87
     * @param link a converted XLink, e.g. received by the getLinks method
     * @param context context for the named-graph in the shape of key-value-pairs as it is returned by
     *                                  the getVocabulary method (key-value-pairs)
     * @returns a JSON-LD named graph, as defined in https://www.w3.org/TR/json-ld/#named-graphs
     */
    createGraphFromLink(link: Link, context: ContextEntry[]): string;
    
    /**
     * Specific function:
     * 
     * Searches for Classification elements with the type "vocabulary" and extracts the key-value-pairs from its
     * ClassificationEntry elements, consisting of a term, given by the keyword attribute of stc:ClassificationEntry 
     * and an [IRI](https://www.rfc-editor.org/rfc/rfc3987#section-2), given by the xlink:href attribute of
     * stc:ClassificationEntry.
     * 
     * Yields ContextEntry elements as array that can be used as a context for a named-graph, to be used as 
     * argument for createGraphFromLink.
     * 
     * Will accumulate all vocabularies from parent elements, too (assuming this vocabulary is valid for all 
     * child-elements)! If a specific term is defined in a child and parent element, the child-element term definition
     * overrides the parent-element definition
     * (e.g. a term defined in ['stmd:DesignPhase', 'stmd:DefineModelDesignSpecification'] will override the same
     * term defined in ['stmd:DesignPhase']).
     * 
     * @author localhorst87
     * @example
     * getVocabulary(['stmd:DesignPhase', 'stmd:DefineModelDesignSpecification'])
     * // possible result 
     * // [
     * //   { term: "model-requirement", iri: "http://example.com/model-requirement" },
     * //   { term: "product-requirement", iri: "http://example.com/product-requirement" },
     * //   { term: "dervived-from", iri: "http://example.com/derived-from" }
     * // ]
     * @param location the location as array of strings
     * @returns the vocabulary
     */
    getVocabulary(location: string[]): ContextEntry[];
}

export class StmdWriter {
    export(): string;
    setTopLevelInformation(topLevelInformation: SimulationTaskMetaDataAttributes): void;
    setGeneralInformation(generalInformation: GeneralInformationType): void;
    addResources(availableResources: AvailableResource[]): void;
    addResourceReferences(availableResourceReferences: AvailableResourceReference[]): void;
    addLinks(availableLinks: AvailableLink[]): void;
    addSuperAnnotations(availableAnnotations: AvailableAnnotation[]): void;
    addSuperClassifications(availableClassifications: AvailableClassification[]): void;
    addLifeCycleInformation(availableLifeCycleEntries: AvailableLifeCycleEntry[]): void;
}