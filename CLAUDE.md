# CLAUDE.md

Instruktioner för Claude i detta repo. Läses vid varje sessionsstart. Bevaras vid context-kompaktering.

---

## Projekt

- **Namn:** [fylls i]
- **Syfte:** [fylls i]
- **Owner:** Peder Hofman-Bang (pederhofmanbang)
- **Hosting:** [fylls i]

## Tech stack

[fylls i]

## Kommandon

| Vad | Kommando |
|---|---|
| Dev | `npm run dev` |
| Bygg | `npm run build` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Typecheck | `npm run type-check` |

---

## Korta prompter Peder använder (du ska förstå dessa)

### "Setup"
Gör följande automatiskt:
1. Pulla `main`.
2. Läs `CLAUDE.md`, `WORKLOG.md`, `DECISIONS.md`, `IDEAS.md`.
3. Kör `gh pr list` och `gh issue list`.
4. Sammanfatta på svenska: var vi är, öppna trådar, pågående PR:er, prioriterade issues, föreslagna nästa steg.
5. Vänta på Peders OK innan något konkret görs.
6. Skapa ny feature-branch innan första kodraden.

### "Spara idé: [text]"
Gör direkt:
1. Skapa GitHub Issue med titeln baserad på texten.
2. Sätt label `idea`.
3. Bekräfta kort att det är gjort. Inga frågor.

### "Avsluta"
Gör följande:
1. Kör `npm run lint && npm run type-check`. Fixa fel som upptäcks.
2. Commit + push på feature-branchen med Conventional Commit-meddelande.
3. Skapa PR med `gh pr create --fill`. Inkludera `Closes #N` om en issue löses.
4. När PR mergats: växla till `main`, pulla, uppdatera `WORKLOG.md` (och `DECISIONS.md` / `IDEAS.md` om relevant), commit + push på main.
5. Sammanfatta kort vad som gjordes.

### "Nytt projekt: [namn]"
Stacken bestäms i dialog – fråga, föreslå inte direkt.

Gör i denna ordning, vänta på svar mellan stegen:

1. **Fråga:** "Privat eller jobb-projekt?" → välj rätt template:
   - Privat → `pederhofmanbang/project-template-privat`
   - Jobb → `pederhofmanbang/project-template-jobb`
   (Om Peder lägger till fler templates senare, lista dem alla och fråga vilken.)

2. **Fråga:** "Beskriv kort vad projektet ska göra."

3. **Föreslå stack** baserat på beskrivningen. Ge ETT konkret förslag, inte en lista, med kort motivering. Vänta på OK eller justering.

4. När stack är bekräftad:
   - Skapa nytt privat GitHub-repo från vald template.
   - Klona det lokalt.
   - Läs `BOOTSTRAP.md` och kör igenom dess steg.
   - Anpassa `CLAUDE.md` och `README.md` för den bekräftade stacken.
   - Scaffolder grundprojektet.
   - Skapa standardlabels (`idea`, `quick-win`, `priority:high`, `priority:low`).
   - Radera `BOOTSTRAP.md`.
   - Initial commit + push.
   - Bekräfta att repot är klart.

### "Setup repo" (används vid utrullning i befintligt repo)
Gör följande:
1. Fråga: "Privat eller jobb-projekt?" för att veta vilken template att referera till (`pederhofmanbang/project-template-privat` eller `pederhofmanbang/project-template-jobb`).
2. Hämta `CLAUDE.md`, `WORKLOG.md`, `DECISIONS.md`, `IDEAS.md` från vald template.
3. Anpassa `CLAUDE.md` för det här projektet baserat på koden i repot.
4. Skapa standardlabels (`idea`, `quick-win`, `priority:high`, `priority:low`).
5. Lista alla TODO-kommentarer i koden och föreslå vilka som bör bli GitHub Issues.
6. Vänta på Peders OK innan commit.

---

## Mappar och filer

- `WORKLOG.md` – sessionsdagbok, uppdateras BARA på `main`
- `DECISIONS.md` – arkitekturbeslut, uppdateras BARA på `main`
- `IDEAS.md` – formlösa tankegods, uppdateras BARA på `main`

## Git-workflow

- En session = en branch = en PR.
- Branch-namn: `feature/...` eller `fix/...`
- Conventional Commits.
- Aldrig direkt push till `main` utom WORKLOG/DECISIONS/IDEAS-uppdateringar.
- Rör ALDRIG WORKLOG/DECISIONS/IDEAS i feature-branches.

## Issue-labels

- `idea` – obearbetad idé
- `bug` – något är trasigt
- `enhancement` – beredd att implementera
- `priority:high` / `priority:low`
- `quick-win` – under 30 min

## Miljöval

| Uppgift | Miljö |
|---|---|
| Kodändringar, tester, PR | claude.ai/code (webben) eller lokalt |
| Externa CLI:er (Railway, Fly, AWS) | Lokalt |
| Deploys, secrets | Lokalt |
| Vercel-deploys | Webben (sker via GitHub) |

---

## Kommunikation

- Svenska när Peder skriver svenska.
- Direkt och koncis. Inga hedge-meningar.
- Föreslå plan innan större ändringar, vänta på OK.
- Fråga vid osäkerhet, gissa inte.

## Förbjudet

- Aldrig push till `main` direkt (utom WORKLOG/DECISIONS/IDEAS)
- Aldrig commit:a `.env` eller secrets
- Aldrig installera dependencies utan att fråga
- Aldrig ändra databasschema utan OK
- Aldrig radera `WORKLOG.md`, `DECISIONS.md` eller `IDEAS.md`
