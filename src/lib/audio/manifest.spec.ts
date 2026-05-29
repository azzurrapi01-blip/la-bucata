import { describe, expect, it } from 'vitest';
import { buildAudioManifest } from './manifest';

describe('buildAudioManifest', () => {
	it('includes six recordings ordered along the path', () => {
		const { recordings } = buildAudioManifest();

		expect(recordings).toHaveLength(6);
		expect(recordings.map((recording) => recording.id)).toEqual([
			'tappa-01',
			'tappa-02',
			'tappa-03',
			'tappa-04',
			'tappa-05',
			'tappa-06'
		]);
	});

	it('exposes audio, spectrogram, and narrative text for each recording', () => {
		const { recordings } = buildAudioManifest();

		for (const recording of recordings) {
			expect(recording.audioSrc).toMatch(/\.wav$/i);
			expect(recording.spectrogramSrc).toMatch(/\.png$/i);
			expect(recording.body.length).toBeGreaterThan(0);
			expect(recording.luogo.length).toBeGreaterThan(0);
		}
	});
});
