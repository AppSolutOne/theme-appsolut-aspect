import { resizeObserver } from './utils/resize-observer';

const { on } = window.ivent;

// Set height announcement bar.
on(document, 'ready', () => {
	resizeObserver('#announcement-bar-root', 'height', (entry) => {
		const height = entry.contentRect.height;

		document.body.style.setProperty(
			'--announcement-bar--height',
			height ? `${height}px` : '',
		);
	});
});
