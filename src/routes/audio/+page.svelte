<script lang="ts">
	import AudioGallery from '$lib/components/audio/AudioGallery.svelte';

	let { data } = $props();
</script>

<AudioGallery manifest={data.manifest} />
