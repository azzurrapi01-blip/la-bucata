<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import MediaGrid from '$lib/components/ui/MediaGrid.svelte';
	import MediaLightbox from '$lib/components/ui/MediaLightbox.svelte';
	import { GALLERY_CTA, GALLERY_INTRO, GALLERY_TITLE } from '$lib/gallery/constants';
	import { pickRandom } from '$lib/stampe/random';
	import { base } from '$app/paths';
	import './gallery.css';

	type Props = {
		allImages: string[];
	};

	let { allImages }: Props = $props();

	let previewImages = $state<string[]>([]);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	onMount(() => {
		previewImages = pickRandom(allImages, 4);
	});

	const galleryHref = `${base.replace(/\/$/, '')}/gallery`;

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section class="gallery">
	<SectionHeading
		title={GALLERY_TITLE}
		intro={GALLERY_INTRO}
		titleClass="gallery__title"
		introClass="gallery__intro"
	/>

	{#if previewImages.length > 0}
		<MediaGrid
			images={previewImages}
			layout="grid-2x2"
			class="gallery__grid--preview"
			imageAlt="Fotografia del percorso"
			onImageClick={openLightbox}
		/>
	{/if}

	<a class="gallery__cta" href={galleryHref}>{GALLERY_CTA}</a>

	<MediaLightbox
		open={lightboxOpen}
		images={previewImages}
		index={lightboxIndex}
		navigable={true}
		imageAlt="Fotografia del percorso ingrandita"
		dialogLabel="Anteprima fotografia"
		onClose={() => (lightboxOpen = false)}
		onIndexChange={(nextIndex) => (lightboxIndex = nextIndex)}
	/>
</section>
