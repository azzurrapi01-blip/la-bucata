<script lang="ts">
	import { onMount } from 'svelte';
	import StampeCard from './StampeCard.svelte';
	import StampeLightbox from './StampeLightbox.svelte';
	import { STAMPE_CTA, STAMPE_INTRO, STAMPE_TITLE } from '$lib/stampe/constants';
	import { pickRandom } from '$lib/stampe/random';
	import { base } from '$app/paths';
	import './stampe.css';

	type Props = {
		allImages: string[];
	};

	let { allImages }: Props = $props();

	let previewImages = $state<string[]>([]);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	onMount(() => {
		previewImages = pickRandom(allImages, 2);
	});

	const stampeHref = `${base.replace(/\/$/, '')}/stampe`;

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section class="stampe">
	<h2 class="stampe__title">{STAMPE_TITLE}</h2>

	<div class="stampe__intro">
		{#each STAMPE_INTRO as line}
			<p>{line}</p>
		{/each}
	</div>

	{#if previewImages.length > 0}
		<div class="stampe__grid stampe__grid--preview">
			{#each previewImages as src, index}
				<StampeCard src={src} onClick={() => openLightbox(index)} />
			{/each}
		</div>
	{/if}

	<a class="stampe__cta" href={stampeHref}>{STAMPE_CTA}</a>

	<StampeLightbox
		open={lightboxOpen}
		images={previewImages}
		index={lightboxIndex}
		navigable={false}
		onClose={() => (lightboxOpen = false)}
	/>
</section>

