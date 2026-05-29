import { buildAudioManifest } from '$lib/audio/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		manifest: buildAudioManifest()
	};
}) satisfies PageLoad;
