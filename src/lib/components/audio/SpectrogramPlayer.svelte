<script lang="ts">
	type Props = {
		src: string;
		spectrogramSrc: string;
		luogo: string;
		shouldPause?: boolean;
		onBeforePlay?: () => void;
	};

	let { src, spectrogramSrc, luogo, shouldPause = false, onBeforePlay }: Props = $props();

	let audioEl = $state<HTMLAudioElement | null>(null);
	let stageEl = $state<HTMLElement | null>(null);
	let playing = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isDragging = $state(false);

	const playLabel = $derived(
		playing ? `Metti in pausa ${luogo}` : `Ascolta ${luogo}`
	);

	const progress = $derived(duration > 0 ? Math.min(1, currentTime / duration) : 0);
	const progressPercent = $derived(progress * 100);
	const isComplete = $derived(duration > 0 && currentTime >= duration);
	const showFullColor = $derived(isComplete || currentTime === 0);
	const showGrayscale = $derived(currentTime > 0 && !isComplete);
	const colorClipPercent = $derived(showFullColor ? 100 : progressPercent);
	const showDot = $derived(isDragging || playing || (progress > 0 && !isComplete));
	const canSeek = $derived(duration > 0);

	$effect(() => {
		if (shouldPause && playing && audioEl) {
			audioEl.pause();
		}
	});

	$effect(() => {
		src;
		currentTime = 0;
		duration = 0;
		playing = false;
		isDragging = false;
	});

	function syncDuration() {
		if (!audioEl) return;
		const next = Number.isFinite(audioEl.duration) ? audioEl.duration : 0;
		duration = next;
	}

	function syncCurrentTime() {
		if (!audioEl || isDragging) return;
		currentTime = audioEl.currentTime;
	}

	function ratioFromClientX(clientX: number): number {
		if (!stageEl) return 0;
		const rect = stageEl.getBoundingClientRect();
		if (rect.width <= 0) return 0;
		return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
	}

	function seekToRatio(ratio: number, play = false) {
		if (!audioEl || duration <= 0) return;

		const nextTime = ratio * duration;
		audioEl.currentTime = nextTime;
		currentTime = nextTime;

		if (play) {
			onBeforePlay?.();
			void audioEl.play();
		}
	}

	function togglePlayback() {
		if (!audioEl) return;

		if (playing) {
			audioEl.pause();
			return;
		}

		onBeforePlay?.();

		if (isComplete) {
			audioEl.currentTime = 0;
			currentTime = 0;
		}

		void audioEl.play();
	}

	function handleSeekBandClick(event: MouseEvent) {
		if (!canSeek || isDragging) return;
		seekToRatio(ratioFromClientX(event.clientX), true);
	}

	function handleDotPointerDown(event: PointerEvent) {
		if (!canSeek) return;

		const target = event.currentTarget as HTMLButtonElement;

		event.preventDefault();
		event.stopPropagation();

		isDragging = true;
		target.setPointerCapture(event.pointerId);
		onBeforePlay?.();
		seekToRatio(ratioFromClientX(event.clientX), true);
	}

	function handleDotPointerMove(event: PointerEvent) {
		if (!isDragging) return;
		seekToRatio(ratioFromClientX(event.clientX), true);
	}

	function endDotDrag(event: PointerEvent) {
		if (!isDragging) return;

		const target = event.currentTarget as HTMLButtonElement;

		isDragging = false;
		target.releasePointerCapture(event.pointerId);
	}

	function handlePlay() {
		playing = true;
	}

	function handlePause() {
		playing = false;
	}

	function handleEnded() {
		playing = false;
		if (audioEl) {
			currentTime = audioEl.duration;
		}
	}
</script>

<div class="spectrogram-player">
	<div class="audio-playback">
		<button
			type="button"
			class="audio-playback__play"
			aria-label={playLabel}
			aria-pressed={playing}
			onclick={togglePlayback}
		>
			{#if playing}
				<svg class="audio-playback__play-icon" viewBox="0 0 24 24" aria-hidden="true">
					<rect x="6" y="5" width="4" height="14" fill="currentColor" />
					<rect x="14" y="5" width="4" height="14" fill="currentColor" />
				</svg>
			{:else}
				<svg class="audio-playback__play-icon" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M8 5v14l11-7z" fill="currentColor" />
				</svg>
			{/if}
		</button>
	</div>

	<div class="spectrogram-player__stage" bind:this={stageEl}>
		<img
			class="spectrogram-player__image spectrogram-player__image--sizer"
			src={spectrogramSrc}
			alt=""
			aria-hidden="true"
			loading="lazy"
		/>

		<img
			class="spectrogram-player__image spectrogram-player__image--gray"
			class:spectrogram-player__image--gray-hidden={!showGrayscale}
			src={spectrogramSrc}
			alt=""
			aria-hidden="true"
			loading="lazy"
		/>

		<div
			class="spectrogram-player__color"
			style:clip-path="inset(0 {100 - colorClipPercent}% 0 0)"
		>
			<img
				class="spectrogram-player__image spectrogram-player__image--color"
				src={spectrogramSrc}
				alt="Spettrogramma della registrazione a {luogo}"
				loading="lazy"
			/>
		</div>

		{#if canSeek}
			<button
				type="button"
				class="spectrogram-player__seek-band"
				aria-label="Salta a una posizione nella registrazione"
				onclick={handleSeekBandClick}
			></button>
		{/if}

		{#if showDot}
			<button
				type="button"
				class="spectrogram-player__dot"
				class:spectrogram-player__dot--dragging={isDragging}
				style:left="{progressPercent}%"
				aria-label="Trascina per cambiare posizione"
				onpointerdown={handleDotPointerDown}
				onpointermove={handleDotPointerMove}
				onpointerup={endDotDrag}
				onpointercancel={endDotDrag}
			></button>
		{/if}
	</div>

	<audio
		bind:this={audioEl}
		{src}
		preload="metadata"
		ontimeupdate={syncCurrentTime}
		onloadedmetadata={syncDuration}
		ondurationchange={syncDuration}
		onplay={handlePlay}
		onended={handleEnded}
		onpause={handlePause}
	></audio>
</div>
