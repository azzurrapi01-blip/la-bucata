<script lang="ts">
	import GallerySection from '$lib/components/gallery/GallerySection.svelte';
	import StampeSection from '$lib/components/stampe/StampeSection.svelte';

	let { data } = $props();
</script>

<GallerySection allImages={data.galleryAllImages} />
<StampeSection allImages={data.stampeAllImages} />
