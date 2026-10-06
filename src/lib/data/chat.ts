// Script for the café barista chat. Visitors can only pick these questions.
//
// Every reply has a few versions, and Mocha picks one at random each time,
// so the conversation feels different on every visit.

/** Extra content shown under a reply, built from the data in experiences.ts. */
export type Attachment = 'experience' | 'openSource' | 'stack';

/** One possible reply. Each string is its own chat bubble. */
export type Reply = string[];

export type Question = {
	/** Chip text, also shown as the visitor's message. */
	ask: string;
	/** Possible replies; one is picked at random. */
	replies: Reply[];
	attach?: Attachment;
};

export const barista = { name: 'Mocha', role: 'Barista at Taro’s café' };

export const greetings: Reply[] = [
	[
		'Welcome in! ☕ Grab a seat, it’s raining out.',
		'I’m Mocha. I know everything about Taro, ask me anything on the menu below.'
	],
	[
		'Oh hey, a new face! Shake off that rain and get comfy.',
		'I’m Mocha, Taro’s barista. Pick something from the menu and I’ll spill the beans.'
	],
	[
		'Afternoon! The jazz is on and the coffee’s fresh. 🎷',
		'I’m Mocha. Curious about Taro? Order a question below.'
	],
	[
		'Hi there! Perfect weather for a warm cup, huh?',
		'Name’s Mocha. Ask me about Taro, I’ve heard all his stories.'
	]
];

export const questions: Question[] = [
	{
		ask: 'What has Taro worked on?',
		replies: [
			['Here’s his story so far, freshest first:'],
			['Ooh, my favourite order. Here’s everything he’s brewed up:'],
			['Let me pull up his timeline, one sec…'],
			['From game servers to 42 Bangkok, here’s the full roast:']
		],
		attach: 'experience'
	},
	{
		ask: 'Any open source?',
		replies: [
			['A few things brewing on GitHub:'],
			['He shares his code, yes! Take a sip of these:'],
			['Here’s what he’s put out in the open:']
		],
		attach: 'openSource'
	},
	{
		ask: 'What’s his tech stack?',
		replies: [
			['His daily blend:'],
			['These are the beans he grinds every day:'],
			['Here’s his toolbox, strong and well-roasted:']
		],
		attach: 'stack'
	},
	{
		ask: 'What is he into right now?',
		replies: [
			[
				'Low-level programming and cybersecurity, mostly in C and Rust.',
				'He still loves building for the web too. This café runs on Svelte!'
			],
			[
				'Lately? Poking at memory, pointers and how systems break. 🔐',
				'Cybersecurity and low-level code, with C and Rust as his espresso.'
			],
			[
				'He’s been deep in C and Rust, learning how computers work under the hood.',
				'Security is his new obsession. Don’t worry, he only hacks his own stuff.'
			]
		]
	},
	{
		ask: 'How can I contact him?',
		replies: [
			['Drop him an email at halfdevc@gmail.com, he reads everything with his morning coffee.'],
			['Send a note to halfdevc@gmail.com! He usually replies before his cup gets cold.'],
			['Easiest way is email: halfdevc@gmail.com. Say Mocha sent you. 😉']
		]
	}
];

export const farewells: Reply[] = [
	['That’s the whole menu! Time for my coffee break, see you soon ☕'],
	['You’ve tried everything on the menu! I’m taking five, be right back.'],
	['Wow, you ordered it all! My paws need a rest. Back in a bit 🐾']
];

/** How long Mocha's break lasts before the chat starts again. */
export const breakSeconds = 30;

const lastPicked = new Map<Reply[], number>();

/** Pick a random reply, never the same one twice in a row. */
export function pick(replies: Reply[]): Reply {
	let index = Math.floor(Math.random() * replies.length);
	if (replies.length > 1 && index === lastPicked.get(replies)) index = (index + 1) % replies.length;
	lastPicked.set(replies, index);
	return replies[index];
}
