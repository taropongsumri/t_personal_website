export type NavLink = { label: string; href: string };

export type NavCard = {
	label: string;
	/** Tailwind classes for the card's background and text colour. */
	class: string;
	links: NavLink[];
};

// Cards go from light to dark kraft, left to right.
export const navCards: NavCard[] = [
	{
		label: 'About',
		class: 'bg-secondary text-secondary-foreground',
		links: [
			{ label: 'Home', href: '/#home' },
			{ label: 'About me', href: '/#about' }
		]
	},
	{
		label: 'Projects',
		class: 'bg-muted-foreground text-background',
		links: [{ label: 'All projects', href: '/projects' }]
	},
	{
		label: 'Contact',
		class: 'bg-foreground text-background',
		links: [
			{ label: 'GitHub', href: 'https://github.com/ChocodevX' },
			{ label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593483204421' }
		]
	}
];
