# Image optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ridurre peso e LCP delle immagini statiche con `@sveltejs/enhanced-img`, componente UI condiviso, manifest aggiornati e script di normalizzazione per i master gallery/raccolta.

**Architecture:** `enhancedImages()` in Vite; glob `query: { enhanced: true }`; `OptimizedImage` con `sizes` per contesto; batch Sharp su JPG troppo grandi prima del primo build di produzione.

**Tech Stack:** SvelteKit 5, Vite 8, `@sveltejs/enhanced-img`, Sharp (dev script), Vitest

**Spec:** `docs/superpowers/specs/2026-06-04-image-optimization-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `vite.config.ts` | `enhancedImages()` before `sveltekit()` |
| `package.json` | `@sveltejs/enhanced-img`, `sharp`, script `normalize-images` |
| `scripts/normalize-images.mjs` | Resize JPEG in-place (max 2400px, q85) |
| `src/lib/images/types.ts` | `EnhancedImageSrc` type alias |
| `src/lib/images/sizes.ts` | `SIZES_GRID_HALF`, `SIZES_COLUMN`, `SIZES_GRID_THIRD`, `SIZES_LIGHTBOX`, `SIZES_SPECTROGRAM` |
| `src/lib/components/ui/OptimizedImage.svelte` | `<enhanced:img>` wrapper |
| `src/lib/gallery/manifest.ts` + `types.ts` | Enhanced glob |
| `src/lib/stampe/manifest.ts` + `types.ts` | Enhanced glob |
| `src/lib/raccolta/manifest.ts` + `types.ts` | Enhanced glob |
| `src/lib/audio/manifest.ts` | Enhanced glob for PNG |
| `src/lib/components/ui/MediaGrid.svelte` | `images: EnhancedImageSrc[]` |
| `src/lib/components/ui/MediaLightbox.svelte` | idem + `SIZES_LIGHTBOX` |
| `src/lib/components/stampe/StampeCard.svelte` | OptimizedImage + sizes third/half by parent |
| `src/lib/components/raccolta/RaccoltaCard.svelte` | OptimizedImage |
| `src/lib/components/audio/AudioSection.svelte` | OptimizedImage + fetchpriority |
| `src/lib/components/audio/AudioRecording.svelte` | OptimizedImage |
| `src/lib/gallery/manifest.spec.ts` | Assert enhanced src shape |
| `src/lib/stampe/manifest.spec.ts` | idem |
| `src/lib/raccolta/manifest.spec.ts` | idem |
| `src/lib/audio/manifest.spec.ts` | idem |

---

### Task 1: Plugin e dipendenze

**Files:**
- Modify: `package.json`, `vite.config.ts`

- [ ] **Step 1:** Install dev dependency:

```bash
npm i -D @sveltejs/enhanced-img sharp
```

- [ ] **Step 2:** Update `vite.config.ts`:

```typescript
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
	plugins: [
		enhancedImages(), // MUST be before sveltekit()
		sveltekit(),
		// ... test config unchanged
	]
});
```

- [ ] **Step 3:** Run `npm run build` once — expect longer first build; confirm no plugin order error.

- [ ] **Step 4:** Commit `chore: add enhanced-img vite plugin`

---

### Task 2: Tipi immagine e costanti `sizes`

**Files:**
- Create: `src/lib/images/types.ts`, `src/lib/images/sizes.ts`

- [ ] **Step 1:** `types.ts` — dopo install, importare il tipo dal pacchetto se esportato; altrimenti:

```typescript
/** Default export from `import.meta.glob(..., { query: { enhanced: true } })` */
export type EnhancedImageSrc = import('@sveltejs/enhanced-img').Picture;
```

Se `Picture` non esiste, usare:

```typescript
export type EnhancedImageSrc = {
	src: string;
	w: number;
	h: number;
	// allow index signature for imagetools metadata
	[key: string]: string | number | undefined;
};
```

Verificare con `npm run check` quale variante compila.

- [ ] **Step 2:** `sizes.ts`:

```typescript
export const SIZES_GRID_HALF = '(max-width: 600px) 100vw, 50vw';
export const SIZES_COLUMN = '(max-width: 640px) 100vw, 56rem';
export const SIZES_GRID_THIRD =
	'(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw';
export const SIZES_LIGHTBOX = 'min(90vw, 56rem)';
export const SIZES_SPECTROGRAM = SIZES_COLUMN;
```

- [ ] **Step 3:** Commit `feat(images): add enhanced src types and sizes constants`

---

### Task 3: OptimizedImage component

**Files:**
- Create: `src/lib/components/ui/OptimizedImage.svelte`

- [ ] **Step 1:** Implement component:

```svelte
<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/images/types';

	type Props = {
		src: EnhancedImageSrc;
		alt: string;
		sizes: string;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
	};

	let {
		src,
		alt,
		sizes,
		loading = 'lazy',
		fetchpriority,
		class: className = ''
	}: Props = $props();
