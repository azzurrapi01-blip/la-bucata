<script lang="ts">
	import StampeGallery from '$lib/components/stampe/StampeGallery.svelte';

	let { data } = $props();
</script>

<StampeGallery manifest={data.manifest} />

