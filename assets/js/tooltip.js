const { on } = window.ivent;
const { tippy } = window;

const tooltips = {
	// Tooltips inside content.
	content: {
		// Array is needed to destroy after rendering the navigation.
		elements: [],
		selector: '.content [data-tippy-content]',
		options: {
			moveTransition: 'transform 0.1s ease-out',
		},
	},

	// Tooltips when hover avatar author.
	author: {
		// Array is needed to destroy after rendering the navigation.
		elements: [],
		selector: '.content [data-tooltip-custom]',
		options: {
			trigger: 'mouseenter',
			arrow: false,
			interactive: true,
			placement: 'bottom-start',
			allowHTML: true,
			delay: [400, 100],
			offset: [-20, 7],
			duration: 100,
			appendTo: () => document.body,
		},
		additionalOptions: (el) => {
			const attr = el.getAttribute('data-tooltip-custom');
			return {
				theme: attr,
				content: el.parentNode.querySelector(`.tooltip-custom-${attr}`)
					.innerHTML,
			};
		},
	},

	// Tooltips when collapsed sidebar.
	sidebar: {
		// Array is needed to show/hide tooltips after the sidebar collapses.
		elements: [],
		selector: '.sidebar [data-tippy-content]:only-child',
		options: {
			arrow: true,
			placement: 'right',
		},
	},

	// Tooltips sidebar socials.
	sidebarSocials: {
		elements: [],
		selector: '.sidebar .social-link',
		options: {
			arrow: true,
		},
		additionalOptions: (el) => ({
			content: el.querySelector('span').textContent,
		}),
	},

	// Social links.
	socialLinks: {
		elements: [],
		selector: '.social-links .social-link:has(> .screen-reader-text)',
		options: {
			arrow: true,
		},
		additionalOptions: (el) => ({
			content: el.querySelector('span').textContent,
		}),
	},
};

/**
 * Init tooltips.
 *
 * @param {string} name
 * @param {function} callbackOptions - set additional options.
 */
function initTooltips(name) {
	// Set elements on data `tooltips[name].elements`.
	tooltips[name].elements = Array.from(
		document.querySelectorAll(tooltips[name].selector),
	);

	// Init tippy.
	tooltips[name].elements.forEach((el) => {
		if (el._tippy) return;

		let options = tooltips[name].options;

		if (tooltips[name].additionalOptions) {
			options = {
				...options,
				...tooltips[name].additionalOptions(el),
			};
		}

		tippy(el, options);
	});
}

/**
 * Content tooltips.
 */
initTooltips('content');

/**
 * Author tooltips.
 */
initTooltips('author');

// Search new 'content' and 'author' tooltips after pagination rendered.
on(document, 'pvs.pagination.rendered', () => {
	initTooltips('content');
	initTooltips('author');
});

// Destroy and re-init 'content' and 'author' tooltips after content rendered.
on(document, 'pvs.navigation.content-rendered', () => {
	// Destroy.
	[...tooltips.content.elements, ...tooltips.author.elements].forEach((el) => {
		if (!el._tippy) return;

		el._tippy.destroy();
	});

	// Re-init.
	initTooltips('content');
	initTooltips('author');
});

/**
 * Sidebar Socials tooltips.
 */
initTooltips('sidebarSocials');

on(document, 'pvs.social-links.rendered', () => {
	initTooltips('sidebarSocials');
});

/**
 * Social links tooltips.
 */
initTooltips('socialLinks');

/**
 * Sidebar tooltips.
 */
initTooltips('sidebar');

function toggleSidebarTooltips(toggle = 'enable') {
	tooltips.sidebar.elements.forEach((el) => {
		el._tippy[toggle]();
	});
}

on(document, 'aspect.sidebar.collapsed', () => toggleSidebarTooltips('enable'));
on(document, 'aspect.sidebar.open', () => toggleSidebarTooltips('disable'));
