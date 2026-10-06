<!--
	Cozy café stickers floating down the left and right of every page.
	Only on big screens: phones and tablets don't have the empty space.
-->
<script lang="ts">
	type Sticker = {
		/** File in static/assets. */
		src: string;
		/** Position, size, tilt and which screen size it appears from. */
		class: string;
	};

	// Positions are % of the whole page height, so the stickers spread down any page.
	// Each side has two lanes that zig-zag:
	//   outer lane (2% from the edge) at 4% / 30% / 56% / 82%
	//   inner lane (9% from the edge) at 17% / 43% / 69%
	// lg (1024px+): first outer only · xl (1280px+): whole outer lane · 2xl (1536px+): + inner lane.
	// Sizes: small 3.6rem · medium 4.5rem · large 5.4rem.
	// Not used yet: image_2 (raisin toast), image_4 (bread), image_6 (pumpkin), image_8 (gingham jam), image_11 (roll tray).
	const stickers: Sticker[] = [
		// left, outer
		{ src: 'image_12.png', class: 'top-[4%] left-[2%] w-[3.6rem] -rotate-6 lg:block xl:w-[4.5rem]' }, // hot chocolate
		{ src: 'image_0.png', class: 'top-[30%] left-[2%] w-[4.5rem] -rotate-12 xl:block' }, // cinnamon roll
		{ src: 'image_9.png', class: 'top-[56%] left-[2%] w-[4.5rem] rotate-6 xl:block' }, // pretzel
		{ src: 'image_10.png', class: 'top-[82%] left-[2%] w-[4.5rem] -rotate-6 xl:block' }, // jam toast
		// left, inner
		{ src: 'image_13.png', class: 'top-[17%] left-[9%] w-[3.6rem] rotate-12 2xl:block' }, // maple leaf
		{ src: 'image_3.png', class: 'top-[43%] left-[9%] w-[3.6rem] rotate-6 2xl:block' }, // strawberry jam
		{ src: 'image_7.png', class: 'top-[69%] left-[9%] w-[4.5rem] -rotate-12 2xl:block' }, // pain au chocolat
		// right, outer
		{ src: 'image_18.png', class: 'top-[4%] right-[2%] w-[3.6rem] rotate-6 lg:block xl:w-[4.5rem]' }, // pumpkin spice latte
		{ src: 'image_16.png', class: 'top-[30%] right-[2%] w-[3.6rem] -rotate-6 xl:block' }, // coffee to go
		{ src: 'image_17.png', class: 'top-[56%] right-[2%] w-[4.5rem] rotate-12 xl:block' }, // cookie
		{ src: 'image_5.png', class: 'top-[82%] right-[2%] w-[4.5rem] -rotate-6 xl:block' }, // lattice pie
		// right, inner
		{ src: 'image_1.png', class: 'top-[17%] right-[9%] w-[4.5rem] rotate-6 2xl:block' }, // cake
		{ src: 'image_14.png', class: 'top-[43%] right-[9%] w-[3.6rem] -rotate-3 2xl:block' }, // cozy vibes candle
		{ src: 'image_15.png', class: 'top-[69%] right-[9%] w-[5.4rem] rotate-3 2xl:block' } // campfire
	];
</script>

<div aria-hidden="true">
	{#each stickers as { src, class: className }, i}
		<img
			src="/assets/{src}"
			alt=""
			draggable="false"
			class="sticker absolute z-10 hidden transition-[scale] duration-300 hover:scale-110 {className}"
			style:--delay="{i * -0.8}s"
		/>
	{/each}
</div>

<style>
	.sticker {
		filter: drop-shadow(0 6px 8px rgb(0 0 0 / 0.25));
		animation: float 6s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	/* Gentle bobbing. Uses `translate` so it doesn't override the rotate-* tilt. */
	@keyframes float {
		50% {
			translate: 0 -8px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sticker {
			animation: none;
		}
	}
</style>
