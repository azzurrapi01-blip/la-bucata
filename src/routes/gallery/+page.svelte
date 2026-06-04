<script lang="ts">
	import GalleryGallery from '$lib/components/gallery/GalleryGallery.svelte';

	let { data } = $props();
</script>

<GalleryGallery manifest={data.manifest} />
