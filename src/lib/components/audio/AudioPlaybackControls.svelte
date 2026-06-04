<script lang="ts">
	type Props = {
		src: string;
		luogo: string;
		shouldPause?: boolean;
		onBeforePlay?: () => void;
	};

	let { src, luogo, shouldPause = false, onBeforePlay }: Props = $props();

	let audioEl = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isSeeking = $state(false);

	const playLabel = $derived(
		playing ? `Metti in pausa ${luogo}` : `Ascolta ${luogo}`
	);

	const progressMax = $derived(duration > 0 ? duration : 0);

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
	});

	function syncDuration() {
		if (!audioEl) return;
		const next = Number.isFinite(audioEl.duration) ? audioEl.duration : 0;
		duration = next;
	}

	function syncCurrentTime() {
		if (!audioEl || isSeeking) return;
		currentTime = audioEl.currentTime;
	}

	function togglePlayback() {
		if (!audioEl) return;

		if (playing) {
			audioEl.pause();
			return;
		}

		onBeforePlay?.();
		void audioEl.play();
	}

	function handleSeek(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		const nextTime = Number(target.value);

		if (!Number.isFinite(nextTime) || !audioEl) return;

		audioEl.currentTime = nextTime;
		currentTime = nextTime;
	}

	function handlePlay() {
		playing = true;
	}

	function handlePause() {
		playing = false;
	}

	function handleEnded() {
		playing = false;
		currentTime = 0;
	}
</script>

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

	<input
		type="range"
		class="audio-playback__progress"
		min="0"
		max={progressMax}
		step="0.01"
		value={currentTime}
		disabled={progressMax === 0}
		aria-label="Progresso riproduzione"
		aria-valuemin={0}
		aria-valuemax={progressMax}
		aria-valuenow={currentTime}
		onmousedown={() => (isSeeking = true)}
		ontouchstart={() => (isSeeking = true)}
		oninput={handleSeek}
		onchange={() => (isSeeking = false)}
	/>
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
