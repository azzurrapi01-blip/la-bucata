# Raccolte di specie vegetali — Design Spec

**Date:** 2026-05-29  
**Status:** Approved  
**Project:** La bucata

---

## Overview

Sezione dedicata al materiale vegetale raccolto lungo il percorso, organizzato per **mese** (febbraio → maggio). Comprende un'anteprima in homepage (dopo Gallery e Stampe) e una pagina dedicata `/raccolta`. Architettura **gemella delle Stampe** (sezione dedicata), con componenti UI condivisi già estratti (`SectionHeading`, `CategoryFilters`, `MediaGrid`, `MediaLightbox`).

---

## Requirements

### Homepage (`/`)

**Ordine sezioni:** Gallery → Stampe → **Raccolta**.

#### Blocco Raccolta

1. Titolo: **Raccolte di specie vegetali**
2. Testo introduttivo (un paragrafo):
   - *La ricerca botanica si traduce in una mappatura sensoriale, dove il materiale vegetale raccolto diventa la matrice di un racconto visivo.*
3. **Griglia 2×2**: 4 foto scelte **a caso a ogni visita** dall'intera raccolta (tutti i mesi).
4. Ogni foto ha **didascalia** sotto (nome derivato dal file).
5. Immagini **senza scheda bianca**; ritratto verticale (~4:5), `object-fit: cover`.
6. Sfondo **crema** `#FFF9D0`.
7. Pulsante **Vedi tutta la raccolta** → `/raccolta` (CTA nero come Stampe/Gallery).
8. Click su immagine → lightbox con navigazione tra le **4 anteprime**.
9. Su mobile: griglia responsive (2 colonne strette o 1 colonna).

---

### Pagina dedicata (`/raccolta`)

- Stesso titolo e intro del blocco homepage.
- Filtri: **Tutte · Febbraio · Marzo · Aprile · Maggio**
- Filtro attivo: sfondo **verde scuro** `#2D4619`, testo bianco.
- Filtri inattivi: solo testo nero.
- **Tutte:** mesi in ordine cronologico, ciascuno con **etichetta mese** (pillola verde scuro, testo bianco) e griglia **3 colonne**.
- **Singolo mese:** solo le foto di quel mese, griglia 3 colonne, **senza** etichetta mese ripetuta.
- Ogni cella: foto + didascalia (dal nome file).
- Cambio filtro → dissolvenza breve (~200ms).
- Click → lightbox navigabile tra **tutte le foto visibili** nel filtro attivo (per «Tutte», ordine febbraio → maggio, sinistra-destra nella griglia).
- Chiusura: X, sfondo, Esc; swipe su mobile.
- Su mobile: griglia 2 poi 1 colonna.

---

## Visual Design

| Elemento | Valore |
|----------|--------|
| Sfondo sezione | Crema `#FFF9D0` |
| Testo | Nero `#000000` |
| Filtro / etichetta mese attivi | Verde scuro `#2D4619`, testo bianco |
| Layout pagina | Griglia 3 col + didascalie |
| Homepage anteprima | Griglia 2×2, 4 random |
| Tipografia | Lora (globale), didascalie bold |

Token CSS sul wrapper `.raccolta` (es. `--raccolta-bg`, `--filter-active-bg`, `--filter-active-color`).

---

## Data Model

### Organizzazione file

```
src/lib/content/raccolta/
├── febbraio/    ← immagini .jpg/.JPG
├── marzo/
├── aprile/
└── maggio/
```

Nessuna cartella `tutte/`; il filtro «Tutte» è **virtuale** (vista raggruppata per mese).

### Didascalie

Derivate automaticamente dal nome file (senza estensione):

- Trattini → spazi
- Prima lettera di ogni parola maiuscola
- Suffissi numerici finali (es. `… 2`) rimossi

Esempi: `leccio` → «Leccio»; `galium-aparine` → «Galium aparine».

### Manifest (build time)

- `months`: `{ id, label, images: { src, caption }[] }[]` in ordine cronologico
- `categories`: `{ id: 'tutte', label: 'Tutte' }` + un entry per mese (per i filtri)
- `allItems`: flatten di tutte le `{ src, caption }` per anteprima random e lightbox «Tutte»

---

## Componenti

| Componente | Ruolo |
|------------|--------|
| `RaccoltaSection` | Homepage: heading, 2×2, CTA, lightbox 4 foto |
| `RaccoltaGallery` | Pagina: filtri, griglie raggruppate o singole, lightbox |
| `RaccoltaCard` | Figura: immagine cliccabile + `figcaption` |
| `raccolta.css` | Token e stili sezione |

Riutilizzo: `SectionHeading`, `CategoryFilters`, `MediaGrid`, `MediaLightbox`, `pickRandom` (da `$lib/stampe/random`).

---

## Non-goals

- Elenco manuale di nomi comuni/scientifici
- Duplicare immagini in `static/raccolta/` (solo `src/lib/content/raccolta/`)
- Modificare Gallery o Stampe oltre all’ordine homepage e al load della home

---

## Testing

- `captionFromFilename` (unit)
- `buildRaccoltaManifest` (mesi presenti, ordine, caption non vuote)
- Smoke manuale: homepage anteprima, `/raccolta` filtri Tutte/singolo mese, lightbox
