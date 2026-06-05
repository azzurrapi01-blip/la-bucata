import { buildAudioManifest } from '$lib/audio/manifest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		manifest: buildAudioManifest()
	};
};
