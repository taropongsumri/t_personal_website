<!--
	Round button in the bottom-right corner that switches between the
	coffee (default) and light kraft-paper themes. The choice is saved.
-->
<script lang="ts">
	let light = $state(false);

	// app.html may already have applied a saved theme; read it after the page loads.
	$effect(() => {
		light = document.documentElement.classList.contains('light');
	});

	function toggle() {
		const apply = () => {
			light = !light;
			document.documentElement.classList.toggle('light', light);
			try {
				localStorage.setItem('theme', light ? 'light' : 'coffee');
			} catch {
				// storage blocked (private mode): the theme just won't be remembered
			}
		};
		// Cross-fade between themes where the browser supports it.
		if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
			document.startViewTransition(apply);
		} else {
			apply();
		}
	}
</script>

<button
	type="button"
	class="fixed right-5 bottom-5 z-50 grid size-12 cursor-pointer place-items-center rounded-full border bg-card text-card-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
	aria-label={light ? 'Switch to coffee theme' : 'Switch to light theme'}
	title={light ? 'Coffee theme' : 'Light theme'}
	onclick={toggle}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="size-5"
		aria-hidden="true"
	>
		{#if light}
			<!-- moon: go to the coffee theme -->
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		{:else}
			<!-- sun: go to the light theme -->
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		{/if}
	</svg>
</button>
