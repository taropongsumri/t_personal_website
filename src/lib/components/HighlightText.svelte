<!-- Text with some phrases emphasised: coloured orange, or bold. -->
<script lang="ts">
	import { splitHighlights } from '#lib/utils.js';

	type Props = {
		text: string;
		/** Phrases inside `text` to emphasise; they must match exactly. */
		highlights: string[];
		/** 'orange' = orange text, 'bold' = bold ivory text. */
		variant?: 'orange' | 'bold';
	};

	let { text, highlights, variant = 'orange' }: Props = $props();

	const styles = {
		orange: 'font-normal text-highlight',
		bold: 'font-bold text-foreground'
	};
</script>

{#each splitHighlights(text, highlights) as part}{#if part.highlight}<strong class={styles[variant]}>{part.text}</strong>{:else}{part.text}{/if}{/each}
