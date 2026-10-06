<!--
	A scripted "AI" chat with Mocha the café barista. Visitors can only pick
	questions from the menu (chips); every answer comes from data/chat.ts.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import ChatBubble from '#lib/components/chat/ChatBubble.svelte';
	import ExperienceList from '#lib/components/ExperienceList.svelte';
	import { barista, breakSeconds, farewell, greeting, questions, type Attachment, type Question } from '#lib/data/chat.js';
	import { experiences, openSource } from '#lib/data/experiences.js';
	import { stack } from '#lib/data/stack.js';

	type Message =
		| { from: 'barista' | 'visitor'; text: string }
		| { from: 'barista'; attach: Attachment };

	let section: HTMLElement;
	let log: HTMLDivElement;

	let messages = $state<Message[]>([]);
	let asked = $state<string[]>([]);
	let typing = $state(false); // show the "● ● ●" bubble
	let busy = $state(false); // a reply is in progress, so the chips are disabled
	let breakLeft = $state(0); // seconds left on Mocha's break; 0 = working
	const onBreak = $derived(breakLeft > 0);

	const menu = $derived(questions.filter((q) => !asked.includes(q.ask)));

	const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const wait = (ms: number) => new Promise((done) => setTimeout(done, reducedMotion() ? 0 : ms));

	// Barista "types" each line (longer lines take longer), then sends it.
	async function say(lines: string[], attach?: Attachment) {
		for (const text of lines) {
			typing = true;
			await wait(600 + text.length * 15);
			typing = false;
			messages.push({ from: 'barista', text });
			await wait(250);
		}
		if (attach) messages.push({ from: 'barista', attach });
	}

	async function ask(question: Question) {
		if (busy) return;
		busy = true;
		asked.push(question.ask);
		messages.push({ from: 'visitor', text: question.ask });
		await wait(300);
		await say(question.reply, question.attach);
		if (menu.length === 0) {
			await say([farewell]);
			await wait(1500);
			breakLeft = breakSeconds;
		}
		busy = false;
	}

	async function start() {
		busy = true;
		messages = [];
		asked = [];
		await say(greeting);
		busy = false;
	}

	// Greet the visitor the first time the chat scrolls into view.
	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				start();
			},
			{ threshold: 0.4 }
		);
		observer.observe(section);
		return () => observer.disconnect();
	});

	// Count the break down once a second, then reopen the chat.
	$effect(() => {
		if (!onBreak) return;
		const timer = setInterval(() => {
			breakLeft -= 1;
			if (breakLeft === 0) start();
		}, 1000);
		return () => clearInterval(timer);
	});

	// Keep the newest message in view.
	$effect(() => {
		void messages.length;
		void typing;
		tick().then(() => log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' }));
	});
</script>

<section bind:this={section} id="experience" class="mx-auto w-full max-w-3xl px-6 py-24 sm:px-10">
	<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Ask the barista</h2>
	<p class="mt-2 text-muted-foreground">Order a question from the menu to learn about my experience.</p>

	<div class="relative mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
		<!-- Everything is blurred and unclickable while Mocha is on break. -->
		<div inert={onBreak} class="transition-[filter] duration-500" class:blur-sm={onBreak}>
			<!-- Header -->
			<div class="flex items-center gap-3 border-b px-4 py-3">
				<span class="grid size-10 place-items-center rounded-full bg-secondary text-xl" aria-hidden="true">☕</span>
				<div class="flex-1">
					<p class="font-bold">{barista.name}</p>
					<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span class="size-1.5 rounded-full bg-emerald-600"></span>
						{barista.role}
					</p>
				</div>
				<span class="text-xs text-muted-foreground">pre-written answers</span>
			</div>

			<!-- Messages -->
			<div bind:this={log} class="flex h-[28rem] flex-col gap-3 overflow-y-auto p-4 sm:h-[32rem]" aria-live="polite">
				{#each messages as message}
					{#if 'text' in message}
						<ChatBubble from={message.from} text={message.text} />
					{:else}
						<div class="attachment rounded-xl border bg-background/60 p-4 sm:mr-12">
							{#if message.attach === 'experience'}
								<ExperienceList items={experiences} />
							{:else if message.attach === 'openSource'}
								<ul class="flex flex-col gap-3">
									{#each openSource as { name, description, repo, languages, period }}
										<li>
											<a href={repo} target="_blank" rel="noreferrer" class="font-bold underline-offset-4 hover:underline">{name} ↗</a>
											<span class="text-xs text-muted-foreground">· {period}</span>
											<p class="text-sm text-muted-foreground">{description}</p>
											{#if languages?.length}
												<p class="mt-1 text-xs">{languages.join(' · ')}</p>
											{/if}
										</li>
									{/each}
								</ul>
							{:else if message.attach === 'stack'}
								<ul class="flex flex-wrap gap-5 text-foreground/70">
									{#each stack as { title, icon }}
										<li class="flex flex-col items-center gap-1 text-xs">
											<svg viewBox="0 0 24 24" fill="currentColor" class="size-7" aria-hidden="true"><path d={icon} /></svg>
											{title}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
				{/each}

				{#if typing}
					<div class="typing flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3" aria-label="{barista.name} is typing">
						<span></span><span></span><span></span>
					</div>
				{/if}
			</div>

			<!-- Menu: the only questions visitors can ask -->
			<div class="flex flex-wrap gap-2 border-t bg-background/40 p-3">
				{#each menu as question (question.ask)}
					<button
						type="button"
						class="rounded-full border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-secondary disabled:opacity-50"
						disabled={busy}
						onclick={() => ask(question)}
					>
						{question.ask}
					</button>
				{:else}
					<p class="px-1 py-1.5 text-sm text-muted-foreground">The menu is empty for now.</p>
				{/each}
			</div>
		</div>

		{#if onBreak}
			<div class="break absolute inset-0 grid place-items-center bg-background/40 p-6 text-center" role="status">
				<div class="flex flex-col items-center gap-3">
					<img
						src="/capybara.jpg"
						alt="A pixel-art capybara sipping coffee"
						class="size-36 rounded-2xl border shadow-lg [image-rendering:pixelated] sm:size-44"
					/>
					<p class="text-lg font-bold">{barista.name} is on a coffee break</p>
					<p class="text-sm text-muted-foreground">Back in {breakLeft}s</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.break {
		animation: fade 0.5s ease-out both;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.attachment {
		animation: rise 0.4s ease-out both;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}

	/* Three dots bouncing one after another. */
	.typing span {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
		background: var(--muted-foreground);
		animation: bounce 1s infinite;
	}
	.typing span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing span:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes bounce {
		0%,
		60%,
		100% {
			transform: none;
			opacity: 0.4;
		}
		30% {
			transform: translateY(-4px);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.break,
		.attachment,
		.typing span {
			animation: none;
		}
	}
</style>
