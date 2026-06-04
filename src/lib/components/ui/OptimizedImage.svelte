<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/images/types';

	type Props = {
		src: EnhancedImageSrc;
		alt: string;
		sizes: string;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
	};

	let {
		src,
		alt,
		sizes,
		loading = 'lazy',
		fetchpriority,
		class: className = ''
	}: Props = $props();
</script>

<enhanced:img {src} {alt} {sizes} {loading} {fetchpriority} class={className} />
