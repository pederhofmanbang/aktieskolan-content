# WORKLOG

Sessionsdagbok. Senaste post överst. Uppdateras BARA på `main`-branchen, aldrig i feature-branches (för att undvika merge-konflikter).

Format per post: datum, kort rubrik, branch + PR, gjort, öppna trådar, nästa steg.

---

<!-- Mall för ny post – kopiera och fyll i: -->

## YYYY-MM-DD — [kort rubrik]

**Branch:** `feature/exempel`
**PR:** `#42` (mergad / öppen)

**Gjort:**
- 

**Filer som ändrats:**
- 

**Öppna trådar:**
- 

**Nästa steg:**
- 

---

<!-- Tidigare poster följer nedan -->

## 2026-05-14 — Bunt 7 — Pedagogisk koppling lektion ↔ simulator

**Branch:** `feature/simulator-bunt-7`
**PR:** `#20` (mergad — squash)

**Gjort:**
- `lib/lessonProgress.ts` — localStorage-state för completed lessons
- `components/lessons/LessonActions.tsx` — "Markera som läst"-knapp +
  djuplänk till simulator-funktion per lektion
- `lib/lessonSimulatorLinks.ts` — mappning lektion → simulator-djuplänk
- SimulatorView läser `?tab=&sub=&expand=` query-params
- AnalysisTab + TradeTab tar `initialExpand` / `initialSub` props
- `data/companies.ts` — bolagsbeskrivningar för 20 instrument
- InstrumentRow får "i"-knapp som visar bolagsinfo
- Term-tooltips applicerade på Sharpe, drawdown, schablonskatt, fribelopp,
  P/E, direktavkastning, soliditet
- `components/simulator/ProgressIndicator.tsx` — "X/10 lektioner" + progress-bar
- Soft-block: limit-toggle döljs tills lektion 2 är markerad läst
- PlanTab visar banner "läs lektion 10 först" tills lektion 10 är markerad
- localStorage-storage-event lyssnas så progress synkas mellan flikar

**Filer som ändrats:**
- Nya: `LessonActions`, `ProgressIndicator`, `lessonProgress.ts`,
  `lessonSimulatorLinks.ts`, `companies.ts`
- Modifierade: `app/lektioner/[slug]/page.tsx`, `SimulatorView`, `TradeTab`,
  `StockList`, `InstrumentRow`, `AnalysisTab`, `PlanTab`, `MyPlanSection`,
  4 analyssektioner (Term-applikationer)

**Slutsats:** Aktieskolan har nu en faktisk pedagogisk progression. Lektioner
markeras klara, simulatorn lyssnar på progress, och varje lektion har en
direkt-länk till sin motsvarande simulator-funktion. Termer förklaras
överallt de syns. Inga blockerande lås — bara mjuk vägledning.

**Inga öppna trådar.** Simulatorn + lektioner är nu en helhet.

---

## 2026-05-14 — Simulator bunt 6 — UX-polering (10 punkter)

**Branch:** `feature/simulator-bunt-6`
**PR:** `#19` (mergad — squash)

**Gjort:**
- Tab-omdöp: "Analys" → "Verktyg", "Min plan" → "Min sparplan"
- Sektor-färgkodning som badges på aktier (`lib/sectors.ts`)
- "Balansera till 100 %"-knapp i IPS-form
- Redigera-knapp synlig direkt i certifikatvyn
- Mobil-komprimering med `formatKrCompact` (100 k kr istället för 100 000)
- Spel-länkar från varje analyskort till motsvarande spel-modul
- Gruppering av Analys-kort i "Förstå risk" + "Strategier & planering"
- `lessonHref`-prop på ExpandableCard med "← Läs lektionen"-länk
- Term-tooltips (`components/simulator/Term.tsx`) — 11 termer definierade
  (GAV, ISK, schablonskatt, fribelopp, Sharpe, drawdown, spread, P/E,
  direktavkastning, soliditet, IPS), applicerade på GAV och ISK
