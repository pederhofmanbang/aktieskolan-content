# Aktieskolan — Game Design Document

## Syfte med detta dokument

Det här är en **byggbar specifikation** för spelet i Aktieskolan-appen. Det är skrivet för Claude Code som primär läsare. Allt visuellt, mekaniskt och pedagogiskt val är förankrat i vad de 10 MDX-lektionerna säger i `/content/lessons/`.

Om något här krockar med en lektion → **lektionen vinner**. Om något är otydligt → kolla lektionens text först, fråga sen.

---

## 1. Vision

Spelet är en pedagogisk komplettering till de 10 lektionerna. Det är **inte ett quiz** och **inte en simulator**. Det är ett scenario-baserat val-och-konsekvens-spel som tar spelaren genom en hel ekonomisk livsbåge: **entreprenör → bolagsägare → investerare**.

Genom att FÖRST vara den som *bygger* ett bolag, sedan *börsnoterar* det, sedan blir *investerare* — får spelaren en djupare förståelse än någon utbildning som börjar med "här är en aktie, köp den".

Målgrupp: 20–25-åringar, gymnasieutbildade, nybörjare på investering.

Total speltid att slutföra alla akter en gång: 3–5 timmar, uppdelat i 5–15-minuters sessioner.

---

## 2. Pedagogiska principer (hårda regler för design)

Dessa är icke-förhandlingsbara och ska genomsyra alla designval:

1. **Inga timers, någonstans — utom i lektion 9.** Tid är inte en fiende i aktiehandel. Snabba beslut är fienden. Spelet får aldrig belöna fart. Undantag: i lektion 9 (psykologi) ska "panic sell"-knappen pulsera under simulerade kraschar — det är pedagogiken: man ska *motstå* att klicka.

2. **Pedagogiken sitter i mekaniken, inte i text.** Spelaren ska *känna* utspädning när pizzan krymper, *se* ränta-på-ränta i snöbollens växande, *uppleva* paniken när siffror blir röda. Förklarande text är en backup, inte primären.

3. **Konsekvenser visualiseras över tid.** När spelaren gör ett val: tidshjulet snurrar, siffror tickar, en månad eller ett år simuleras snabbt, och resultatet visas. Inga abstrakta "du fick 100 XP" — verkliga konsekvenser.

4. **Coach kommer från lektionsmanus, inte tutorial-text.** När spelaren bryter mot en princip (säljer på panik, väljer fel kontotyp, samlar för få bolag) får hen en kort kommentar med direktlänk till relevant lektionsdel. Detta är spelets enda "lärar-röst".

5. **Belöning för rätt enligt lektionerna.** Den som diversifierar, väljer ISK, sätter upp månadssparande, undviker panik — vinner. Den som tajmar marknaden, samlar enskilda aktier, säljer i kris — förlorar oftare än vinner. Sannolikheten ska spegla verkligheten, inte göra spelaren rätt 100 % av tiden.

6. **Lektion låser upp spelmoment (Modell B).** Lektion N → spelmoment N spelbart. Du kan inte spela Akt 4 (investeraren) innan lektion 10 är genomgången.

7. **Allt sparas. Spelet är permadeath-vänligt: misstag förstör inte progress.** Du kan dö i en pizzeria-konkurs och starta om utan att förlora utbildningsprogress.

---

## 3. Den övergripande bågen — fyra akter

Spelet följer en livsbåge för spelaren från 25 till 75 års ålder.

### Akt 1 — Pizzerian (entreprenören)

**Spelarens ålder i fiktion:** 25 år
**Speltid:** 30–45 min
**Låses upp efter:** lektion 1
**Bygger ut efter:** lektion 2

Du är 25 år. Du har 50 000 kr i sparpengar. Du vill starta en pizzeria i Hammarby Sjöstad. Spelet är en serie scenarion (5–8 stycken) där du gör val: finansiering, anställa personal, marknadsföring, hur du hanterar dåliga månader.

Lärobehållning: vad ett bolag är, vad ägande betyder, vad utspädning gör, varför kapitalstrukturen påverkar risk.

### Akt 2 — Kedjan (bolagsägaren)

**Spelarens ålder i fiktion:** 28–32 år
**Speltid:** 30–45 min
**Låses upp efter:** Akt 1 + lektion 3 är klar

Du har en stabil pizzeria. Nu vill du expandera. Akten består av ~10 scenarion som tar dig från 1 pizzeria till en kedja på 5–8 platser. Du möter en lågkonjunktur som testar din kapitalstruktur.

