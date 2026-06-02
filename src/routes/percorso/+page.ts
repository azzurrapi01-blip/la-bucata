import { buildPercorsoManifest } from '$lib/percorso/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		manifest: buildPercorsoManifest()
	};
}) satisfies PageLoad;
