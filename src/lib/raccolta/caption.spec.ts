import { describe, expect, it } from 'vitest';
import { captionFromFilename } from './caption';

describe('captionFromFilename', () => {
	it('formats a simple common name', () => {
		expect(captionFromFilename('leccio.JPG')).toBe('Leccio');
	});

	it('formats a binomial-style name', () => {
		expect(captionFromFilename('galium-aparine.JPG')).toBe('Galium aparine');
	});

	it('strips a trailing numeric suffix', () => {
		expect(captionFromFilename('populus-x-canadensis-moench 2.JPG')).toBe(
			'Populus X Canadensis Moench'
		);
	});
});
