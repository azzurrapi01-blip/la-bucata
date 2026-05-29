<script lang="ts">
	import RaccoltaGallery from '$lib/components/raccolta/RaccoltaGallery.svelte';

	let { data } = $props();
</script>

<RaccoltaGallery manifest={data.manifest} />
