import { resizeObserver } from './utils/resize-observer';

const { on } = window.ivent;

const SELECTORS = {
	TOC: '.toc',
	ACTIVE_LINK: '.active',
};

const CSS_PROPERTIES = {
	SCROLL_PROGRESS: '--toc--scroll-progress',
	LINK_HEIGHT: '--toc--link-height',
};

const state = {
	toc: document.querySelector(SELECTORS.TOC),
	link: null,
	resizeObserver: null,
};

function updateStyles(scroll, linkHeight) {
	state.toc.style.setProperty(
		CSS_PROPERTIES.SCROLL_PROGRESS,
		linkHeight ? `${scroll + linkHeight}px` : '',
	);
	state.toc.style.setProperty(
		CSS_PROPERTIES.LINK_HEIGHT,
		linkHeight ? `${linkHeight}` : '',
	);
}

// Update state when navigation content is rendered.
on(document, 'pvs.navigation.content-rendered', () => {
	// Disconnect observer.
	state.resizeObserver?.disconnect();

	// Search new toc.
	state.toc = document.querySelector(SELECTORS.TOC);
	state.link = state.toc?.querySelector(SELECTORS.ACTIVE_LINK);

	// Reconnect observer.
	if (state.toc) {
		state.resizeObserver?.observe(state.toc);
	}
});

// Set progress when link is activated.
on(document, 'pvs.toc.activated-link', ({ relatedTarget: link }) => {
	if (state.toc) {
		state.link = link;
		updateStyles(link.offsetTop, link.offsetHeight);
	}
});

// Reset progress when link is deactivated.
on(document, 'pvs.toc.deactivated-link', ({ relatedTarget: link }) => {
	if (state.link === link && state.toc) {
		updateStyles();
	}
});

resizeObserver(state.toc, 'width', (entry, observer) => {
	updateStyles(state.link?.offsetTop, state.link?.offsetHeight);

	if (!state.resizeObserver) {
		state.resizeObserver = observer;
	}
});
