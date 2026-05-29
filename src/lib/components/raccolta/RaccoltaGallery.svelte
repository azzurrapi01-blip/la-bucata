<script lang="ts">
	import RaccoltaCard from './RaccoltaCard.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import CategoryFilters from '$lib/components/ui/CategoryFilters.svelte';
	import MediaGrid from '$lib/components/ui/MediaGrid.svelte';
	import MediaLightbox from '$lib/components/ui/MediaLightbox.svelte';
	import { RACCOLTA_INTRO, RACCOLTA_TITLE } from '$lib/raccolta/constants';
	import type { RaccoltaManifest, RaccoltaMonth } from '$lib/raccolta/types';
	import './raccolta.css';

	type Props = {
		manifest: RaccoltaManifest;
	};

	let { manifest }: Props = $props();

	let activeCategoryId = $state('tutte');
	let fading = $state(false);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	const visibleMonths = $derived<RaccoltaMonth[]>(
		activeCategoryId === 'tutte'
			? manifest.months
			: manifest.months.filter((month) => month.id === activeCategoryId)
	);

	const visibleItems = $derived(visibleMonths.flatMap((month) => month.images));

	const visibleSrcs = $derived(visibleItems.map((item) => item.src));

	function monthStartIndex(monthId: string): number {
		let index = 0;
		for (const month of visibleMonths) {
			if (month.id === monthId) return index;
			index += month.images.length;
		}
		return 0;
	}

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

<section class="raccolta">
	<SectionHeading
		title={RACCOLTA_TITLE}
		intro={RACCOLTA_INTRO}
		headingLevel={1}
		titleClass="raccolta__title"
		introClass="raccolta__intro"
	/>

	<CategoryFilters
		categories={manifest.categories}
		activeId={activeCategoryId}
		onSelect={selectCategory}
		ariaLabel="Filtra raccolta per mese"
	/>

	<div class:raccolta__content--fading={fading}>
		{#each visibleMonths as month (month.id)}
			<div class="raccolta__month-group">
				{#if activeCategoryId === 'tutte'}
					<p class="raccolta__month-label">{month.label}</p>
				{/if}

				<MediaGrid images={month.images.map((item) => item.src)} layout="grid-3">
					{#snippet cell({ src, index })}
						{@const item = month.images[index]}
						<RaccoltaCard
							src={item.src}
							caption={item.caption}
							onClick={() => openLightbox(monthStartIndex(month.id) + index)}
						/>
					{/snippet}
				</MediaGrid>
			</div>
		{/each}
	</div>

	<MediaLightbox
		open={lightboxOpen}
		images={visibleSrcs}
		index={lightboxIndex}
		navigable={true}
		imageAlt="Specie vegetale ingrandita"
		dialogLabel="Anteprima raccolta"
		onClose={() => (lightboxOpen = false)}
		onIndexChange={(nextIndex) => (lightboxIndex = nextIndex)}
	/>
</section>

<style>
	.raccolta__content--fading {
		opacity: 0;
		transition: opacity 200ms ease;
	}
</style>
