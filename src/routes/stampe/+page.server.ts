import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		manifest: buildStampeManifest()
	};
};