</script>

<enhanced:img
	{src}
	{alt}
	{sizes}
	{loading}
	fetchpriority={fetchpriority}
	class={className}
/>
```

- [ ] **Step 2:** Run svelte-autofixer MCP on the file; fix any issues.

- [ ] **Step 3:** `npm run check` — pass.

- [ ] **Step 4:** Commit `feat(images): add OptimizedImage component`

---

### Task 4: Manifest — gallery e stampe

**Files:**
- Modify: `src/lib/gallery/manifest.ts`, `src/lib/gallery/types.ts`
- Modify: `src/lib/stampe/manifest.ts`, `src/lib/stampe/types.ts`
- Modify: `src/lib/gallery/manifest.spec.ts`, `src/lib/stampe/manifest.spec.ts`

- [ ] **Step 1:** Replace glob in both manifests:

```typescript
const imageModules = import.meta.glob(
	'/src/lib/content/gallery/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
	{
		eager: true,
		query: { enhanced: true },
		import: 'default'
	}
) as Record<string, EnhancedImageSrc>;
```

(Stampe path: `/src/lib/content/stampe/**/*.{jpg,jpeg,png,webp}`)

- [ ] **Step 2:** Update types — `images: EnhancedImageSrc[]`, `allImages: EnhancedImageSrc[]`.

- [ ] **Step 3:** Update specs — replace URL regex asserts with:

```typescript
expect(manifest.allImages[0]).toBeTypeOf('object');
expect(manifest.allImages[0]).toHaveProperty('src');
```

- [ ] **Step 4:** Run `npm test -- src/lib/gallery/manifest.spec.ts src/lib/stampe/manifest.spec.ts`

- [ ] **Step 5:** Commit `feat(images): enhanced glob for gallery and stampe manifests`

---

### Task 5: Manifest — raccolta e audio

**Files:**
- Modify: `src/lib/raccolta/manifest.ts`, `src/lib/raccolta/types.ts`, `manifest.spec.ts`
- Modify: `src/lib/audio/manifest.ts`, `manifest.spec.ts`

- [ ] **Step 1:** Raccolta — `RaccoltaImage.src` → `EnhancedImageSrc`; glob enhanced (same pattern as gallery).

- [ ] **Step 2:** Audio — PNG glob:

```typescript
const imageModules = import.meta.glob('/src/lib/content/audio/**/*.{png,PNG}', {
	eager: true,
	query: { enhanced: true },
	import: 'default'
}) as Record<string, EnhancedImageSrc>;
```

Update `AudioRecording.spectrogramSrc` type in `src/lib/audio/types.ts`.

- [ ] **Step 3:** Fix `manifest.spec.ts` for raccolta/audio (object src, not `.png$` string on src — assert path in module key or `src.src` string contains processed asset).

- [ ] **Step 4:** `npm test -- src/lib/raccolta/manifest.spec.ts src/lib/audio/manifest.spec.ts`

- [ ] **Step 5:** Commit `feat(images): enhanced glob for raccolta and audio`

---

### Task 6: MediaGrid e MediaLightbox

**Files:**
- Modify: `src/lib/components/ui/MediaGrid.svelte`, `MediaLightbox.svelte`
- Modify: `src/lib/components/gallery/GalleryGallery.svelte`, `GallerySection.svelte`
- Modify: `src/lib/components/stampe/StampeGallery.svelte`, `StampeSection.svelte`
- Modify: `src/lib/components/raccolta/RaccoltaGallery.svelte`, `RaccoltaSection.svelte`

- [ ] **Step 1:** MediaGrid — import `OptimizedImage`, `EnhancedImageSrc`, sizes constants:

```typescript
import OptimizedImage from './OptimizedImage.svelte';
import type { EnhancedImageSrc } from '$lib/images/types';
import { SIZES_GRID_HALF, SIZES_GRID_THIRD, SIZES_COLUMN } from '$lib/images/sizes';

type Props = {
	images: EnhancedImageSrc[];
	imageSizes?: string;
	// ...
};
```

Derive default sizes from layout:

```typescript
const resolvedSizes = $derived(
	imageSizes ??
		(layout === 'grid-3' ? SIZES_GRID_THIRD : layout === 'stack' ? SIZES_COLUMN : SIZES_GRID_HALF)
);
```

Replace default cell `<img>` with:

```svelte
<OptimizedImage src={src} alt={imageAlt} sizes={resolvedSizes} loading="lazy" />
```

- [ ] **Step 2:** MediaLightbox — `images: EnhancedImageSrc[]`; replace `<img>` with:

```svelte
<OptimizedImage
	src={images[index]}
	alt={imageAlt}
	sizes={SIZES_LIGHTBOX}
	loading="eager"
	class="media-lightbox__image"
