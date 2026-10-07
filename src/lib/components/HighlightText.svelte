<!-- Text with some phrases coloured orange, e.g. key words in a paragraph. -->
<script lang="ts">
	import { splitHighlights } from '#lib/utils.js';

	type Props = {
		text: string;
		/** Phrases inside `text` to colour; they must match exactly. */
		highlights: string[];
	};

	let { text, highlights }: Props = $props();
</script>

{#each splitHighlights(text, highlights) as part}{#if part.highlight}<strong class="font-normal text-highlight">{part.text}</strong>{:else}{part.text}{/if}{/each}
