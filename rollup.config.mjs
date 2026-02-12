import { resolve } from 'node:path';
import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import postcssMixins from 'postcss-mixins';
import postcssFluid from '@lehoczky/postcss-fluid';
import postcssNested from 'postcss-nested';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import { globSync } from 'glob';

// eslint-disable-next-line no-undef -- it is defined actually.
const isProduction = process.env.BUILD === 'production';

// Unified build configuration - CHANGE THIS IN THEMES
const buildConfig = {
	js: [
		'assets/js/index.js',
		'assets/js/announcement-bar.js',
		'assets/js/slider-tags.js',
		'assets/js/slider-cards.js',
		'assets/js/section-featured/carousel.js',
		'assets/js/section-featured/slider.js',
	],
	css: [
		'assets/css/index.css',
		{ src: 'assets/css/section-featured/*.css', ignore: '' },
	],
	copy: [
		// Ivent
		{ src: 'node_modules/ivent/dist/ivent.min.js', dest: 'assets/vendors' },
		{ src: 'node_modules/ivent/dist/ivent.min.js.map', dest: 'assets/vendors' },
		// Popper
		{
			src: 'node_modules/@popperjs/core/dist/umd/popper.min.js',
			dest: 'assets/vendors',
		},
		{
			src: 'node_modules/@popperjs/core/dist/umd/popper.min.js.map',
			dest: 'assets/vendors',
		},
		// Tippy
		{
			src: 'node_modules/tippy.js/dist/tippy.css',
			dest: 'assets/vendors',
		},
		{
			src: 'node_modules/tippy.js/dist/tippy.umd.min.js',
			dest: 'assets/vendors',
		},
		{
			src: 'node_modules/tippy.js/dist/tippy.umd.min.js.map',
			dest: 'assets/vendors',
		},
		// Swiper
		{
			src: 'node_modules/swiper/swiper.min.css',
			dest: 'assets/vendors/swiper',
		},
		{
			src: 'node_modules/swiper/modules/effect-creative.min.css',
			dest: 'assets/vendors/swiper',
		},
		{
			src: 'node_modules/swiper/modules/free-mode.min.css',
			dest: 'assets/vendors/swiper',
		},
		{
			src: 'node_modules/swiper/modules/mousewheel.min.css',
			dest: 'assets/vendors/swiper',
		},
		{
			src: 'node_modules/swiper/modules/navigation.min.css',
			dest: 'assets/vendors/swiper',
		},
		// Motion
		{ src: 'node_modules/motion/dist/motion.js', dest: 'assets/vendors' },
		// PVS
		{ src: 'node_modules/pvs/dist/pvs.min.js', dest: 'assets/vendors' },
		{ src: 'node_modules/pvs/dist/pvs.min.css', dest: 'assets/vendors' },
		{ src: 'node_modules/pvs/dist/pvs-footer.min.js', dest: 'assets/vendors' },
		// Geist font
		{
			src: 'node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',
			dest: 'assets/vendors',
		},
		// Partials
		{ src: 'node_modules/pvs/partials/*.hbs', dest: 'partials' },
	],
};

// Process CSS configuration to get additional CSS files
const getAdditionalCssFiles = () => {
	const files = [];
	buildConfig.css.forEach((item) => {
		if (typeof item === 'object') {
			const globbed = globSync(item.src, {
				ignore: item.ignore,
			});
			files.push(...globbed);
		}
	});
	return files;
};

// Get the main CSS file
const getMainCssFile = () => {
	const mainCss = buildConfig.css.find((item) => typeof item === 'string');
	return mainCss || 'assets/css/index.css';
};

const mainCss = getMainCssFile();
const additionalCss = getAdditionalCssFiles();

// Common plugins
const jsPlugins = [
	commonjs(),
	nodeResolve(),
	esbuild({
		target: ['es2020'],
		minify: isProduction,
		sourcemap: !isProduction,
	}),
];

const cssPlugins = [
	postcssMixins(),
	postcssFluid({
		min: '380px',
		max: '1500px',
	}),
	postcssNested(),
	postcssImport(),
	postcssPresetEnv({
		features: {
			'custom-properties': false,
		},
	}),
];

// Build the rollup configuration
function buildRollupConfig() {
	const configs = [];

	// Process JS files
	buildConfig.js.forEach((jsPath) => {
		// Check if it's a glob pattern
		if (jsPath.includes('*')) {
			const files = globSync(jsPath);
			files.forEach((input) => {
				// Determine output directory based on input path
				const outputDir = getOutputDir(input);
				configs.push({
					input,
					output: {
						dir: outputDir,
						format: 'iife',
					},
					plugins: jsPlugins,
				});
			});
		} else {
			// Handle single file
			const isMainJs = jsPath === buildConfig.js[0]; // First file is considered main
			const outputDir = isMainJs ? 'assets/built' : getOutputDir(jsPath);

			const config = {
				input: jsPath,
				output: {
					dir: outputDir,
					format: 'iife',
				},
				plugins: [...jsPlugins],
			};

			// Add CSS processing only to the main JS file
			if (isMainJs) {
				config.plugins.push(
					// Main CSS
					postcss({
						extract: true,
						include: mainCss,
						exclude: additionalCss,
						inject: false,
						minimize: isProduction,
						plugins: cssPlugins,
					}),

					// Additional CSS
					...additionalCss.map((file) =>
						postcss({
							include: file,
							extract: resolve(file.replace('assets/css/', 'assets/built/')),
							minimize: isProduction,
							plugins: cssPlugins,
						}),
					),

					// Copy plugins
					isProduction && copy({ targets: buildConfig.copy }),
					!isProduction &&
						livereload({
							watch: [
								resolve('assets/css'),
								resolve('assets/js'),
								resolve('partials'),
								resolve('*.hbs'),
							],
							exts: ['js', 'css', 'hbs'],
							verbose: true,
							delay: 300,
						}),
				);
			}

			configs.push(config);
		}
	});

	return configs.filter(Boolean);
}

// Helper function to determine output directory based on input path
function getOutputDir(inputPath) {
	// Remove 'assets/js/' prefix and get the directory
	const relativePath = inputPath.replace('assets/js/', '');
	const dirPath = relativePath.includes('/')
		? relativePath.substring(0, relativePath.lastIndexOf('/'))
		: '';

	return dirPath ? `assets/built/${dirPath}` : 'assets/built';
}

// Rollup configuration
// eslint-disable-next-line import/no-default-export -- rollup requires default export
export default defineConfig(buildRollupConfig());
