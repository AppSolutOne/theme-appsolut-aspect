const { debounce } = require('throttle-debounce');

const { on } = window.ivent;
const dropdowns = document.querySelectorAll('.dropdown');

const dropdownAlign = () => {
	dropdowns.forEach((dropdown) => {
		if (dropdown.getBoundingClientRect().right > window.innerWidth) {
			dropdown.classList.add('dropdown-align-left');
		} else if (dropdown.getBoundingClientRect().left < 0) {
			dropdown.classList.remove('dropdown-align-left');
		}
	});
};

dropdownAlign();
on(window, 'resize', debounce(100, dropdownAlign));
