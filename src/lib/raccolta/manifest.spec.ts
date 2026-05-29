import { describe, expect, it } from 'vitest';
import { buildRaccoltaManifest } from './manifest';

describe('buildRaccoltaManifest', () => {
	it('includes Tutte as first filter category', () => {
		const manifest = buildRaccoltaManifest();

		expect(manifest.categories[0]).toEqual({ id: 'tutte', label: 'Tutte' });
	});

	it('includes chronological months with images and captions', () => {
		const manifest = buildRaccoltaManifest();

		expect(manifest.months.length).toBeGreaterThan(0);
		expect(manifest.months[0].id).toBe('febbraio');
		expect(manifest.months[0].images.length).toBeGreaterThan(0);
		expect(manifest.months[0].images[0].caption.length).toBeGreaterThan(0);
	});

	it('flattens all items for homepage sampling', () => {
		const manifest = buildRaccoltaManifest();
		const expectedCount = manifest.months.reduce((sum, month) => sum + month.images.length, 0);

		expect(manifest.allItems).toHaveLength(expectedCount);
	});
});
