import Swiper from 'swiper';
import { Navigation, Parallax } from 'swiper/modules';

document.querySelectorAll('.section-featured .swiper').forEach((slider) => {
	new Swiper(slider, {
		modules: [Navigation, Parallax],
		navigation: {
			nextEl: '.section-featured .slider-button-next',
			prevEl: '.section-featured .slider-button-prev',
		},
		slidesPerView: 1,
		speed: 600,
		autoHeight: true,
		grabCursor: true,
		parallax: true,
		loop: true,
	});
});
