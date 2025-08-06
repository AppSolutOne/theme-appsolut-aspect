const { on } = window.ivent;

const mapAnimating = new Map();
const selector =
	'.button:not([type="submit"], [disabled], .loading, .complete), .kg-cta-button, .kg-button-card a, .kg-product-card-button, .section-hero .social-links a';

on(document, 'mouseenter', selector, (e) => {
	const button = e.delegateTarget;
	const text = button.textContent?.trim();
	let label = button.querySelector('.label');
	let labelWrapper = button.querySelector('.label-wrapper');

	// Return if already animating.
	if (mapAnimating.get(button) || !text) {
		return;
	}

	// Create label.
	if (!label) {
		label = document.createElement('span');
		label.classList.add('label');
		label.textContent = text;
		button.textContent = '';
		button.appendChild(label);
	}

	// Create wrapper.
	if (!labelWrapper) {
		labelWrapper = document.createElement('span');
		labelWrapper.classList.add('label-wrapper');
		labelWrapper.appendChild(label.cloneNode(true));
		labelWrapper.appendChild(label.cloneNode(true));
		label.replaceWith(labelWrapper);
	}

	// Set animation.
	mapAnimating.set(button, true);
	setTimeout(() => {
		mapAnimating.set(button, false);
	}, 400);

	// Add class animation.
	button.classList.remove('button-animation');
	button.offsetHeight;
	button.classList.add('button-animation');
});
