# Gallery — Design Spec

**Date:** 2026-05-29  
**Status:** Approved  
**Project:** La bucata

---

## Overview

Sezione fotografica del percorso urbano → naturale, con filtri per area. Comprende un'anteprima in homepage (sopra le Stampe) e una pagina dedicata `/gallery`. Architettura **gemella delle Stampe** (approccio 1), con **componenti UI condivisi** estratti per le pagine di dettaglio e refactor delle Stampe.

---

## Requirements

### Homepage (`/`)

**Ordine sezioni:** Gallery → Stampe.

#### Blocco Gallery

1. Titolo: **Gallery**
2. Testo introduttivo (un paragrafo):
   - *Le immagini raccontano il passaggio graduale dalla dimensione urbana della città a quella naturale del sentiero, dove architetture e traffico lasciano spazio alla vegetazione, al fiume e al paesaggio fluviale.*
3. **Griglia 2×2**: 4 foto scelte **a caso a ogni visita** dall'intera collezione (`tutte/`).
4. Immagini a tutta cella, **senza scheda bianca** (paesaggio, come in `/gallery`).
5. Sfondo **giallo ocra** del mockup (valore iniziale `#E5C76B`, rifinitura visiva ammessa).
6. Pulsante **Vedi tutta la gallery** → `/gallery` (stile CTA nero come Stampe).
7. Click su un'immagine → lightbox con navigazione **solo tra le 4 anteprime** (avanti/indietro, X, sfondo, Esc, swipe su mobile).
8. Su mobile: griglia responsive (es. 1 colonna stretta o 2×2 ridotta) senza perdere leggibilità.

#### Blocco Stampe (esistente)

Invariato nel contenuto; resta **sotto** Gallery.

---

### Pagina dedicata (`/gallery`)

- Stesso titolo e intro del blocco homepage.
- Filtri: **Tutte · Area urbana · Area semi-urbana · Area naturale**
- **Colonna singola**: immagini una sotto l'altra, larghezza generosa, gap verticale regolare, nessuna scheda bianca.
- Filtro attivo: **pillola bianca** `#FFFFFF`, testo nero.
- Filtri inattivi: solo testo nero.
- Cambio filtro → dissolvenza breve (~200ms), senza reload.
- Click su immagine → lightbox fullscreen con navigazione tra **tutte le foto del filtro attivo**.
- Chiusura lightbox: X, click sfondo, Esc; swipe su mobile.
- Ordine immagini: ordine dei file nella cartella (nomi `97_PPL…` = sequenza narrativa).
- Su mobile: colonna singola; filtri a capo se necessario.

---

## Visual Design

| Elemento | Gallery | Stampe (riferimento) |
|----------|---------|----------------------|
| Sfondo | Giallo ocra `#E5C76B` (approx.) | Verde salvia `#B9C678` |
| Testo | Nero `#000000` | Nero `#000000` |
| Filtro attivo | Bianco `#FFFFFF` | Verde oliva `#8A9A4A` |
| Layout pagina dettaglio | Colonna singola | Griglia 3 col + scheda bianca |
| Homepage anteprima | Griglia 2×2, 4 random | 2 affiancate, 2 random |
| Tipografia | Lora (globale) | Lora |

Le sezioni Gallery e Stampe impostano le proprie **CSS custom properties** sul wrapper (es. `--section-bg`, `--filter-active-bg`) consumate dai componenti condivisi.

---

## Data Model

### Organizzazione file

```
src/lib/content/gallery/
├── tutte/              ← 58 immagini
├── area-urbana/        ← 3
├── area-semi-urbana/   ← 31
└── area-naturale/      ← 23
```

(Mirror in `static/gallery/` per deploy statico, come Stampe.)

| ID cartella | Etichetta UI |
|-------------|--------------|
| `tutte` | Tutte |
| `area-urbana` | Area urbana |
| `area-semi-urbana` | Area semi-urbana |
| `area-naturale` | Area naturale |

- Manifest generato **a build time** da `import.meta.glob` (stesso pattern di `buildStampeManifest()`).
- Categorie senza immagini → filtro non mostrato.

### Manifest

```typescript
type GalleryCategory = {
  id: string;
  label: string;
  images: string[];
};

type GalleryManifest = {
  categories: GalleryCategory[];
  allImages: string[];
};
```

---

## Architecture

### Componenti condivisi (pagine di dettaglio + refactor Stampe)

Posizione: `src/lib/components/ui/`

