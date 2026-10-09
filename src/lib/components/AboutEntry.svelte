<!--
	One education or experience row: logo, name (+ website link), role and dates.
	If it has details (points, tags, images), clicking the row opens/closes them.
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	import HighlightText from '#lib/components/HighlightText.svelte';
	import MorphSlider from '#lib/components/MorphSlider.svelte';
	import type { Entry } from '#lib/data/about.js';

	let { entry }: { entry: Entry } = $props();

	const { org, role, period, logo, url, points = [], tags = [], images = [] } = $derived(entry);
	const hasDetails = $derived(points.length > 0 || tags.length > 0 || images.length > 0);

	// Only the starting state comes from the config; after that the visitor controls it.
	let open = $state(untrack(() => entry.open) ?? false);
	const detailsId = $props.id();

	// Placeholder when there's no logo: first character of the first two words ("42 Bangkok" → "4B").
	const initials = $derived(
		org
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => word[0])
			.join('')
			.toUpperCase()
	);
</script>

<!-- Header row. The toggle button sits behind the whole row (so hovering highlights it); the text ignores the mouse and the website link sits on top. -->
<div class="relative isolate flex items-center gap-4">
	{#if hasDetails}
		<button
			type="button"
			class="absolute -inset-2 -z-10 cursor-pointer rounded-lg transition-colors outline-none hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring"
			aria-expanded={open}
			aria-controls={detailsId}
			aria-label="{open ? 'Hide' : 'Show'} details for {org}"
			onclick={() => (open = !open)}
		></button>
	{/if}

	<!-- Logo, or the organisation's initials as a placeholder -->
	<div class="pointer-events-none grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-card text-xs font-bold text-muted-foreground">
		{#if logo}
			<img src={logo} alt="" class="size-full object-cover" />
		{:else}
			{initials}
		{/if}
	</div>

	<!-- Text is 20% smaller than body text (0.8rem) to make room for the logo -->
	<div class="pointer-events-none flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
		<div class="min-w-0">
			<p class="flex items-center gap-1.5 text-[0.8rem] font-bold">
				{org}
				{#if url}
					<a
						href={url}
						target="_blank"
						rel="noreferrer"
						class="pointer-events-auto relative grid size-5 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-highlight"
						aria-label="Visit {org} website"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3" aria-hidden="true">
							<path d="M7 17 17 7M7 7h10v10" />
						</svg>
					</a>
				{/if}
			</p>
			<p class="text-[0.8rem] text-muted-foreground">{role}</p>
		</div>
		<p class="flex shrink-0 items-center gap-2 text-[0.7rem] text-muted-foreground tabular-nums">
			{period}
			{#if hasDetails}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-3.5 transition-transform duration-300"
					class:rotate-180={open}
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			{/if}
		</p>
	</div>
</div>

{#if open}
	<div id={detailsId} class="flex flex-col gap-4 pt-4 pl-14" transition:slide={{ duration: 300 }}>
		{#if points.length}
			<ul class="flex list-disc flex-col gap-2 pl-4 text-[0.8rem] leading-relaxed text-muted-foreground marker:text-muted-foreground/60">
				{#each points as { text, bold = [] }}
					<li><HighlightText {text} highlights={bold} variant="bold" /></li>
				{/each}
			</ul>
		{/if}

		{#if tags.length}
			<ul class="flex flex-wrap gap-2" aria-label="Topics">
				{#each tags as tag}
					{@const orange = typeof tag !== 'string'}
					<li
						class="rounded-full border px-3 py-1 text-[0.7rem] {orange
							? 'border-highlight/40 bg-highlight/10 text-highlight'
							: 'text-muted-foreground'}"
					>
						{typeof tag === 'string' ? tag : tag.label}
					</li>
				{/each}
			</ul>
		{/if}

		{#if images.length}
			<MorphSlider slides={images} />
		{/if}
	</div>
{/if}
