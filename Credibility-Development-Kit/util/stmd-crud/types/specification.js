/**
 * SimulationTaskMetaDataAttributes
 * 
 * @typedef {object} SimulationTaskMetaDataAttributes
 * @property {string} version 
 * @property {string} name 
 * @property {string} GUID
 * @property {string} [id]
 * @property {string} [description]
 * @property {string} [author]
 * @property {string} [fileversion]
 * @property {string} [copyright]
 * @property {string} [license]
 * @property {string} [generationTool]
 * @property {string} [generationDateAndTime]
 */

/**
 * GeneralInformationType 
 * 
 * @typedef {object} GeneralInformationType 
 * @property {DerivationChain} [DerivationChain]
 * @property {LinksType} [Links]
 */

/**
 * DerivationChain
 * 
 * @typedef {object} DerivationChain
 * @property {DerivationChainEntry[]} [DerivationChainEntry]
 */

/**
 * DerivationChainEntry
 * 
 * @typedef {object} DerivationChainEntry
 * @property {DerivationChainEntryAttributes} attributes
 */

/**
 * DerivationChainEntryAttributes
 * 
 * @typedef {object} DerivationChainEntryAttributes 
 * @property {string} GUID
 * @property {string} [author]
 * @property {string} [fileversion]
 * @property {string} [copyright]
 * @property {string} [license]
 * @property {string} [generationTool]
 * @property {string} [generationDateAndTime]
 */

/**
 * ResourceType
 * 
 * The ResourceType element defines the structure and attributes of information about a resource that is related to the
 * particular step and particle. Multiple (or no) resources may be present.
 * 
 * @typedef {object} ResourceType
 * @property {ContentType} [Content]
 * @property {Summary} [Summary]
 * @property {MetaData[]} [MetaData]
 * @property {SignatureType[]} [Signature]
 * @property {Classification[]} [Classification]
 * @property {Annotations} [Annotations]
 * @property {ResourceTypeAttributes} attributes
 */

/**
 * ResourceTypeAttributes
 * 
 * @typedef {object} ResourceTypeAttributes
 * @property {string} kind              This attribute indicates the kind of resource that is referenced, 
 *                                      i.e. what role it plays in relation to the particle being described.
 * @property {string} type              This mandatory attribute specifies the MIME type of the resource, 
 *                                      which does not have a default value. If no specific MIME type can be 
 *                                      indicated, then the type application/octet-stream is to be used.
 * @property {string} [description]     This attribute gives a human readable longer description of the model element,
 *                                      which can be shown to the user where appropriate.       
 * @property {string} [id]              This attribute gives the model element a file-wide unique id which can be
 *                                      referenced from other elements or via URI fragment identifier.
 * @property {string} [master]          This attribute, if present, indicates the original, canonical master source 
 *                                      for the resource. If it is present, it indicates that the content provided 
 *                                      via source attribute and/or Content element is only a copy of the original,
 *                                      canonical data, and this attributes provides the URI reference to that original
 *                                      canonical master data.
 * @property {string} [scope]           This attribute indicates the scope or level that a resource is specific to, i.e.
 *                                      whether the resource applies at a global, system, subsystem or component level.
 *                                      The use of this attribute is optional, i.e. it should only be specified where it
 *                                      makes sense to give this kind of information.
 * @property {string} [source]          This attribute gives a human readable longer description of the model element,
 *                                      which can be shown to the user where appropriate.
 */

/**
 * ResourceReference
 * 
 * This element references a resource element defined in another place, that is related to the particular step and
 * particle.
 * 
 * @typedef {object} ResourceReference
 * @property {Classification[]} [Classification]
 * @property {Annotations} [Annotations]
 * @property {ResourceReferenceAttributes} attributes 
 */

/**
 * ResourceReferenceAttributes
 * 
 * @typedef {object} ResourceReferenceAttributes
 * @property {string} xlink_type    Has the fixed value simple to indicate an XLink simple link.
 * @property {string} xlink_href    A mandatory attribute that supplies the data that allows an XLink application to
 *                                  find a remote resource (or resource fragment). The value of the href attribute is a
 *                                  [Legacy extended IRIs] (LEIRI). Processing a relative identifier against a base is
 *                                  handled straightforwardly; the algorithms of [RFC 3986] can be applied directly, 
 *                                  treating the characters additionally allowed in LEIRIs in the same way that
 *                                  unreserved characters are in URI references.
 * @property {string} [id]          This attribute gives the element a file-wide unique id which can be 
 *                                  referenced from other elements or via URI fragment identifier.
 * @property {string} [description]  This attribute gives a human readable longer description of the reference, which
 *                                   can be shown to the user where appropriate.
 */