- NextStepHint — dynamisk banner baserad på portfolio-state
- Sparkline per innehav (60d historik) bredvid värde i PositionRow

**Filer som ändrats:**
- Nya: `Term.tsx`, `Sparkline.tsx`, `NextStepHint.tsx`, `lib/sectors.ts`
- Modifierade: `SimulatorView`, `AnalysisTab`, `ExpandableCard`,
  `InstrumentRow`, `PositionRow`, `MyPlanSection`, `lib/format.ts`,
  `lib/prices.ts` (lade till `recentPrices`)

**Skjuts till bunt 7:**
- Aktie-detaljvy modal med stor graf + nyckeltal + köp-form
- Sökfält i toppmenyn (sticky) som hoppar till Köp & sälj
- Aktivitets-flik (samlar ordrar, affärer, månadsspar-status)
- Gradvis unlock baserat på lektion-läst-state

**Nästa steg:**
- Bunt 7 vid behov, eller polish/bugfixar baserat på faktisk användning.

---

## 2026-05-13 — Simulator bunt 5 — UX-omstrukturering med flikar

**Branch:** `feature/simulator-bunt-5`
**PR:** `#16` (mergad — squash)

**Gjort:**
- Refaktorerat simulator-UI:t från lång scroll-lista (17 sektioner) till
  4-fliks-system (Portfölj / Köp & sälj / Analys / Min plan).
- Sticky stats-bar med kassa/värde/totalt/resultat + ISK-pill.
- Onboarding-banner på första-besöket.
- Sub-tabs i Köp & sälj (Aktier / Fonder / Månadssparande).
- Sökfält + sektorfilter + grupp-toggle i aktielistan (löser lektion 1-glapp).
- Mini-orderbok per aktie med spread skalad mot handelsvolym (löser
  lektion 2-glapp).
- 6 expanderbara kort i Analys-fliken.
- Allokering visar nu Sharpe-jämförelse mot 100 % globalfond.

**Filer som ändrats:**
- Nya: `Tabs.tsx`, `ExpandableCard.tsx`, `OrderBookSnippet.tsx`,
  `StockList.tsx`, `InstrumentRow.tsx`, `PositionRow.tsx`,
  `TransactionRow.tsx`, `OnboardingBanner.tsx`, `PortfolioTab.tsx`,
  `TradeTab.tsx`, `AnalysisTab.tsx`, `PlanTab.tsx`.
- Modifierade: `SimulatorView.tsx` (omskriven som tab-container),
  alla 6 analyssektioner (lade till `embedded`-prop).
- `package.json`: installerat `zustand` (krävdes för att fixa pre-existing
  type-check-fel i `lib/spel/state.ts`).

**Öppna trådar:**
- `ActiveOrdersSection.tsx` är nu oanvänd död kod (kan tas bort i nästa
  städ-runda).
- Tekniska skulder kvar från tidigare bunkar: limit-orderfyllning i
  tidsmaskinen, ISK-kapitalunderlag som Q-snitt.

**Nästa steg:**
- Inget akut. Eventuell polish-runda med mobil-anpassning av tabellerna,
  borttagning av död kod, och lösning av kvarvarande tekniska skulder.

---

## 2026-05-13 — Simulator bunt 4 (sista) — aktieskolan komplett

**Branch:** `feature/simulator-bunt-4`
**PR:** `#13` (mergad — squash)

**Gjort:**
- **Lektion 8 — Aktiescreener:** `data/fundamentals.ts` med P/E, P/S, P/B,
  direktavkastning, soliditet och ROE för alla 16 aktier. `ScreenerSection`
  med filter, default Large Cap-snittet, resultattabell.
- **Lektion 9 — Stresstest:** `StressTestSection` med rapportras −15 %,
  motiveringsalgoritm som vägrar säljordrar med panik-ord och godkänner
  fundamenta-baserade motiveringar.
