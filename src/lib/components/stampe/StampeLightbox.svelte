<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		open: boolean;
		images: string[];
		index: number;
		navigable?: boolean;
		onClose: () => void;
		onIndexChange?: (index: number) => void;
	};

	let {
		open,
		images,
		index,
		navigable = false,
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
		class="stampe-lightbox"
		role="dialog"
		aria-modal="true"
		aria-label="Anteprima stampa"
		tabindex="-1"
		onclick={(event) => {
			if (event.target === event.currentTarget) onClose();
		}}
		onkeydown={(event) => {
			// Keyboard users can close with Escape on top of the global handler.
			if (event.key === 'Escape') onClose();
		}}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<button type="button" class="stampe-lightbox__close" aria-label="Chiudi" onclick={onClose}>
			×
		</button>

		{#if canGoPrev}
			<button
				type="button"
				class="stampe-lightbox__nav stampe-lightbox__nav--prev"
				aria-label="Immagine precedente"
				onclick={goPrev}
			>
				‹
			</button>
		{/if}

		<img class="stampe-lightbox__image" src={currentSrc} alt="Stampa botanica ingrandita" />

		{#if canGoNext}
			<button
				type="button"
				class="stampe-lightbox__nav stampe-lightbox__nav--next"
				aria-label="Immagine successiva"
				onclick={goNext}
			>
				›
			</button>
		{/if}
	</div>
{/if}

<style>
	.stampe-lightbox {
		align-items: center;
		background: rgb(0 0 0 / 85%);
		display: flex;
		inset: 0;
		justify-content: center;
		position: fixed;
		z-index: 1000;
	}

	.stampe-lightbox__image {
		max-height: 90vh;
		max-width: min(90vw, 56rem);
		object-fit: contain;
	}

	.stampe-lightbox__close,
	.stampe-lightbox__nav {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 2rem;
		line-height: 1;
		position: absolute;
	}

	.stampe-lightbox__close {
		right: 1rem;
		top: 1rem;
	}

	.stampe-lightbox__nav--prev {
		left: 1rem;
	}

	.stampe-lightbox__nav--next {
		right: 1rem;
	}
</style>