/**
 * ContentType
 * 
 * The ContentType element defines the structure and attributes of inline content of an entity. If it is present,
 * then the attribute source of the enclosing element must not be present.
 * 
 * @typedef {object} ContentType 
 * @property {object} [any]         The ContentType may contain XML Elements of any kind, i.e. the STMD Schema provides
 *                                  the possibility and capability to code any kind of information regardless of what 
 *                                  the  STMD specifies. This mean the name, structure and attributes of XML elements 
 *                                  enclosed by a contentType element is completely free.
 */

/**
 * Summary
 * 
 * The Summary element provides an optional summary of the resource being referenced. The summary information is
 * intended for human consumption to get an overview of the resource content without looking at the content itself.
 * The summary content can be provided inline through the Content element, or it can be provided through the source URI
 * attribute.
 * 
 * @typedef {object} Summary
 * @property {ContentType} [Content]
 * @property {SignatureType[]} [Signature]
 * @property {Classification[]} [Classification]
 * @property {Annotations} [Annotations]
 * @property {SummaryAttributes} attributes
 */

/**
 * SummaryAttributes
 * 
 * @typedef {object} SummaryAttributes
 * @property {string} type              This mandatory attribute specifies the MIME type of the resource summary, which 
 *                                      does not have a default value. If no specific MIME type can be indicated, then 
 *                                      the type application/octet-stream is to be used. If markdown content is used,
 *                                      then the type text/markdown shall be used.
 * @property {string} [source]          This attribute indicates the source of the resource summary as a URI (cf. RFC 
 *                                      3986). For purposes of the resolution of relative URIs the base URI is the URI
 *                                      of the STMD, if the sourceBase attribute is not specified or is specified as 
 *                                      STMD, and the URI of the referenced resource if the sourceBase attribute is 
 *                                      specified as resource. This allows the specification of summary sources that 
 *                                      reside inside the resource (e.g. an FMU) through relative URIs. For summaries 
 *                                      that are located alongside the STMD, relative URIs without scheme and authority 
 *                                      can and should be used to specify the summary sources.
 *                                      For summaries that are packaged inside an SSP that contains this STMD, this is 
 *                                      mandatory (in this way, the STMD URIs remain valid after unpacking the SSP into
 *                                      the filesystem). If the source attribute is missing, the summary is provided
 *                                      inline as contents of the Content element, which must not be resent otherwise.
 * @property {string} [sourceBase]      Defines the base the source URI is resolved against: If the attribute is missing
 *                                      or is specified as STMD, the source is resolved against the URI of the STMD, if
 *                                      the attribute  is specified as resource the URI is resolved against the 
 *                                      (resolved) URI of the resource source.
 */

/**
 * MetaData
 * 
 * The MetaData element can specify additional metadata for the given resource. Multiple (or no) MetaData elements may
 * be present.
 * 
 * @typedef {object} MetaData
 * @property {ContentType} [Content] 
 * @property {SignatureType[]} [Signature]
 * @property {Classification[]} [Classification]
 * @property {Annotations} [Annotations]
 * @property {MetaDataAttributes} attributes
 * 
 */

/**
 * MetaDataAttributes
 * 
 * @typedef {object} MetaDataAttributes
 * @property {string} kind              This attribute indicates the kind of resource meta data that is referenced, i.e.
 *                                      what role it plays in relation to the resource being described.
 * @property {string} type              This mandatory attribute specifies the MIME type of the resource summary, which
 *                                      does not have a default value. If no specific MIME type can be indicated, then
 *                                      the type application/octet-stream is to be used. If markdown content is used,
 *                                      then the type text/markdown shall be used.
 * @property {string} [source]          This attribute indicates the source of the resource summary as a URI (cf. RFC 
 *                                      3986). For purposes of the resolution of relative URIs the base URI is the URI
 *                                      of the STMD, if the sourceBase attribute is not specified or is specified as 
 *                                      STMD, and the URI of the referenced resource if the sourceBase attribute is 
 *                                      specified as resource. This allows the specification of summary sources that 
 *                                      reside inside the resource (e.g. an FMU) through relative URIs. For summaries 
 *                                      that are located alongside the STMD, relative URIs without scheme and authority 
 *                                      can and should be used to specify the summary sources.
 *                                      For summaries that are packaged inside an SSP that contains this STMD, this is 
 *                                      mandatory (in this way, the STMD URIs remain valid after unpacking the SSP into
 *                                      the filesystem). If the source attribute is missing, the summary is provided
 *                                      inline as contents of the Content element, which must not be resent otherwise.
 * @property {string} [sourceBase]      Defines the base the source URI is resolved against: If the attribute is missing
 *                                      or is specified as STMD, the source is resolved against the URI of the STMD, if
 *                                      the attribute  is specified as resource the URI is resolved against the 
 *                                      (resolved) URI of the resource source.
 */

