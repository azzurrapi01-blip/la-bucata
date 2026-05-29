import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	const { allImages } = buildStampeManifest();
	return { allImages };
}) satisfies PageLoad;
