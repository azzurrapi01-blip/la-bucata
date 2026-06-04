<script lang="ts">
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import CategoryFilters from '$lib/components/ui/CategoryFilters.svelte';
	import MediaGrid from '$lib/components/ui/MediaGrid.svelte';
	import MediaLightbox from '$lib/components/ui/MediaLightbox.svelte';
	import { GALLERY_INTRO, GALLERY_TITLE } from '$lib/gallery/constants';
	import type { GalleryManifest } from '$lib/gallery/types';
	import './gallery.css';

	type Props = {
		manifest: GalleryManifest;
	};

	let { manifest }: Props = $props();

	let activeCategoryId = $state('tutte');
	let fading = $state(false);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	const activeCategory = $derived(
		manifest.categories.find((category) => category.id === activeCategoryId) ??
			manifest.categories[0]
	);
	const visibleImages = $derived(activeCategory?.images ?? []);

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

<section class="gallery">
	<SectionHeading
		title={GALLERY_TITLE}
		intro={GALLERY_INTRO}
		headingLevel={1}
		titleClass="gallery__title"
		introClass="gallery__intro"
	/>

	<CategoryFilters
		categories={manifest.categories}
		activeId={activeCategoryId}
		onSelect={selectCategory}
		ariaLabel="Filtra gallery"
	/>

	<MediaGrid
		images={visibleImages}
		layout="stack"
		class="gallery__stack"
		{fading}
		imageAlt="Fotografia del percorso"
		onImageClick={openLightbox}
	/>

	<MediaLightbox
		open={lightboxOpen}
		images={visibleImages}
		index={lightboxIndex}
		navigable={true}
		imageAlt="Fotografia del percorso ingrandita"
		dialogLabel="Anteprima fotografia"
		onClose={() => (lightboxOpen = false)}
		onIndexChange={(nextIndex) => (lightboxIndex = nextIndex)}
	/>
</section>
