<!--
	Card Nav, ported from React Bits (reactbits.dev) to Svelte + our kraft theme.
	A slim bar that expands (GSAP) to reveal up to three link cards.
-->
<script lang="ts">
	import { gsap } from 'gsap';

	type NavCard = {
		label: string;
		/** Tailwind classes for the card's background and text colour. */
		class: string;
		links: { label: string; href: string }[];
	};

	// Cards go from light to dark kraft, left to right.
	const cards: NavCard[] = [
		{
			label: 'About',
			class: 'bg-secondary text-secondary-foreground',
			links: [
				{ label: 'Home', href: '/#home' },
				{ label: 'About me', href: '/#about' }
			]
		},
		{
			label: 'Projects',
			class: 'bg-muted-foreground text-background',
			links: [{ label: 'All projects', href: '/projects' }]
		},
		{
			label: 'Contact',
			class: 'bg-foreground text-background',
			links: [
				{ label: 'GitHub', href: 'https://github.com/ChocodevX' },
				{ label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593483204421' }
			]
		}
	];

	const cta = { label: 'Email me', href: 'mailto:halfdevc@gmail.com' };

	const BAR_HEIGHT = 60;
	const DESKTOP_HEIGHT = 260;
	const ease = 'power3.out';

	let nav: HTMLElement;
	let content: HTMLDivElement;
	let cardEls: HTMLDivElement[] = [];
	let timeline: gsap.core.Timeline;

	let open = $state(false); // what the hamburger shows
	let expanded = $state(false); // cards are visible (stays true until the close animation ends)

	// Desktop has a fixed height; on phones the cards stack, so measure them.
	function expandedHeight() {
		const isPhone = matchMedia('(max-width: 767px)').matches;
		return isPhone ? BAR_HEIGHT + content.scrollHeight : DESKTOP_HEIGHT;
	}

	// Paused animation: grow the bar, then slide the cards up one by one.
	function buildTimeline() {
		timeline?.kill();
		gsap.set(nav, { height: BAR_HEIGHT });
		gsap.set(cardEls, { y: 50, opacity: 0 });

		timeline = gsap
			.timeline({ paused: true })
			.to(nav, { height: expandedHeight, duration: 0.4, ease })
			.to(cardEls, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');
	}

	$effect(() => {
		buildTimeline();
		return () => timeline.kill();
	});

	function toggle() {
		if (!open) {
			open = expanded = true;
			timeline.play(0);
		} else {
			open = false;
			timeline.eventCallback('onReverseComplete', () => (expanded = false));
			timeline.reverse();
		}
	}

	const close = () => open && toggle();

	// Screen size changed while open: rebuild at the new height and jump to the end.
	function onResize() {
		if (!expanded) return;
		buildTimeline();
		timeline.progress(1);
	}
</script>

<svelte:window onresize={onResize} onkeydown={(e) => e.key === 'Escape' && close()} />

<div class="fixed top-5 left-1/2 z-50 w-[90%] max-w-[800px] -translate-x-1/2 md:top-8">
	<nav
		bind:this={nav}
		class="relative h-[60px] overflow-hidden rounded-xl border bg-card shadow-sm will-change-[height]"
	>
		<!-- Top bar -->
		<div class="absolute inset-x-0 top-0 z-10 flex h-[60px] items-center justify-between py-2 pr-2 pl-4">
			<button
				type="button"
				class="hamburger order-2 flex h-full cursor-pointer flex-col items-center justify-center gap-1.5 px-1 md:order-none"
				class:open
				aria-label={open ? 'Close menu' : 'Open menu'}
				aria-expanded={open}
				onclick={toggle}
			>
				<span></span>
				<span></span>
			</button>

			<a href="/" class="order-1 md:absolute md:left-1/2 md:order-none md:-translate-x-1/2">
				<img src="/t_pongnav.svg" alt="txropks" class="h-4 w-auto invert md:h-5 light:invert-0" />
			</a>

			<a
				href={cta.href}
				class="hidden h-full items-center rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:inline-flex"
			>
				{cta.label}
			</a>
		</div>

		<!-- Cards -->
		<div
			bind:this={content}
			class="absolute inset-x-0 top-[60px] bottom-0 flex flex-col gap-2 p-2 md:flex-row md:items-end md:gap-3"
			class:invisible={!expanded}
			class:pointer-events-none={!expanded}
			aria-hidden={!expanded}
		>
			{#each cards as card, i}
				<div
					bind:this={cardEls[i]}
					class="flex min-h-[60px] flex-col gap-2 rounded-lg px-4 py-3 select-none md:h-full md:min-w-0 md:flex-1 {card.class}"
				>
					<div class="text-lg tracking-tight md:text-[22px]">{card.label}</div>
					<div class="mt-auto flex flex-col gap-0.5">
						{#each card.links as link}
							{@const external = link.href.startsWith('http')}
							<a
								href={link.href}
								target={external ? '_blank' : undefined}
								rel={external ? 'noreferrer' : undefined}
								class="inline-flex items-center gap-1.5 text-[15px] transition-opacity hover:opacity-75 md:text-base"
								onclick={close}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
									class="size-4 shrink-0"
								>
									<path d="M7 17 17 7M7 7h10v10" />
								</svg>
								{link.label}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</nav>
</div>

<style>
	/* Two lines that cross into an X when open. */
	.hamburger span {
		display: block;
		width: 30px;
		height: 2px;
		background: currentColor;
		transition: transform 0.25s ease;
	}
	.hamburger:hover span {
		opacity: 0.75;
	}
	.hamburger.open span:first-child {
		transform: translateY(4px) rotate(45deg);
	}
	.hamburger.open span:last-child {
		transform: translateY(-4px) rotate(-45deg);
	}
</style>