- **Lektion 10 — Min plan & certifikat:** Komplett IPS-formulär i
  `MyPlanSection` med mål, horisont, månadssparande, allokering (måste
  summa 100 %), 6 obligatoriska regler, underskrift. Vid signering visas
  formaterad certifikat-vy som kan skrivas ut / sparas som PDF via
  `window.print()`. `Portfolio.myPlan` + `saveMyPlan()` i lib/portfolio.ts.

**Filer som ändrats:**
- `data/fundamentals.ts` (ny)
- `lib/prices.ts` — exposes fundamentals på Instrument
- `lib/portfolio.ts` — MyPlan-typ + saveMyPlan
- `components/simulator/ScreenerSection.tsx` (ny)
- `components/simulator/StressTestSection.tsx` (ny)
- `components/simulator/MyPlanSection.tsx` (ny)
- `components/simulator/SimulatorView.tsx` — integration + auto-unlock

**Resultat — alla 10 simulator-funktioner på plats.** Aktieskolan-cykeln
är komplett från första lektionen om vad en aktie är till sista lektionen
med signerad investeringspolicy.

**Tekniska skulder kvar:**
- Limit-orderfyllning i tidsmaskinen (limit-ordrar är passiva även när
  tiden rullas framåt).
- ISK-kapitalunderlag använder nuvärdet, inte Q1/Q2/Q3/Q4-snittet som
  banken beräknar på riktigt.

**Nästa steg:**
- Eventuell polish-runda: limit-orderfyllning i tidsmaskinen, riktig
  Q-snittsberäkning för ISK, mobilanpassning av tabellerna.

---

## 2026-05-13 — Simulator bunt 2 + 3 sammanmergade

**Branch:** `feature/simulator-bunt-3`
**PR:** `#11` (mergad — squash; innehöll bunt 2 + bunt 3 rebasade på main)

**Gjort:**
- Bunt 2: limitorder med Aktiva ordrar-vy (lektion 2), månadssparande
  (lektion 3), tidsmaskinen med ränta-på-ränta-projektion (lektion 4).
- Bunt 3: krasch-läge med 4 historiska scenarier (lektion 5), allokering
  & Sharpe-approximation (lektion 6), ISK-skattevy med AF-jämförelse
  (lektion 7).
- Auto-unlocka alla icke-destruktiva pedagogiska vyer (tidsmaskin, krasch,
  allokering, ISK-skattevy).
- Städade öppna PRs: stängde duplicat PR #7 (bunt 1, redan mergad som
  #4) och konfliktande PR #10 (ersatt av #11).
- PR #12 (lesson format tabs) mergad parallellt.

**Filer som ändrats:**
- `lib/portfolio.ts` — utvidgad med ActiveOrder, MonthlyPurchase + actions
- `lib/projection.ts` (ny) — tidsmaskin-simulering
- `lib/crashScenarios.ts` (ny) — fyra historiska scenarier
- `lib/allocation.ts` (ny) — kärna/krydda + Sharpe
- `lib/iskTax.ts` (ny) — schablonskatt 2026
- `components/simulator/ActiveOrdersSection.tsx` (ny)
- `components/simulator/MonthlySavingsSection.tsx` (ny)
- `components/simulator/TimeMachineSection.tsx` (ny)
- `components/simulator/CrashTestSection.tsx` (ny)
- `components/simulator/AllocationSection.tsx` (ny)
- `components/simulator/ISKTaxSection.tsx` (ny)
- `components/simulator/SimulatorView.tsx` — integrerar allt + auto-unlock

**Öppna trådar:**
- Bunt 4 återstår: aktiescreener (lektion 8), stresstest med säljmotivering
  (lektion 9), IPS-formulär + certifikat (lektion 10).
- Screener behöver nya nyckeltal i datat (P/E, soliditet, ROE,
  direktavkastning) — saknar i `data/prices.json` idag.
- Limit-orderfyllning i tidsmaskinen är inte implementerad — limit-ordrar
  ligger passivt även när tiden rullas framåt. Bör in i bunt 4 eller fix.

**Nästa steg:**
- Starta bunt 4 när Peder säger till.
