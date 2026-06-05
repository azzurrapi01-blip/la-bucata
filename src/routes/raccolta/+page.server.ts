import { buildRaccoltaManifest } from '$lib/raccolta/manifest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		manifest: buildRaccoltaManifest()
	};
};
