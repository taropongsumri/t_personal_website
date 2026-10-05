<!--
	Renders a link (<a>) when given `href`, otherwise a <button>.
	Replaces shadcn's `<Button asChild>` pattern from the old React site.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	const variants = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground'
	};

	const sizes = {
		sm: 'h-8 px-3',
		md: 'h-9 px-4',
		lg: 'h-10 px-6'
	};

	type Props = HTMLAnchorAttributes &
		HTMLButtonAttributes & {
			variant?: keyof typeof variants;
			size?: keyof typeof sizes;
			children: Snippet;
		};

	let {
		variant = 'default',
		size = 'md',
		href,
		class: className,
		children,
		...rest
	}: Props = $props();

	const classes = $derived(
		cn(
			'group/button inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
			variants[variant],
			sizes[size],
			className
		)
	);
</script>

{#if href}
	<a {href} class={classes} {...rest}>{@render children()}</a>
{:else}
	<button class={classes} {...rest}>{@render children()}</button>
{/if}
