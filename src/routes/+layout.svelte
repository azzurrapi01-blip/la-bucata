<script lang="ts">
	import { page } from '$app/state';
	import SiteShell from '$lib/components/layout/SiteShell.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/gt-alpha.css';
	import '$lib/styles/gt-walsheim.css';
	import '$lib/styles/section-card.css';

	let { children } = $props();

	const routeId = $derived(page.route.id ?? '');
	const useSiteShell = $derived(routeId !== '/' && !routeId.startsWith('/demo'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if useSiteShell}
	<SiteShell>
		{@render children()}
	</SiteShell>
{:else}
	{@render children()}
{/if}

<style>
	:global(body) {
		margin: 0;
		color: #000000;
		font-family: 'Lora', Georgia, 'Times New Roman', serif;
	}
</style>
