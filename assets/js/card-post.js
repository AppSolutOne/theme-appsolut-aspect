const { animate, spring } = window.Motion;
const { on } = window.ivent;

const SELECTOR = `
	.card-post-classic, .card-post-classic-simple,
	.card-post-list .card-post-image, .card-post-list-simple .card-post-image,
	.card-post-overlay, .card-post-overlay-simple
`;

const cardMap = new Map();

export function setWillChange(data, isHover = false) {
	if (data.timeout) {
		clearTimeout(data.timeout);
	}
	data.animateEl.style.willChange = 'transform';
	data.timeout = setTimeout(() => {
		data.animateEl.style.willChange = '';

		// Update position tooltips.
		if (!isHover) return;
		data.tippy.forEach(({ _tippy }) => {
			if (_tippy && _tippy.popperInstance) {
				_tippy.popperInstance.update();
			}
		});
	}, 300);
}

// Hover.
on(document, 'mouseenter', SELECTOR, (e) => {
	const card = e.delegateTarget;
	let animateEl = card.querySelector('.card-post-image');

	if (
		card.classList.contains('card-post-image') ||
		card.classList.contains('card-post-overlay') ||
		card.classList.contains('card-post-overlay-simple')
	) {
		animateEl = card;
	}

	// Set map.
	if (!cardMap.has(card)) {
		cardMap.set(card, {
			animateEl,
			tippy: card.querySelectorAll('[data-tippy-content]'),
			timeout: null,
		});
	}

	const data = cardMap.get(card);

	// Will change.
	setWillChange(data, true);

	// Image animate.
	animate(
		data.animateEl,
		{
			transform: [
				'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg)',
				'perspective(1000px) scale3d(1.02, 1.02, 1) rotateX(5deg)',
				'perspective(1000px) scale3d(1.04, 1.04, 1) rotateX(0deg)',
			],
			boxShadow: '0 20px 40px -20px rgb(0 0 0 / 40%)',
			transformStyle: 'preserve-3d',
		},
		{ easing: spring({ stiffness: 50 }) },
	);
});

// Leave.
on(document, 'mouseleave', SELECTOR, (e) => {
	const data = cardMap.get(e.delegateTarget);
	if (!data) return;

	// Will change.
	setWillChange(data);

	// Image animate.
	animate(
		data.animateEl,
		{
			transform: 'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg)',
			boxShadow: '0 0px 0px 0px rgb(0 0 0 / 0%)',
		},
		{ easing: spring({ stiffness: 50 }) },
	);
});
