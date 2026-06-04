<script lang="ts">
	import AudioSection from '$lib/components/audio/AudioSection.svelte';
	import GallerySection from '$lib/components/gallery/GallerySection.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import HomeHero from '$lib/components/home/HomeHero.svelte';
	import HomeIntro from '$lib/components/home/HomeIntro.svelte';
	import PercorsoSection from '$lib/components/percorso/PercorsoSection.svelte';
	import RaccoltaSection from '$lib/components/raccolta/RaccoltaSection.svelte';
	import StampeSection from '$lib/components/stampe/StampeSection.svelte';
	import '$lib/components/home/home.css';

	let { data } = $props();
</script>

<div class="home-page">
	<div class="home-cover" id="top">
		<SiteHeader />
		<HomeHero />
	</div>
	<main class="home">
		<div class="home__sections">
	<HomeIntro
		title={data.about.title}
		paragraphs={data.about.paragraphs}
		illustrationSrc={data.about.illustrationSrc}
	/>
	<AudioSection recordings={data.audioRecordings} />
	<PercorsoSection manifest={data.percorsoManifest} />
	<GallerySection allImages={data.galleryAllImages} />
	<StampeSection allImages={data.stampeAllImages} />
	<RaccoltaSection allItems={data.raccoltaAllItems} />
		</div>
	</main>
</div>
