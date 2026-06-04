import { describe, expect, it } from 'vitest';
import { parseAboutMarkdown, splitAboutParagraphs } from './parse-info';

const sampleAbout = `---
titolo: About
---

Primo paragrafo breve. Il percorso continua nel secondo blocco.`;

describe('parseAboutMarkdown', () => {
	it('reads the about title from frontmatter', () => {
		const { frontmatter } = parseAboutMarkdown(sampleAbout);
		expect(frontmatter.titolo).toBe('About');
	});
});

describe('splitAboutParagraphs', () => {
	it('splits a single block before "Il percorso"', () => {
		const paragraphs = splitAboutParagraphs(
			'“La bucata” è un progetto. Il percorso è diventato un archivio.'
		);
		expect(paragraphs).toEqual([
			'“La bucata” è un progetto.',
			'Il percorso è diventato un archivio.'
		]);
	});
});