Lärobehållning: diversifiering (öppna i olika städer), hävstång (lån), tillväxt vs utdelning, kassaflöde.

### Akt 3 — IPO:n (börsnoteringen)

**Spelarens ålder i fiktion:** 33 år
**Speltid:** 20–30 min
**Låses upp efter:** Akt 2 + lektion 7 + lektion 8 är klara

Du börsnoterar **Pizza Hofman-Bang AB** på First North. Du sätter teckningskursen, skriver prospekt, möter analytiker. Första handelsdagen visar om du gjorde rätt val.

Lärobehållning: värdering (P/E, P/S), prospekt-transparens, varför olika investerare vill olika saker.

### Akt 4 — Investeraren

**Spelarens ålder i fiktion:** 35–75 år
**Speltid:** oändlig replay, en "körning" ~30 min
**Låses upp efter:** Akt 3 + lektion 10 är klar

Du har sålt majoritet i din kedja. 80 miljoner kr ligger på dina personliga konton. Tidshastigheten ökar: 1 år = ~3 minuter speltid. Du sätter upp allokering, månadssparande och regler. Sedan rullar tiden. Du möter dotcom (1999), finanskrisen (2008), corona (2020), inflationen (2022) i komprimerad tid. Spelet vinns inte genom att maximera siffran — det vinns genom att du fortfarande har pengar kvar vid 75 år.

Lärobehållning: alla lektioner i kombination, men särskilt 4 (ränta-på-ränta), 5 (risk), 9 (psykologi), 10 (din egen plan).

---

## 4. Spelmekanik per lektion (1–10)

Varje lektion låser upp en spelmodul. Modulerna är 2–10 minuter långa och kan spelas flera gånger.

### Lektion 1 — Vad är en aktie?

**Spelmodul:** "Dela pizzan"
**Format:** Turbaserat scenario, 4–6 val i följd
**Speltid:** 5–8 minuter

Du har 50 000 kr, behöver 200 000 kr för att öppna pizzerian. Pizzan visas i centrum (10 bitar). Du möter en sekvens av scenarion:

**Scenario 1.1 — Banklånet:**
> "Handelsbanken erbjuder dig 200 000 kr i lån mot 6 % ränta. Inga delägare. Du behåller 100 %."
> [Acceptera] [Tacka nej]

**Scenario 1.2 — Bror Lukas:**
> "Din bror erbjuder 150 000 kr mot 40 % av bolaget. Ingen ränta — men nu äger han nästan halva."
> [Acceptera] [Tacka nej]

**Scenario 1.3 — Faster Inger:**
> "Din faster vill köpa 10 % för 25 000 kr. 'Du värderar bolaget till 250 000 kr då. Är det rättvist?'"
> [Acceptera] [Tacka nej]

**Scenario 1.4 — A vs B-aktier (efter lektion 1 är fullt klar):**
> "Affärsmannen erbjuder 100 000 kr för 30 % B-aktier (utan rösträtt). Du behåller alla A-aktier. Hur tänker du?"
> [Acceptera — du behåller all röststyrka] [Tacka nej]

Efter varje val: pizzan visualiserar utspädningen, siffrorna uppdateras, och 1–2 månader simuleras snabbt så spelaren ser konsekvensen.

**Vinst-villkor:** Du har samlat in minst 200 000 kr OCH behåller minst 51 % av rösterna.

**Förlust-scenarion (alla pedagogiska):**
- Tappade kontrollen → "WeWork 2019: grundaren tappade rösträtt och fick sparken."
- Tog för stort lån → "Räntan äter all vinst varje månad."
- Sålde för billigt → "Du värderade bolaget till 50 000 kr per procent. Marknadsvärdet är 30 % högre."

**Coach-kommentarer (länkar till lektion 1):**
- "Lägg märke till: A-aktier och B-aktier ger SAMMA utdelning. Skillnaden är rösträtten." → öppnar lektion 1, sektion "A och B-aktier".

### Lektion 2 — Börsen och Mr Market

**Spelmodul:** "Mr Markets dörrknack"
**Format:** Turbaserat, du klickar igenom 8–12 erbjudanden
**Speltid:** 4–6 minuter

Mr Market står utanför pizzerian. Varje "dag" knackar han med ett bud — antingen vill han **köpa** din pizzeria (dvs. dina aktier) eller **sälja** sin andel till dig.

Vissa dagar är han manisk: "Jag ger dig 5 miljoner för pizzerian!" (mer än bolagets värde — bra om du säljer)
Andra dagar deprimerad: "Jag säljer mina pizzeria-aktier för 100 000 kr." (mindre än värde — bra om du köper)