/**
 * SignatureType
 * 
 * The SignatureType element defines the structure and attributes of the signature entity for a given step or phase.
 * 
 * @typedef {object} SignatureType
 * @property {ContentType} [Content] 
 * @property {Classification[]} [Classification]
 * @property {Annotations} [Annotations]
 * @property {SignatureTypeAttributes} attributes
 * 
 */

/**
 * SignatureTypeAttributes
 * 
 * @typedef {object} SignatureTypeAttributes
 * @property {string} role              This mandatory attribute specifies the role this signature has in the overall 
 *                                      process. It indicates whether the digital signature is intended to just convey
 *                                      the authenticity of the information, or whether a claim for suitability of the
 *                                      information for certain purposes is made. In the latter case, the digital 
 *                                      signature format should include detailed information about what suitability
 *                                      claims are being made.
 * @property {string} type              This mandatory attribute specifies the MIME type of the resource summary, which
 *                                      does not have a default value. If no specific MIME type can be indicated, then
 *                                      the type application/octet-stream is to be used. If markdown content is used,
 *                                      then the type text/markdown shall be used.
 * @property {string} [source]          This attribute indicates the source of the resource summary as a URI (cf. RFC 
 *                                      3986). For purposes of the resolution of relative URIs the base URI is the URI
 *                                      of the STMD, if the sourceBase attribute is not specified or is specified as 
 *                                      STMD, and the URI of the referenced resource if the sourceBase attribute is 
 *                                      specified as resource. This allows the specification of summary sources that 
 *                                      reside inside the resource (e.g. an FMU) through relative URIs. For summaries 
 *                                      that are located alongside the STMD, relative URIs without scheme and authority 
 *                                      can and should be used to specify the summary sources.
 *                                      For summaries that are packaged inside an SSP that contains this STMD, this is 
 *                                      mandatory (in this way, the STMD URIs remain valid after unpacking the SSP into
 *                                      the filesystem). If the source attribute is missing, the summary is provided
 *                                      inline as contents of the Content element, which must not be resent otherwise.
 * @property {string} [sourceBase]      Defines the base the source URI is resolved against: If the attribute is missing
 *                                      or is specified as STMD, the source is resolved against the URI of the STMD, if
 *                                      the attribute  is specified as resource the URI is resolved against the 
 *                                      (resolved) URI of the resource source.
 *  
 */

/**
 * Classification
 * 
 * The Classification element, which can occur multiple times, provides a set of classifications of an STMD modeling
 * element, provided as Keyword Value Pairs (KWP), the meaning of which is interpreted according to the name of the 
 * classification provided in the name attribute. This approach can be used, for example, to provide searchable keywords
 * for content, or to assign and track quality or validation level requirements across the STMD process, or to maintain 
 * variant or other classification content across the process.
 * 
 * @typedef {object} Classification
 * @property {ClassificationEntry[]} [ClassificationEntry]
 * @property {ClassificationAttributes} attributes
 */

/**
 * ClassificationAttributes
 * 
 * @typedef {object} ClassificationAttributes
 * @property {string} [type]    This attribute provides the name of the type of classification being provided. The name
 *                              should be unique across the Classification elements of the immediately enclosing
 *                              element. In order to ensure uniqueness all types should be identified with reverse
 *                              domain name notation (cf. Java package names or Apple UTIs) of a domain that is 
 *                              controlled by the entity defining the semantics and content of the classification.
 */

/**
 * ClassificationEntry
 * 
 * @typedef {object} ClassificationEntry
 * @property {object} [any]     The ClassificationEntry element may contain XML Elements of any kind, i.e. the
 *                              STMDSchema provides the possibility and capability to code any kind of information
 *                              regardless of what the STMD specifies. This means, the name, structure and attributes of
 *                              XML elements enclosed by a ClassificationEntry element are completely free.
 * @property {ClassificationEntryAttributes} attributes 
 */

