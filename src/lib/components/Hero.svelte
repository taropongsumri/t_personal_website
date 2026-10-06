<script lang="ts">
	import Button from '#lib/components/Button.svelte';
	import FadeIn from '#lib/components/FadeIn.svelte';
	import PixelTransition from '#lib/components/PixelTransition.svelte';
	import SplitText from '#lib/components/SplitText.svelte';
	import { c, facebook, github, linux, python, rust, svelte, tailwind, typescript } from '#lib/icons.js';
	import { splitHighlights } from '#lib/utils.js';

	const name = 'Pongkaseam (Taro)';
	const role = 'Software Engineer · 42';
	const status = 'Studying at 42 Bangkok';
	const intro = [
		"I'm currently studying at 42 Bangkok, focusing on Low-level programming and Cybersecurity.",
		'Passionate about building web applications and solving complex technical challenges.'
	];
	const highlights = ['Low-level programming', 'Cybersecurity'];
	const socials = [
		{ label: 'GitHub', href: 'https://github.com/taropongsumri', icon: github },
		{ label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593483204421', icon: facebook }
	];
	const stack = [
		{ title: 'C', icon: c },
		{ title: 'Python', icon: python },
		{ title: 'Rust', icon: rust },
		{ title: 'Linux', icon: linux },
		{ title: 'Svelte', icon: svelte },
		{ title: 'Tailwind CSS', icon: tailwind },
		{ title: 'TypeScript', icon: typescript }
	];
</script>

<section
	id="home"
	class="relative isolate mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center gap-14 px-6 py-28 sm:px-10 md:flex-row md:gap-16"
>
	<div class="flex w-full flex-col gap-6 md:flex-1">
		<FadeIn>
			<p class="inline-flex w-fit items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground sm:text-sm">
				<span class="relative flex size-2">
					<span class="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping"></span>
					<span class="relative inline-flex size-2 rounded-full bg-emerald-600"></span>
				</span>
				{status}
			</p>
		</FadeIn>

		<SplitText as="h1" text="Hi, I'm {name}" class="text-3xl font-bold tracking-tight sm:text-4xl" />

		{#each intro as line, i}
			<FadeIn delay={300 + i * 150}>
				<p class="leading-relaxed text-muted-foreground sm:text-lg">
					{#each splitHighlights(line, highlights) as part}{#if part.highlight}<strong class="text-foreground">{part.text}</strong>{:else}{part.text}{/if}{/each}
				</p>
			</FadeIn>
		{/each}

		<FadeIn delay={600} class="flex flex-wrap items-center gap-3">
			<Button href="/projects" size="lg">
				View Projects
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="transition-transform duration-200 group-hover/button:translate-x-1"
				>
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</Button>

			{#each socials as { label, href, icon }}
				<Button {href} size="lg" variant="outline" target="_blank" rel="noreferrer">
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon} /></svg>
					{label}
				</Button>
			{/each}
		</FadeIn>

		<!-- Tech stack -->
		<FadeIn delay={750}>
			<ul class="flex flex-wrap items-center gap-8 border-t pt-6 text-foreground/70" aria-label="Tech stack">
				{#each stack as { title, icon }}
					<li {title} class="transition-transform duration-200 hover:scale-110">
						<svg viewBox="0 0 24 24" fill="currentColor" class="size-8" aria-hidden="true"><path d={icon} /></svg>
						<span class="sr-only">{title}</span>
					</li>
				{/each}
			</ul>
		</FadeIn>
	</div>

	<!-- Photo: warm glow + tilted "polaroid" behind it -->
	<div class="relative w-full max-w-xs shrink-0 sm:max-w-sm md:w-80 lg:w-96">
		<div class="glow pointer-events-none absolute -inset-16 -z-10" aria-hidden="true"></div>
		<div
			class="absolute inset-0 -z-10 translate-x-3 translate-y-2 rotate-6 rounded-2xl border bg-card shadow-sm"
			aria-hidden="true"
		></div>

		<PixelTransition
			class="-rotate-2 rounded-2xl border shadow-lg transition-transform duration-300 hover:rotate-0"
			aspectRatio="4 / 5"
			gridSize={12}
			pixelColor="var(--foreground)"
			duration={0.4}
		>
			{#snippet first()}
				<img src="/txrokps_main.jpg" alt={name} class="size-full object-cover" />
			{/snippet}

			{#snippet second()}
				<div class="flex size-full flex-col items-center justify-center gap-2 bg-foreground p-6 text-center text-background">
					<span class="text-xl font-bold">{name}</span>
					<span class="text-sm">{role}</span>
				</div>
			{/snippet}
		</PixelTransition>
	</div>

	<!-- Scroll hint -->
	<a
		href="#about"
		class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground md:flex"
	>
		scroll
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="size-4 motion-safe:animate-bounce"
		>
			<path d="M12 5v14M5 12l7 7 7-7" />
		</svg>
	</a>
</section>

<style>
	/* Soft lamp-like light behind the photo. */
	.glow {
		background: radial-gradient(
			closest-side,
			color-mix(in oklch, var(--muted-foreground) 35%, transparent),
			transparent
		);
	}
</style>
