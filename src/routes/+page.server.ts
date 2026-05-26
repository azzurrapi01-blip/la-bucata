import { buildStampeManifest } from '$lib/stampe/manifest';

export function load() {
	const { allImages } = buildStampeManifest();
	return { allImages };
}

