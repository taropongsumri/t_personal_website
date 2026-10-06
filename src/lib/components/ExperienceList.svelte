<!-- Vertical timeline of experiences, newest first. -->
<script lang="ts">
	import type { Experience } from '#lib/data/experiences.js';

	let { items }: { items: Experience[] } = $props();
</script>

<ol class="relative flex flex-col gap-5 border-l pl-5">
	{#each items as { period, role, org, description, stack }}
		<li class="relative">
			<!-- Dot on the timeline line -->
			<span class="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-card bg-muted-foreground"></span>

			<p class="text-xs tracking-wide text-muted-foreground uppercase">{period}</p>
			<h3 class="font-bold">{role} <span class="font-normal text-muted-foreground">· {org}</span></h3>
			<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>

			{#if stack?.length}
				<ul class="mt-2 flex flex-wrap gap-1.5">
					{#each stack as tech}
						<li class="rounded-full border bg-background px-2 py-0.5 text-xs">{tech}</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ol>
