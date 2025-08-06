import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

document.querySelectorAll('.slider-cards').forEach((slider) => {
	const swiper = new Swiper(slider, {
		modules: [Navigation],
		navigation: {
			nextEl: slider.querySelector('.slider-button-next'),
			prevEl: slider.querySelector('.slider-button-prev'),
		},
		slidesPerView: 'auto',
		spaceBetween: 16,
		grabCursor: true,
		touchEventsTarget: 'container',
		breakpoints: {
			440: {
				spaceBetween: 17.5,
			},
			540: {
				spaceBetween: 18.75,
			},
			768: {
				spaceBetween: 21.6,
			},
			992: {
				spaceBetween: 24.4,
			},
			1200: {
				spaceBetween: 27,
			},
			1400: {
				spaceBetween: 30,
			},
		},
	});

	// For touching effect.
	swiper.on('sliderFirstMove', () => {
		swiper.el.classList.add('swiper-touching');
	});
	swiper.on('touchEnd', () => {
		setTimeout(() => {
			swiper.el.classList.remove('swiper-touching');
		}, 50);
	});
});
