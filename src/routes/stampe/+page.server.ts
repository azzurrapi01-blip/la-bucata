import { buildStampeManifest } from '$lib/stampe/manifest';
import { base } from '$app/paths';

export function load() {
	return {
		manifest: buildStampeManifest(process.cwd(), base)
	};
}

