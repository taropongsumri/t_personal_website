// Script for the café barista chat. Visitors can only pick these questions.

/** Extra content shown under a reply, built from the data in experiences.ts. */
export type Attachment = 'experience' | 'openSource' | 'stack';

export type Question = {
	/** Chip text, also shown as the visitor's message. */
	ask: string;
	/** The barista's reply; each string is its own bubble. */
	reply: string[];
	attach?: Attachment;
};

export const barista = { name: 'Mocha', role: 'Barista at Taro’s café' };

export const greeting = [
	'Welcome in! ☕ Grab a seat, it’s raining out.',
	'I’m Mocha. I know everything about Taro, ask me anything on the menu below.'
];

export const questions: Question[] = [
	{
		ask: 'What has Taro worked on?',
		reply: ['Here’s his story so far, freshest first:'],
		attach: 'experience'
	},
	{
		ask: 'Any open source?',
		reply: ['A few things brewing on GitHub:'],
		attach: 'openSource'
	},
	{
		ask: 'What’s his tech stack?',
		reply: ['His daily blend:'],
		attach: 'stack'
	},
	{
		ask: 'What is he into right now?',
		reply: [
			'Low-level programming and cybersecurity, mostly in C and Rust.',
			'He still loves building for the web too. This café runs on Svelte!'
		]
	},
	{
		ask: 'How can I contact him?',
		reply: ['Drop him an email at halfdevc@gmail.com, he reads everything with his morning coffee.']
	}
];

export const farewell = 'That’s the whole menu! Time for my coffee break, see you soon ☕';

/** How long Mocha's break lasts before the chat starts again. */
export const breakSeconds = 30;