/>
```

Adjust CSS: target `.media-lightbox__image` on wrapper or use `:global(img)` inside lightbox.

- [ ] **Step 3:** StampeGallery / RaccoltaGallery pass `imageSizes={SIZES_GRID_THIRD}` where layout grid-3; GalleryGallery stack uses default `SIZES_COLUMN`; homepage sections use grid-2x2 → `SIZES_GRID_HALF`.

- [ ] **Step 4:** StampeCard / RaccoltaCard — accept `EnhancedImageSrc`, use OptimizedImage with prop `sizes` passed from parent (add optional `sizes` prop defaulting to `SIZES_GRID_THIRD`).

- [ ] **Step 5:** `npm run check`

- [ ] **Step 6:** Commit `feat(images): wire OptimizedImage through grid, lightbox, cards`

---

### Task 7: Audio LCP

**Files:**
- Modify: `AudioSection.svelte`, `AudioRecording.svelte`

- [ ] **Step 1:** Replace spectrogram `<img>` with:

```svelte
<OptimizedImage
	src={preview.spectrogramSrc}
	alt="..."
	sizes={SIZES_SPECTROGRAM}
	loading="eager"
	fetchpriority="high"
	class="audio-recording__spectrogram"
/>
```

- [ ] **Step 2:** AudioRecording page variant: `loading="lazy"` (below fold on `/audio`).

- [ ] **Step 3:** Commit `feat(images): optimize audio spectrogram loading`

---

### Task 8: Script normalizzazione sorgenti

**Files:**
- Create: `scripts/normalize-images.mjs`
- Modify: `package.json` scripts

- [ ] **Step 1:** Add script:

```json
"normalize-images": "node scripts/normalize-images.mjs"
```

- [ ] **Step 2:** Implement `normalize-images.mjs`:

```javascript
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const MAX_EDGE = 2400;
const QUALITY = 85;
const ROOTS = [
	'src/lib/content/gallery',
	'src/lib/content/raccolta'
];

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const p = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(p);
		else if (/\.(jpe?g)$/i.test(entry.name)) yield p;
	}
}

for (const root of ROOTS) {
	for await (const file of walk(root)) {
		const img = sharp(file);
		const meta = await img.metadata();
		if (!meta.width || !meta.height) continue;
		const max = Math.max(meta.width, meta.height);
		if (max <= MAX_EDGE) continue;
		const resized = img.resize({
			width: meta.width >= meta.height ? MAX_EDGE : undefined,
			height: meta.height > meta.width ? MAX_EDGE : undefined,
			withoutEnlargement: true
		});
		const buf = await resized.jpeg({ quality: QUALITY }).toBuffer();
		await sharp(buf).toFile(file);
		console.log('resized', file, `${max} -> <=${MAX_EDGE}`);
	}
}
```

- [ ] **Step 3:** Run `npm run normalize-images` (long-running on gallery — confirm disk space).

- [ ] **Step 4:** Spot-check 2–3 images visually in dev.

- [ ] **Step 5:** Commit `chore: add image normalization script and run on gallery`

**Note:** Committing resized binaries may be a large commit; acceptable for this project goal.

---

### Task 9: Verification

- [ ] **Step 1:** `npm test`
- [ ] **Step 2:** `npm run check`
- [ ] **Step 3:** `npm run build` — record `du -sh build/` vs pre-change baseline if noted
- [ ] **Step 4:** Manual DevTools Network:
  - `/` — 4 gallery previews: single image request < 500 KB typical
  - `/gallery` — first visible image < 500 KB
  - Lightbox — srcset picks appropriate width
- [ ] **Step 5:** Lighthouse mobile on `/` and `/gallery` — document LCP element and total image bytes
- [ ] **Step 6:** Commit `chore: verify image optimization build` (only if loose files from verification)

---

## Plan self-review (spec coverage)

| Spec requirement | Task |
|------------------|------|
| enhanced-img plugin | Task 1 |
| Manifest glob enhanced | Tasks 4–5 |
| OptimizedImage + sizes | Tasks 2–3, 6 |
| LCP audio | Task 7 |
| Normalize gallery/raccolta | Task 8 |
| Tests + manual criteria A/B | Task 9 |
| Fuori scope CDN/layout | — |

No placeholders remain in task steps.
