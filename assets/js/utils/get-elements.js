/**
 * Converts various input types into an array of DOM elements.
 *
 * @param {(string|Element|Node|NodeList|HTMLCollection)} selector - Can be a string, DOM element, Node, NodeList or HTMLCollection.
 * @returns {Element[]} Array of DOM elements
 *
 * @example
 * // CSS selector
 * getElements('.selector');
 *
 * // DOM element
 * getElements(document.getElementById('my-id'));
 *
 * // NodeList
 * getElements(document.querySelectorAll('.selector'));
 *
 * // single Node
 * getElements(document.body);
 */
export function getElements(selector) {
	let elements = [];

	// If it's a string, we use it as a CSS selector.
	if (typeof selector === 'string') {
		elements = Array.from(document.querySelectorAll(selector));

		// If DOM element.
	} else if (selector instanceof Element) {
		elements = [selector];

		// If Node - convert to array if it is a collection, or add as an element.
	} else if (selector instanceof Node) {
		elements = selector.nodeType ? [selector] : Array.from(selector);

		// If NodeList or HTMLCollection - convert to array.
	} else if (
		selector instanceof NodeList ||
		selector instanceof HTMLCollection
	) {
		elements = Array.from(selector);
	}

	return elements;
}
