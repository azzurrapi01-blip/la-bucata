# Image optimization — Design Spec

**Date:** 2026-06-04  
**Status:** Approved  
**Project:** La bucata

---

## Overview

Ottimizzare il caricamento delle immagini statiche del sito per migliorare **tempo di caricamento percepito** (LCP, mobile, homepage) e **peso totale scaricato** su `/gallery` e pagine con molte foto. Approccio: **`@sveltejs/enhanced-img`** a build-time + **normalizzazione una tantum** dei master troppo grandi in `src/lib/content/`.

---

## Success criteria

| ID | Criterio | Verifica |
|----|----------|----------|
| A1 | Anteprima homepage Gallery (4 foto) scarica ordine **KB** per immagine, non MB | DevTools Network su `/` |
| A2 | Nessun salto layout evidente sulle griglie (dimensioni intrinseche) | Lighthouse CLS |
| A3 | Spettrogramma audio homepage non ritarda LCP inutilmente | Lighthouse LCP su `/` |
| B1 | Pagina `/gallery`: scroll carica varianti adatte alla colonna (~56rem), non master 18 MB | Network per singola immagine |
| B2 | Lightbox usa variante da `srcset`, non file sorgente integrale | Network in lightbox |
| B3 | Output `build/` per asset immagine ridotto vs baseline (dopo normalizzazione sorgenti) | `du -sh build/` |

---

## Current state

- **Adapter:** `@sveltejs/adapter-static` (nessun image server runtime).
- **Asset pipeline:** `import.meta.glob(..., { query: '?url' })` → URL singolo, formato originale (JPEG/PNG).
- **UI:** `<img loading="lazy">` in `MediaGrid`, `MediaLightbox`, `StampeCard`, `RaccoltaCard`, audio.
- **Volume sorgenti (approx.):** `gallery/` ~2,1 GB (115 JPG, media ~18 MB), `raccolta/` ~329 MB, `stampe/` ~95 MB, `audio/` PNG spettrogrammi ~39 MB.
- **Display max tipico:** colonna/stack e lightbox `max-width: 56rem` (~896 px); griglie 2×2 ≈ 50vw; stampe 3 col ≈ 33vw.

---

## Requirements

### Build pipeline

1. Installare `@sveltejs/enhanced-img` e registrare `enhancedImages()` in `vite.config.ts` **prima** di `sveltekit()`.
2. Manifest immagini (`gallery`, `stampe`, `raccolta`, `audio`) usano `import.meta.glob` con `query: { enhanced: true }` (non `?url`).
3. Tipi manifest aggiornati: `src` è il valore `default` del modulo enhanced (compatibile con `<enhanced:img src={...}>`).

### UI condivisa

1. Nuovo componente `OptimizedImage.svelte` in `src/lib/components/ui/`:
   - Props: `src` (enhanced picture), `alt`, `sizes`, opzionali `loading`, `fetchpriority`, `class`.
   - Render: `<enhanced:img>` con `sizes` obbligatorio passato dal parent.
2. `MediaGrid`, `MediaLightbox` accettano `EnhancedImageSrc[]` (alias tipo) invece di `string[]`.
3. `StampeCard`, `RaccoltaCard` usano `OptimizedImage`.
4. `AudioSection` / `AudioRecording` spettrogrammi usano `OptimizedImage` con `sizes` adatto al wrapper (~56rem).

### Attributi `sizes` (valori iniziali)

| Contesto | `sizes` |
|----------|---------|
| Homepage 2×2 / 2 col | `(max-width: 600px) 100vw, 50vw` |
| Gallery stack `/gallery` | `(max-width: 640px) 100vw, 56rem` |
| Stampe griglia 3 col | `(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw` |
| Raccolta griglia 3 col | come stampe |
| Lightbox | `min(90vw, 56rem)` |
| Audio spettrogramma | `(max-width: 640px) 100vw, 56rem` |

Costanti in `src/lib/images/sizes.ts` per DRY.

### Priorità caricamento (LCP)

- Spettrogramma in `AudioSection` (homepage): `fetchpriority="high"`, **senza** `loading="lazy"`.
- Anteprime Gallery/Stampe/Raccolta: `loading="lazy"` (below the fold).
- Lightbox: immagine visibile solo quando aperto; nessun preload della collezione intera.

