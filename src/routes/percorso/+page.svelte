<script lang="ts">
	import PercorsoGallery from '$lib/components/percorso/PercorsoGallery.svelte';

	let { data } = $props();
</script>

<PercorsoGallery manifest={data.manifest} />
