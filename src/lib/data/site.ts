// Personal info used across the whole site. Change it here and every page updates.

import { c, facebook, github, linux, python, rust, svelte, tailwind, typescript } from '#lib/icons.js';

export const site = {
	/** Short name used in page titles and the logo's alt text. */
	title: 'txropks',
	name: 'Pongkaseam (Taro)',
	role: 'Software Engineer · 42',
	email: 'halfdevc@gmail.com',

	/** Shown as buttons in the hero and as links in the nav's Contact card. */
	socials: [
		{ label: 'GitHub', href: 'https://github.com/taropongsumri', icon: github },
		{ label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593483204421', icon: facebook }
	],

	/** Tech logos under the hero text. Icons come from src/lib/icons.ts. */
	stack: [
		{ title: 'C', icon: c },
		{ title: 'Python', icon: python },
		{ title: 'Rust', icon: rust },
		{ title: 'Linux', icon: linux },
		{ title: 'Svelte', icon: svelte },
		{ title: 'Tailwind CSS', icon: tailwind },
		{ title: 'TypeScript', icon: typescript }
	]
};
