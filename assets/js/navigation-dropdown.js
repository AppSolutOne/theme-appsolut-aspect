import { createFocusTrap } from 'focus-trap';

const { on } = window.ivent;

const itemToDropdown = new Map();
const dropdownToItem = new Map();
const sidebar = document.querySelector('.sidebar');
const selector =
	'.navigation-sidebar .nav-item:has(> .navigation-dropdown-toggle) > .nav-link, .navigation-sidebar.navigation-tags > .nav-link';

function setPositionDropdown(dropdown, item) {
	const itemRect = item.getBoundingClientRect();
	dropdown.style.left = `${itemRect.width + itemRect.left}px`;

	if (itemRect.top + dropdown.offsetHeight > window.innerHeight) {
		dropdown.style.top = 'auto';
		dropdown.style.bottom = '0px';
		return;
	}

	dropdown.style.top = `${itemRect.top}px`;
	dropdown.style.bottom = '';
}

function toggleDropdown(item, show = false, focus = false) {
	const data = itemToDropdown.get(item);

	// Return if already showing (event triggered twice).
	if ((show && data.show) || (!show && !data.show)) {
		return;
	}

	// Return if dropdown is hidden.
	if (getComputedStyle(data.dropdown).display === 'none') {
		return;
	}

	data.show = show;
	const { dropdown } = data;

	if (show) {
		setPositionDropdown(dropdown, item);
		item.classList.add('hover');
		dropdown.classList.add('show');

		// Visible.
		clearTimeout(data.timeoutVisible);
		data.visible = true;

		// FocusTrap.
		if (focus) {
			setTimeout(() => {
				data.focusTrap.activate();
				data.focus = true;
			}, 50);
		}
	} else {
		item.classList.remove('hover');
		dropdown.classList.remove('show');

		// Visible.
		data.timeoutVisible = setTimeout(() => {
			data.visible = false;
		}, 150);

		// FocusTrap.
		if (focus) {
			setTimeout(() => {
				data.focusTrap.deactivate();
				data.focus = false;
				item.focus();
			}, 50);
		}
	}
}

// Init dropdowns (move to body).
document.querySelectorAll(selector).forEach((item) => {
	const dropdown =
		item.parentNode.querySelector('.navigation-dropdown') ||
		item.parentNode.querySelector('.collapse')?.cloneNode(true);

	// Collapse.
	if (dropdown.classList.contains('collapse')) {
		dropdown.classList.remove('collapse', 'collapse-ready');
		dropdown.classList.add('navigation-dropdown');
		dropdown.ariaLabelledby = dropdown
			.getAttribute('aria-labelledby')
			.replace('collapse', 'dropdown');
		dropdown.id = dropdown.getAttribute('id').replace('collapse', 'dropdown');
	}

	// Move to body.
	document.body.append(dropdown);

	// Save data.
	itemToDropdown.set(item, {
		dropdown,
		show: false,
		focus: false,
		visible: false,
		timeoutVisible: null,
		focusTrap: createFocusTrap(dropdown),
	});
	dropdownToItem.set(dropdown, item);
});

// Hover item.
on(document, 'mouseenter', selector, (e) => {
	toggleDropdown(e.delegateTarget, true);
});

on(document, 'mouseleave', selector, (e) => {
	toggleDropdown(e.delegateTarget, false);
});

// Hover dropdown.
on(document, 'mouseenter', '.navigation-dropdown', (e) => {
	dropdownToItem.get(e.delegateTarget).classList.add('hover');
});

on(document, 'mouseleave', '.navigation-dropdown', (e) => {
	dropdownToItem.get(e.delegateTarget).classList.remove('hover');
});

// Update position dropdown on scroll sidebar.
on(sidebar, 'scroll', (e) => {
	itemToDropdown.forEach((data, item) => {
		if (data.visible) {
			setPositionDropdown(data.dropdown, item);
		}
	});
});

// Click toggle (show only on :focus-visible).
on(document, 'click', '.navigation-dropdown-toggle', (e) => {
	e.preventDefault();

	toggleDropdown(
		e.delegateTarget.parentNode.querySelector('.nav-link'),
		true,
		true,
	);
});

on(document, 'keyup', (e) => {
	if (e.key === 'Escape') {
		itemToDropdown.forEach((data, item) => {
			if (data.focus) {
				toggleDropdown(item, false, true);
			}
		});
	}
});
