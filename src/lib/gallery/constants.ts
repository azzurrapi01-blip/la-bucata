export const GALLERY_TITLE = 'Gallery';

export const GALLERY_INTRO =
	'Le immagini raccontano il passaggio graduale dalla dimensione urbana della città a quella naturale del sentiero, dove architetture e traffico lasciano spazio alla vegetazione, al fiume e al paesaggio fluviale.';

export const GALLERY_CTA = 'Vedi tutta la gallery';

export const CATEGORY_LABELS: Record<string, string> = {
	tutte: 'Tutte',
	'area-urbana': 'Area urbana',
	'area-semi-urbana': 'Area semi-urbana',
	'area-naturale': 'Area naturale'
};

export const CATEGORY_ORDER = [
	'tutte',
	'area-urbana',
	'area-semi-urbana',
	'area-naturale'
] as const;

export const GALLERY_COLORS = {
	background: '#E5C76B',
	filterActive: '#FFFFFF',
	text: '#000000'
} as const;
