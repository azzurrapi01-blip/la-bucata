import { captionFromFilename } from './caption';
import { MONTH_LABELS, MONTH_ORDER } from './constants';
import type { RaccoltaCategory, RaccoltaImage, RaccoltaManifest, RaccoltaMonth } from './types';

const fullImageModules = import.meta.glob(
	'/src/lib/content/raccolta/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}',
	{
		eager: true,
		query: {
			w: '1200',
			format: 'webp',
			quality: '82'
		},
		import: 'default'
	}
) as Record<string, string>;

const thumbImageModules = import.meta.glob(
	'/src/lib/content/raccolta/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}',
	{
		eager: true,
		query: {
			w: '640',
			format: 'webp',
			quality: '75'
		},
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
	return Object.keys(fullImageModules)
		.filter((path) => IMAGE_EXT.test(path) && monthIdFromPath(path) === monthId)
		.sort((a, b) => a.localeCompare(b))
		.map((path) => ({
			src: fullImageModules[path],
			thumb: thumbImageModules[path],
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
