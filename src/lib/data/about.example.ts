// ─────────────────────────────────────────────────────────────────────────────
//  HOW TO WRITE ENTRIES FOR about.ts (intro paragraphs, education, experience)
//
//  This file is a reference only. Nothing imports it, so it never shows on the
//  site. Copy an example into `education` or `experience` in about.ts and edit it.
//
//  It uses the real `Entry` type, so `bun run check` fails if an example here
//  ever stops matching the real format.
// ─────────────────────────────────────────────────────────────────────────────

import type { Entry, Paragraph } from './about.js';

// ── 0. Intro paragraphs (`paragraphs` in about.ts) ──────────────────────────
// Shown at the top of the About page. `highlights` lists phrases inside `text`
// to colour orange; like bold phrases below, they must match the text EXACTLY.

export const paragraphExample: Paragraph = {
	text: "Hey, I'm Taro. I'm a first-year Computer Science student.",
	highlights: ['first-year Computer Science student']
};

// ── 1. The smallest entry ────────────────────────────────────────────────────
// Only org, role and period are required. With nothing else, the row has no
// dropdown (no chevron, not clickable) and the logo box shows the initials.

export const minimal: Entry = {
	org: 'Example University', // bold name on the first line
	role: 'Computer Science Student', // grey line under the name
	period: 'Aug 2024 – May 2028' // right side; use an en dash (–) for ranges, "Now" for ongoing
};

// ── 2. Every option ──────────────────────────────────────────────────────────

export const full: Entry = {
	org: 'Example Lab',
	role: 'Research Intern',
	period: 'Jun 2026 – Now',

	// Logo: a file in static/logos/, written from the site root ('/logos/…').
	// Shown at 40×40px. Best: square PNG/SVG/WebP, 128×128px, transparent background.
	// Leave it out and the box shows the first two capital letters of `org` ("EL").
	logo: '/logos/example-lab.png',

	// Website: adds a small ↗ button after the name. Opens in a new tab.
	url: 'https://example.com',

	// Start with the dropdown open. Default is closed. Any number can start open.
	open: true,

	// Bullet points inside the dropdown.
	// `bold` lists phrases inside `text` to show in bold ivory.
	// Each phrase must match the text EXACTLY (same capital letters, spaces and
	// punctuation), otherwise it simply isn't bold. `bold` is optional.
	points: [
		{
			text: 'Built a land-use map from satellite imagery with Google Earth Engine.',
			bold: ['land-use map', 'Google Earth Engine']
		},
		{
			text: 'A point without any bold words is fine too.'
		}
	],

	// Tags: pills under the points.
	//   'GIS'                          → grey pill
	//   { label: 'GIS', orange: true } → orange pill (use for the 1–2 most important)
	tags: ['Remote Sensing', { label: 'GIS', orange: true }, 'Python'],

	// Images: turns on the Morph Slider at the bottom of the dropdown.
	// Put files in static/projects/<project-name>/ and write the path from the site root.
	// Best: WebP or JPG, 1200×675 (16:9), under 150 KB each. Other shapes get cropped to 16:9.
	// `alt` describes the picture for screen readers (required).
	// `caption` is optional text shown in the bottom-left corner of the slide.
	images: [
		{ src: '/projects/example/1.webp', alt: 'Land-use map of Bangkok', caption: 'Final map' },
		{ src: '/projects/example/2.webp', alt: 'Training data in Google Earth Engine' }
	]
};

// ── 3. Typical education entry (text + tags, no slider) ──────────────────────

export const educationExample: Entry = {
	org: 'Ramkhamhaeng University',
	role: 'Computer Science Student',
	period: 'Oct 2026 – Now',
	logo: '/logos/csru.png',
	url: 'https://www.ru.ac.th',
	points: [
		{
			text: 'Relevant coursework: Data Structures, Discrete Mathematics, and Computer Architecture.',
			bold: ['Data Structures, Discrete Mathematics, and Computer Architecture']
		}
	],
	tags: ['Computer Science', { label: 'Data Structures', orange: true }]
};

// ── 4. Typical experience entry (text + tags + slider) ───────────────────────

export const experienceExample: Entry = {
	org: 'Example Company',
	role: 'Software Engineering Intern',
	period: 'Jan 2026 – Mar 2026',
	url: 'https://example.com',
	points: [
		{
			text: 'Planned the software architecture for an internal tool used by 3 teams.',
			bold: ['software architecture']
		}
	],
	tags: [{ label: 'Software Architecture', orange: true }, 'TypeScript', 'Svelte'],
	images: [
		{ src: '/projects/example/1.webp', alt: 'Dashboard of the internal tool' },
		{ src: '/projects/example/2.webp', alt: 'Architecture diagram' }
	]
};

// ── Tips ─────────────────────────────────────────────────────────────────────
//  • Order: newest first. The list shows in the same order as the array.
//  • Every entry in a list must be separated by a comma.
//  • Text with an apostrophe (I'm, don't): wrap it in "double quotes" or use ’.
//  • After editing, run `bun run check` to catch typos in option names.
