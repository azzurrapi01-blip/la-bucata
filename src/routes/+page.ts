import { base } from '$app/paths';
import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	const { allImages } = buildStampeManifest(base);
	return { allImages };
}) satisfies PageLoad;
