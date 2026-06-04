import { buildGalleryManifest } from '$lib/gallery/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	return {
		manifest: buildGalleryManifest()
	};
}) satisfies PageLoad;
