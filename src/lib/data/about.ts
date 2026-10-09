// Education and experience shown on the About me page. Newest first.
// See about.example.ts for every option, with examples.

export type Entry = {
	org: string;
	role: string;
	period: string;
	/** Logo in static/logos, e.g. '/logos/csru.png'. Without one, the initials show. */
	logo?: string;
	/** Website, shown as a small ↗ button after the name. */
	url?: string;
	/** Start with the details open. */
	open?: boolean;
	/** Bullet points; phrases in `bold` are shown bold (they must match the text exactly). */
	points?: { text: string; bold?: string[] }[];
	/** Pills under the points. A plain string is grey; { label, orange: true } is orange. */
	tags?: (string | { label: string; orange: true })[];
	/** Images for the Morph Slider, e.g. '/projects/my-project/1.webp'. */
	images?: { src: string; alt: string; caption?: string }[];
};

/** One intro paragraph at the top of the About page. */
export type Paragraph = {
	text: string;
	/** Phrases inside `text` coloured orange; they must match exactly. */
	highlights: string[];
};

// Intro paragraphs at the top of the About page.
export const paragraphs: Paragraph[] = [
	{
		text: "Hey, I'm Taro. I'm a Fist-Year Computer Science student, full-stack developer, and builder interested in solving problems with software and technology.",
		highlights: ['Fist-Year Computer Science student', 'full-stack developer', 'builder']
	},
	{
		text: 'I spend most of my time learning across software, applications, websites, and education. I like building practical systems, working with teams, and taking ideas from an early concept to something real.',
		highlights: ['software, applications, websites, and education', 'from an early concept to something real']
	},
	{
		text: "Right now, I'm exploring full-stack development, low-level programming, cybersecurity, and AI while balancing Running Start at 42 Bangkok, leadership, and a growing list of side projects.",
		highlights: ['full-stack development, low-level programming, cybersecurity, and AI', 'Running Start at 42 Bangkok']
	},
	{
		text: "I'm curious by default, care a lot about execution, and like building things that have a purpose beyond just being another project.",
		highlights: ['curious by default', 'care a lot about execution']
	}
];

/** Placeholder slides until real project pictures exist. */
const placeholderImages = [1, 2, 3].map((n) => ({
	src: `/projects/placeholder/${n}.svg`,
	alt: `Placeholder image ${n}`,
	caption: `Placeholder ${n}`
}));

export const education: Entry[] = [
	{
		org: 'Ramkhamhaeng University',
		role: 'Computer Science Student',
		period: 'Oct 2026 – Now',
		logo: '/logos/csru.png',
		url: 'https://www.ru.ac.th',
		open: true,
		// TODO: placeholder text
		points: [
			{
				text: 'Studying computer science fundamentals: programming, data structures, algorithms, and mathematics.',
				bold: ['computer science fundamentals']
			},
			{
				text: 'Relevant coursework: Data Structures, Discrete Mathematics, and Computer Architecture.',
				bold: ['Data Structures, Discrete Mathematics, and Computer Architecture']
			}
		],
		tags: ['Computer Science', 'Data Structures', { label: 'Mathematics', orange: true }]
	},
	{
		org: '42 Bangkok',
		role: 'Cadet & Focus on Cybersecurity & Software Engineering',
		period: 'May 2026 – Now',
		logo: '/logos/42bkk_blackbg.jpg',
		url: 'https://42bangkok.com',
		// TODO: placeholder text
		points: [
			{
				text: 'Peer-to-peer, project-based learning with no teachers or lectures, focused on C and Unix.',
				bold: ['Peer-to-peer, project-based learning', 'C and Unix']
			}
		],
		tags: [{ label: 'Cybersecurity', orange: true }, 'C', 'Unix', 'Software Engineering']
	}
];

// TODO: copied from education for now, replace with real experience.
export const experience: Entry[] = [
	{
		...education[0],
		open: false,
		points: [
			{
				text: 'Built a remote sensing pipeline in Google Earth Engine to map land use from satellite imagery.',
				bold: ['remote sensing pipeline', 'Google Earth Engine']
			},
			{
				text: 'Trained AI / ML models to classify the imagery and planned the software architecture behind it.',
				bold: ['AI / ML models', 'software architecture']
			}
		],
		tags: [
			{ label: 'Remote Sensing', orange: true },
			{ label: 'GIS', orange: true },
			'Google Earth Engine',
			'AI / ML',
			'Software Architecture'
		],
		images: placeholderImages
	},
	{
		...education[1],
		open: false,
		points: [
			{
				text: 'Planned the software architecture for a team project and reviewed peers’ code.',
				bold: ['software architecture']
			}
		],
		tags: ['Software Architecture', { label: 'Cybersecurity', orange: true }],
		images: placeholderImages
	}
];
