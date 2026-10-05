<script lang="ts">
	import '@fontsource/shippori-mincho/400.css';
	import '@fontsource/shippori-mincho/500.css';
	import '@fontsource/shippori-mincho/600.css';
	import '@fontsource/shippori-mincho/700.css';
	import '@fontsource/shippori-mincho/800.css';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Navbar goes here once ported (same spot as the old layout.tsx) -->
{@render children()}
