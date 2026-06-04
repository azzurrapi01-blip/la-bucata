import { describe, expect, it } from 'vitest';
import { buildGalleryManifest } from './manifest';

describe('buildGalleryManifest', () => {
	it('includes Tutte as first category with images from gallery/tutte/', () => {
		const manifest = buildGalleryManifest();

		expect(manifest.categories[0].id).toBe('tutte');
		expect(manifest.categories[0].label).toBe('Tutte');
		expect(manifest.categories[0].images.length).toBeGreaterThan(0);
		expect(manifest.allImages).toEqual(manifest.categories[0].images);
	});

	it('includes area-urbana when folder has images', () => {
		const manifest = buildGalleryManifest();
		const areaUrbana = manifest.categories.find((c) => c.id === 'area-urbana');

		expect(areaUrbana).toBeDefined();
		expect(areaUrbana!.images.length).toBeGreaterThan(0);
	});

	it('includes all four category filters', () => {
		const manifest = buildGalleryManifest();
		const ids = manifest.categories.map((c) => c.id);

		expect(ids).toContain('tutte');
		expect(ids).toContain('area-urbana');
		expect(ids).toContain('area-semi-urbana');
		expect(ids).toContain('area-naturale');
	});
});
