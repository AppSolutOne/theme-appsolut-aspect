import { resizeObserver } from './utils/resize-observer';

const { on, trigger } = window.ivent;
const { documentElement } = document;

const events = {
	collapsed: 'aspect.sidebar.collapsed',
	open: 'aspect.sidebar.open',
};

const sidebar = document.querySelector('.sidebar');

// Collapse sidebar.
on(document, 'click', '.toggle-sidebar', (e) => {
	e.preventDefault();

	const hasCollapsed =
		documentElement.getAttribute('data-sidebar-collapsed') === 'false';

	// Set toggle aria-expanded.
	e.delegateTarget.setAttribute('aria-expanded', !hasCollapsed);

	// Set attribute.
	documentElement.setAttribute('data-sidebar-collapsed', hasCollapsed);

	// Set local storage.
	localStorage.setItem('sidebar-collapsed', hasCollapsed);

	// Close collapse.
	if (hasCollapsed) {
		sidebar.querySelectorAll('[aria-expanded="true"]').forEach((toggle) => {
			// Toggle.
			toggle.style.transition = 'none';
			toggle.setAttribute('aria-expanded', 'false');
			toggle.offsetHeight;
			toggle.style.transition = '';

			// Collapse.
			const collapse = toggle.parentNode.querySelector('.collapse');
			collapse.style.transition = 'none';
			collapse.classList.remove('show');
			collapse.offsetHeight;
			collapse.style.transition = '';
		});
	}
});

resizeObserver('.sidebar', 'width', (entry) => {
	const hasCollapsed = entry.target.clientWidth < 200;

	document
		.querySelector('.toggle-sidebar')
		.setAttribute('aria-expanded', !hasCollapsed);

	trigger(document, hasCollapsed ? events.collapsed : events.open);
});
