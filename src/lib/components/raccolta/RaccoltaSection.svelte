<script lang="ts">
	import { onMount } from 'svelte';
	import RaccoltaCard from './RaccoltaCard.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import MediaGrid from '$lib/components/ui/MediaGrid.svelte';
	import MediaLightbox from '$lib/components/ui/MediaLightbox.svelte';
	import { RACCOLTA_CTA, RACCOLTA_INTRO, RACCOLTA_TITLE } from '$lib/raccolta/constants';
	import type { RaccoltaImage } from '$lib/raccolta/types';
	import { pickRandom } from '$lib/stampe/random';
	import { base } from '$app/paths';
	import './raccolta.css';

	type Props = {
		allItems: RaccoltaImage[];
	};

	let { allItems }: Props = $props();

	let previewItems = $state<RaccoltaImage[]>([]);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	onMount(() => {
		previewItems = pickRandom(allItems, 4);
	});

	const raccoltaHref = `${base.replace(/\/$/, '')}/raccolta`;

	const previewSrcs = $derived(previewItems.map((item) => item.src));

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section class="raccolta">
	<SectionHeading
		title={RACCOLTA_TITLE}
		intro={RACCOLTA_INTRO}
		titleClass="raccolta__title"
		introClass="raccolta__intro"
	/>

	{#if previewItems.length > 0}
		<MediaGrid
			images={previewSrcs}
			layout="grid-2x2"
			class="raccolta__grid--preview"
		>
			{#snippet cell({ index })}
				{@const item = previewItems[index]}
				<RaccoltaCard
					src={item.src}
					caption={item.caption}
					onClick={() => openLightbox(index)}
				/>
			{/snippet}
		</MediaGrid>
	{/if}

	<a class="raccolta__cta" href={raccoltaHref}>{RACCOLTA_CTA}</a>

	<MediaLightbox
		open={lightboxOpen}
		images={previewSrcs}
		index={lightboxIndex}
		navigable={true}
		imageAlt="Specie vegetale ingrandita"
		dialogLabel="Anteprima raccolta"
		onClose={() => (lightboxOpen = false)}
		onIndexChange={(nextIndex) => (lightboxIndex = nextIndex)}
	/>
</section>
