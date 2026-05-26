# Stampe botaniche — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Homepage preview + pagina `/stampe` con filtri per tipologia, griglia fedele al mockup, e lightbox.

**Architecture:** Manifest immagini generato a build time da `static/stampe/` (cartelle = categorie). Componenti Svelte 5 condivisi per scheda, griglia e lightbox. Anteprima random client-side; filtri e lightbox navigabile client-side su `/stampe`.

**Tech Stack:** SvelteKit 5 (runes), TypeScript, adapter-static, Vitest, CSS custom properties

**Spec:** `docs/superpowers/specs/2026-05-26-stampe-botaniche-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/lib/stampe/types.ts` | Tipi `StampeCategory`, `StampeManifest` |
| `src/lib/stampe/constants.ts` | Testi UI, mappa label categorie, token colore |
| `src/lib/stampe/manifest.ts` | `buildStampeManifest()` — legge cartelle a build time |
| `src/lib/stampe/random.ts` | `pickRandom(items, count)` |
| `src/lib/stampe/manifest.spec.ts` | Test manifest |
| `src/lib/stampe/random.spec.ts` | Test random |
| `src/lib/components/stampe/StampeCard.svelte` | Scheda bianca singola |
| `src/lib/components/stampe/StampeLightbox.svelte` | Overlay fullscreen |
| `src/lib/components/stampe/StampeGallery.svelte` | Filtri + griglia + lightbox navigabile |
| `src/lib/components/stampe/StampeSection.svelte` | Blocco homepage |
| `src/lib/components/stampe/stampe.css` | Token e classi condivise |
| `src/routes/stampe/+page.server.ts` | Load manifest |
| `src/routes/stampe/+page.svelte` | Pagina dedicata |
| `src/routes/+page.server.ts` | Load `allImages` per home |
| `src/routes/+page.svelte` | Include `StampeSection` |
| `src/routes/+layout.svelte` | Font serif globale |

---

### Task 1: Tipi e costanti

**Files:**
- Create: `src/lib/stampe/types.ts`
- Create: `src/lib/stampe/constants.ts`

- [ ] **Step 1: Creare `types.ts`**

```typescript
export type StampeCategory = {
	id: string;
	label: string;
	images: string[];
};

export type StampeManifest = {
	categories: StampeCategory[];
	allImages: string[];
};
```

- [ ] **Step 2: Creare `constants.ts`**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/stampe/types.ts src/lib/stampe/constants.ts
git commit -m "feat(stampe): add types and constants"
```

---

### Task 2: Manifest builder + test

**Files:**
- Create: `src/lib/stampe/manifest.ts`
- Create: `src/lib/stampe/manifest.spec.ts`

- [ ] **Step 1: Scrivere test fallente `manifest.spec.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { buildStampeManifest } from './manifest';

describe('buildStampeManifest', () => {
	it('includes Tutte as first category with images from tutte/', () => {
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
		expect(foglie!.images.every((src) => src.startsWith('/stampe/foglie/'))).toBe(true);
	});
});
```

- [ ] **Step 2: Eseguire test — deve fallire**

Run: `npm run test:unit -- src/lib/stampe/manifest.spec.ts --run`  
Expected: FAIL — module `./manifest` not found

- [ ] **Step 3: Implementare `manifest.ts`**

```typescript
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants';
import type { StampeCategory, StampeManifest } from './types';

const STAMPE_ROOT = 'static/stampe';
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function listImages(categoryId: string, cwd: string): string[] {
	const dir = join(cwd, STAMPE_ROOT, categoryId);
	if (!existsSync(dir)) return [];

	return readdirSync(dir)
		.filter((file) => IMAGE_EXT.test(file))
		.sort((a, b) => a.localeCompare(b))
		.map((file) => `/stampe/${categoryId}/${file}`);
}

export function buildStampeManifest(cwd = process.cwd()): StampeManifest {
	const allImages = listImages('tutte', cwd);

	const categories: StampeCategory[] = CATEGORY_ORDER.map((id) => {
		const images = listImages(id, cwd);
		if (images.length === 0) return null;
		return {
			id,
			label: CATEGORY_LABELS[id] ?? id,
			images
		};
	}).filter((category): category is StampeCategory => category !== null);

	return { categories, allImages };
}
```

- [ ] **Step 4: Eseguire test — deve passare**

Run: `npm run test:unit -- src/lib/stampe/manifest.spec.ts --run`  
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/stampe/manifest.ts src/lib/stampe/manifest.spec.ts
git commit -m "feat(stampe): build manifest from static folders"
```

---

### Task 3: Helper random + test

**Files:**
- Create: `src/lib/stampe/random.ts`
- Create: `src/lib/stampe/random.spec.ts`

