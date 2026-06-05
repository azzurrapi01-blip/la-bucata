<script lang="ts">
	import StampeCard from './StampeCard.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import CategoryFilters from '$lib/components/ui/CategoryFilters.svelte';
	import MediaGrid from '$lib/components/ui/MediaGrid.svelte';
	import MediaLightbox from '$lib/components/ui/MediaLightbox.svelte';
	import { imageSrcs, imageThumbs } from '$lib/media/optimized-image';
	import { STAMPE_INTRO, STAMPE_TITLE } from '$lib/stampe/constants';
	import type { StampeManifest } from '$lib/stampe/types';
	import './stampe.css';

	type Props = {
		manifest: StampeManifest;
	};

	let { manifest }: Props = $props();

	let activeCategoryId = $state('tutte');
	let fading = $state(false);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	const activeCategory = $derived(
		manifest.categories.find((category) => category.id === activeCategoryId) ?? manifest.categories[0]
	);
	const visibleImages = $derived(activeCategory?.images ?? []);
	const visibleThumbs = $derived(imageThumbs(visibleImages));
	const visibleSrcs = $derived(imageSrcs(visibleImages));

	function selectCategory(id: string) {
		if (id === activeCategoryId) return;

		lightboxOpen = false;

		fading = true;
		setTimeout(() => {
			activeCategoryId = id;
			fading = false;
		}, 200);
	}

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section class="stampe">
	<SectionHeading
		title={STAMPE_TITLE}
		intro={STAMPE_INTRO}
		headingLevel={1}
		titleClass="stampe__title"
		introClass="stampe__intro"
	/>

	<CategoryFilters
		categories={manifest.categories}
		activeId={activeCategoryId}
		onSelect={selectCategory}
		ariaLabel="Filtra stampe"
	/>

	<MediaGrid images={visibleThumbs} layout="grid-3" {fading} onImageClick={openLightbox}>
		{#snippet cell({ src, index })}
			<StampeCard {src} onClick={() => openLightbox(index)} />
		{/snippet}
	</MediaGrid>

	<MediaLightbox
		open={lightboxOpen}
		images={visibleSrcs}
		index={lightboxIndex}
		navigable={true}
		imageAlt="Stampa botanica ingrandita"
		dialogLabel="Anteprima stampa"
		onClose={() => (lightboxOpen = false)}
		onIndexChange={(nextIndex) => (lightboxIndex = nextIndex)}
	/>
</section>
