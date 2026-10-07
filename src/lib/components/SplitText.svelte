<!--
	Split Text, ported from React Bits (reactbits.dev).
	Splits the text into letters (or words) with GSAP and lets them rise in one
	after another, the first time it scrolls into view.
-->
<script lang="ts">
	import { gsap } from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import { cn, splitHighlights } from '#lib/utils.js';

	gsap.registerPlugin(SplitText);

	type Props = {
		text: string;
		/** HTML tag to render, e.g. 'h1' for the page title. */
		as?: 'p' | 'h1' | 'h2' | 'span';
		/** Part of `text` wrapped in <span class="highlight"> so it can be styled. */
		highlight?: string;
		class?: string;
	};

	let {
		text,
		as = 'p',
		highlight,
		class: className = ''
	}: Props = $props();

	/** Seconds between each letter starting, and seconds each letter takes to rise in. */
	const STAGGER = 0.04;
	const DURATION = 1.25;

	let el: HTMLElement;
	let ready = $state(false); // hidden until split, so the full text never flashes first
	let done = $state(false); // letters have (mostly) landed; exposed as data-done for CSS

	const parts = $derived(splitHighlights(text, highlight ? [highlight] : []));

	$effect(() => {
		let split: SplitText | undefined;
		let tween: gsap.core.Tween | undefined;
		let observer: IntersectionObserver | undefined;
		let cancelled = false;

		// Wait for the font: splitting measures letters, and the fallback font has different widths.
		document.fonts.ready.then(() => {
			if (cancelled) return;
			ready = true;
			if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
				done = true;
				return;
			}

			// 'words, chars' keeps each word's letters together so a word never breaks across lines.
			split = SplitText.create(el, { type: 'words, chars' });
			const targets = split.chars;
			gsap.set(targets, { opacity: 0, y: 40 });

			observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				observer?.disconnect();
				tween = gsap.to(targets, {
					opacity: 1,
					y: 0,
					duration: DURATION,
					ease: 'power3.out',
					stagger: STAGGER,
					// Letters ease out, so they look settled well before the tween ends.
					onUpdate() {
						if (!done && this.progress() > 0.6) done = true;
					}
				});
			});
			observer.observe(el);
		});

		return () => {
			cancelled = true;
			observer?.disconnect();
			tween?.kill();
			split?.revert();
		};
	});
</script>

<svelte:element this={as} bind:this={el} class={cn(!ready && 'invisible', className)} data-done={done || undefined}
	>{#each parts as part}{#if part.highlight}<span class="highlight">{part.text}</span>{:else}{part.text}{/if}{/each}</svelte:element
>
