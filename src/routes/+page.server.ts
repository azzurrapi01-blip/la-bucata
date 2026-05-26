import { buildStampeManifest } from '$lib/stampe/manifest';
import { base } from '$app/paths';

export function load() {
	const { allImages } = buildStampeManifest(process.cwd(), base);
	return { allImages };
}

