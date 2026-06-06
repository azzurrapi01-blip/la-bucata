import { describe, expect, it } from 'vitest';
import { buildStampeManifest } from './manifest';

describe('buildStampeManifest', () => {
	it('includes Tutte as first virtual category combining other filters', () => {
		const manifest = buildStampeManifest();

		expect(manifest.categories[0].id).toBe('tutte');
		expect(manifest.categories[0].label).toBe('Tutte');
		expect(manifest.categories[0].images.length).toBeGreaterThan(0);
		expect(manifest.allImages).toEqual(manifest.categories[0].images);

		const sourceCount = manifest.categories
			.filter((category) => category.id !== 'tutte')
			.reduce((sum, category) => sum + category.images.length, 0);
		expect(manifest.categories[0].images).toHaveLength(sourceCount);
	});

	it('excludes empty or missing categories like erbe', () => {
		const manifest = buildStampeManifest();

		const ids = manifest.categories.map((c) => c.id);
		expect(ids).not.toContain('erbe');
	});

	it('includes foglie when folder has images', () => {
		const manifest = buildStampeManifest();
		const foglie = manifest.categories.find((c) => c.id === 'foglie');

		expect(foglie).toBeDefined();
		expect(foglie!.images.length).toBeGreaterThan(0);
		expect(foglie!.images.every((image) => image.src.length > 0 && image.thumb.length > 0)).toBe(
			true
		);
	});
});

