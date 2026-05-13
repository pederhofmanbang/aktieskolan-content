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
