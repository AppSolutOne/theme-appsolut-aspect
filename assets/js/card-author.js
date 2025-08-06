import { setWillChange } from './card-post';

const { animate, stagger, spring } = window.Motion;
const { on } = window.ivent;

const cardMap = new Map();

// Hover.
on(document, 'mouseenter', '.card-author', (e) => {
	const card = e.delegateTarget;

	// Init map.
	if (!cardMap.has(card)) {
		cardMap.set(card, {
			animateEl: card.querySelector('.card-author-image'),
			badge: card.querySelectorAll('.social-links a'),
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
				'perspective(1000px) scale3d(1.02, 1.02, 1) rotateX(3.5deg)',
				'perspective(1000px) scale3d(1.04, 1.04, 1) rotateX(0deg)',
			],
			transformStyle: 'preserve-3d',
		},
		{ easing: spring({ stiffness: 60 }) },
	);

	// Badge animate.
	animate(
		data.badge,
		{
			opacity: 1,
			transform: ['translateY(6px)', 'translateY(0)'],
		},
		{
			delay: stagger(0.1),
			easing: spring({ stiffness: 60 }),
		},
	);
});

// Leave.
on(document, 'mouseleave', '.card-author', (e) => {
	const data = cardMap.get(e.delegateTarget);
	if (!data) return;

	// Will change.
	setWillChange(data);

	// Image animate.
	animate(
		data.animateEl,
		{ transform: 'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg)' },
		{ easing: spring({ stiffness: 60 }) },
	);

	// Badge animate.
	animate(
		data.badge,
		{
			opacity: 0,
			transform: 'translateY(0)',
		},
		{
			easing: spring({ stiffness: 100 }),
		},
	);
});
