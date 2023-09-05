/**
 * Extracts an ID of a Resource that is given by a internal reference
 * 
 * @param {string} href the internal reference
 * @returns {string} the ID
 */
function getResourceIdFromHref(href) {
    if (href[0] !== "#")
        throw("For ResourceReferences only internal references must be used");

    return href.slice(1);
}

/**
 * Generates a random hexa-decimal ID as string
 * 
 * @returns {string}
 */
function generateRandomId() {
    return Math.random().toString(16).slice(2);
}

exports.getResourceIdFromHref = getResourceIdFromHref;
exports.generateRandomId = generateRandomId;