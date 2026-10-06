import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind class names; later classes win on conflicts.
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Split text into plain and highlighted parts, e.g. to bold some keywords.
export function splitHighlights(text: string, phrases: string[]) {
	if (!phrases.length) return [{ text, highlight: false }];
	const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	// A capture group keeps the matched phrases in the result, at the odd indexes.
	return text
		.split(new RegExp(`(${escaped.join('|')})`))
		.map((part, i) => ({ text: part, highlight: i % 2 === 1 }));
}