| Componente | Responsabilità | Props principali |
|------------|----------------|------------------|
| `SectionHeading.svelte` | Titolo + sottotitolo/intro | `title: string`, `intro: string \| readonly string[]` |
| `CategoryFilters.svelte` | Lista filtri orizzontale | `categories: { id, label }[]`, `activeId`, `onSelect(id)` — stili via classi/CSS vars del parent |
| `MediaGrid.svelte` | Griglia/stack immagini cliccabili | `images: string[]`, `layout: 'stack' \| 'grid-3' \| 'grid-2' \| 'grid-2x2'`, `fading?: boolean`, `onImageClick(index)`, slot opzionale `cell` per scheda custom (Stampe) |
| `MediaLightbox.svelte` | Overlay fullscreen | `open`, `images`, `index`, `navigable`, `onClose`, `onIndexChange`, `imageAlt` |

**Principi:**

- Nessun colore hardcoded nei componenti `ui/`; il wrapper sezione (`.gallery`, `.stampe`) definisce `--filter-active-bg`, `--section-bg`, ecc.
- `MediaGrid` con `layout="stack"` per Gallery; `layout="grid-3"` + slot `cell` → `StampeCard` per Stampe.
- `StampeLightbox.svelte` viene **sostituito** da `MediaLightbox` (o delega a esso); stessi comportamenti attuali.

### Componenti sezione Gallery

| Componente | Responsabilità |
|------------|----------------|
| `GallerySection.svelte` | Homepage: heading, griglia 2×2 random (4), CTA, lightbox tra le 4 |
| `GalleryPage.svelte` o `GalleryGallery.svelte` | `/gallery`: heading, filtri, stack, lightbox navigabile nel filtro |
| `gallery.css` | Token visivi Gallery (sfondo ocra, filtro bianco, stack, griglia 2×2) |
| `$lib/gallery/constants.ts` | Titolo, intro, CTA, label categorie, ordine |
| `$lib/gallery/manifest.ts` | `buildGalleryManifest()` |
| `$lib/gallery/types.ts` | Tipi manifest |

### Componenti sezione Stampe (refactor)

| Componente | Modifica |
|------------|----------|
| `StampeGallery.svelte` | Usa `SectionHeading`, `CategoryFilters`, `MediaGrid`, `MediaLightbox` |
| `StampeSection.svelte` | Usa `SectionHeading`; anteprima può usare `MediaGrid layout="grid-2"` + `StampeCard` via slot |
| `StampeLightbox.svelte` | Rimosso o thin wrapper deprecato → `MediaLightbox` |

### Flusso dati

```
src/lib/content/gallery/**  →  buildGalleryManifest()  →  +page.ts load()
                                                              ↓
                                                    GallerySection / GalleryGallery
                                                              ↓
                                                    ui/* (heading, filters, grid, lightbox)
```

- Random 4 anteprime homepage: **client-side** al mount (`pickRandom(allImages, 4)` — estendere helper esistente).
- Filtri e lightbox: state client Svelte 5 runes nelle pagine/sezioni.

### Route

| Route | Load | Componente |
|-------|------|------------|
| `/` | `allImages` gallery + stampe | `GallerySection` poi `StampeSection` |
| `/gallery` | `manifest` gallery | `GalleryGallery` (o equivalente) |

---

## Error Handling

- Cartella categoria vuota/assente → filtro non mostrato.
- Immagine mancante → `alt` generico; nessun crash.
- Lightbox con una sola immagine → frecce nascoste.
- Cambio filtro con lightbox aperto → chiudere lightbox (come Stampe).

---

## Testing

- Unit test `buildGalleryManifest()`: conteggio categorie e immagini dalle cartelle reali.
- Unit test `pickRandom(..., 4)`: 4 immagini distinte quando la collezione lo consente.
- Regression: test manifest Stampe ancora verdi dopo refactor componenti condivisi.
- E2E (opzionale): filtro su `/gallery`, lightbox apre/chiude.

---

## Workflow per il designer

| Obiettivo | Azione |
|-----------|--------|
| Nuova foto in "Tutte" | Aggiungi in `src/lib/content/gallery/tutte/` (+ mirror `static/` se usato) |
| Foto in una sola area | Aggiungi in `src/lib/content/gallery/{area-*/}` |
| Ordine narrativo | Rinomina/ordina i file (ordinamento alfabetico = ordine UI) |
| Ricostruire | `npm run build` |

---

## Out of Scope

- Didascalie sotto le foto
- Filtri in homepage
- Download / condivisione
- Zoom pinch oltre al lightbox

---

## Approvazioni brainstorming

| Decisione | Scelta |
|-----------|--------|
| Dove vive | Homepage + `/gallery` |
| Lightbox | Come Stampe (nav completa su pagina dettaglio; tra 4 in homepage) |
| Anteprima homepage | Griglia 2×2, 4 random |
| Ordine homepage | Gallery sopra Stampe |
| Anteprima random | Sì, da tutta la collezione |
| Approccio architetturale | 1 — gemella Stampe + componenti `ui/` condivisi |
