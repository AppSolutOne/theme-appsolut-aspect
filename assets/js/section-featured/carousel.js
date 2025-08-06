import Swiper from 'swiper';
import { Navigation, EffectCreative } from 'swiper/modules';

document.querySelectorAll('.section-featured .swiper').forEach((slider) => {
	new Swiper(slider, {
		modules: [Navigation, EffectCreative],
		navigation: {
			nextEl: '.section-featured .slider-button-next',
			prevEl: '.section-featured .slider-button-prev',
		},
		slidesPerView: 1,
		spaceBetween: 16,
		speed: 600,
		autoHeight: true,
		grabCursor: true,
		effect: 'creative',
		creativeEffect: {
			perspective: true,
			prev: {
				translate: [0, -10, -1],
				scale: 0.92,
			},
			next: {
				translate: ['120%', 0, 0],
				scale: 1,
			},
		},
	});
});
