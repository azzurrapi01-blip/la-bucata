import { buildAudioManifest } from '$lib/audio/manifest';
import { buildGalleryManifest } from '$lib/gallery/manifest';
import { buildPercorsoManifest } from '$lib/percorso/manifest';
import { buildRaccoltaManifest } from '$lib/raccolta/manifest';
import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	const { recordings: audioRecordings } = buildAudioManifest();
	const { allImages: galleryAllImages } = buildGalleryManifest();
	const percorsoManifest = buildPercorsoManifest();
	const { allImages: stampeAllImages } = buildStampeManifest();
	const { allItems: raccoltaAllItems } = buildRaccoltaManifest();

	return { audioRecordings, percorsoManifest, galleryAllImages, stampeAllImages, raccoltaAllItems };
}) satisfies PageLoad;
