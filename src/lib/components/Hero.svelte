<script lang="ts">
	import BlurText from '#lib/components/BlurText.svelte';
	import Button from '#lib/components/Button.svelte';
	import PixelTransition from '#lib/components/PixelTransition.svelte';
	import { facebook, github } from '#lib/icons.js';

	const name = 'Pongkaseam (Taro)';
	const role = 'Software Engineer · 42';
	const intro = [
		"I'm currently studying at 42 Bangkok, focusing on Low-level programming and Cybersecurity.",
		'Passionate about building web applications and solving complex technical challenges.'
	];
	const highlights = ['Low-level programming', 'Cybersecurity'];
	const socials = [
		{ label: 'GitHub', href: 'https://github.com/ChocodevX', icon: github },
		{ label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593483204421', icon: facebook }
	];
</script>

<section
	id="home"
	class="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-24 sm:px-10 md:flex-row md:gap-16"
>
	<div class="flex w-full flex-col gap-6 md:flex-1">
		<BlurText
			text="Hi, I'm {name}"
			delay={120}
			class="text-3xl font-bold tracking-tight sm:text-4xl"
		/>
		{#each intro as line}
			<BlurText
				text={line}
				delay={30}
				{highlights}
				class="leading-relaxed text-muted-foreground sm:text-lg"
			/>
		{/each}

		<div class="flex flex-wrap items-center gap-3">
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
		</div>
	</div>

	<div class="w-full max-w-xs shrink-0 sm:max-w-sm md:w-80 lg:w-96">
		<PixelTransition
			class="rounded-2xl border shadow-sm"
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
</section>
