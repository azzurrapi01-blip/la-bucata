<script lang="ts">
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { AUDIO_INTRO, AUDIO_TITLE } from '$lib/audio/constants';
	import type { AudioManifest } from '$lib/audio/types';
	import AudioRecording from './AudioRecording.svelte';
	import './audio.css';

	type Props = {
		manifest: AudioManifest;
	};

	let { manifest }: Props = $props();

	let activeId = $state<string | null>(null);

	function activate(id: string) {
		activeId = id;
	}
</script>

<section class="audio">
	<SectionHeading
		title={AUDIO_TITLE}
		intro={AUDIO_INTRO}
		headingLevel={1}
		titleClass="audio__title"
		introClass="audio__intro"
	/>

	<div class="audio__list">
		{#each manifest.recordings as recording, index (recording.id)}
			{#if index > 0}
				<hr class="audio__divider" />
			{/if}
			<AudioRecording {recording} {activeId} onActivate={activate} />
		{/each}
	</div>
</section>
