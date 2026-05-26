# Stampe botaniche — Design Spec

**Date:** 2026-05-26  
**Status:** Approved  
**Project:** La bucata

---

## Overview

Sezione del sito per mostrare stampe botaniche (nature prints) con filtri per tipologia. Comprende un'anteprima in homepage e una pagina dedicata `/stampe`.

---

## Requirements

### Homepage (`/`)

- Blocco verticale, allineato a sinistra:
  1. Titolo: **Stampe botaniche**
  2. Testo introduttivo (due righe):
     - *Ogni impronta conserva il respiro della natura.*
     - *Foglie, fiori ed erbe diventano tracce delicate del tempo, trasformate in memoria.*
  3. Due anteprime affiancate (stessa scheda bianca del mockup)
  4. Pulsante **Vedi tutte le stampe** → link a `/stampe`
- Le due anteprime sono **scelte a caso a ogni visita** dall'intera collezione (`static/stampe/tutte/`).
- Click su un'anteprima → lightbox con **solo quella immagine** (nessuna navigazione avanti/indietro).
- Su mobile: le due immagini passano a colonna singola.

### Pagina dedicata (`/stampe`)

- Replica fedele del mockup allegato:
  - Stesso titolo e testo introduttivo
  - Filtri orizzontali: **Tutte · Foglie · Felci · Fiori · Altre**
  - Griglia responsive (3 col desktop, 2 tablet, 1 mobile)
  - Ogni stampa in scheda bianca verticale con immagine centrata
- Filtro attivo evidenziato con pillola verde scuro (come nel mockup).
- Cambio filtro → aggiornamento griglia con breve dissolvenza (fade), senza reload.
- Click su una stampa → lightbox a schermo intero con navigazione **avanti/indietro tra tutte le stampe del filtro attivo**.
- Chiusura lightbox: pulsante X, click sullo sfondo, tasto Esc.
- Su mobile: swipe sinistra/destra nel lightbox per navigare.

### Filtro "Erbe"

- **Nascosto** finché non esiste la cartella `static/stampe/erbe/` con almeno un'immagine.
- Quando la cartella viene creata e popolata, il filtro appare automaticamente.

---

## Visual Design

| Elemento | Valore |
|----------|--------|
| Sfondo pagina | Verde salvia `#B9C678` (approx. mockup) |
| Testo | Nero `#000000` |
| Filtro attivo | Verde oliva scuro `#8A9A4A` su testo nero |
| Scheda stampa | Bianco `#FFFFFF`, padding generoso, aspect ratio verticale |
| Tipografia | Serif elegante (es. Lora o Playfair Display via Google Fonts) |

---

## Data Model

### Organizzazione file (approccio consigliato: cartelle = categorie)

```
static/stampe/
├── tutte/       ← tutte le stampe (26 immagini)
├── foglie/      ← solo foglie (15)
├── felci/       ← solo felci (1)
├── fiori/       ← solo fiori (7)
├── altre/       ← altre (4)
└── erbe/        ← (da creare in futuro)
```

- I nomi cartella sono **minuscoli** (convenzione attuale del repo).
- Etichette UI in **Title Case** italiano: Tutte, Foglie, Felci, Fiori, Altre, Erbe.
- Una stampa può comparire in più categorie (copie dello stesso file in cartelle diverse).
- Il manifest delle immagini viene generato **a build time** leggendo le cartelle — nessun elenco manuale da mantenere.

### Manifest (build time)

```typescript
type StampeCategory = {
  id: string;        // es. "foglie"
  label: string;     // es. "Foglie"
  images: string[];  // es. ["/stampe/foglie/stampa1.jpg", ...]
};

type StampeManifest = {
  categories: StampeCategory[];
  allImages: string[];  // da tutte/
};
```

- `categories` include solo cartelle con ≥ 1 immagine (esclude `erbe` finché vuota/inesistente).
- `allImages` proviene sempre da `tutte/`.

---

## Architecture

### Componenti

| Componente | Responsabilità |
|------------|----------------|
| `StampeSection.svelte` | Blocco homepage: titolo, testo, 2 anteprime random, pulsante |
| `StampeGallery.svelte` | Pagina `/stampe`: filtri + griglia + lightbox navigabile |
| `StampeCard.svelte` | Scheda bianca singola con immagine |
| `StampeLightbox.svelte` | Overlay fullscreen; prop `navigable: boolean` |
| `stampe.ts` (lib) | Tipi, costanti testo, helper random/shuffle |
| `manifest.ts` (lib) | Funzione `buildStampeManifest()` con `fs` a build time |
| `+page.server.ts` (stampe) | `load()` che restituisce manifest; `prerender = true` |
| `+page.server.ts` (home) | `load()` che restituisce `allImages` per anteprima random |

### Flusso dati

```
static/stampe/**  →  buildStampeManifest()  →  +page.server.ts load()
                                                    ↓
                                            StampeSection / StampeGallery
                                                    ↓
                                            StampeLightbox (client)
```

- Selezione random delle 2 anteprime: **client-side** al mount (il sito è statico prerendered).
- Filtri e lightbox: **client-side** state in Svelte 5 runes.

---

## Error Handling

- Cartella categoria assente o vuota → filtro non mostrato (nessun errore).
- Immagine mancante → `alt` descrittivo generico; nessun crash.
- Lightbox: se una sola immagine nel set, frecce nascoste.

---

## Testing

- Unit test su `buildStampeManifest()`: verifica conteggio categorie e immagini dalle cartelle reali.
- Unit test su helper random: restituisce esattamente 2 immagini distinte.
- E2E Playwright (opzionale fase 2): filtro cambia griglia; lightbox apre e chiude su `/stampe`.

---

## Workflow per il designer

| Obiettivo | Azione |
|-----------|--------|
| Nuova stampa visibile in "Tutte" | Aggiungi file in `static/stampe/tutte/` |
| Nuova stampa in categoria specifica | Aggiungi copia in `static/stampe/{categoria}/` |
| Nuova categoria "Erbe" | Crea `static/stampe/erbe/` e aggiungi immagini → filtro appare automaticamente |
| Ricostruire il sito | `npm run build` (manifest rigenerato) |

---

## Out of Scope

- Didascalie / nomi botanici sulle stampe
- Ordine custom diverso dall'ordine alfabetico dei filename
- Download o condivisione immagini
- Integrazione con sezione `gallery/` esistente (progetto separato)
