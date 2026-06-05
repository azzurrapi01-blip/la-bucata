<script lang="ts">
	import { onMount } from 'svelte';
	import { AUDIO_INTRO, AUDIO_PREVIEW_LINK, AUDIO_TITLE } from '$lib/audio/constants';
	import type { AudioRecording } from '$lib/audio/types';
	import { pickRandom } from '$lib/stampe/random';
	import { base } from '$app/paths';
	import SpectrogramPlayer from './SpectrogramPlayer.svelte';
	import './audio.css';

	type Props = {
		recordings: AudioRecording[];
	};

	let { recordings }: Props = $props();

	let preview = $state<AudioRecording | null>(null);

	const audioHref = `${base.replace(/\/$/, '')}/audio`;

	onMount(() => {
		if (recordings.length === 0) return;
		preview = pickRandom(recordings, 1)[0] ?? null;
	});
</script>

<section class="audio audio--preview" id="audio">
	<header class="audio__header">
		<h2 class="audio__title">{AUDIO_TITLE}</h2>
	</header>

	<p class="audio__intro">{AUDIO_INTRO}</p>

	{#if preview}
		<article class="audio-recording audio-recording--preview" aria-labelledby="{preview.id}-title">
			<h3 class="audio-recording__title" id="{preview.id}-title">
				Registrazione {preview.number} — {preview.luogo}
			</h3>

			<div class="audio-recording__grid">
				<div class="audio-recording__meta">
					<p>{preview.data}</p>
					<p>{preview.coordinateLabel}</p>
				</div>
				<p class="audio-recording__body">{preview.body}</p>
			</div>

			<SpectrogramPlayer
				src={preview.audioSrc}
				spectrogramSrc={preview.spectrogramSrc}
				luogo={preview.luogo}
			/>
		</article>
	{/if}

	<a class="audio__cta" href={audioHref}>{AUDIO_PREVIEW_LINK}</a>
</section>
