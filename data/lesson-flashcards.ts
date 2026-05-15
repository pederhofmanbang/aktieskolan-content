export type Flashcard = {
  front: string;
  back: string;
};

/**
 * Egna flashcards per lektion. 15-20 kort styck som testar de viktigaste
 * begreppen, räkningarna och historiska fakta från manuskripten.
 *
 * Strukturen är synlig för LessonTabs som väljer interna kort när de finns
 * (annars fallback till NotebookLM-länken i lesson-media.ts).
 */
export const lessonFlashcards: Record<string, Flashcard[]> = {
  "01-vad-ar-en-aktie": [
    {
      front: "Vad är en aktie?",
      back: "Ett ägarbevis i ett riktigt bolag — en bit av företaget med rätt till andel av vinsten.",
    },
    {
      front: "Du äger 50 aktier i ett bolag med 5 000 utestående aktier. Hur stor andel äger du?",
      back: "1 % (50 / 5 000 = 0,01).",
    },
    {
      front: "Vilka tre saker får du som aktieägare?",
      back: "1) Andel av vinsten (utdelning). 2) Rösträtt på bolagsstämman. 3) Andel av tillgångarna vid likvidation.",
    },
    {
      front: "Varför noteras bolag på börsen?",
      back: "För att få in kapital till tillväxt och/eller låta tidiga ägare ta hem en del av värdet.",
    },
    {
      front: "Vad är skillnaden mellan A- och B-aktier i svenska bolag?",
      back: "A-aktier har starkare rösträtt (1 vs 1/10). Utdelning per aktie är samma. B-aktien är oftast mer omsatt.",
    },
    {
      front: "Vilken aktietyp väljer småsparare oftast?",
      back: "B-aktien — mer omsatt, bättre likviditet, mindre spread. Samma utdelning per aktie.",
    },
    {
      front: "Vilka två sätt kan du tjäna pengar på en aktie?",
      back: "Kursutveckling (köper för 100, säljer för 150) och utdelning (kontant från bolaget).",
    },
    {
      front: "Vad är en utdelning?",
      back: "Bolagets vinstdel som betalas ut till aktieägarna — kontant in på kontot.",
    },
    {
      front: "Skattefritt eller skattepliktigt — utdelning i ett ISK?",
      back: "Skattefri direkt (men du betalar schablonskatt på hela kapitalet — förklaras i lektion 7).",
    },
    {
      front: "Familjen Persson äger ~36 % av H&M:s aktier. Hur stor andel av rösterna?",
      back: "Över 75 % — tack vare A-aktiernas starkare rösträtt.",
    },
    {
      front: "Vilket år börsnoterades H&M?",
      back: "1974.",
    },
    {
      front: "Vad är skillnaden mellan spekulation och investering?",
      back: "Spekulation = kortsiktig kursrörelse. Investering = långsiktig värdeökning baserad på bolagets utveckling.",
    },
    {
      front: "På kort sikt — vad styr aktiekursen mest?",
      back: "Känslor, nyheter, flöden — inte bolagets faktiska verksamhet.",
    },
    {
      front: "På lång sikt (5+ år) — vad styr aktiekursen?",
      back: "Hur bolaget faktiskt går — vinster, tillväxt, marknadsandelar.",
    },
    {
      front: "Investor delar ut ~5 kr per aktie. Du äger 100 aktier — hur mycket får du?",
      back: "500 kr in på kontot.",
    },
    {
      front: "Varför ger tillväxtbolag (Spotify, Stillfront) sällan utdelning?",
      back: "De återinvesterar vinsten för att växa snabbare istället för att dela ut.",
    },
    {
      front: "Kan en aktie bli värd noll?",
      back: "Ja — om bolaget går i konkurs och tillgångarna inte räcker till aktieägarna.",
    },
    {
      front: "Varför har A-aktier sämre likviditet än B-aktier?",
      back: "Grundarfamiljer behåller A-aktier för rösträtten, så få omsätts. B-aktien handlas mer aktivt.",
    },
    {
      front: "Vad är 'röststark' aktie i Sverige?",
      back: "A-aktier med 1 röst (B-aktier har ofta 1/10) — låter grundarfamiljer behålla kontroll med mindre kapital.",
    },
    {
      front: "Vad krävs för att ett bolag ska kunna börsnoteras?",
      back: "Tillräcklig storlek, finansiell historik, prospekt, granskad redovisning och listkrav från Nasdaq Stockholm.",
    },
  ],

  "02-borsen-och-mr-market": [
    {
      front: "Vem är Mr Market?",
      back: "Benjamin Grahams metafor för börsen — en partner med stora humörsvängningar som varje dag erbjuder dig ett pris.",
    },
    {
      front: "Vad är skillnaden mellan pris och värde?",
      back: "Priset är vad Mr Market erbjuder idag. Värdet är vad bolaget faktiskt är värt långsiktigt. De är sällan samma.",
    },
    {
      front: "Vad är köpkurs (bid)?",
      back: "Det högsta priset någon är villig att betala just nu — högsta nivån i orderbokens köpsida.",
    },
    {
      front: "Vad är säljkurs (ask)?",
      back: "Det lägsta priset någon är villig att sälja för just nu — lägsta nivån i orderbokens säljsida.",
    },
    {
      front: "Vad är spread?",
      back: "Skillnaden mellan bid och ask — den 'dolda avgiften' för att handla aktien.",
    },
    {
      front: "Typisk spread för svenska Large Cap-aktier?",
      back: "0,05–0,2 %.",
    },
    {
      front: "Typisk spread för småbolag på First North?",
      back: "3–5 % — du måste tjäna 3–5 % bara för att gå plus minus noll efter köp+sälj.",
    },
    {
      front: "Stockholmsbörsens officiella namn?",
      back: "Nasdaq Stockholm.",
    },
    {
      front: "Vilken lista hör Volvo, H&M, Investor och Ericsson till?",
      back: "Large Cap (börsvärde över 1 mdr EUR, ungefär 10 mdr SEK).",
    },
    {
      front: "Vad är First North?",
      back: "Mindre reglerad lista för tillväxtbolag av valfri storlek. Lägre transparenskrav och högre spread.",
    },
    {
      front: "Vad är OMXS30?",
      back: "Index för de 30 mest omsatta aktierna på Stockholmsbörsen. Räknar INTE med utdelningar.",
    },
    {
      front: "Vad skiljer OMXS30 från OMXS30GI?",
      back: "GI = Gross Index = inkluderar återinvesterade utdelningar. Det 'ärliga' måttet på avkastning.",
    },
    {
      front: "Vad är OMXSPI?",
      back: "Brett index för alla ~370 aktier på Stockholmsbörsen. Räknar inte med utdelningar.",
    },
    {
      front: "Hur mycket bidrar utdelningar till svensk börsavkastning per år historiskt?",
      back: "Ungefär 3 procentenheter per år — stor skillnad över decennier.",
    },
    {
      front: "Stockholmsbörsens öppettider en vanlig handelsdag?",
      back: "08:45–09:00 öppningsauktion. 09:00–17:25 kontinuerlig handel. 17:25–17:30 stängningsauktion.",
    },
    {
      front: "Vad är skillnaden mellan marknadsorder och limitorder?",
      back: "Marknadsorder: köp till bästa pris just nu — snabbt men du tar emot vad spreaden bjuder. Limitorder: köp endast om priset når ditt maxpris.",
    },
    {
      front: "När ska du absolut använda limitorder?",
      back: "På småbolag, utländska aktier eller andra aktier med stor spread. För att inte chocka över priset.",
    },
    {
      front: "Vad är 'senast betalt'-kurs?",
      back: "Det pris den senaste affären gjordes till. Det är ofta det pris du ser i appen.",
    },
    {
      front: "Varför rör sig aktiekursen om inget händer i bolaget?",
      back: "Mr Market reagerar på känslor, nyheter, makroflöden — inte bara fundamenta. Priset svänger på kortsiktiga humör.",
    },
    {
      front: "Vad är 'regel-of-thumb' för nybörjare gällande börslistor?",
      back: "Börja på Large Cap. Mer transparent, mer omsatt, längre historik genom kriser.",
    },
    {
      front: "Vad är courtage?",
      back: "Avgift som banken/mäklaren tar för att utföra din aktie-order. Hos Avanza/Nordnet: 1–9 kr mini, 39 kr standard, ~99 kr cap på stora ordrar.",
    },
    {
      front: "Vad kostar det att köpa fonder och månadssparande hos Avanza/Nordnet?",
      back: "0 kr courtage. Bara fondens årliga avgift dras automatiskt över tid.",
    },
    {
      front: "Du köper aktier för 1 000 kr med 39 kr i courtage. Hur stor andel åt avgiften?",
      back: "3,9 %. Aktien måste stiga 3,9 % bara för att kompensera courtaget. Använd mini-courtage för små köp.",
    },
  ],

  "03-fonder-lasagne": [
    {
      front: "Vad är en fond?",
      back: "En pengapool där förvaltaren köper aktier/obligationer åt dig och tusentals andra sparare. Du äger fondandelar.",
    },
    {
      front: "Vad står NAV för?",
      back: "Net Asset Value — fondens värde per andel. Uppdateras typiskt en gång per dag kl. 16:00.",
    },
    {
      front: "Vad definierar en aktiefond?",
      back: "Minst 85 % aktier. Risk hög, förväntad avkastning 6–9 % per år långsiktigt.",
    },
    {
      front: "Vad är en räntefond?",
      back: "Fond som äger obligationer och statsskuldväxlar. Låg–medel risk, 1–4 % per år.",
    },
    {
      front: "Vad är en blandfond?",
      back: "Mix av aktier och räntor (t.ex. 50/50). Medelrisk, 3–6 % avkastning.",
    },
    {
      front: "Vad är skillnaden mellan indexfond och aktivt förvaltad fond?",
      back: "Indexfond följer marknaden passivt med låg avgift. Aktiv försöker välja vinnare — men slår sällan index efter avgift.",
    },
    {
      front: "Vad säger SPIVA-rapporten om aktiva fonder på 10 års sikt?",
      back: "Mindre än 20 % slår sitt jämförelseindex. På 20 år är siffran närmare 10 %.",
    },
    {
      front: "Typisk avgift för en bra svensk indexfond?",
      back: "0,1–0,3 % per år. Avanza Zero har 0 %.",
    },
    {
      front: "Typisk avgift för en aktivt förvaltad fond?",
      back: "1–2 % per år.",
    },
    {
      front: "Skillnad i slutbelopp på 30 år vid 2 000 kr/mån mellan 0,2 % och 1,5 % avgift?",
      back: "Cirka 400 000 kr till indexfondens fördel.",
    },
    {
      front: "Vad är 'active share'?",
      back: "Andel av fonden som skiljer sig från jämförelseindex. Under 60 % indikerar smygindexfond.",
    },
    {
      front: "Vilken är Sveriges billigaste globalfond?",
      back: "Avanza Global, 0,09 % avgift. Drygt 800 globala bolag.",
    },
    {
      front: "Vad är Avanza Zero?",
      back: "Sverige-indexfond med 0 % avgift. Innehåller de 30 största svenska bolagen.",
    },
    {
      front: "Vad är en ETF?",
      back: "Exchange Traded Fund — fond som handlas som aktie i realtid på börsen. Oftast passiv indexfond.",
    },
    {
      front: "Vad är 'utdelningsfond'?",
      back: "Fond som fokuserar på högutdelande bolag. Del av direktavkastningen återinvesteras eller delas ut.",
    },
    {
      front: "Hur ofta bör du kolla din portfölj som långsiktig sparare?",
      back: "Max 1 gång per kvartal. Daglig kontroll leder till panic-beslut.",
    },
    {
      front: "Den enklaste portföljen i världen för en ung sparare?",
      back: "100 % i en bred globalfond. Det räcker — allvarligt.",
    },
    {
      front: "Hur många bolag äger en typisk globalfond?",
      back: "800–2000 bolag fördelade över USA, Europa, Japan, Sverige, tillväxtmarknader.",
    },
    {
      front: "Vad är fördelen med fond jämfört med enstaka aktier?",
      back: "Automatisk diversifiering. En enskild aktiekonkurs sänker dig knappt — du äger lite av många.",
    },
    {
      front: "Vad är en hedgefond?",
      back: "Fond som kan använda derivat, blankning och hävstång. Varierar i mål — ofta dyr och svår att förstå.",
    },
  ],

  "04-ranta-pa-ranta": [
    {
      front: "Vad är ränta-på-ränta?",
      back: "Att fjolårets vinst också börjar tjäna pengar — vinsten på vinsten gör kurvan exponentiell.",
    },
    {
      front: "10 000 kr vid 7 % årligen — värde efter 10 år?",
      back: "Cirka 19 700 kr (10 000 × 1,07^10 = 1,97x).",
    },
    {
      front: "10 000 kr vid 7 % årligen — värde efter 30 år?",
      back: "Cirka 76 000 kr.",
    },
    {
      front: "10 000 kr vid 7 % årligen — värde efter 50 år?",
      back: "Cirka 295 000 kr — nästan 30 gånger pengarna.",
    },
    {
      front: "Vad säger regel-72?",
      back: "Dela 72 med årlig avkastning för att räkna ut hur länge det tar för pengarna att fördubblas.",
    },
    {
      front: "Vid 6 % årlig avkastning — fördubblingstid?",
      back: "Cirka 12 år (72/6).",
    },
    {
      front: "Vid 8 % årlig avkastning — fördubblingstid?",
      back: "Cirka 9 år (72/8).",
    },
    {
      front: "Vid 10 % årlig avkastning — fördubblingstid?",
      back: "Cirka 7 år (72/10).",
    },
    {
      front: "Vid 2 % (typiskt sparkonto) — fördubblingstid?",
      back: "Cirka 36 år. Inflation äter upp avkastningen.",
    },
    {
      front: "Anna sparar 1000 kr/mån 25–35 år. Värde vid 65?",
      back: "Cirka 1,4 miljoner kr (vid 7 % årligen).",
    },
    {
      front: "Erik sparar 1000 kr/mån 35–65 år. Värde vid 65?",
      back: "Cirka 1,22 miljoner kr (vid 7 % årligen).",
    },
    {
      front: "Vem vinner — Anna eller Erik? Trots att Erik satte in 3 gånger så mycket?",
      back: "Anna — för att hennes pengar fick 10 år ostörda att växa innan Erik ens kom igång.",
    },
    {
      front: "5000 kr/månad i 42 år vid 7 % — slutbelopp?",
      back: "Cirka 15,2 miljoner kr. Insatta: 2,5 miljoner. Resten är ränta-på-ränta.",
    },
    {
      front: "1000 kr/månad i 42 år vid 7 % — slutbelopp?",
      back: "Cirka 3 miljoner kr (504 000 insatt + 2,5 milj i ränta-på-ränta).",
    },
    {
      front: "Vad är globala aktiemarknadens historiska snittavkastning?",
      back: "Ungefär 7–9 % per år nominellt sedan 1928.",
    },
    {
      front: "Är ränta-på-ränta-kurvan linjär eller exponentiell?",
      back: "Exponentiell — kurvan kröker brant uppåt efter 15–20 år.",
    },
    {
      front: "Varför ger de flesta upp på ränta-på-ränta?",
      back: "Det känns långsamt i början — efter 5 år har det knappt hänt något. Vinsten kommer i slutet.",
    },
    {
      front: "Vad är viktigast — beloppet eller tiden?",
      back: "Tiden. Ett år förlorat vid 25 är värt mer än 10 år vid 55.",
    },
    {
      front: "När är bästa tidpunkten att börja spara?",
      back: "För 10 år sedan. Näst bäst: idag.",
    },
    {
      front: "Vad sa Einstein sägs ha kallat ränta-på-ränta?",
      back: "'Världens åttonde underverk — den som förstår den tjänar på den, den som inte gör det betalar den.'",
    },
  ],

  "05-risk": [
    {
      front: "Vad är risk i investeringssammanhang?",
      back: "Priset du betalar för avkastning — kursrörelser, drawdowns, ovisshet. Inte en bugg, en feature.",
    },
    {
      front: "Vad är standardavvikelse (volatilitet)?",
      back: "Mått på hur mycket en investering svänger historiskt — högre = större upp- och nedgångar.",
    },
    {
      front: "Typisk standardavvikelse för en bred globalfond per år?",
      back: "13–16 %.",
    },
    {
      front: "Typisk standardavvikelse för en svensk Large Cap-aktie?",
      back: "20–30 %.",
    },
    {
      front: "Typisk standardavvikelse för småbolagsaktie/First North?",
      back: "30–50 %+. Mycket hög risk.",
    },
    {
      front: "Vad är drawdown?",
      back: "Hur mycket en investering tappat från sin senaste topp.",
    },
    {
      front: "Vad är max drawdown?",
      back: "Det värsta som hänt historiskt — den största fall från topp till botten.",
    },
    {
      front: "Max drawdown för svenska börsen historiskt?",
      back: "Cirka -65 % (Dotcom-kraschen 2000–2002).",
    },
    {
      front: "Hur mycket föll svenska börsen i Finanskrisen 2007–2009?",
      back: "Cirka -55 %. Hade du haft 1 miljon i januari hade du haft ~450 000 i mars 2009.",
    },
    {
      front: "Hur mycket föll börsen i Coronakraschen 2020?",
      back: "Cirka -30 % på 4 veckor — snabbaste raset någonsin. Återhämtning på 5 månader.",
    },
    {
      front: "Vad är Sharpe-kvot?",
      back: "Avkastning över riskfri ränta, delat med standardavvikelse. Mått på riskjusterad avkastning.",
    },
    {
      front: "Vad är bra Sharpe-kvot?",
      back: "1–2 är bra. Över 2 är mycket bra och sällsynt över lång tid.",
    },
    {
      front: "Vilken riskklass har de flesta aktiefonder enligt EU?",
      back: "Klass 6 (standardavvikelse 15–25 %).",
    },
    {
      front: "Vilken riskklass är typisk för småbolag/branschfonder?",
      back: "Klass 7 (standardavvikelse över 25 %).",
    },
    {
      front: "Sannolikhet att svenska börsen är ned efter 1 dag?",
      back: "Cirka 46 % — nästan slumpartat.",
    },
    {
      front: "Sannolikhet att svenska börsen är ned efter 1 år?",
      back: "Cirka 25 %.",
    },
    {
      front: "Sannolikhet att svenska börsen är ned efter 5 år?",
      back: "Cirka 10 %.",
    },
    {
      front: "Sannolikhet att svenska börsen är ned efter 15 år?",
      back: "Nästan 0 % — har aldrig hänt historiskt.",
    },
    {
      front: "Bör pengar du behöver inom 5 år vara på börsen?",
      back: "Nej — för korta tider för att klara en eventuell krasch. Sparkonto eller korträntefond är säkrare.",
    },
    {
      front: "Vem hade störst förlust i 2008–2009?",
      back: "De som sålde på botten. De som satt kvar fick tillbaka allt och mer därtill inom några år.",
    },
  ],

  "06-diversifiering": [
    {
      front: "Vad är diversifiering?",
      back: "Att sprida pengar mellan innehav som inte rör sig likadant — minskar risk utan att minska förväntad avkastning.",
    },
    {
      front: "Vem fick Nobelpriset för att bevisa diversifieringens värde?",
      back: "Harry Markowitz, ekonomipriset 1990.",
    },
    {
      front: "Varför kallas diversifiering 'den enda gratisluncen i finans'?",
      back: "Du minskar risken (volatilitet, drawdown) utan att minska den förväntade avkastningen.",
    },
    {
      front: "Hur stor andel av världens börsvärde står USA för?",
      back: "Cirka 60 %.",
    },
    {
      front: "Hur stor andel står Sverige för?",
      back: "Ungefär 1 %.",
    },
    {
      front: "Hur stor andel står tillväxtmarknader för?",
      back: "Cirka 14 %.",
    },
    {
      front: "Vad är 'kärna-krydda'-modellen?",
      back: "Kärna (70–100 %) = bred globalfond. Krydda (0–30 %) = Sverigefond eller enstaka aktier.",
    },
    {
      front: "Hur många bolag behövs för bra diversifiering?",
      back: "15–20 i olika branscher räcker. ELLER 1 globalfond med 1000+ bolag — bättre.",
    },
    {
      front: "Klassiskt exempel på land-fokuserad katastrof?",
      back: "Japan 1989 — då världens största börs. Sedan stagnerade Nikkei i 30 år.",
    },
    {
      front: "Är 5 svenska bankaktier väldiversifierat?",
      back: "Nej — alla beror på samma räntor och svensk ekonomi. Samma bransch, samma risker.",
    },
    {
      front: "Är 2 globalfonder från olika bolag bra diversifiering?",
      back: "Nej — de äger oftast samma bolag i samma vikter. Dubbla avgifter för samma exponering.",
    },
    {
      front: "Förväntad avkastning på 100 % aktier vs 60/40-portfölj?",
      back: "100 % aktier: ~8 % per år, max drawdown -55 %. 60/40: ~6 %/år, max drawdown -30 %.",
    },
    {
      front: "Förväntad avkastning på 80/20 (aktier/räntor)?",
      back: "Cirka 7 % per år. Max drawdown ~ -40 %.",
    },
    {
      front: "Vad är rebalansering?",
      back: "Att en gång om året sälja det som gått bra och köpa det som halkat efter, för att återställa allokeringen.",
    },
    {
      front: "Hur ofta bör en månadssparare rebalansera?",
      back: "En gång per år. Eller styr månadssparandet mot det som halkat efter.",
    },
    {
      front: "Är crypto bra diversifiering?",
      back: "Bara i mycket små proportioner (några få procent). Mycket volatilt och spekulativt.",
    },
    {
      front: "Vad är 'tech-fond-fällan'?",
      back: "Tre olika tech-fonder överlappar oftast med 70 %+ — Apple, Microsoft, Nvidia, Tesla finns i alla.",
    },
    {
      front: "För en 23-åring med 40 års horisont — rationell aktieandel?",
      back: "90–100 %. Tiden jämnar ut svängningarna.",
    },
    {
      front: "När bör man flytta mer mot räntor?",
      back: "Närmare målpunkt (pension), eller om svängningarna blir psykiskt jobbiga.",
    },
    {
      front: "Vad är fördelen med en bred globalfond gentemot enstaka aktier?",
      back: "Diversifiering på 1000+ bolag, geografisk spridning, automatisk balansering, låga avgifter. Slår 95 % av enstaka portföljer.",
    },
  ],

  "07-isk-vs-af-vs-kf": [
    {
      front: "Vad står ISK för?",
      back: "Investeringssparkonto — svenskt sparkonto för aktier och fonder med schablonbeskattning.",
    },
    {
      front: "Hur beskattas ISK?",
      back: "Schablonskatt på hela kapitalet, oavsett vinst eller förlust. Banken sköter allt automatiskt.",
    },
    {
      front: "Vad är fribeloppet på ISK 2026?",
      back: "300 000 kr per person — höjt från 150 000 kr 2025. Skattefritt under denna nivå.",
    },
    {
      front: "Vad är schablonintäkten 2026?",
      back: "Statslåneräntan (2,55 %) + 1 procentenhet = 3,55 %. Lägst 1,25 % i lag.",
    },
    {
      front: "Vad blir effektiv ISK-skatt 2026?",
      back: "1,065 % av kapitalet över fribeloppet (3,55 % × 30 % skattesats).",
    },
    {
      front: "Anna har 500 000 kr på ISK 2026 — hur mycket skatt?",
      back: "(500 000 − 300 000) × 1,065 % = 2 130 kr för året.",
    },
    {
      front: "Vid vilken årlig avkastning blir ISK och AF lika dyra?",
      back: "Cirka 3,55 % per år. Över det vinner ISK; under det vinner AF.",
    },
    {
      front: "Vad är största nackdelen med ISK?",
      back: "Förluster är INTE avdragsgilla. Och schablonskatt även förlustår.",
    },
    {
      front: "Får onoterade aktier ligga på ISK?",
      back: "Nej — bara börsnoterade aktier och fonder.",
    },
    {
      front: "Vad är KF (Kapitalförsäkring)?",
      back: "Försäkringsbolaget äger värdepappren, du är förmånstagare. Samma schablonskatt som ISK.",
    },
    {
      front: "När är KF bättre än ISK?",
      back: "Vid stora utländska utdelningar (auto-återbetalning av källskatt), barnsparande, eller sekretess.",
    },
    {
      front: "Vad är största nackdelen med KF jämfört med ISK?",
      back: "Du äger inte aktierna juridiskt — ingen rösträtt på bolagsstämman.",
    },
    {
      front: "Vad är AF (Aktie- och fondkonto)?",
      back: "Klassisk depå. 30 % skatt på realiserad vinst, 30 % på utdelning, 0,12 % schablonskatt på fonder.",
    },
    {
      front: "När är AF bättre än ISK?",
      back: "Vid förlust (kan kvitta), onoterade aktier, eller om pengarna inte växer över ~3,5 % per år.",
    },
    {
      front: "Hur räknas ISK-kapitalunderlaget?",
      back: "Snittet av kontots värde 1 jan, 1 apr, 1 jul, 1 okt + halva insättningarna under året.",
    },
    {
      front: "Behöver man deklarera ISK manuellt?",
      back: "Nej — banken rapporterar och Skatteverket fyller i. AF kräver K4-blankett för aktier.",
    },
    {
      front: "Vad händer om man flyttar utomlands med ISK?",
      back: "Måste stängas eller flyttas — ISK kräver svensk skatthemvist.",
    },
    {
      front: "Hur stor skattefördel ger ISK över AF på 30 år (2000 kr/mån, 7 %)?",
      back: "Cirka 330 000 kr.",
    },
    {
      front: "Hur öppnar man ett ISK?",
      back: "Avanza.se eller Nordnet.se → öppna konto → BankID → välj 'Investeringssparkonto'. 5 minuter, 0 kr.",
    },
    {
      front: "För 95 % av svenska småsparare — vilken kontotyp är bäst?",
      back: "ISK — för långsiktigt sparande i fonder och aktier som förväntas växa mer än 3,5 % per år.",
    },
  ],

  "08-nyckeltal": [
    {
      front: "Vad står P/E för?",
      back: "Price / Earnings = aktiekurs / vinst per aktie. 'Hur många år tar det innan vinsten betalar det jag betalade?'",
    },
    {
      front: "Stockholmsbörsens historiska snitt-P/E?",
      back: "Cirka 16–18.",
    },
    {
      front: "Vad signalerar P/E under 10?",
      back: "Kan vara billigt — eller en värdefälla (något fel som marknaden ser men du inte ännu).",
    },
    {
      front: "Vad signalerar P/E över 30?",
      back: "Marknaden förväntar sig stark tillväxt — eller har blivit för optimistisk.",
    },
    {
      front: "Vad är P/E för bolag som går med förlust?",
      back: "Negativt eller meningslöst — använd P/S istället.",
    },
    {
      front: "Vad är direktavkastning?",
      back: "Årlig utdelning delat med aktiekurs. Hur stor andel av investeringen du får tillbaka som utdelning per år.",
    },
    {
      front: "Vad anses normal direktavkastning för svenska Large Cap?",
      back: "2–4 %.",
    },
    {
      front: "Vad signalerar direktavkastning över 7 %?",
      back: "Varningsflagga — ofta utdelningsfälla. Kursen kan ha rasat för att marknaden tror utdelningen är hotad.",
    },
    {
      front: "Vad är utdelningsandel?",
      back: "Utdelning delat med vinst. Över 80 % är ohållbart — bolaget delar ut nästan hela vinsten.",
    },
    {
      front: "Vad är soliditet?",
      back: "Eget kapital / totala tillgångar. Mått på finansiell styrka — hur mycket bolaget själv bidragit med vs lånat.",
    },
    {
      front: "Vad är hög soliditet?",
      back: "Över 50 % — bolaget klarar svåra perioder utan att gå omkull.",
    },
    {
      front: "Typisk soliditet för banker?",
      back: "Under 10 % — det är deras affärsmodell att låna ut.",
    },
    {
      front: "Vad är P/S?",
      back: "Pris / försäljning. Används mest för tillväxtbolag utan vinst, där P/E inte fungerar.",
    },
    {
      front: "Vad är P/B?",
      back: "Aktiekurs / eget kapital per aktie. P/B < 1 = handlas under bokfört värde (fynd eller varning).",
    },
    {
      front: "Vad är ROE?",
      back: "Return on Equity = vinst / eget kapital. Mäter hur effektivt bolaget förräntar ägarpengar.",
    },
    {
      front: "Vad är bra ROE?",
      back: "10–15 % bra, >15 % utmärkt, >25 % misstänksamt högt (kolla skuldsättning).",
    },
    {
      front: "Vad hände med SBB 2022–2023?",
      back: "Tappade ~95 % av värdet — hög skuldsättning + stigande räntor knäckte bolaget.",
    },
    {
      front: "Vad är 'utdelningsfälla'?",
      back: "Aktier med oroväckande hög direktavkastning där utdelningen riskerar att sänkas eller försvinna.",
    },
    {
      front: "Är teknisk analys ett bra verktyg för nybörjare?",
      back: "Nej — efter avgifter slår teknisk analys sällan marknaden för retail. Fokusera på fundamenta + tid + diversifiering.",
    },
    {
      front: "Vad är Warren Buffetts princip för bolagsval?",
      back: "Hellre ett bra bolag till okej pris än ett okej bolag till bra pris. Kvalitet före pris.",
    },
  ],

  "09-psykologi": [
    {
      front: "Vad är reptilhjärnan vs frontalloben i investeringssammanhang?",
      back: "Reptilhjärnan skriker 'sälj allt!' i panik. Frontalloben påminner om planen. Frontalloben ska vinna.",
    },
    {
      front: "Hur mycket sämre avkastning får genomsnittlig privatsparare jämfört med fonden hen äger?",
      back: "1,5–2 procentenheter per år. Över 30 år: 30–40 % mindre pengar. Bara pga timing-misstag.",
    },
    {
      front: "Vad är FOMO?",
      back: "Fear Of Missing Out — du köper på toppen för att 'alla andra tjänar pengar'.",
    },
    {
      front: "Vad är panic selling?",
      back: "Att sälja på botten av rädsla, just när du borde köpa eller sitta still.",
    },
    {
      front: "Hur mycket halveras din avkastning om du missar de 20 bästa börsdagarna under 20 år?",
      back: "Mer än halveras. Och de bästa dagarna kommer ofta precis efter de värsta — när folk just sålt.",
    },
    {
      front: "Vad är recency bias?",
      back: "Att tro att det som hänt senast kommer hända igen — chasa gårdagens vinnare, sälja förlorare.",
    },
    {
      front: "Klassiskt recency bias-katastrof?",
      back: "Japan 1989 — alla trodde tillväxten skulle fortsätta. 30 års stagnation följde.",
    },
    {
      front: "Vad är confirmation bias?",
      back: "Att bara söka information som bekräftar din åsikt. Avfärdar negativa nyheter.",
    },
    {
      front: "Hur skyddar du dig mot confirmation bias?",
      back: "För varje aktie du vill köpa — skriv 3 anledningar att INTE äga den. Hittar du inga är det varning.",
    },
    {
      front: "Vad är loss aversion enligt Kahneman & Tversky?",
      back: "Förlust gör ~2,5 gånger så ont som motsvarande vinst gör glad.",
    },
    {
      front: "Vad är symptomet på loss aversion i praktiken?",
      back: "Du säljer vinnare för tidigt och håller förlorare för länge.",
    },
    {
      front: "Vad är Buffetts säljregel?",
      back: "'Sälj inte en aktie på grund av kursen — sälj den för att verksamheten har försämrats.'",
    },
    {
      front: "Vad är herding (flockbeteende)?",
      back: "Att alla köper samma sak när priset redan är uppdrivet. Du blir kvar med Svarte Petter.",
    },
    {
      front: "Vad är Buffetts kontraregel mot herding?",
      back: "'Var rädd när andra är giriga. Var girig när andra är rädda.'",
    },
    {
      front: "Vad är anchoring?",
      back: "Att fastna vid en kurs (oftast inköpspriset) som beslutspunkt. 'Jag säljer när den är tillbaka på X.'",
    },
    {
      front: "Vad är overconfidence?",
      back: "Att tro att man är bättre än man är. 90 % av aktiva privatsparare underpresterar sitt index över 10 år.",
    },
    {
      front: "Vad är IPS (Investment Policy Statement)?",
      back: "Skriftlig investeringspolicy som du skriver när du är lugn — för att läsa när du är panikslagen.",
    },
    {
      front: "Vad är pre-commitment?",
      back: "Binda sina händer i förväg — automatiskt månadssparande, skrivna regler, 'väntar 7 dagar innan jag köper'.",
    },
    {
      front: "Vad är den enda giltiga säljanledningen enligt Buffett?",
      back: "Bolagets långsiktiga verksamhet har försämrats fundamentalt. Inte kursen, inte rädsla, inte magkänsla.",
    },
    {
      front: "Investerande är 80 % vad och 20 % vad?",
      back: "80 % psykologi, 20 % matematik. Alla rationella beslut är meningslösa om du inte klarar att hålla dem.",
    },
  ],

  "10-din-egen-plan": [
    {
      front: "Vad är 4 %-regeln (Trinity-studien 1998)?",
      back: "Du kan ta ut 4 % av portföljen per år (inflationsjusterat) och pengarna räcker 30+ år i de flesta historiska scenarier.",
    },
    {
      front: "Vad rekommenderas för Sverige istället för 4 %?",
      back: "Cirka 3,5 % — högre skatt och mer volatil börs gör 4 % lite för aggressivt.",
    },
    {
      front: "Behöver 240 000 kr/år för att leva — vilken portföljstorlek (4 %-regeln)?",
      back: "6 000 000 kr (240 000 / 0,04).",
    },
    {
      front: "Vad är FIRE?",
      back: "Financial Independence, Retire Early — ekonomisk frihet med möjlighet till tidig pension.",
    },
    {
      front: "Vad är sparkvot?",
      back: "Andel av nettolönen som går till sparande.",
    },
    {
      front: "Sparkvot 50 % — år till ekonomisk frihet vid 5 % real avkastning?",
      back: "Cirka 17 år.",
    },
    {
      front: "Sparkvot 25 % — år till ekonomisk frihet?",
      back: "Cirka 30 år.",
    },
    {
      front: "Sparkvot 10 % — år till ekonomisk frihet?",
      back: "Cirka 51 år (typisk arbetslivshorisont).",
    },
    {
      front: "Vilken sparkvot bör en ung sparare sikta på som minimum?",
      back: "10–15 % av nettolönen. På 25 000 kr/mån: 2 500–3 750 kr/mån i sparande.",
    },
    {
      front: "Vad är en buffert?",
      back: "3–6 månadsutgifter (typiskt 30 000–60 000 kr) på sparkonto med insättningsgaranti — innan du investerar.",
    },
    {
      front: "Får bufferten ligga på börsen?",
      back: "Nej — då tvingas du sälja på fel ställe när bilen pajar.",
    },
    {
      front: "Vad innehåller en IPS (Investment Policy Statement)?",
      back: "Mål, sparhorisont, månadssparande, allokering, regler, underskrift.",
    },
    {
      front: "Vad är klassisk allokering för en 23-åring?",
      back: "70–100 % bred globalfond. Kanske 10–20 % Sverigefond eller krydda om man vill.",
    },
    {
      front: "Vad är 'kärnan' i en kärna-krydda-portfölj?",
      back: "Bred globalfond (Avanza Global, LF Global Indexnära, DNB Global Indeks) — billigt och brett.",
    },
    {
      front: "Vad är pre-commitment-teknik nummer ett?",
      back: "Auto-månadssparande — binder dig att köpa även när det känns dåligt.",
    },
    {
      front: "Vad bör man göra med PPM-rådgivare som ringer obeställda?",
      back: "Lägga på. Alltid bluff.",
    },
    {
      front: "Är hävstångsprodukter (CFD, mini futures) lämpligt för nybörjare?",
      back: "Nej — 70–80 % av retail förlorar pengar på dem. Roligt att läsa om, men du ska inte vara där.",
    },
    {
      front: "Hur stor andel krypto bör en ung sparare ha?",
      back: "Max några få procent. Det är krydda, inte mat. Extremt volatilt och oförsäkrat.",
    },
    {
      front: "Vad är de tre viktigaste sakerna från hela kursen?",
      back: "1) Bred globalfond på ISK. 2) Tid och ränta-på-ränta. 3) Skriven plan när du är lugn — följd när du inte är det.",
    },
    {
      front: "Vad är det enda riktigt viktiga klick som ger en framtida förmögenhet?",
      back: "Det första riktiga månadssparandet. Sätt det, kalenderpåminnelse 3 månader fram, lev livet.",
    },
  ],
};
