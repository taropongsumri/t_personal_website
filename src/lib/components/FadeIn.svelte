<!--
	Fades its content in the first time it scrolls into view.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	type Props = {
		children: Snippet;
		/** Milliseconds to wait before fading in. */
		delay?: number;
		class?: string;
	};

	let { children, delay = 0, class: className = '' }: Props = $props();

	let el: HTMLDivElement;
	let visible = $state(false);

	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				visible = true;
				observer.disconnect();
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class={cn('fade', className)}
	class:visible
	style:animation-delay="{delay}ms"
>
	{@render children()}
</div>

<style>
	.fade {
		opacity: 0;
	}

	.visible {
		animation: fade-in 0.8s ease-out both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fade {
			opacity: 1;
		}
		.visible {
			animation: none;
		}
	}
</style>
