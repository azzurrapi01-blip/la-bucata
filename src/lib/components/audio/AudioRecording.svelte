<script lang="ts">
	import type { AudioRecording } from '$lib/audio/types';

	type Props = {
		recording: AudioRecording;
		activeId: string | null;
		onActivate: (id: string) => void;
	};

	let { recording, activeId, onActivate }: Props = $props();

	let audioEl = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);

	const title = $derived(`Registrazione ${recording.number} — ${recording.luogo}`);
	const playLabel = $derived(
		playing ? `Metti in pausa ${recording.luogo}` : `Ascolta ${recording.luogo}`
	);

	$effect(() => {
		if (activeId !== recording.id && playing && audioEl) {
			audioEl.pause();
			playing = false;
		}
	});

	function togglePlayback() {
		if (!audioEl) return;

		if (playing) {
			audioEl.pause();
			return;
		}

		onActivate(recording.id);
		void audioEl.play();
	}

	function handlePlay() {
		playing = true;
	}

	function handleEnded() {
		playing = false;
	}

	function handlePause() {
		playing = false;
	}
</script>

<article class="audio-recording" aria-labelledby="{recording.id}-title">
	<h3 class="audio-recording__title" id="{recording.id}-title">{title}</h3>

	<div class="audio-recording__grid">
		<div class="audio-recording__meta">
			<p>{recording.data}</p>
			<p>{recording.coordinateLabel}</p>
		</div>
		<p class="audio-recording__body">{recording.body}</p>
	</div>

	<button
		type="button"
		class="audio-recording__play"
		aria-label={playLabel}
		aria-pressed={playing}
		onclick={togglePlayback}
	>
		{#if playing}
			<svg class="audio-recording__play-icon" viewBox="0 0 24 24" aria-hidden="true">
				<rect x="6" y="5" width="4" height="14" fill="currentColor" />
				<rect x="14" y="5" width="4" height="14" fill="currentColor" />
			</svg>
		{:else}
			<svg class="audio-recording__play-icon" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M8 5v14l11-7z" fill="currentColor" />
			</svg>
		{/if}
	</button>

	<audio
		bind:this={audioEl}
		src={recording.audioSrc}
		preload="metadata"
		onplay={handlePlay}
		onended={handleEnded}
		onpause={handlePause}
	></audio>

	<img
		class="audio-recording__spectrogram"
		src={recording.spectrogramSrc}
		alt="Spettrogramma della registrazione a {recording.luogo}"
		loading="lazy"
	/>
</article>
