<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		open: boolean;
		images: string[];
		index: number;
		navigable?: boolean;
		imageAlt?: string;
		dialogLabel?: string;
		onClose: () => void;
		onIndexChange?: (index: number) => void;
	};

	let {
		open,
		images,
		index,
		navigable = false,
		imageAlt = 'Immagine ingrandita',
		dialogLabel = 'Anteprima immagine',
		onClose,
		onIndexChange
	}: Props = $props();

	const canGoPrev = $derived(navigable && images.length > 1 && index > 0);
	const canGoNext = $derived(navigable && images.length > 1 && index < images.length - 1);
	const currentSrc = $derived(images[index] ?? '');

	function goPrev() {
		if (!canGoPrev) return;
		onIndexChange?.(index - 1);
	}

	function goNext() {
		if (!canGoNext) return;
		onIndexChange?.(index + 1);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;

		if (event.key === 'Escape') {
			onClose();
			return;
		}

		if (!navigable) return;

		if (event.key === 'ArrowLeft') goPrev();
		if (event.key === 'ArrowRight') goNext();
	}

	let touchStartX = 0;

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.changedTouches[0]?.clientX ?? 0;
	}

	function handleTouchEnd(event: TouchEvent) {
		if (!navigable) return;

		const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX;
		if (delta > 50) goPrev();
		if (delta < -50) goNext();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<div
		class="media-lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={dialogLabel}
		tabindex="-1"
		onclick={(event) => {
			if (event.target === event.currentTarget) onClose();
		}}
		onkeydown={(event) => {
			if (event.key === 'Escape') onClose();
		}}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<button type="button" class="media-lightbox__close" aria-label="Chiudi" onclick={onClose}>
			×
		</button>

		{#if canGoPrev}
			<button
				type="button"
				class="media-lightbox__nav media-lightbox__nav--prev"
				aria-label="Immagine precedente"
				onclick={goPrev}
			>
				‹
			</button>
		{/if}

		<img class="media-lightbox__image" src={currentSrc} alt={imageAlt} />

		{#if canGoNext}
			<button
				type="button"
				class="media-lightbox__nav media-lightbox__nav--next"
				aria-label="Immagine successiva"
				onclick={goNext}
			>
				›
			</button>
		{/if}
	</div>
{/if}

<style>
	.media-lightbox {
		align-items: center;
		background: rgb(0 0 0 / 85%);
		display: flex;
		inset: 0;
		justify-content: center;
		position: fixed;
		z-index: 1000;
	}

	.media-lightbox__image {
		max-height: 90vh;
		max-width: min(90vw, 56rem);
		object-fit: contain;
	}

	.media-lightbox__close,
	.media-lightbox__nav {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 2rem;
		line-height: 1;
		position: absolute;
	}

	.media-lightbox__close {
		right: 1rem;
		top: 1rem;
	}

	.media-lightbox__nav--prev {
		left: 1rem;
	}

	.media-lightbox__nav--next {
		right: 1rem;
	}
</style>
