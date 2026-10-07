<script lang="ts">
	import FadeIn from '#lib/components/FadeIn.svelte';
	import HighlightText from '#lib/components/HighlightText.svelte';
	import SplitText from '#lib/components/SplitText.svelte';

	// TODO: placeholder text, rewrite with your own.
	// `highlights` lists phrases inside `text` to colour orange; they must match exactly.
	const paragraphs = [
		{
			text: "Hey, I'm Cleo. I'm a high school student, full-stack developer, and builder interested in turning ambitious ideas into things people can actually use.",
			highlights: ['high school student', 'full-stack developer', 'builder']
		},
		{
			text: 'I spend most of my time working across software, GIS, healthcare, and education. I like building practical systems, working with teams, and taking ideas from an early concept to something real.',
			highlights: ['software, GIS, healthcare, and education', 'from an early concept to something real']
		},
		{
			text: "Right now, I'm exploring full-stack development, remote sensing, computer vision, and AI while balancing Running Start at Bellevue College, leadership, and a growing list of side projects.",
			highlights: ['full-stack development, remote sensing, computer vision, and AI', 'Running Start at Bellevue College']
		},
		{
			text: "I'm curious by default, care a lot about execution, and like building things that have a purpose beyond just being another project.",
			highlights: ['curious by default', 'care a lot about execution']
		}
	];

	type Job = {
		org: string;
		role: string;
		period: string;
		/** Optional logo in static/logos, e.g. '/logos/csru.png'. Without one, the initials show. */
		logo?: string;
	};

	// TODO: placeholder experience, replace with your own. Newest first.
	const experience: Job[] = [
		{ org: 'MIT Beaver Works Summer Institute', role: 'Remote Sensing for Disaster Response', period: 'Mar 2026 – Aug 2026' },
		{ org: 'Traycer AI', role: 'AI Agent Beta Testing Intern', period: 'Jan 2026 – Mar 2026' },
		{ org: 'Rove Miles (Y Combinator W24)', role: 'Back-End Development Intern', period: 'Oct 2024 – Dec 2024' },
		{ org: 'Seattle Sports & Regenerative Medicine', role: 'Business Strategy Analyst', period: 'Oct 2024' },
		{ org: 'University of Michigan', role: 'Joy of Coding Summer Program', period: 'Jun 2024 – Aug 2024' },
		{ org: 'American Rocketry Challenge', role: 'Rocket Engineer', period: 'Sep 2023 – Mar 2025' },
		{ org: 'Christian Medical College Vellore', role: 'Operations Observer', period: 'Aug 2023' }
	];
</script>

<svelte:head>
	<title>About me · txropks</title>
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

	<section class="mt-20" aria-labelledby="experience">
		<FadeIn>
			<h2 id="experience" class="text-2xl font-bold tracking-tight sm:text-3xl">Experience</h2>
		</FadeIn>

		<ul class="mt-8 flex flex-col">
			{#each experience as { org, role, period, logo }, i}
				<li class="border-t py-4 first:border-t-0 first:pt-0">
					<FadeIn delay={i * 80} class="flex items-center gap-4">
						<!-- Logo, or the organisation's initials as a placeholder -->
						<div class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-card text-xs font-bold text-muted-foreground">
							{#if logo}
								<img src={logo} alt="" class="size-full object-cover" />
							{:else}
								{org.match(/\b[A-Z]/g)?.slice(0, 2).join('')}
							{/if}
						</div>

						<!-- Text is 20% smaller than body text (0.8rem) to make room for the logo -->
						<div class="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
							<div class="min-w-0">
								<p class="text-[0.8rem] font-bold">{org}</p>
								<p class="text-[0.8rem] text-muted-foreground">{role}</p>
							</div>
							<p class="shrink-0 text-[0.7rem] text-muted-foreground tabular-nums">{period}</p>
						</div>
					</FadeIn>
				</li>
			{/each}
		</ul>
	</section>
</main>
