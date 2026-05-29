import { describe, expect, it } from 'vitest';
import { formatCoordinateLabel, parseInfoMarkdown } from './parse-info';

describe('parseInfoMarkdown', () => {
	it('parses frontmatter and body', () => {
		const raw = `---
data: 16 Marzo 2026
coordinate: 43.114017,12.393665
descrizione_breve: Breve
percentuale: 0
luogo: Porta Pesa
---

Testo del corpo.`;

		const { frontmatter, body } = parseInfoMarkdown(raw);

		expect(frontmatter.luogo).toBe('Porta Pesa');
		expect(frontmatter.percentuale).toBe(0);
		expect(body).toBe('Testo del corpo.');
	});
});

describe('formatCoordinateLabel', () => {
	it('formats coordinates with a space after the comma', () => {
		expect(formatCoordinateLabel('43.114017,12.393665')).toBe(
			'Coordinate 43.114017, 12.393665'
		);
	});
});
