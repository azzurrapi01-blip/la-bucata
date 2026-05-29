<script lang="ts">
	type Props = {
		title: string;
		intro: string | readonly string[];
		headingLevel?: 1 | 2;
		titleClass?: string;
		introClass?: string;
	};

	let {
		title,
		intro,
		headingLevel = 2,
		titleClass = 'section-heading__title',
		introClass = 'section-heading__intro'
	}: Props = $props();

	const introLines = $derived(typeof intro === 'string' ? [intro] : intro);
</script>

{#if headingLevel === 1}
	<h1 class={titleClass}>{title}</h1>
{:else}
	<h2 class={titleClass}>{title}</h2>
{/if}

<div class={introClass}>
	{#each introLines as line}
		<p>{line}</p>
	{/each}
</div>
