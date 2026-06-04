<script lang="ts">
	import OptimizedImage from '$lib/components/ui/OptimizedImage.svelte';
	import type { EnhancedImageSrc } from '$lib/images/types';
	import { SIZES_GRID_THIRD } from '$lib/images/sizes';

	type Props = {
		src: EnhancedImageSrc;
		alt?: string;
		sizes?: string;
		onClick?: () => void;
	};

	let { src, alt = 'Stampa botanica', sizes = SIZES_GRID_THIRD, onClick }: Props = $props();
</script>

<button type="button" class="stampe__card" onclick={onClick}>
	<OptimizedImage {src} {alt} {sizes} loading="lazy" />
</button>

