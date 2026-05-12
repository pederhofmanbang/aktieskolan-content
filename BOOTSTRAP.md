# BOOTSTRAP.md

Instruktioner till Claude när detta repo används som template för ett nytt projekt. **Radera denna fil när bootstrap är klar.**

## Steg som Claude ska göra vid bootstrap

1. **Fråga användaren:**
   - Projektnamn (kort)
   - En mening om vad projektet gör
   - Stack (Next.js + TS + Tailwind / Python + FastAPI / annat)
   - Hosting (Vercel / annat)

2. **Anpassa CLAUDE.md:**
   - Fyll i sektionen "Projekt" (namn, syfte, repo-URL, hosting)
   - Fyll i sektionen "Tech stack"
   - Anpassa "Kommandon"-tabellen efter stacken (t.ex. Python: `pytest` istället för `npm test`)
   - Lägg till stack-specifika konventioner under "Mappkonventioner"

3. **Anpassa README.md:**
   - Fyll i projektnamn och beskrivning
   - Uppdatera "Kom igång"-sektionen efter stacken
   - Beskriv stacken
   - Beskriv deployment

4. **Skapa första WORKLOG-posten:**
   ```
   ## YYYY-MM-DD — Bootstrap

   **Branch:** main
   **PR:** —

   **Gjort:**
   - Bootstrappat repo från pederhofmanbang/project-template
   - Anpassat CLAUDE.md för [stack]
   - Initiala dependencies installerade

   **Öppna trådar:**
   - 

   **Nästa steg:**
   - [Första riktiga featuren]
   ```

5. **Initiera projektet:**
   - Kör rätt scaffold-kommando för stacken (t.ex. `npx create-next-app@latest .`)
   - Installera dependencies
   - Kör en första `npm run lint && npm run type-check` för att verifiera att allt funkar

6. **Radera BOOTSTRAP.md:**
   ```
   git rm BOOTSTRAP.md
   ```

7. **Initial commit:**
   ```
   git add .
   git commit -m "chore: bootstrap project from template"
   git push
   ```

8. **Bekräfta för användaren:** Repo är klart, första branchen kan skapas för riktigt arbete.
