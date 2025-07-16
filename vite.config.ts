import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import banner from 'vite-plugin-banner';

export default defineConfig({
	plugins: [
		dts(),
		banner(`/*!
 * Lightbox for Bootstrap 5 v${process.env.npm_package_version} (https://trvswgnr.github.io/bs5-lightbox/)
 * Copyright ${new Date().getFullYear()} Travis Aaron Wagner (https://github.com/trvswgnr/)
 * Licensed under MIT (https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE)
 */`)
	],
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: './src/bs5-lightbox.js',
			name: 'lightbox',
			// the proper extensions will be added
			fileName: 'bs5-lightbox',
			formats: ['es', 'iife', 'umd']
		},
		rollupOptions: {
			external: ['bootstrap'],
			output: {
				globals: {
					bootstrap: 'bootstrap'
				}
			}
		},
		sourcemap: true
	}
});
