import { buildStampeManifest } from '$lib/stampe/manifest';

export function load() {
	return {
		manifest: buildStampeManifest()
	};
}

