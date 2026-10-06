<!-- One chat message. Barista bubbles sit left, visitor bubbles right. -->
<script lang="ts">
	let { from, text }: { from: 'barista' | 'visitor'; text: string } = $props();

	const words = $derived(text.split(' '));
</script>

<div class="flex {from === 'visitor' ? 'justify-end' : 'justify-start'}">
	<p
		class="bubble max-w-[85%] rounded-2xl px-4 py-2 leading-relaxed sm:max-w-[75%]"
		class:barista={from === 'barista'}
		class:visitor={from === 'visitor'}
	>
		{#if from === 'barista'}
			<!-- Words fade in one by one, like the reply is being written. -->
			{#each words as word, i}<span class="word" style:animation-delay="{i * 35}ms">{word}</span>{' '}{/each}
		{:else}
			{text}
		{/if}
	</p>
</div>

<style>
	.bubble {
		animation: pop-in 0.25s ease-out both;
	}
	.barista {
		border-bottom-left-radius: 0.25rem;
		background: var(--secondary);
		color: var(--secondary-foreground);
	}
	.visitor {
		border-bottom-right-radius: 0.25rem;
		background: var(--primary);
		color: var(--primary-foreground);
	}
	.word {
		animation: word-in 0.3s ease-out both;
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.97);
		}
	}
	@keyframes word-in {
		from {
			opacity: 0;
			filter: blur(4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bubble,
		.word {
			animation: none;
		}
	}
</style>
