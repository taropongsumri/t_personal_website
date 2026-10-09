<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import { site } from '#lib/data/site.js';
</script>

<svelte:head>
	<title>{site.title}</title>
</svelte:head>

<main class="flex-1">
	<Hero />
</main>
