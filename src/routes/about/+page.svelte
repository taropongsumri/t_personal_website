<script lang="ts">
	import AboutEntry from '#lib/components/AboutEntry.svelte';
	import FadeIn from '#lib/components/FadeIn.svelte';
	import HighlightText from '#lib/components/HighlightText.svelte';
	import SplitText from '#lib/components/SplitText.svelte';
	import { education, experience, paragraphs } from '#lib/data/about.js';
	import { site } from '#lib/data/site.js';

	const sections = [
		{ id: 'education', title: 'Education', entries: education },
		{ id: 'experience', title: 'Experience', entries: experience }
	];
</script>

<svelte:head>
	<title>About me · {site.title}</title>
</svelte:head>

<main class="mx-auto w-full max-w-2xl flex-1 px-6 pt-36 pb-24 sm:px-10 md:pt-44">
	<SplitText as="h1" text="About me" class="hand-underline text-3xl font-bold tracking-tight sm:text-4xl" />

	<div class="mt-10 flex flex-col gap-6">
		{#each paragraphs as { text, highlights }, i}
			<FadeIn delay={300 + i * 150}>
				<p class="leading-relaxed text-muted-foreground sm:text-lg">
					<HighlightText {text} {highlights} />
				</p>
			</FadeIn>
		{/each}
	</div>

	{#each sections as { id, title, entries }}
		<section class="mt-20" aria-labelledby={id}>
			<FadeIn>
				<h2 {id} class="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
			</FadeIn>

			<ul class="mt-8 flex flex-col">
				{#each entries as entry, i}
					<li class="border-t py-4 first:border-t-0 first:pt-0">
						<FadeIn delay={i * 80}>
							<AboutEntry {entry} />
						</FadeIn>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</main>
