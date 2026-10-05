<!--
	Text that fades in from blurry to sharp, one word (or letter) at a time,
	the first time it scrolls into view.
-->
<script lang="ts">
	import { cn } from '#lib/utils.js';

	type Props = {
		text: string;
		/** Milliseconds between each word/letter starting. */
		delay?: number;
		animateBy?: 'words' | 'letters';
		direction?: 'top' | 'bottom';
		/** Phrases inside `text` to emphasise, e.g. ['Cybersecurity']. */
		highlights?: string[];
		class?: string;
	};

	let {
		text,
		delay = 200,
		animateBy = 'words',
		direction = 'top',
		highlights = [],
		class: className = ''
	}: Props = $props();

	let el: HTMLParagraphElement;
	let visible = $state(false);

	// Split the text into words/letters and mark the ones inside a highlighted phrase.
	const segments = $derived.by(() => {
		const parts = animateBy === 'words' ? text.split(' ') : [...text];
		const gap = animateBy === 'words' ? 1 : 0;

		const ranges = highlights
			.map((phrase) => [text.indexOf(phrase), text.indexOf(phrase) + phrase.length])
			.filter(([start]) => start !== -1);

		let offset = 0;
		return parts.map((part) => {
			const start = offset;
			offset += part.length + gap;
			return {
				text: part,
				highlight: ranges.some(([from, to]) => start >= from && start < to)
			};
		});
	});

	// Start the animation once the text is on screen, then stop watching.
	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				visible = true;
				observer.disconnect();
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<p
	bind:this={el}
	class={cn('flex flex-wrap', className)}
	class:visible
	style:--from-y={direction === 'top' ? '-50px' : '50px'}
	aria-label={text}
>
	{#each segments as segment, i}
		<span
			class="segment"
			class:highlight={segment.highlight}
			style:animation-delay="{i * delay}ms"
			aria-hidden="true"
		>
			{segment.text === ' ' ? ' ' : segment.text}{#if animateBy === 'words' && i < segments.length - 1}&nbsp;{/if}
		</span>
	{/each}
</p>

<style>
	.segment {
		display: inline-block;
		opacity: 0;
	}

	.visible .segment {
		animation: blur-in 0.7s both;
	}

	.highlight {
		color: var(--foreground);
		font-weight: 700;
	}

	@keyframes blur-in {
		from {
			opacity: 0;
			filter: blur(10px);
			transform: translateY(var(--from-y));
		}
		50% {
			opacity: 0.5;
			filter: blur(5px);
			transform: translateY(calc(var(--from-y) * -0.1));
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.segment {
			opacity: 1;
		}
		.visible .segment {
			animation: none;
		}
	}
</style>
