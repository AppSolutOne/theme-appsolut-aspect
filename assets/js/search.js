const { on } = window.ivent;

on(document, 'keydown', (e) => {
	if (
		e.key === '/' ||
		(e.key === 'k' && (e.metaKey /* for Mac */ || /* for non-Mac */ e.ctrlKey))
	) {
		// Prevent triggering if user is typing in an input field or textarea.
		if (
			document.activeElement.tagName === 'INPUT' ||
			document.activeElement.tagName === 'TEXTAREA'
		) {
			return;
		}

		e.preventDefault();

		window.location.hash = '#/search';
	}
});
