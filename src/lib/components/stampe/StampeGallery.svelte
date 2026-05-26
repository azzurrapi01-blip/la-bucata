<script lang="ts">
	import StampeCard from './StampeCard.svelte';
	import StampeLightbox from './StampeLightbox.svelte';
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

	function selectCategory(id: string) {
		if (id === activeCategoryId) return;

		// Chiudiamo il lightbox: evita mismatch con indice/insieme immagini durante il fade.
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
	<h1 class="stampe__title">{STAMPE_TITLE}</h1>

	<div class="stampe__intro">
		{#each STAMPE_INTRO as line}
			<p>{line}</p>
		{/each}
	</div>

	<div class="stampe__filters" role="tablist" aria-label="Filtra stampe">
		{#each manifest.categories as category}
			<button
				type="button"
				class="stampe__filter"
				class:stampe__filter--active={category.id === activeCategoryId}
				role="tab"
				aria-selected={category.id === activeCategoryId}
				onclick={() => selectCategory(category.id)}
			>
				{category.label}
			</button>
		{/each}
	</div>

	<div class="stampe__grid" class:stampe__grid--fading={fading}>
		{#each visibleImages as src, index}
			<StampeCard src={src} onClick={() => openLightbox(index)} />
		{/each}
	</div>

	<StampeLightbox
		open={lightboxOpen}
		images={visibleImages}
		index={lightboxIndex}
		navigable={true}
		onClose={() => (lightboxOpen = false)}
		onIndexChange={(nextIndex) => (lightboxIndex = nextIndex)}
	/>
</section>

