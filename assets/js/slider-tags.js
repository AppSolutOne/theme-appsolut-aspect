import Swiper from 'swiper';
import { Mousewheel, Navigation, FreeMode } from 'swiper/modules';

document.querySelectorAll('.slider-tags').forEach((slider) => {
	new Swiper(slider, {
		modules: [Navigation, FreeMode, Mousewheel],
		navigation: {
			nextEl: '.slider-tags .slider-button-next',
			prevEl: '.slider-tags .slider-button-prev',
		},
		slidesPerView: 'auto',
		spaceBetween: 6,
		freeMode: true,
		grabCursor: true,
		touchEventsTarget: 'container',
		initialSlide: parseFloat(slider.getAttribute('data-initial-slide')) || 0,
		mousewheel: {
			enabled: true,
			forceToAxis: true,
		},
	});
});

function isHorizontalScroll(event) {
	return event instanceof WheelEvent && event.deltaX !== 0;
}

function isSwiperTarget(event) {
	return event.target.closest('.slider-tags') !== null;
}

// Disable history browser when trackpad swiping horizontally on .slider-tags.
document.addEventListener(
	'wheel',
	(event) => {
		if (isHorizontalScroll(event) && isSwiperTarget(event)) {
			event.preventDefault();
		}
	},
	{ passive: false },
);
