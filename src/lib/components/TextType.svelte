<!--
	Types out each word, deletes it, then moves on to the next, forever.
-->
<script lang="ts">
	type Props = {
		words: string[];
		/** Milliseconds per typed character. */
		typingSpeed?: number;
		/** Milliseconds per deleted character. */
		deletingSpeed?: number;
		/** Milliseconds a finished word stays on screen. */
		pause?: number;
		class?: string;
	};

	let {
		words,
		typingSpeed = 70,
		deletingSpeed = 40,
		pause = 1800,
		class: className = ''
	}: Props = $props();

	let wordIndex = $state(0);
	let length = $state(0); // how many characters of the word are showing
	let deleting = $state(false);

	const word = $derived(words[wordIndex % words.length]);

	// Each run does one step: type or delete a character, or switch direction/word.
	// Changing any state it reads schedules the next step.
	$effect(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			length = word.length;
			return;
		}

		const finished = !deleting && length === word.length;
		const cleared = deleting && length === 0;

		const timer = setTimeout(
			() => {
				if (finished) deleting = true;
				else if (cleared) {
					deleting = false;
					wordIndex++;
				} else length += deleting ? -1 : 1;
			},
			finished ? pause : deleting ? deletingSpeed : typingSpeed
		);
		return () => clearTimeout(timer);
	});
</script>

<span class={className}>
	<span class="sr-only">{words.join(', ')}</span>
	<span aria-hidden="true">{word.slice(0, length)}</span><span class="cursor" aria-hidden="true">▍</span>
</span>

<style>
	.cursor {
		margin-left: 1px;
		animation: blink 1s steps(1) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