/**
 * ClassificationEntryAttributes
 * 
 * @typedef {object} ClassificationEntryAttributes
 * @property {string} keyword       This attribute gives the keyword for the classification entry (i.e. keyword value
 *                                  pair). It is left undefined whether this must be unique across the entries of the
 *                                  Classification element, or whether repeated entries are allowed. This will depend on
 *                                  the definition of the classification.
 * @property {string} xlink_type    Has the fixed value simple to indicate an XLink simple link.
 * @property {string} [xlink_href]  This attribute gives an optional link for the classification entry (i.e. keyword
 *                                  value pair). This link can be given in addition to any content of the classification
 *                                  entry, or it can be the sole information of the classification entry. The rules will
 *                                  depend on the definition of the classification.  
 */

/**
 * Annotations
 * 
 * The Annotations element can be used to add a list of additional free style annotations.
 * 
 * @typedef {object} Annotations
 * @property {Annotation[]} Annotation
 */

/**
 * Annotation
 * 
 * The Annotation element can be used to add a single free style annotation to the list of annotations.
 * 
 * @typedef {object} Annotation
 * @property {object[]} [any]                   The Annotation element may contain XML Elements of any kind, i.e. the
 *                                              STMD Schema provides the possibility and capability to code any kind of
 *                                              information regardless of what the STMD specifies. This means, the name,
 *                                              structure and attributes of XML elements enclosed by an Annotation 
 *                                              element are completely free.
 * @property {AnnotationAttributes} attributes 
 */

/**
 * AnnotationAttributes 
 * 
 * @typedef {object} AnnotationAttributes
 * @property {string} type  The unique name of the type of the annotation. In order to ensure uniqueness all types
 *                          should be identified with reverse domain name notation (cf. Java package names or Apple
 *                          UTIs) of a domain that is controlled by the entity defining the semantics and content of the
 *                          annotation. For vendor-specific annotations this would e.g. be a domain controlled by the
 *                          tool vendor. For MAP-SSP defined annotations, this will be a domain under the org.modelica
 *                          prefix.
 */

/**
 * LinksType
 * 
 * The LinksType element defines the structure and attributes for the linkage mechanism to use links within the stmd
 * file as well as links to external resources outside the STMD file.
 * 
 * @typedef {object} LinksType
 * @property {Link[]} Link
 */

/**
 * Link
 * 
 * The Link element represents a single links no mater if it is an STMD file internal link or a link targeted to the
 * outside of the STMD file.
 * 
 * @typedef {object} Link
 * @property {Locator[]} Locator
 * @property {Arc[]} [Arc]
 * @property {LinkAttributes} attributes
 */

/**
 * LinkAttributes
 * 
 * @typedef {object} LinkAttributes 
 * @property {string} xlink_type        Has the fixed value extended to indicate an XLink extended link
 * @property {string} [xlink_title]     This optional attributes specifies a meaningful title of the link
 * @property {string} [xlink_role]      This optional attribute specifies the role this link has in the overall process
 */

/**
 * Locator
 * 
 * This element provides a locator conforming to the XLink specification. It identifies aparticular piece of information
 * through an URI, that is taking part in the linking relationship. Locators can further specify their semantic meaning
 * through an optional role attribute. The SSP Traceability specification currently provides no predefined roles.
 * 
 * @typedef {object} Locator
 * @property {LocatorAttributes} attributes
 */

/**
 * LocatorAttributes
 * 
 * @typedef {object} LocatorAttributes
 * @property {string} xlink_type    Has the fixed value locator to indicate an XLink locator
 * @property {string} xlink_href    A mandatory attribute that supplies the data that allows an XLink application to
 *                                  find a remote resource (or resource fragment). The value of the href attribute is a
 *                                  [Legacy extended IRIs] (LEIRI). Processing a relative identifier against a base is
 *                                  handled straightforwardly; the algorithms of [RFC 3986] can be applied directly, 
 *                                  treating the characters additionally allowed in LEIRIs in the same way that
 *                                  unreserved characters are in URI references.
 * @property {string} [xlink_label] This optional attribute specifies a label that can be referenced by an XLink Arc.
 *                                  It does not necessarily be unique. If the label is not unique and an Arc references
 *                                  this label, a link is drawn from/to all the Locators with this label.
 * @property {string} [xlink_title] Specifies a meaningful title for the Locator
 * @property {string} [xlink_role]  Specifies the semantic meaning of the Locator
 */

