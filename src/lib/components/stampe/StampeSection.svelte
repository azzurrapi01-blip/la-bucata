<script lang="ts">
	import { onMount } from 'svelte';
	import StampeCard from './StampeCard.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import MediaGrid from '$lib/components/ui/MediaGrid.svelte';
	import MediaLightbox from '$lib/components/ui/MediaLightbox.svelte';
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

<section class="stampe" id="stampe">
	<SectionHeading
		title={STAMPE_TITLE}
		intro={STAMPE_INTRO}
		titleClass="stampe__title"
		introClass="stampe__intro"
	/>

	{#if previewImages.length > 0}
		<MediaGrid images={previewImages} layout="grid-2" class="stampe__grid--preview">
			{#snippet cell({ src, index })}
				<StampeCard {src} onClick={() => openLightbox(index)} />
			{/snippet}
		</MediaGrid>
	{/if}

	<a class="stampe__cta" href={stampeHref}>{STAMPE_CTA}</a>

	<MediaLightbox
		open={lightboxOpen}
		images={previewImages}
		index={lightboxIndex}
		navigable={false}
		imageAlt="Stampa botanica ingrandita"
		dialogLabel="Anteprima stampa"
		onClose={() => (lightboxOpen = false)}
	/>
</section>
