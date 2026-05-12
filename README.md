# Aktieskolan — lektionsinnehåll

Detta är allt textinnehåll till "Aktieskolan" — en pedagogisk webbapp om svenska
aktier och fonder. Alla 10 lektioner är skrivna som MDX-filer redo att läsas av
Next.js App Router.

## Filstruktur

```
content/
└── lessons/
    ├── 01-vad-ar-en-aktie.mdx
    ├── 02-borsen-och-mr-market.mdx
    ├── 03-fonder-lasagne.mdx
    ├── 04-ranta-pa-ranta.mdx
    ├── 05-risk.mdx
    ├── 06-diversifiering.mdx
    ├── 07-isk-vs-af-vs-kf.mdx
    ├── 08-nyckeltal.mdx
    ├── 09-psykologi.mdx
    └── 10-din-egen-plan.mdx
```

## Frontmatter — fält som finns i varje fil

```yaml
---
slug: "01-vad-ar-en-aktie"          # URL-slug, måste matcha filnamnet
nummer: 1                            # Lektionsnummer 1-10
titel: "Vad är en aktie egentligen?" # Visas som rubrik
underrubrik: "..."                   # Visas under rubrik
metafor: "Pizzan"                    # Visas som badge/etikett
mal:                                 # Lärandemål, visas i intro-kort
  - "Förstå vad en aktie är"
  - "..."
beraknad_tid_minuter: 7              # Visas på lektionskortet
unlocks: "simulator.kop_aktie"       # Vad lektionen låser upp i simulatorn
nasta_lektion: "02-borsen-och-mr-market"  # Slug till nästa, null på sista
---
```

## MDX-komponenter som används

Alla lektioner använder följande **anpassade React-komponenter** som Claude Code
behöver bygga (förslag i `components/lessons/`):

### `<Metafor titel="...">...</Metafor>`
En framträdande box som markerar huvudmetaforen. Förslag på styling: ljus
bakgrund, ikon i hörnet, lite mer "rik" än vanlig text. En per lektion (alltid
nära toppen).

### `<Faktaruta>...</Faktaruta>`
Box för viktiga sammanfattningar, tabeller, listor, regler. Subtilare än Metafor.
Förslag: ljusgrå bakgrund, smal vänsterkant i primärfärg.

### `<Varning>...</Varning>`
Varningsruta — för fallgropar, viktiga disclaimers, "akta dig för X". Förslag:
gul/orange-toning, varningssymbol.

### `<NyckeltalsTabell>...</NyckeltalsTabell>`
Wrapper runt markdown-tabeller för konsekvent styling (radhöjd, zebra-rader,
mobil-responsivitet). Komponenten behöver bara rendera barnen i en `<div>` med
styling — markdown-tabellen inuti renderas automatiskt av MDX.

### `<Försökssjälv>...</Försökssjälv>`
En inbjudan att gå till simulatorn mitt i en lektion (inte slut-uppdraget).
Förslag: blå/grön accent, "prova själv"-ikon, kanske CTA-knapp till simulatorn.

### `<Quiz>...</Quiz>`
Quiz-sektion. **Bygg som interaktiv komponent.** Frågorna är i markdown-format
i MDX:n men det enklaste är att parsa fram dem eller låta MDX-komponenten ta in
frågorna som JSON i en `data`-prop. Förenklat MVP:
- Visa frågorna som markdown till en början
- Senare: bygg en `<QuizFragor data={[...]} />` som tar emot strukturerad data

**Korrekt svar markeras med ✓** i texten — gör en regex-parser eller manuell
struktur i lib/.

### `<SimulatorTask>...</SimulatorTask>`
Slut-uppdraget för lektionen. Förslag: framträdande box i botten, "uppdrag"-etikett,
CTA-knapp till simulator + checkbox för att markera klart.

## Pedagogiska principer som lektionerna är skrivna efter

1. **En tydlig metafor per lektion** — visa den i Metafor-boxen tidigt
2. **5–10 min läsning** — varje fil är runt 1 200–1 800 ord
3. **3 quiz-frågor i mitten/slutet** med facit
4. **1 simulator-uppdrag som låser upp en funktion** (`unlocks` i frontmatter)
5. **Disclaimers där det behövs** — särskilt om historisk avkastning, risk, val
6. **Konkreta svenska bolag och siffror** — inte abstrakta "Bolag X"

## Lektionsöversikt — vad varje låser upp

| # | Lektion | Metafor | Låser upp |
|---|---------|---------|-----------|
| 1 | Vad är en aktie? | Pizzan | `simulator.kop_aktie` |
| 2 | Börsen och Mr Market | Mr Market | `simulator.limitorder` |
| 3 | Fonder | Lasagne-tallriken | `simulator.fondkop_manadssparande` |
| 4 | Ränta-på-ränta | Snöbollen | `simulator.tidsmaskin` |
| 5 | Risk | Bergsklättring | `simulator.riskmatt_kraschlage` |
| 6 | Diversifiering | Sportlaget | `simulator.omallokering` |
| 7 | ISK vs AF vs KF | Tre lägenheter | `simulator.isk_skattevy` |
| 8 | Nyckeltal | Bilköp | `simulator.screener` |
| 9 | Psykologi | Reptilhjärnan | `simulator.stresstest` |
| 10 | Din egen plan | Resplanen | `certifikat` |

## Nästa steg för Claude Code

1. **Skapa komponenterna** i `components/lessons/` (Metafor, Faktaruta, Varning,
   NyckeltalsTabell, Försökssjälv, Quiz, SimulatorTask)
2. **Sätt upp MDX-rendering** via `@next/mdx` + `next-mdx-remote` eller
   `contentlayer` (rekommenderas)
3. **Bygg lektionssidan** `/app/lektioner/[slug]/page.tsx`
4. **Bygg lektionsindex** `/app/lektioner/page.tsx` som listar alla 10 lektioner
   med progress-indikator
5. **XP/streaks/unlocks** — lagra i localStorage initialt, migrera till Supabase
   senare

## Faktatekniska källor (om Claude Code vill kolla noggrannare)

- ISK-skatt 2026: 1,065 % på kapital över 300 000 kr (SLR 2,55 % + 1 % × 30 %)
- Stockholmsbörsen: ~370 noterade bolag, OMXS30 = 30 mest omsatta
- Globalfond-exempel: Avanza Global (0,09 %), LF Global Indexnära (0,21 %)
- Aktier vs räntor historiskt: 7–9 % vs 1–4 % per år
