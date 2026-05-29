import { base } from '$app/paths';
import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		manifest: buildStampeManifest(base)
	};
}) satisfies PageLoad;
