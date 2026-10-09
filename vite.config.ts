import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	ssr: {
		// gsap ships ES-module .js files without "type": "module", which Node on Vercel
		// loads as CommonJS and crashes. Bundling it into the server build avoids that.
		noExternal: ['gsap', 'ogl']
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter(),

			prerender: {
				// The hero's scroll hint links to #about, which isn't built yet. Warn instead of
				// failing the build. TODO: switch back to the default ('fail') once it exists.
				handleMissingId: 'warn'
			}
		})
	]
});