/**
 * Arc
 * 
 * This element provides an arc conforming to the XLink specification. An arc relates sets of locators in a navigable
 * relationship, including directionality information. Arcs can further specify their semantic meaning through an
 * optional arcrole attribute. The SSP Traceability specification currently provides no predefined roles.
 * 
 * @typedef {object} Arc 
 * @property {ArcAttributes} attributes
 */

/**
 * ArcAttributes
 * 
 * @typedef {object} ArcAttributes
 * @property {string} xlink_type        Has the fixed value arc to indicate an XLink arc
 * @property {string} [xlink_from]      This optional attribute specifies the locator from where the link is starting.
 *                                      If no value is supplied for a from attribute, the missing value is interpreted 
 *                                      as standing for all locators 
 * @property {string} [xlink_to]        This optional attribute specifies the locator for the destination of the link.
 *                                      If no value is supplied for a to attribute, the missing value is interpreted as
 *                                      standing for all locators.
 * @property {string} [xlink_title]     Optional attribute that specifies a title for the Arc
 * @property {string} [xlink_arcrole]   Optional attribute that specifies the semantic meaning of the Arc
 */

/**
 * LifeCycleInformationType
 * 
 * The LifeCycleInformationType element defines the structure and attributes of lifecycle information about the
 * enclosing phase or step element.
 * 
 * @typedef {object} LifeCycleInformationType
 * @property {LifeCycleEntryType} [Drafted]
 * @property {LifeCycleEntryType} [Defined]
 * @property {LifeCycleEntryType} [Validated]
 * @property {LifeCycleEntryType} [Approved]
 * @property {LifeCycleEntryType} [Archived]
 * @property {LifeCycleEntryType} [Retracted]
 */

/**
 * LifeCycleEntryType
 * 
 * The LifeCycleEntryType element defines the structure and the attributes of lifecycle information entries and
 * therefore is the basis of the Drafted, Defined, Validated, Approved, Archived and Retracted XML elements.
 * 
 * @typedef {object} LifeCycleEntryType
 * @property {ResponsibleType} Responsible
 * @property {SignatureType[]} [Signature]
 * @property {ResourceType[]} [Resource]
 * @property {ResourceReference[]} [ResourceReference]
 * @property {Classification[]} [Classification]
 * @property {Annotations} [Annotations]
 * @property {LifeCycleEntryTypeAttributes} attributes
 */

/**
 * LifeCycleEntryTypeAttributes
 * 
 * @typedef {object} LifeCycleEntryTypeAttributes
 * @property {string} date
 * @property {string} [checksum]
 * @property {string} [checksumType]
 */

/**
 * ResponsibleType
 * 
 * The ResponsibleType element defines the structure and attributes of the responsible entry for a lifecycle entry of a
 * step or a phase of the overall simulation task.
 * 
 * @typedef {object} ResponsibleType
 * @property {ResponsibleTypeAttributes} attributes
 */

/**
 * ResponsibleTypeAttributes
 * 
 * @typedef {object} ResponsibleTypeAttributes
 * @property {string} [organization] This attribute gives the organization that is responsible for a given step.
 * @property {string} [role] This attribute gives the role of the person that is responsible for a given step.
 * @property {string} [name] This attribute gives the name of the person that is responsible for a given step.
 */

module.exports = {
    /**
     * @type {SimulationTaskMetaDataAttributes}
     * @type {GeneralInformationType}
     * @type {DerivationChain}
     * @type {DerivationChainEntry}
     * @type {ResourceType}
     * @type {ResourceTypeAttributes}
     * @type {ResourceReference}
     * @type {ResourceReferenceAttributes}
     * @type {ContentType}
     * @type {Summary}
     * @type {SummaryAttributes}
     * @type {MetaData}
     * @type {MetaDataAttributes}
     * @type {SignatureType}
     * @type {SignatureTypeAttributes}
     * @type {Classification}
     * @type {ClassificationAttributes}
     * @type {ClassificationEntry}
     * @type {ClassificationEntryAttributes}
     * @type {Annotations}
     * @type {Annotation}
     * @type {AnnotationAttributes}
     * @type {LinksType}
     * @type {Link}
     * @type {LinkAttributes}
     * @type {Locator}
     * @type {LocatorAttributes}
     * @type {Arc}
     * @type {ArcAttributes}
     * @type {LifeCycleInformationType}
     * @type {LifeCycleEntryType}
     * @type {LifeCycleEntryTypeAttributes}
     * @type {ResponsibleType}
     * @type {ResponsibleTypeAttributes}
     */
}