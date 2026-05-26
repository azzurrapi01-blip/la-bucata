export const STAMPE_TITLE = 'Stampe botaniche';

export const STAMPE_INTRO = [
	'Ogni impronta conserva il respiro della natura.',
	'Foglie, fiori ed erbe diventano tracce delicate del tempo, trasformate in memoria.'
] as const;

export const STAMPE_CTA = 'Vedi tutte le stampe';

export const CATEGORY_LABELS: Record<string, string> = {
	tutte: 'Tutte',
	foglie: 'Foglie',
	felci: 'Felci',
	fiori: 'Fiori',
	erbe: 'Erbe',
	altre: 'Altre'
};

export const CATEGORY_ORDER = ['tutte', 'foglie', 'felci', 'fiori', 'erbe', 'altre'] as const;

export const STAMPE_COLORS = {
	background: '#B9C678',
	filterActive: '#8A9A4A',
	text: '#000000',
	card: '#FFFFFF'
} as const;