- [ ] **Step 1: Scrivere test fallente `random.spec.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { pickRandom } from './random';

describe('pickRandom', () => {
	it('returns exactly count distinct items', () => {
		const items = ['a', 'b', 'c', 'd', 'e'];
		const result = pickRandom(items, 2);
		expect(result).toHaveLength(2);
		expect(new Set(result).size).toBe(2);
	});

	it('returns all items when count exceeds length', () => {
		const items = ['a', 'b'];
		const result = pickRandom(items, 5);
		expect(result).toHaveLength(2);
	});
});
```

- [ ] **Step 2: Eseguire test — deve fallire**

Run: `npm run test:unit -- src/lib/stampe/random.spec.ts --run`  
Expected: FAIL

- [ ] **Step 3: Implementare `random.ts`**

```typescript
export function pickRandom<T>(items: T[], count: number): T[] {
	if (count >= items.length) return [...items];
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy.slice(0, count);
}
```

- [ ] **Step 4: Eseguire test — deve passare**

Run: `npm run test:unit -- src/lib/stampe/random.spec.ts --run`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/stampe/random.ts src/lib/stampe/random.spec.ts
git commit -m "feat(stampe): add pickRandom helper"
```

---

### Task 4: Stili condivisi

**Files:**
- Create: `src/lib/components/stampe/stampe.css`

- [ ] **Step 1: Creare `stampe.css`**

```css
.stampe {
	--stampe-bg: #b9c678;
	--stampe-filter-active: #8a9a4a;
	--stampe-text: #000000;
	--stampe-card: #ffffff;
	background: var(--stampe-bg);
	color: var(--stampe-text);
	padding: 3rem 1.5rem;
}

.stampe__title {
	font-size: clamp(2rem, 4vw, 3rem);
	font-weight: 700;
	margin: 0 0 1rem;
}

.stampe__intro {
	font-size: 1.125rem;
	line-height: 1.6;
	margin: 0 0 2rem;
	max-width: 42rem;
}

.stampe__intro p {
	margin: 0;
}

.stampe__filters {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem 1.25rem;
	margin-bottom: 2rem;
}

.stampe__filter {
	background: none;
	border: none;
	color: var(--stampe-text);
	cursor: pointer;
	font: inherit;
	padding: 0.35rem 0.75rem;
}

.stampe__filter--active {
	background: var(--stampe-filter-active);
}

.stampe__grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
}

.stampe__grid--preview {
	grid-template-columns: repeat(2, minmax(0, 12rem));
	margin-bottom: 2rem;
}

.stampe__card {
	background: var(--stampe-card);
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 3 / 4;
	padding: 1.5rem;
}

.stampe__card img {
	display: block;
	max-height: 100%;
	max-width: 100%;
	object-fit: contain;
}

.stampe__cta {
	background: var(--stampe-text);
	color: var(--stampe-card);
	display: inline-block;
	font: inherit;
	padding: 0.75rem 1.25rem;
	text-decoration: none;
}

.stampe__grid--fading {
	opacity: 0;
	transition: opacity 200ms ease;
}

