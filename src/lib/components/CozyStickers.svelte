<!--
	Tiny café stickers sprinkled down the left and right edges of every page.
	They stay in narrow strips at the screen edges, far from the content,
	and only appear on wide screens where those strips are empty.
-->
<script lang="ts">
	/** Pictures in static/assets: image_0.png … image_18.png. */
	const IMAGE_COUNT = 19;
	/** Stickers per lane, spread evenly from the top to the bottom of the page. */
	const PER_LANE = 10;

	// Each side has an outer lane at the very edge and an inner lane a bit further in.
	// `offset` staggers lanes so stickers on the same side don't line up.
	const lanes = [
		{ side: 'left', inset: '1.5%', show: 'xl:block', offset: 0 },
		{ side: 'left', inset: '6%', show: '2xl:block', offset: 0.5 },
		{ side: 'right', inset: '1.5%', show: 'xl:block', offset: 0.25 },
		{ side: 'right', inset: '6%', show: '2xl:block', offset: 0.75 }
	] as const;

	/** Same "random" number for the same input, so server and browser render identical stickers. */
	const random = (n: number) => (Math.imul(n + 1, 2654435761) >>> 0) / 2 ** 32;

	const stickers = lanes.flatMap((lane, l) =>
		Array.from({ length: PER_LANE }, (_, i) => {
			const n = l * PER_LANE + i;
			return {
				src: `/assets/image_${(n * 7) % IMAGE_COUNT}.png`, // stepping by 7 keeps neighbours different
				side: lane.side,
				inset: lane.inset,
				show: lane.show,
				top: `${2 + ((i + lane.offset) / PER_LANE) * 94}%`,
				size: `${28 + Math.round(random(n) * 12)}px`, // 28–40px
				tilt: `${Math.round((random(n + 100) - 0.5) * 40)}deg`, // -20° to 20°
				delay: `${-random(n + 200) * 6}s`
			};
		})
	);
</script>

<div aria-hidden="true">
	{#each stickers as sticker}
		<img
			src={sticker.src}
			alt=""
			loading="lazy"
			draggable="false"
			class="sticker absolute z-10 hidden transition-[scale] duration-300 hover:scale-125 {sticker.show}"
			style:top={sticker.top}
			style:left={sticker.side === 'left' ? sticker.inset : undefined}
			style:right={sticker.side === 'right' ? sticker.inset : undefined}
			style:width={sticker.size}
			style:rotate={sticker.tilt}
			style:--delay={sticker.delay}
		/>
	{/each}
</div>

<style>
	.sticker {
		filter: drop-shadow(0 3px 4px rgb(0 0 0 / 0.25));
		animation: float 6s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	/* Gentle bobbing. Uses `translate` so it doesn't override the tilt. */
	@keyframes float {
		50% {
			translate: 0 -4px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sticker {
			animation: none;
		}
	}
</style>
