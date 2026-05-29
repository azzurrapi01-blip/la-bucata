import { buildRaccoltaManifest } from '$lib/raccolta/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	const manifest = buildRaccoltaManifest();

	return { manifest };
}) satisfies PageLoad;