**Visualisering:** Mr Market är en figur (illustrerad) som dyker upp vid dörren. Hans humör visas tydligt: glad/neutral/ledsen-uttryck. Hans bud visas i en pratbubbla.

**Spelarens val:**
- Acceptera erbjudandet
- Tacka nej (vänta på nästa dag)
- "Räkna ut det rättvisa värdet" (öppnar en miniräknare som visar bolagets faktiska värde just nu — vinst × P/E)

**Vinst-villkor:** Du har avvärjt minst 3 dåliga bud OCH accepterat minst 2 bra bud inom 12 dagar.

**Pedagogisk poäng (från lektion 2):** Spelaren känner Mr Markets manodepressiva svängningar i magen. Det är inte ett tempospel — det är ett *tålamods-spel*. Den som väntar på rätt erbjudande vinner.

### Lektion 3 — Fonder

**Spelmodul:** "Bygg lasagnen"
**Format:** Drag-and-drop puzzle
**Speltid:** 5–10 minuter

Du har 50 000 kr att placera. På skärmen finns en tom lasagne-form (din "fond") och ett brett urval av bolag — Volvo, H&M, Investor, Ericsson, AstraZeneca, Telia, samt utländska som Apple, Microsoft, Nestle, etc. (~30 bolag totalt).

**Mekanik:**
- Du drar bolag in i din fond
- Varje bolag kostar olika mycket
- Du kan välja vikt (5 %, 10 %, 20 %, etc.)
- En "diversifierings-meter" visar hur bred din fond är

**Konsekvens:**
- När du klickar "Stäng fonden" simuleras 5 år snabbt
- Du möter 3 slumpvisa scenarier (ett tech-ras, en geopolitisk kris, en oljeprischock)
- Din fond reagerar olika beroende på sammansättning

**Vinst-villkor:** Din fond har stigit i värde efter 5 simulerade år OCH max drawdown var under 30 %.

**Pedagogisk poäng:**
- Spelar du 100 % i Volvo → någon dag rasar Volvo 40 %, du är dödssjuk
- Spelar du 5 % i 20 bolag → snittet håller
- Spelar du i en globalfond direkt (genvägen) → automatisk balansering, lägst risk

### Lektion 4 — Ränta-på-ränta

**Spelmodul:** "Snöbollsbacken"
**Format:** Idle-spel med val
**Speltid:** 3–5 minuter (men man kan spela längre)

Du står överst på en lång snöig backe. En liten snöboll framför dig. Du klickar "Släpp" och snöbollen börjar rulla.

**Mekanik:**
- Snöbollen växer exponentiellt med tiden
- Du kan "puffa på" var 5:e sekund (motsvarar månadssparande)
- Hinder dyker upp i backen — "Sälj nu och köp en Tesla", "Tjäna 2× på krypto", "Marknaden ska krascha — sälj!"
- Klickar du på ett hinder → snöbollen tappar 50 % av massan
- Klickar du inte → snöbollen rullar förbi och fortsätter växa

**Visualisering:**
- Tid längst ner: år 1, år 5, år 10, år 20, år 30
- Snöbollens diameter visar din portföljs värde
- Värdet i kronor visas också
- Bakgrund ändras med årstider och dekader (90-talet → 2000-tal → 2010-tal → 2020-tal med små referenser)

**Vinst-villkor:** Snöbollen passerar 1 miljon kr utan att tappa över 30 % en gång.

**Pedagogisk poäng:** Spelaren ser med egna ögon hur exponentiell tillväxt funkar — och hur en enda paniksäljning kan rasera 10 års sparande.

### Lektion 5 — Risk

**Spelmodul:** "Bergsbestigningen"
**Format:** Vägval, vandringssimulering
**Speltid:** 5–8 minuter

Du står vid foten av ett berg. Du ska klättra till toppen. Tre leder visas:

**Vandring i Skåne (räntefonder)** — flack, säker, men toppen är låg. Du *kommer fram*, men bara på 200 m höjd.

**Kebnekaise (globalfond)** — riktig klättring, vind, snö, en del scrambling. Topp på 2 100 m. Du klarar det — men 1–2 gånger kommer du vilja vända.

**Mount Everest (enskilda aktier)** — fantastisk utsikt, men 1 av 4 klarar det inte. Massa risk.

**Mekanik:**
- Du väljer led
- Slumpvisa "väderhändelser" inträffar (motsvarar marknadshändelser)
- Du måste välja: "fortsätt", "vila", "vänd om"
- Vänder du om mitt på Kebnekaise → du tappar all höjd. Det är panic-sell.

