<!--
	Morph Slider, ported from React Bits (reactbits.dev).
	Image slider where slides melt into each other (WebGL). Drag, arrows, dots or ←/→ keys.
	The WebGL engine loads only in the browser; until then, or without WebGL, a plain image shows.
-->
<script lang="ts">
	import type { MorphEngine, MorphOptions } from '#lib/morph/morph-engine.js';

	type Slide = { src: string; alt: string; caption?: string };

	type Props = Partial<MorphOptions> & {
		slides: Slide[];
		class?: string;
	};

	let {
		slides,
		transition = 'melt',
		duration = 1.1,
		intensity = 0.55,
		scale = 2.4,
		aberration = 0.35,
		drift = 0, // > 0 adds an idle wobble, but then it redraws every frame while visible
		class: className = ''
	}: Props = $props();

	let stage: HTMLDivElement;
	let engine = $state<MorphEngine>();
	let index = $state(0);

	$effect(() => {
		let cancelled = false;
		let created: MorphEngine | undefined;
		let observer: IntersectionObserver | undefined;

		import('#lib/morph/morph-engine.js').then(({ MorphEngine }) => {
			if (cancelled) return;
			try {
				created = new MorphEngine(
					stage,
					slides.map((s) => s.src),
					{ transition, duration, intensity, scale, aberration, drift },
					(i) => (index = i),
					matchMedia('(prefers-reduced-motion: reduce)').matches,
					index
				);
			} catch {
				return; // no WebGL: keep the plain image
			}
			engine = created;
			observer = new IntersectionObserver(([entry]) => created?.setVisible(entry.isIntersecting));
			observer.observe(stage);
		});

		return () => {
			cancelled = true;
			observer?.disconnect();
			created?.destroy();
			engine = undefined;
		};
	});

	/** Without WebGL, step through the plain images instead. */
	function go(dir: 1 | -1) {
		if (engine) engine.go(dir);
		else index = (index + dir + slides.length) % slides.length;
	}

	function goTo(i: number) {
		if (engine) engine.goTo(i);
		else index = i;
	}

	// Drag to change slides (WebGL only).
	let startX = 0;
	let width = 1;
	let dragging = false;

	function onpointerdown(e: PointerEvent) {
		const rect = stage.getBoundingClientRect();
		width = rect.width || 1;
		startX = e.clientX;
		dragging = engine?.beginDrag((e.clientX - rect.left) / width, (e.clientY - rect.top) / rect.height) ?? false;
		if (dragging) stage.setPointerCapture(e.pointerId);
	}

	function onpointermove(e: PointerEvent) {
		if (dragging) engine?.drag((e.clientX - startX) / width);
	}

	function onpointerup() {
		if (!dragging) return;
		dragging = false;
		engine?.endDrag();
	}
</script>

<div class="relative aspect-video w-full touch-pan-y overflow-hidden rounded-xl border bg-card select-none {className}">
	<!-- Focusable so ←/→ work; arrow and dot buttons below cover mouse and screen-reader users. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={stage}
		class="absolute inset-0 cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing"
		role="group"
		aria-roledescription="carousel"
		aria-label="Project images"
		tabindex="0"
		{onpointerdown}
		{onpointermove}
		{onpointerup}
		onpointercancel={onpointerup}
		onkeydown={(e) => {
			if (e.key === 'ArrowRight') go(1);
			else if (e.key === 'ArrowLeft') go(-1);
		}}
	>
		{#if !engine}
			<img src={slides[index].src} alt={slides[index].alt} class="size-full object-cover" draggable="false" />
		{/if}
	</div>

	<!-- Caption -->
	{#if slides[index].caption}
		<p class="pointer-events-none absolute bottom-3 left-3 rounded-md bg-background/60 px-3 py-1 text-xs backdrop-blur-sm" aria-live="polite">
			{slides[index].caption}
		</p>
	{/if}

	{#if slides.length > 1}
		<!-- Arrows -->
		{#each [-1, 1] as const as dir}
			<button
				type="button"
				class="absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border bg-background/50 backdrop-blur-sm transition-colors hover:bg-background/80 {dir === -1
					? 'left-3'
					: 'right-3'}"
				aria-label={dir === -1 ? 'Previous image' : 'Next image'}
				onclick={() => go(dir)}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
					<path d={dir === -1 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
				</svg>
			</button>
		{/each}

		<!-- Dots -->
		<div class="absolute right-3 bottom-3 flex gap-1.5">
			{#each slides as _, i}
				<button
					type="button"
					class="h-1.5 rounded-full transition-all {i === index ? 'w-4 bg-foreground' : 'w-1.5 bg-foreground/40 hover:bg-foreground/70'}"
					aria-label="Show image {i + 1}"
					aria-current={i === index}
					onclick={() => goTo(i)}
				></button>
			{/each}
		</div>
	{/if}
</div>
