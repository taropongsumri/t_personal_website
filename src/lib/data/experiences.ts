export type Experience = {
	/** Used in the URL later: /project/<slug>. */
	slug: string;
	period: string;
	role: string;
	org: string;
	description: string;
	stack?: string[];
};

export type OpenSource = {
	period: string;
	/** Shown as the title, e.g. "owner/repo". */
	name: string;
	description: string;
	/** Link to the repository. */
	repo: string;
	languages?: string[];
};

// Newest first.
export const experiences: Experience[] = [
	{
		slug: '42',
		period: '2025 — now',
		role: 'Student',
		org: '42 Bangkok',
		description:
			'Finished the 26-day C & Shell Piscine and two Discovery Piscines (Web and Python). Learning through peer-to-peer, project-based evaluation with no lectures.',
		stack: ['C', 'Shell', 'Python', 'Git']
	},
	{
		slug: 'halfcityss2',
		period: '2024 — 2025',
		role: 'FiveM Server Developer',
		org: 'HalfCity Roleplay SS2',
		description:
			'Built and maintained the server scripts for a roleplay community, shipping new features from player feedback.',
		stack: ['Lua', 'JavaScript', 'MySQL']
	},
	{
		slug: 'halfcityss1',
		period: '2023 — 2024',
		role: 'FiveM Server Developer',
		org: 'HalfCity Roleplay SS1',
		description: 'First season of HalfCity: server scripts, gameplay balancing and community-requested features.',
		stack: ['Lua', 'MySQL']
	},
	{
		slug: 'resource',
		period: '2022 — 2023',
		role: 'Developer',
		org: 'C2 Resource',
		description:
			'A FiveM resource studio: reusable inventory and HUD scripts, with React interfaces talking to Lua game logic.',
		stack: ['Lua', 'React', 'MySQL']
	}
];

// TODO: mock data — replace with your real repos.
export const openSource: OpenSource[] = [
	{
		period: '2025',
		name: 'ChocodevX/libft',
		description: 'My own C standard library, rebuilt from scratch at 42.',
		repo: 'https://github.com/ChocodevX',
		languages: ['C']
	},
	{
		period: '2025',
		name: 'ChocodevX/c2-portfolio',
		description: 'This website: SvelteKit, Tailwind and a little too much coffee.',
		repo: 'https://github.com/ChocodevX/c2-portfolio',
		languages: ['Svelte', 'TypeScript']
	}
];