**Vinst-villkor:** Du når toppen. Olika led ger olika "höjder" (= avkastning).

**Pedagogisk poäng:** Risk är priset för avkastning. Den som väljer Skåne kommer fram, men kommer aldrig högt. Den som väljer Kebnekaise kommer högre, om hen härdar ut stormarna. Den som väljer Everest har 25 % konkursrisk.

### Lektion 6 — Diversifiering

**Spelmodul:** "Lagdraften"
**Format:** Drafta ett lag av bolag i positioner
**Speltid:** 5–8 minuter

En fotbollsplan visas (eller hockeyrink — välj det som känns rätt). Du ska sätta ihop ett lag av 11 spelare. Varje position måste fyllas.

**Positionerna är sektorer:**
- Målvakt = försvarande aktier (banker, livsmedel, defensiva)
- Försvar = stabila industribolag
- Mittfält = blandbolag, telekom, hälsa
- Anfall = tillväxt, tech, småbolag

**Spelarna är riktiga bolag:**
- Volvo, Handelsbanken, AstraZeneca, Telia, Ericsson, Spotify, Evolution, etc.

**Mekanik:**
- Drag-and-drop bolag till positioner
- Varje bolag har stats (avkastning, risk, sektor)
- Du kan inte spela 11 forwards

**Konsekvens:**
- Ditt lag spelar 3 matcher (= 3 marknadsscenarier):
  - Match 1: stabil tillväxtmarknad
  - Match 2: räntechock (svår för småbolag)
  - Match 3: tech-ras

**Vinst-villkor:** Du vinner alla 3 matcher (avkastning över 5 % i varje scenario).

**Pedagogisk poäng:** Bredd och balans slår excellens i en position. Den som diversifierar smart slår både den som spelar säkert (alla målvakter) och den som spelar offensivt (alla forwards).

### Lektion 7 — ISK vs AF vs KF

**Spelmodul:** "Tre lägenheter"
**Format:** Drag-and-drop, sortera pengar
**Speltid:** 4–6 minuter

Tre lägenheter visas på en gatuvy:
- **ISK** — en mysig vanlig lägenhet
- **KF** — en lägenhet med försäkringsbolagets skylt
- **AF** — ett hotellrum

Du har 10 olika "påsar med pengar", var och en med en lapp som beskriver:
- "Långsiktigt aktiesparande, 500 000 kr"
- "Utländska utdelningsaktier, USA"
- "Onoterade tillgångar i mitt eget bolag"
- "Pengar jag ska använda inom 6 månader"
- etc.

**Mekanik:**
- Drag varje påse till rätt lägenhet
- Klicka "Stäng året" → ett år simuleras, du betalar/sparar skatt baserat på dina val

**Konsekvens:**
- Långsiktig globalfond i ISK → bra skatt
- Långsiktig globalfond i AF → höga skatter
- Onoterat i ISK → systemet säger nej, du kan inte placera där
- Pengar du behöver snart i ISK → schablonskatt även om de står stilla

**Vinst-villkor:** Lägsta totala skattekostnad över 5 simulerade år. Ranking jämförs med "expertplacering".

**Pedagogisk poäng:** Skattevalet är inte komplicerat när man fattat principen. Spelaren förlåter sig själv för att den prövat och misslyckats, och har sedan principen i ryggen.

### Lektion 8 — Nyckeltal

**Spelmodul:** "Bilbesiktningen"
**Format:** Inspektera bolag med ficklampa
**Speltid:** 5–8 minuter

Du står på en bilförsäljning — men bilarna är bolag. Du har 200 000 kr att investera. Du måste välja 3 bolag att köpa aktier i.

**Mekanik:**
- 8 bolag visas (kort med logga och kort beskrivning)
- Du har en "ficklampa" du för över varje bolag → ser nyckeltal en åt gången:
  - P/E
  - Soliditet
  - Direktavkastning
  - Utdelningsandel
  - ROE
  - Tillväxt senaste 3 år
- Varje nyckeltal visas i grönt (bra), gult (varning) eller rött (varning)

**Konsekvens:**
- Du väljer 3 bolag och klickar "Köp"
- 2 år simuleras
- Bolag med dåliga nyckeltal har förhöjd konkurs-/raseringssannolikhet
- Bolag med starka nyckeltal levererar oftast vinst

**Vinst-villkor:** Inget av dina 3 bolag har förlorat över 30 % efter 2 år.

