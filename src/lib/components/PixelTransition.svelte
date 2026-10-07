<!--
	A card that swaps `first` for `second` behind a random pixel dissolve.
	Mouse: hover to swap. Touch: tap to toggle. Keyboard: focus to swap.
-->
<script lang="ts">
	import { gsap } from 'gsap';
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	type Props = {
		first: Snippet;
		second: Snippet;
		/** Pixels per row/column. */
		gridSize?: number;
		pixelColor?: string;
		/** Seconds for the pixels to cover the card (and again to clear it). */
		duration?: number;
		/** CSS aspect-ratio, e.g. "4 / 5". */
		aspectRatio?: string;
		class?: string;
	};

	let {
		first,
		second,
		gridSize = 7,
		pixelColor = 'currentColor',
		duration = 0.3,
		aspectRatio = '1 / 1',
		class: className = ''
	}: Props = $props();

	let grid: HTMLDivElement;
	let active = $state(false); // the state the user asked for
	let showSecond = $state(false); // flips halfway, once pixels cover the card
	let swap: gsap.core.Tween | undefined;

	const pixelSize = $derived(100 / gridSize);
	const pixels = $derived(
		Array.from({ length: gridSize * gridSize }, (_, i) => ({
			top: Math.floor(i / gridSize) * pixelSize,
			left: (i % gridSize) * pixelSize
		}))
	);

	// Pixels pop in randomly, the content swaps underneath, then pixels pop out randomly.
	function animate(next: boolean) {
		active = next;

		const cells = grid.children;
		gsap.killTweensOf(cells);
		swap?.kill();

		const stagger = { each: duration / cells.length, from: 'random' as const };
		gsap.set(cells, { display: 'none' });
		gsap.to(cells, { display: 'block', duration: 0, stagger });
		swap = gsap.delayedCall(duration, () => (showSecond = next));
		gsap.to(cells, { display: 'none', duration: 0, delay: duration, stagger });
	}

	const reveal = () => !active && animate(true);
	const hide = () => active && animate(false);
	const toggle = () => (active ? hide() : reveal());
</script>

<div
	class={cn('relative w-full overflow-hidden', className)}
	style:aspect-ratio={aspectRatio}
	role="button"
	tabindex="0"
	aria-pressed={active}
	onpointerenter={(e) => e.pointerType === 'mouse' && reveal()}
	onpointerleave={(e) => e.pointerType === 'mouse' && hide()}
	onpointerup={(e) => e.pointerType !== 'mouse' && toggle()}
	onfocus={(e) => e.currentTarget.matches(':focus-visible') && reveal()}
	onblur={hide}
>
	<div class="absolute inset-0" aria-hidden={showSecond}>
		{@render first()}
	</div>

	<div class="pointer-events-none absolute inset-0 z-10" class:hidden={!showSecond} aria-hidden={!showSecond}>
		{@render second()}
	</div>

	<div bind:this={grid} class="pointer-events-none absolute inset-0 z-20">
		{#each pixels as { top, left }}
			<div
				class="absolute hidden"
				style:top="{top}%"
				style:left="{left}%"
				style:width="{pixelSize}%"
				style:height="{pixelSize}%"
				style:background-color={pixelColor}
			></div>
		{/each}
	</div>
</div>
