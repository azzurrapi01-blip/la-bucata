<script lang="ts">
	import StampeSection from '$lib/components/stampe/StampeSection.svelte';

	let { data } = $props();
</script>

<StampeSection allImages={data.allImages} />