**Pedagogisk poäng:** Spelaren tränas i att INTE bara titta på en siffra. Det krävs flera röda flaggor för att avstå, och en sann värdefälla har ofta hög direktavkastning + låg soliditet + sjunkande omsättning.

### Lektion 9 — Psykologi

**Spelmodul:** "Motstå panik-knappen"
**Format:** Reaktivt psykologispel — ENDA spelmodulen med tidspress
**Speltid:** 3–5 minuter, intensiv

**Detta är den enda spelmodulen där tid spelar roll** — och det är pedagogiskt korrekt. Lektion 9 säger uttryckligen att panik och snabba beslut är fienden. Här testas det direkt.

**Setup:**
Du har en simulerad portfölj på 1 miljon kr. Den har gått upp 8 % per år i 5 år. Du är belåtet rik.

**Sedan börjar krisen.**

**Mekanik:**
- Skärmen blir gradvis röd
- Nyheter rullar i botten ("Banker i kollaps", "Sverigebörsen ner 15 % på en dag")
- Din portföljsiffra droppar i realtid
- En enorm röd **"SÄLJ ALLT"** knapp pulserar i mitten, växer sakta
- Knappen "Behåll" är liten och grå
- Slumpmässiga "vänner" skickar fake SMS i hörnet: "Sålde allt — räddade mig undan kraschen 🙏"
- Kraschen pågår i 90 sekunder

**Spelarens val:**
- Klicka SÄLJ → du har "räddat" 60 % av kapitalet, men marknaden vänder dagen efter och du missar uppgången
- Vänta ut → kraschen bottnar på -40 %, sedan återhämtar sig allt på 18 månader
- Klicka "KÖP MER" (en grön knapp som är svår att hitta) → du köper på botten och tjänar dubbelt

**Vinst-villkor:** Du har INTE klickat sälj. Bonus om du klickat köp.

**Pedagogisk poäng:** Spelaren känner i kroppen vad lektion 9 säger. Reptilhjärnan vill desperat säga ja till panik-knappen. Frontalloben måste vinna. Efter att man spelat detta en gång *fattar* man vad "panic selling" betyder på riktigt.

### Lektion 10 — Din egen plan

**Spelmodul:** "Bygg din IPS"
**Format:** Puzzle + slutbåge
**Speltid:** 10–15 minuter

Du sätter ihop din egen **Investment Policy Statement (IPS)** genom att välja bland 12 "regelkort". Bara 6 får plats i din IPS.

**Regelkort att välja mellan:**
- "Jag säljer ALDRIG vid -X % kursfall"
- "Jag köper INGEN aktie första veckan jag hört talas om den"
- "Jag månadssparar X kr på autogiro"
- "Jag rebalanserar 1 gång per år"
- "Jag har 70 % global, 30 % Sverige"
- "Jag har 100 % global"
- "Jag använder ISK för långsiktigt sparande"
- "Jag pratar med min sambo innan beslut > 50 000 kr"
- "Jag försöker tajma marknaden" (felaktig — straffas)
- "Jag säljer när media är negativ" (felaktig — straffas)
- "Jag följer börstips från influencers" (felaktig — straffas)
- "Jag handlar bara småbolag" (riskabel)

Efter att du valt → spelet simulerar 40 år (35 → 75) av investerande. Du möter alla riktiga kriser: dotcom, finanskris, corona, inflation, plus 3–4 fiktiva framtida kriser. Du ser hur DIN plan klarar dem.

**Vinst-villkor:** Du har portföljvärde > 5 miljoner kr vid 75 år OCH du har inte klickat sälj under någon kris.

**Pedagogisk poäng:** Allt landar här. Spelaren bygger sin plan från lektionernas principer, ser den fungera över livstid. Du kan spela om med olika planer för att se vilken som faktiskt funkar.

---

## 5. Visuell stil

