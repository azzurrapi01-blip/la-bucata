<script lang="ts">
	import type { Snippet } from 'svelte';

	export type MediaGridLayout = 'stack' | 'grid-3' | 'grid-2' | 'grid-2x2';

	type CellContext = {
		src: string;
		index: number;
	};

	type Props = {
		images: string[];
		layout: MediaGridLayout;
		class?: string;
		fading?: boolean;
		imageAlt?: string;
		onImageClick?: (index: number) => void;
		cell?: Snippet<[CellContext]>;
	};

	let {
		images,
		layout,
		class: className = '',
		fading = false,
		imageAlt = 'Immagine',
		onImageClick,
		cell
	}: Props = $props();

	const layoutClass = $derived(
		({
			stack: 'media-grid--stack',
			'grid-3': 'media-grid--grid-3',
			'grid-2': 'media-grid--grid-2',
			'grid-2x2': 'media-grid--grid-2x2'
		})[layout]
	);
</script>

<div
	class="media-grid {layoutClass} {className}"
	class:media-grid--fading={fading}
>
	{#each images as src, index}
		{#if cell}
			{@render cell({ src, index })}
		{:else}
			<button
				type="button"
				class="media-grid__default-cell"
				onclick={() => onImageClick?.(index)}
			>
				<img {src} alt={imageAlt} loading="lazy" />
			</button>
		{/if}
	{/each}
</div>

<style>
	.media-grid {
		display: grid;
		gap: 1.5rem;
	}

	.media-grid--stack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.media-grid--grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.media-grid--grid-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.media-grid--grid-2x2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.media-grid--fading {
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.media-grid__default-cell {
		background: none;
		border: none;
		cursor: pointer;
		display: block;
		padding: 0;
		width: 100%;
	}

	.media-grid__default-cell img {
		display: block;
		height: auto;
		width: 100%;
	}

	@media (max-width: 900px) {
		.media-grid--grid-3 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 600px) {
		.media-grid--grid-3,
		.media-grid--grid-2,
		.media-grid--grid-2x2 {
			grid-template-columns: 1fr;
		}
	}
</style>
