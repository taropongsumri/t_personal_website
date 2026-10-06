<script lang="ts">
	import '@fontsource/shippori-mincho/400.css';
	import '@fontsource/shippori-mincho/500.css';
	import '@fontsource/shippori-mincho/600.css';
	import '@fontsource/shippori-mincho/700.css';
	import '@fontsource/shippori-mincho/800.css';
	import './layout.css';
	import CardNav from '#lib/components/CardNav.svelte';
	import CozyStickers from '#lib/components/CozyStickers.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<CardNav />
<!-- Stickers float down the sides of every page; clip so they never cause sideways scrolling. -->
<div class="relative flex flex-1 flex-col overflow-x-clip">
	<CozyStickers />
	{@render children()}
</div>
<ThemeToggle />