**Bakgrund:** Crème (#F5EBD7). Varmt, retro-modernt, INTE svart eller mörkt.

**Accentfärger (Iron Man-paletten översatt till ljust läge):**
- Primär röd: #D62828
- Guld: #E9B949 / #C8941F
- Mintgrön: #4A9D7F (för positivt)
- Djupblå: #3F7CAC (för stats)

**Typografi:**
- **Endast Inter.** Vikter 500 och 700. Inga andra typsnitt.
- Tre storlekar: 13px (small/labels), 16px (body), 26px (titles). Hjälte-siffror får vara 36–52px på specifika ställen (kapital, snöbollens värde).

**Illustrationer:**
- Stardew Valley-charm. Stora, mysiga, runda former. Inga små detaljer som tävlar.
- SVG-baserade. Inga foton.
- Pizzerian, snöbollen, bergen, lägenheterna, fotbollsplanen — alla illustrerade i samma varma stil.

**Animationer:**
- Subtila, meningsfulla. Aldrig dekorativa.
- Pengar som tickar upp/ner → använd CountUp eller liknande
- Pizzan som krymper när bitar säljs → spring physics
- Snöbollen växer exponentiellt → smooth scaling
- Mr Market går fram och tillbaka → enkel translateX
- Lektion 9 panic mode: skakande skärm, röd toning, pulserande knapp → här får animationerna vara mer dramatiska

**Komponenter att återanvända från lektionsappen:**
- Färgvariabler från `globals.css`
- Inter font setup
- Eventuella shadcn/ui-komponenter som passar

---

## 6. Datamodell

```typescript
// /lib/spel/types.ts

export type GameProgress = {
  userId: string;
  currentAct: 1 | 2 | 3 | 4;
  unlockedLessons: number[]; // lektioner spelaren klarat
  unlockedSpelModules: number[]; // spelmoduler som låsts upp
  highScores: Record<string, number>; // per spelmodul
  totalXp: number;
  achievements: string[]; // ex. "first-pizza", "didnt-panic"
};

export type Scenario = {
  id: string;
  lessonId: number;
  moduleId: string;
  situation: string; // text till spelaren
  illustration?: string; // path till SVG
  choices: Choice[];
  consequenceTemplate: ConsequenceTemplate;
};

export type Choice = {
  id: string;
  label: string;
  effects: Effect[]; // vad händer mekaniskt
  pedagogicalNote?: string; // koppling till lektion om relevant
  isOptimal?: boolean; // om detta är "rätt" enligt lektionerna
};

export type Effect = {
  field: string; // "capital" | "ownership" | "debt" | "ipsScore" osv.
  delta: number;
  description?: string;
};

export type ConsequenceTemplate = {
  shortTerm: string; // direkt feedback
  longTerm?: string; // vad händer efter simulerad tid
  pedagogicalLink?: string; // länk till lektion
};

export type Pizzeria = {
  name: string;
  capital: number;
  debt: number;
  ownership: { [stakeholder: string]: number }; // namn → % ägande
  votingRights: { [stakeholder: string]: number }; // A vs B-aktier
  monthlyRevenue: number;
  monthlyCosts: number;
};

export type Portfolio = {
  holdings: Array<{ ticker: string; antal: number; gav: number; type: 'stock' | 'fund' }>;
  cash: number;
  accountType: 'isk' | 'af' | 'kf';
};

export type IPS = {
  rules: string[]; // 6 valda regelkort-id:n
  monthlySaving: number;
  allocation: { global: number; sweden: number; bonds: number; krydda: number };
};
```

**Persistens:**
- MVP: localStorage med key `aktieskolan-spel-progress`
- V1: migrera till Supabase tabellen `game_progress` (en kolumn `progress JSONB` räcker)

---

## 7. Teknisk arkitektur

### Filstruktur i Next.js-projektet

```
/app
  /spel
    page.tsx                  ← spelöversikten, visar låsta/upplåsta moduler
    /[modul-slug]/page.tsx    ← enskild spelmodul
/components
  /spel
    /shared                   ← gemensamma komponenter
      ScenarioBox.tsx         ← visar text + val
      ConsequenceVisualizer.tsx ← animerar konsekvenser
      Coach.tsx               ← pedagogiska kommentarer
      LessonLink.tsx          ← djupklänkning till lektion
    /modul-1-pizzan
      PizzaCanvas.tsx         ← visualisering av pizzan
      OwnershipMeter.tsx
    /modul-2-mr-market
      MrMarketFigure.tsx
    /modul-3-lasagne
      LasagneBuilder.tsx
    /modul-4-snoboll
      SnowballScene.tsx
    osv.
/content
  /spel
    /scenarios                ← JSON-filer per modul
      modul-1-pizzan.json
      modul-2-mr-market.json
      osv.
/lib
  /spel
    types.ts
    state.ts                  ← Zustand store
    persistence.ts            ← localStorage + Supabase
    simulation.ts             ← simulera tid, kriser, marknad
```

### State management

**Zustand** för spelets state (inte Redux — för mycket overhead). Exempel:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SpelStore {
  progress: GameProgress;
  currentScenario: Scenario | null;

  makeChoice: (choiceId: string) => void;
  unlockModule: (moduleId: number) => void;
  resetGame: () => void;
}

export const useSpel = create<SpelStore>()(
  persist(
    (set) => ({
      progress: { /* default */ },
      currentScenario: null,
      makeChoice: (choiceId) => { /* logik */ },
      unlockModule: (id) => { /* logik */ },
      resetGame: () => { /* logik */ },
    }),
    { name: 'aktieskolan-spel' }
  )
);
```

### Scenarier som data, inte kod

Lägg alla scenarier i JSON så de är lätta att redigera utan att touch koden:

```json
// /content/spel/scenarios/modul-1-pizzan.json
{
  "moduleId": "pizzan",
  "lessonId": 1,
  "scenarios": [
    {
      "id": "1.1-banklan",
      "situation": "Handelsbanken erbjuder dig 200 000 kr i lån mot 6 % ränta.",
      "choices": [
        {
          "id": "accept",
          "label": "Acceptera lånet",
          "effects": [
            { "field": "capital", "delta": 200000 },
            { "field": "debt", "delta": 200000 },
            { "field": "monthlyCost", "delta": 1000 }
          ],
          "pedagogicalNote": null
        },
        {
          "id": "decline",
          "label": "Tacka nej",
          "effects": [],
          "pedagogicalNote": null
        }
      ]
    }
  ]
}
```

### Integration med befintliga appen

- Återanvänd designsystemet (samma globala CSS-variabler)
- Återanvänd `lib/isk.ts` för skattelogik i lektion 7
- Återanvänd `data/stocks.json` och `data/funds.json` för riktiga bolag/fonder i lektion 6 och 8
- Spelmodulerna ligger på `/spel/[modul-slug]` så de inte krockar med `/lektioner` och `/simulator`

---

## 8. Konkreta scenarier för Akt 1 (Modul 1: Pizzan)

Här är 6 färdiga scenarier som Claude Code kan kopiera in i `modul-1-pizzan.json`. Bygg modulen så den kör dessa i ordning.

### Scenario 1.1 — Startkapital

```
"Det är våren 2026. Du är 25 år, jobbar som servitör och har sparat 50 000 kr.
Dina ögon faller på en ledig lokal i Hammarby Sjöstad — perfekt för en pizzeria.
Du räknar: du behöver 200 000 kr för ugn, kyl, hyra och löner första månaderna.
Hur löser du det?"

Val:
1. "Ta banklån på 200 000 kr (6 % ränta)" → +200k capital, +200k debt, +1000kr/mån
2. "Sälj 40 % av bolaget till bror Lukas för 150 000 kr" → +150k capital, -40% ownership
3. "Spara 6 månader till — då har jag det själv" → ingen ändring, +6 månader tid
4. "Kombinera: sälj 20 % för 75 000 + ta lån på 75 000" → mix
```

### Scenario 1.2 — Pizzaugnen

```
"Du står hos ugnsleverantören. Två val:
- En begagnad italiensk Marra Forni (90 000 kr) — perfekt men dyr.
- En koreansk standardugn (35 000 kr) — funkar, men maten blir 10 % sämre."

Val:
1. Marra Forni → -90k, men +15 % intäkter framöver
2. Koreanska → -35k, normala intäkter
```

### Scenario 1.3 — Faster Inger knackar på

```
"Din faster Inger har hört om dina planer. Hon vill köpa 10 % av bolaget för
25 000 kr. 'Du värderar bolaget till 250 000 kr då. Det är väl rimligt?'

Du räknar: dina nuvarande pengar + förväntat värde efter ett år ≈ 350 000 kr.
Är 250 000 kr en rättvis värdering?"

Val:
1. Acceptera → +25k, -10 % ownership (men billigt jämfört med vad bolaget är värt)
2. "Erbjud henne 10 % för 35 000 kr istället" → om hon säger ja, +35k -10%
3. Tacka nej → ingen ändring
```

### Scenario 1.4 — A-aktier vs B-aktier

```
"En lokal affärsman erbjuder 100 000 kr för 30 % av bolaget. Du tänker säga ja.
Men då säger han: 'Förresten — gör dem till B-aktier utan rösträtt. Jag bryr mig
bara om utdelningen.'

Du minns från lektion 1: B-aktier ger samma utdelning som A-aktier, men ingen
röststyrka. Du skulle behålla 100 % av rösterna men bara 70 % av utdelningen."

Val:
1. "Bra deal — A-aktier för mig, B-aktier för honom" → +100k, -30 % utdelning, BEHÅLLER 100 % röster
2. "Nej, vi gör vanliga aktier" → +100k, -30 % ownership totalt
3. Tacka nej → ingen ändring
```

### Scenario 1.5 — Första krisen

```
"Det är vecka 14. Det har regnat i 12 dagar i sträck. Försäljningen är 40 %
lägre än normalt. Dina kostnader rullar på.

Vad gör du?"

Val:
1. "Kör som vanligt — det här går över" → -20k, men lär dig tålamod
2. "Sänka priser för att locka kunder" → -10k, men marginalerna äts upp framöver
3. "Sparka en anställd för att rädda kassan" → +0k, men kvaliteten droppar
4. "Ta ett nytt lån på 50 000 kr" → +50k, +50k debt
```

### Scenario 1.6 — Vinsten

```
"Sex månader har gått. Pizzerian går stabilt med 30 000 kr/månad i vinst efter
alla kostnader. Du sitter med 180 000 kr i kassan.

Vad gör du med vinsten?"

Val:
1. "Ta ut som lön till mig själv" → personlig välmående +, bolaget växer ej
2. "Återinvestera i pizzerian (renovera, marknadsför)" → +25 % intäkter framöver
3. "Spara — kanske öppna en till pizzeria om ett år" → leder till Akt 2
4. "Dela ut till alla ägare" → utdelning till delägare proportionellt
```

**Slutbild Akt 1:** Spelet sammanfattar vad spelaren lärt sig:
- Hur stor andel hen behöll
- Hur hen finansierade
- Vinst eller förlust
- Vilka val som var "lektion-optimala"

Sedan: "Akt 2 låses upp efter lektion 3."

---

## 9. MVP-scope (vad bygger vi först)

**MVP = Akt 1 (Modul 1: Pizzan) + skelett för resten**

Veckans arbete:

### Vecka 1 — Fundament
- Skapa `/app/spel/page.tsx` (översikt)
- Sätt upp Zustand store
- Skapa scenario-renderingen
- Implementera Modul 1 (Pizzan) komplett enligt scenarierna i sektion 8
- Localstorage-persistens

### Vecka 2 — Akt 1 polering
- Pizza-visualiseringen (SVG som krymper)
- Animeringar för konsekvenser
- Coach-komponenten med länkar till lektionerna
- Mobile-responsiv layout

### Senare versioner

- **V1.1:** Modul 2 (Mr Market) + Modul 4 (Snöbollen) — de enklare modulerna
- **V1.2:** Modul 3 (Lasagne) + Modul 6 (Lagdraften) — drag-and-drop puzzles
- **V1.3:** Modul 5 (Berg) + Modul 7 (Lägenheter) + Modul 8 (Bilbesiktning)
- **V2:** Modul 9 (Panic) — kräver mest custom animation
- **V2.1:** Modul 10 (IPS-pusslet) + 40-årssimuleringen
- **V3:** Akt 2 (Kedjan), Akt 3 (IPO:n), Akt 4 (Investeraren) — knyt ihop allt

---

## 10. Vad Claude Code ska börja med

1. **Läs detta dokument helt + lektion 1 i `/content/lessons/01-vad-ar-en-aktie.mdx`**
2. **Skapa filstrukturen** enligt sektion 7
3. **Implementera Modul 1 (Pizzan)** med:
   - Alla 6 scenarier från sektion 8
   - SVG-pizza som krymper när ägande minskar
   - Ownership-meter med tydliga gränsvärden (51 %)
   - Coach-komponent som länkar till lektion 1 vid pedagogiskt viktiga ögonblick
4. **Visa Peder första spelbara versionen** så snart Modul 1 fungerar lokalt på `localhost:3000/spel/pizzan`
5. **Iterera baserat på Peders feedback** innan vi tar oss an Modul 2

**Designval Claude Code får göra själv:**
- Exakt typografi-storlekar inom intervallet 13/16/26/36–52
- Exakt placering av komponenter
- Animationskurvor och timing
- Microcopy-detaljer

**Designval Claude Code SKA fråga om:**
- Större förändringar av spelmekanik
- Tillägg av nya scenarier utöver de i sektion 8
- Förändringar i färgpaletten
- Tillägg av timer eller tidspress (vilket är förbjudet utom i Modul 9)

---

## Slutord

Detta dokument är ett *ankare*, inte en bibel. Om Claude Code märker att något i mekaniken inte fungerar i praktiken — diskutera med Peder. Det viktiga är att de pedagogiska principerna (sektion 2) följs. Resten är detaljer.

**Det viktigaste:** spelet finns för att barnen ska *fatta* aktier och fonder. Inte för att vi ska visa hur fancy vi kan koda. Klarhet > snyggt. Pedagogik > snabbhet. Lektionsmanus > kreativ frihet.

Lycka till.