@media (max-width: 900px) {
	.stampe__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 600px) {
	.stampe__grid {
		grid-template-columns: 1fr;
	}

	.stampe__grid--preview {
		grid-template-columns: 1fr;
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/stampe/stampe.css
git commit -m "feat(stampe): add shared styles"
```

---

### Task 5: StampeCard

**Files:**
- Create: `src/lib/components/stampe/StampeCard.svelte`

- [ ] **Step 1: Creare componente**

```svelte
<script lang="ts">
	type Props = {
		src: string;
		alt?: string;
		onclick?: () => void;
	};

	let { src, alt = 'Stampa botanica', onclick }: Props = $props();
</script>

<button type="button" class="stampe__card" {onclick}>
	<img {src} {alt} loading="lazy" />
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/stampe/StampeCard.svelte
git commit -m "feat(stampe): add StampeCard component"
```

---

### Task 6: StampeLightbox

**Files:**
- Create: `src/lib/components/stampe/StampeLightbox.svelte`

- [ ] **Step 1: Creare componente**

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		open: boolean;
		images: string[];
		index: number;
		navigable?: boolean;
		onclose: () => void;
		onindexchange?: (index: number) => void;
	};

	let {
		open,
		images,
		index,
		navigable = false,
		onclose,
		onindexchange
	}: Props = $props();

	const canGoPrev = $derived(navigable && images.length > 1 && index > 0);
	const canGoNext = $derived(navigable && images.length > 1 && index < images.length - 1);
	const currentSrc = $derived(images[index] ?? '');

	function goPrev() {
		if (canGoPrev) onindexchange?.(index - 1);
	}

	function goNext() {
		if (canGoNext) onindexchange?.(index + 1);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') onclose();
		if (!navigable) return;
		if (event.key === 'ArrowLeft') goPrev();
		if (event.key === 'ArrowRight') goNext();
	}

	let touchStartX = 0;

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.changedTouches[0]?.clientX ?? 0;
	}

	function handleTouchEnd(event: TouchEvent) {
		if (!navigable) return;
		const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX;
		if (delta > 50) goPrev();
		if (delta < -50) goNext();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<div
		class="stampe-lightbox"
		role="dialog"
		aria-modal="true"
		aria-label="Anteprima stampa"
		onclick={(event) => {
			if (event.target === event.currentTarget) onclose();
		}}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<button type="button" class="stampe-lightbox__close" aria-label="Chiudi" onclick={onclose}>
			×
		</button>

		{#if canGoPrev}
			<button type="button" class="stampe-lightbox__nav stampe-lightbox__nav--prev" onclick={goPrev}>
				‹
			</button>
		{/if}

		<img class="stampe-lightbox__image" src={currentSrc} alt="Stampa botanica ingrandita" />

		{#if canGoNext}
			<button type="button" class="stampe-lightbox__nav stampe-lightbox__nav--next" onclick={goNext}>
				›
			</button>
		{/if}
	</div>
{/if}

<style>
	.stampe-lightbox {
		align-items: center;
		background: rgb(0 0 0 / 85%);
		display: flex;
		inset: 0;
		justify-content: center;
		position: fixed;
		z-index: 1000;
	}

	.stampe-lightbox__image {
		max-height: 90vh;
		max-width: min(90vw, 56rem);
		object-fit: contain;
	}

	.stampe-lightbox__close,
	.stampe-lightbox__nav {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 2rem;
		line-height: 1;
		position: absolute;
	}

	.stampe-lightbox__close {
		right: 1rem;
		top: 1rem;
	}

	.stampe-lightbox__nav--prev {
		left: 1rem;
	}

	.stampe-lightbox__nav--next {
		right: 1rem;
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/stampe/StampeLightbox.svelte
git commit -m "feat(stampe): add lightbox with optional navigation"
```

---

### Task 7: StampeGallery (pagina `/stampe`)

**Files:**
- Create: `src/lib/components/stampe/StampeGallery.svelte`
- Create: `src/routes/stampe/+page.server.ts`
- Create: `src/routes/stampe/+page.svelte`

- [ ] **Step 1: Creare `+page.server.ts`**

```typescript
import { buildStampeManifest } from '$lib/stampe/manifest';

export function load() {
	return buildStampeManifest();
}
```

- [ ] **Step 2: Creare `StampeGallery.svelte`**

```svelte
<script lang="ts">
	import StampeCard from './StampeCard.svelte';
	import StampeLightbox from './StampeLightbox.svelte';
	import { STAMPE_INTRO, STAMPE_TITLE } from '$lib/stampe/constants';
	import type { StampeManifest } from '$lib/stampe/types';
	import './stampe.css';

	type Props = {
		manifest: StampeManifest;
	};

	let { manifest }: Props = $props();

	let activeCategoryId = $state('tutte');
	let fading = $state(false);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	const activeCategory = $derived(
		manifest.categories.find((category) => category.id === activeCategoryId) ??
			manifest.categories[0]
	);
	const visibleImages = $derived(activeCategory?.images ?? []);

	function selectCategory(id: string) {
		if (id === activeCategoryId) return;
		fading = true;
		setTimeout(() => {
			activeCategoryId = id;
			fading = false;
		}, 200);
	}

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section class="stampe">
	<h1 class="stampe__title">{STAMPE_TITLE}</h1>
	<div class="stampe__intro">
		{#each STAMPE_INTRO as line}
			<p>{line}</p>
		{/each}
	</div>

	<div class="stampe__filters" role="tablist" aria-label="Filtra stampe">
		{#each manifest.categories as category}
			<button
				type="button"
				class="stampe__filter"
				class:stampe__filter--active={category.id === activeCategoryId}
				role="tab"
				aria-selected={category.id === activeCategoryId}
				onclick={() => selectCategory(category.id)}
			>
				{category.label}
			</button>
		{/each}
	</div>

	<div class="stampe__grid" class:stampe__grid--fading={fading}>
		{#each visibleImages as src, index}
			<StampeCard {src} onclick={() => openLightbox(index)} />
		{/each}
	</div>

	<StampeLightbox
		open={lightboxOpen}
		images={visibleImages}
		index={lightboxIndex}
		navigable={true}
		onclose={() => (lightboxOpen = false)}
		onindexchange={(index) => (lightboxIndex = index)}
	/>
</section>
```

- [ ] **Step 3: Creare `+page.svelte`**

```svelte
<script lang="ts">
	import StampeGallery from '$lib/components/stampe/StampeGallery.svelte';

	let { data } = $props();
</script>

<StampeGallery manifest={data} />
```

- [ ] **Step 4: Verificare pagina**

Run: `npm run dev` → visitare `http://localhost:5173/stampe`  
Expected: titolo, filtri, griglia 3 colonne, filtro Tutte attivo, lightbox con frecce

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/stampe/StampeGallery.svelte src/routes/stampe/+page.server.ts src/routes/stampe/+page.svelte
git commit -m "feat(stampe): add gallery page with filters and lightbox"
```

---

### Task 8: StampeSection (homepage)

**Files:**
- Create: `src/lib/components/stampe/StampeSection.svelte`
- Create: `src/routes/+page.server.ts`
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Creare `+page.server.ts` (root)**

```typescript
import { buildStampeManifest } from '$lib/stampe/manifest';

export function load() {
	const { allImages } = buildStampeManifest();
	return { allImages };
}
```

- [ ] **Step 2: Creare `StampeSection.svelte`**

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import StampeCard from './StampeCard.svelte';
	import StampeLightbox from './StampeLightbox.svelte';
	import { STAMPE_CTA, STAMPE_INTRO, STAMPE_TITLE } from '$lib/stampe/constants';
	import { pickRandom } from '$lib/stampe/random';
	import './stampe.css';

	type Props = {
		allImages: string[];
	};

	let { allImages }: Props = $props();

	let previewImages = $state<string[]>([]);
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	onMount(() => {
		previewImages = pickRandom(allImages, 2);
	});

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section class="stampe">
	<h2 class="stampe__title">{STAMPE_TITLE}</h2>
	<div class="stampe__intro">
		{#each STAMPE_INTRO as line}
			<p>{line}</p>
		{/each}
	</div>

	{#if previewImages.length > 0}
		<div class="stampe__grid stampe__grid--preview">
			{#each previewImages as src, index}
				<StampeCard {src} onclick={() => openLightbox(index)} />
			{/each}
		</div>
	{/if}

	<a class="stampe__cta" href="/stampe">{STAMPE_CTA}</a>

	<StampeLightbox
		open={lightboxOpen}
		images={previewImages}
		index={lightboxIndex}
		navigable={false}
		onclose={() => (lightboxOpen = false)}
	/>
</section>
```

- [ ] **Step 3: Aggiornare `+page.svelte`**

```svelte
<script lang="ts">
	import StampeSection from '$lib/components/stampe/StampeSection.svelte';

	let { data } = $props();
</script>

<StampeSection allImages={data.allImages} />
```

- [ ] **Step 4: Verificare homepage**

Run: `npm run dev` → visitare `/`  
Expected: titolo, testo, 2 anteprime, pulsante; refresh cambia le 2 immagini; click → lightbox senza frecce

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/stampe/StampeSection.svelte src/routes/+page.server.ts src/routes/+page.svelte
git commit -m "feat(stampe): add homepage preview section"
```

---

### Task 9: Font serif e build finale

**Files:**
- Modify: `src/routes/+layout.svelte`
- Modify: `src/app.html` (se necessario preconnect)

- [ ] **Step 1: Aggiungere Lora in `+layout.svelte`**

```svelte
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="site">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Lora', Georgia, 'Times New Roman', serif;
	}
</style>
```

- [ ] **Step 2: Verificare build statico**

Run: `npm run check && npm run test:unit -- --run && npm run build`  
Expected: nessun errore; pagina `/stampe` in `build/stampe/index.html`

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat(stampe): add serif typography and verify static build"
```

---

## Spec Coverage Checklist

| Requirement | Task |
|-------------|------|
| Homepage: titolo, testo, 2 anteprime, pulsante | Task 8 |
| Anteprime random a ogni visita | Task 3 + Task 8 |
| Lightbox home: solo immagine cliccata | Task 6 + Task 8 (`navigable=false`) |
| Pagina `/stampe` fedele al mockup | Task 4 + Task 7 |
| Filtri con pillola attiva + fade | Task 4 + Task 7 |
| Lightbox `/stampe` navigabile nel filtro attivo | Task 6 + Task 7 |
| Erbe nascosto finché cartella vuota | Task 2 |
| Manifest da cartelle | Task 2 |
| Mobile responsive | Task 4 |
| Font serif | Task 9 |

## Out of Scope (non implementare)

- Didascalie botaniche
- Integrazione sezione `gallery/`
- E2E Playwright (fase 2 opzionale)
