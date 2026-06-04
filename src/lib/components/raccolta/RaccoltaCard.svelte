<script lang="ts">
	import OptimizedImage from '$lib/components/ui/OptimizedImage.svelte';
	import type { EnhancedImageSrc } from '$lib/images/types';
	import { SIZES_GRID_THIRD } from '$lib/images/sizes';

	type Props = {
		src: EnhancedImageSrc;
		caption: string;
		alt?: string;
		sizes?: string;
		onClick?: () => void;
	};

	let { src, caption, alt, sizes = SIZES_GRID_THIRD, onClick }: Props = $props();

	const imageAlt = $derived(alt ?? caption);
</script>

<figure class="raccolta__card">
	<button type="button" class="raccolta__card-media" onclick={onClick}>
		<OptimizedImage {src} alt={imageAlt} {sizes} loading="lazy" />
	</button>
	<figcaption class="raccolta__card-caption">{caption}</figcaption>
</figure>
