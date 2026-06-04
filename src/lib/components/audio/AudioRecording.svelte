<script lang="ts">
	import type { AudioRecording } from '$lib/audio/types';
	import AudioPlaybackControls from './AudioPlaybackControls.svelte';

	type Props = {
		recording: AudioRecording;
		activeId: string | null;
		onActivate: (id: string) => void;
	};

	let { recording, activeId, onActivate }: Props = $props();

	const title = $derived(`Registrazione ${recording.number} — ${recording.luogo}`);
	const shouldPause = $derived(activeId !== null && activeId !== recording.id);
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

	<AudioPlaybackControls
		src={recording.audioSrc}
		luogo={recording.luogo}
		{shouldPause}
		onBeforePlay={() => onActivate(recording.id)}
	/>

	<img
		class="audio-recording__spectrogram"
		src={recording.spectrogramSrc}
		alt="Spettrogramma della registrazione a {recording.luogo}"
		loading="lazy"
	/>
</article>
