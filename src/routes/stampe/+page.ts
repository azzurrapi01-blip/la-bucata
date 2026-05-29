import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		manifest: buildStampeManifest()
	};
}) satisfies PageLoad;
