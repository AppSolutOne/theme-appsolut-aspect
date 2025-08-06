import { getElements } from './get-elements';

export function resizeObserver(selector, size, callback) {
	getElements(selector).forEach((el) => {
		let lastSize = size ? el.getBoundingClientRect()[size] : null;

		const resizeObserver = new ResizeObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (lastSize && entry.contentRect[size] !== lastSize) {
					callback(entry, observer);

					lastSize = entry.contentRect[size];

					return;
				}

				callback(entry, observer);
			});
		});

		resizeObserver.observe(el);
	});
}