### Normalizzazione sorgenti (fase contenuti)

1. Script npm `scripts/normalize-images.mjs` (Sharp): per ogni JPG/JPEG in cartelle indicate, se lato lungo > 2400 px → ridimensiona a 2400 px, ricodifica JPEG qualità 85, sovrascrive in place (con backup opzionale `.bak` disabilitato di default).
2. **Obbligatorio** su `src/lib/content/gallery/**` prima del deploy.
3. **Raccomandato** su `src/lib/content/raccolta/**` se dopo build restano pesanti.
4. **Stampe:** solo pipeline enhanced, senza batch obbligatorio (file già più piccoli).
5. Documentare in README o commento script: i master devono essere ≥2× la larghezza display target per HiDPI (linee guida SvelteKit).

### Fuori scope

- CDN / `@unpic/svelte`
- Immagini dinamiche da CMS
- `adapter-static` `precompress`
- Cambi layout o UX delle gallerie
- Conversione manuale di tutti i file a WebP sorgente (lo fa il build)

---

## Architecture

```
src/lib/content/**  →  import.meta.glob (enhanced: true)
                              ↓
                    build*Manifest()  →  EnhancedImageSrc in tipi
                              ↓
              OptimizedImage (sizes da constants)
                              ↓
        MediaGrid / MediaLightbox / *Card / Audio*
                              ↓
              build: <picture> + avif/webp + srcset + width/height
```

### File map (nuovi / toccati)

| File | Ruolo |
|------|--------|
| `vite.config.ts` | Plugin `enhancedImages()` |
| `src/lib/images/types.ts` | `EnhancedImageSrc` |
| `src/lib/images/sizes.ts` | Costanti `sizes` |
| `src/lib/components/ui/OptimizedImage.svelte` | Wrapper `<enhanced:img>` |
| `src/lib/gallery/manifest.ts` + `types.ts` | Glob enhanced |
| `src/lib/stampe/manifest.ts` + `types.ts` | Glob enhanced |
| `src/lib/raccolta/manifest.ts` + `types.ts` | Glob enhanced |
| `src/lib/audio/manifest.ts` | Glob enhanced per PNG |
| `src/lib/components/ui/MediaGrid.svelte` | Tipo `images` |
| `src/lib/components/ui/MediaLightbox.svelte` | Tipo `images` |
| `src/lib/components/stampe/StampeCard.svelte` | OptimizedImage |
| `src/lib/components/raccolta/RaccoltaCard.svelte` | OptimizedImage |
| `src/lib/components/audio/*.svelte` | OptimizedImage |
| `scripts/normalize-images.mjs` | Batch resize gallery/raccolta |
| `package.json` | deps + script `normalize-images` |

### CSS

- Regole esistenti `img { width: 100%; height: auto; }` si applicano al `img` interno generato da `<picture>`; dove serve, usare `.optimized-image img` o `enhanced\:img` nel blocco style del componente.

### Error handling

- Se glob non trova immagini, comportamento invariato (categorie vuote filtrate).
- Build fallisce se `enhanced-img` non processa un formato; PNG/JPEG/WebP in scope.

### Testing

- Aggiornare `manifest.spec.ts` (gallery, stampe, raccolta, audio): assert su struttura `src` (oggetto con metadati enhanced, non stringa URL grezza — assert minimo: `typeof src === 'object'` o proprietà documentata dal pacchetto).
- `npm run check`, `npm test`, `npm run build`.
- Verifica manuale Network su `/` e `/gallery`.

---

## Risks

| Rischio | Mitigazione |
|---------|-------------|
| Primo build molto lento | Cache `node_modules/.cache/imagetools`; normalizzare sorgenti prima |
| Qualità visiva dopo resize 2400px | Campionare 3–5 foto; aumentare cap se necessario |
| Tipo `EnhancedImageSrc` cambia tra versioni | Import type dal pacchetto se esportato |
| `enhanced:img` in component wrapper | Test build + svelte-check |

---

## Approvals

- **Approccio:** 2 — `enhanced-img` + normalizzazione sorgenti gallery (e raccolta consigliata).
- **Obiettivi:** A (percezione/LCP) + B (peso scaricato).
- **Approvato:** 2026-06-04 — utente («procedi»).
