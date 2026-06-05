import { buildPercorsoManifest } from '$lib/percorso/manifest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		manifest: buildPercorsoManifest()
	};
};
