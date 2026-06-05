import { buildGalleryManifest } from '$lib/gallery/manifest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		manifest: buildGalleryManifest()
	};
};
