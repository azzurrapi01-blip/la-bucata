import { captionFromFilename } from './caption';
import { MONTH_LABELS, MONTH_ORDER } from './constants';
import type { RaccoltaCategory, RaccoltaImage, RaccoltaManifest, RaccoltaMonth } from './types';

const imageModules = import.meta.glob(
	'/src/lib/content/raccolta/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
	{
		eager: true,
		query: '?url',
		import: 'default'
	}
) as Record<string, string>;

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const MONTH_SEGMENT = /\/raccolta\/([^/]+)\//;

function monthIdFromPath(path: string): string | null {
	return path.match(MONTH_SEGMENT)?.[1] ?? null;
}

function basenameFromPath(path: string): string {
	return path.split('/').pop() ?? path;
}

function listMonthImages(monthId: string): RaccoltaImage[] {
	return Object.entries(imageModules)
		.filter(([path]) => IMAGE_EXT.test(path) && monthIdFromPath(path) === monthId)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src]) => ({
			src,
			caption: captionFromFilename(basenameFromPath(path))
		}));
}

export function buildRaccoltaManifest(): RaccoltaManifest {
	const months: RaccoltaMonth[] = (MONTH_ORDER as readonly string[])
		.map((id) => {
			const images = listMonthImages(id);
			if (images.length === 0) return null;

			return {
				id,
				label: MONTH_LABELS[id] ?? id,
				images
			} satisfies RaccoltaMonth;
		})
		.filter((month): month is RaccoltaMonth => month !== null);

	const categories: RaccoltaCategory[] = [
		{ id: 'tutte', label: 'Tutte' },
		...months.map(({ id, label }) => ({ id, label }))
	];

	const allItems = months.flatMap((month) => month.images);

	return { months, categories, allItems };
}
