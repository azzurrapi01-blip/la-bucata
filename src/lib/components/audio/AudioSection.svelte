<script lang="ts">
	import { onMount } from 'svelte';
	import { AUDIO_INTRO, AUDIO_PREVIEW_LINK, AUDIO_TITLE } from '$lib/audio/constants';
	import type { AudioRecording } from '$lib/audio/types';
	import { pickRandom } from '$lib/stampe/random';
	import { base } from '$app/paths';
	import './audio.css';

	type Props = {
		recordings: AudioRecording[];
	};

	let { recordings }: Props = $props();

	let preview = $state<AudioRecording | null>(null);
	let audioEl = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);

	const audioHref = `${base.replace(/\/$/, '')}/audio`;

	const playLabel = $derived(
		preview
			? playing
				? `Metti in pausa ${preview.luogo}`
				: `Ascolta ${preview.luogo}`
			: 'Ascolta anteprima'
	);

	onMount(() => {
		if (recordings.length === 0) return;
		preview = pickRandom(recordings, 1)[0] ?? null;
	});

	function togglePlayback() {
		if (!audioEl || !preview) return;

		if (playing) {
			audioEl.pause();
			return;
		}

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

<section class="audio audio--preview">
	<header class="audio__header">
		<h2 class="audio__title">{AUDIO_TITLE}</h2>
		<a class="audio__link" href={audioHref}>{AUDIO_PREVIEW_LINK}</a>
	</header>

	<p class="audio__intro">{AUDIO_INTRO}</p>

	{#if preview}
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
			src={preview.audioSrc}
			preload="metadata"
			onplay={handlePlay}
			onended={handleEnded}
			onpause={handlePause}
		></audio>

		<div class="audio__spectrogram-wrap">
			<img
				class="audio-recording__spectrogram"
				src={preview.spectrogramSrc}
				alt="Spettrogramma della registrazione a {preview.luogo}"
			/>
		</div>
	{/if}
</section>
