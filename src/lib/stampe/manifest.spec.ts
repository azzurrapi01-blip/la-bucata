import { describe, expect, it } from 'vitest';
import { buildStampeManifest } from './manifest';

describe('buildStampeManifest', () => {
	it('includes Tutte as first category with images from $lib/content/stampe/tutte/', () => {
		const manifest = buildStampeManifest();

		expect(manifest.categories[0].id).toBe('tutte');
		expect(manifest.categories[0].label).toBe('Tutte');
		expect(manifest.categories[0].images.length).toBeGreaterThan(0);
		expect(manifest.allImages).toEqual(manifest.categories[0].images);
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
		expect(foglie!.images.every((src) => src.length > 0)).toBe(true);
	});
});

