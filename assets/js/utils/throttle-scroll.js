import { throttle } from 'throttle-debounce';

const { on } = window.ivent;
const hideOnScrollList = [];
let lastST = 0;

/**
 * Throttle scroll.
 */
const handleScroll = () => {
	if (!hideOnScrollList.length) {
		return;
	}

	const ST = window.pageYOffset;

	let type = ''; // [up, down, end, start]

	if (ST > lastST) {
		type = 'down';
	} else if (ST < lastST) {
		type = 'up';
	} else {
		type = 'none';
	}

	if (ST === 0) {
		type = 'start';
	} else if (
		window.innerHeight + window.scrollY >=
		document.body.scrollHeight
	) {
		type = 'end';
	}

	hideOnScrollList.forEach((value) => {
		if (typeof value === 'function') {
			value(type, ST, lastST, window);
		}
	});

	lastST = ST;
};

on(window, 'scroll', throttle(200, handleScroll));
on(window, 'load', handleScroll);
on(window, 'orientationchange', handleScroll);

export function throttleScroll(callback) {
	hideOnScrollList.push(callback);
}
