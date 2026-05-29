<script lang="ts">
	import AudioSection from '$lib/components/audio/AudioSection.svelte';
	import GallerySection from '$lib/components/gallery/GallerySection.svelte';
	import RaccoltaSection from '$lib/components/raccolta/RaccoltaSection.svelte';
	import StampeSection from '$lib/components/stampe/StampeSection.svelte';

	let { data } = $props();
</script>

<AudioSection recordings={data.audioRecordings} />
<GallerySection allImages={data.galleryAllImages} />
<StampeSection allImages={data.stampeAllImages} />
<RaccoltaSection allItems={data.raccoltaAllItems} />
