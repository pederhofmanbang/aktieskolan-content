export type CompanyInfo = {
  description: string;
  why: string;
};

/**
 * Korta bolagsbeskrivningar för pedagogiskt syfte. Inte finansiell rådgivning —
 * meningen är att en 20-åring ska kunna gå från "ticker INVE-B" till "ah, det
 * är familjen Wallenberg som äger en massa bolag".
 */
export const COMPANY_INFO: Record<string, CompanyInfo> = {
  "INVE-A.ST": {
    description:
      "Investor är familjen Wallenbergs investmentbolag. Genom Investor äger du indirekt poster i ABB, AstraZeneca, SEB, Atlas Copco, Ericsson och många fler.",
    why: "Pedagogiskt: ett investmentbolag är en hyfsat diversifierad portfölj i en aktie. A-aktien har 1 röst, mindre omsatt än B.",
  },
  "INVE-B.ST": {
    description:
      "B-aktien i samma bolag (Investor). Samma utdelning som A men endast 1/10 röst. Den B-aktien är mer omsatt — därför är spreaden mindre och småsparare väljer oftast B.",
    why: "Lektion 1 introducerar A vs B-aktier via just Investor — perfekt första köp för att se principen.",
  },
  "HM-B.ST": {
    description:
      "H&M Hennes & Mauritz — global modeklädeskedja grundad 1947 i Västerås. Andra största modedetaljisten i världen efter Zara.",
    why: "Familjen Persson är fortfarande största ägare. Klassisk svensk Large Cap som svajat mellan tillväxt och nedgång de senaste 10 åren.",
  },
  "VOLV-B.ST": {
    description:
      "Volvo (lastbilssidan, inte personbilarna — Volvo Cars ägs av kinesiska Geely). Världens näst största lastbilstillverkare. Tillverkar också anläggningsmaskiner och båtmotorer.",
    why: "Konjunkturkänsligt: när konjunkturen är stark säljs många lastbilar. Stora marginalsvängningar — pedagogiskt exempel på cyklisk industri.",
  },
  "ATCO-B.ST": {
    description:
      "Atlas Copco — svenska industrijätten inom kompressorer, vakuumteknik och industriverktyg. Världsledande inom flera nischer.",
    why: "Klassisk 'compounder' — har ökat omsättningen i decennier med stabila marginaler. Hög P/E reflekterar förväntningarna.",
  },
  "ERIC-B.ST": {
    description:
      "Ericsson — svensk telekomutrustningsleverantör, framförallt mobilnätsutrustning (4G/5G). Konkurrerar med Nokia och Huawei.",
    why: "Cyklisk: stora investeringscykler när operatörer bygger ut nya generationer. 5G-cykeln pågår — vad händer i 6G?",
  },
  "SHB-A.ST": {
    description:
      "Handelsbanken — en av de fyra storbankerna i Sverige. Decentraliserad organisation: lokalt kontor bestämmer mycket.",
    why: "Storbank → låg soliditet (~5 %) är normalt. Hög direktavkastning. Pedagogiskt: visa hur banker fungerar annorlunda än industri.",
  },
  "SEB-A.ST": {
    description:
      "SEB (Skandinaviska Enskilda Banken) — Wallenberg-kontrollerad storbank med fokus på företag och stora privatkunder.",
    why: "Klassisk 'utdelningsaktie' med direktavkastning ofta ~7 %. Banker är räntekänsliga — högre räntor → ofta högre vinst.",
  },
  "SWED-A.ST": {
    description:
      "Swedbank — den tredje av storbankerna. Mycket stark i Baltikum (Estland, Lettland, Litauen) och Sverige.",
    why: "Penningtvättsskandalen 2019 visade hur snabbt en bank kan tappa förtroende. Pedagogiskt: regulatorisk risk är viktig att förstå.",
  },
  "NDA-SE.ST": {
    description:
      "Nordea — fjärde och största av storbankerna mätt i tillgångar. Verksamhet i hela Norden, huvudkontor flyttat från Stockholm till Helsingfors 2018.",
    why: "Brett, lite tråkigt, hög direktavkastning. Klassisk 'utdelningsmaskin' för dem som gillar passiva kassaflöden.",
  },
  "EVO.ST": {
    description:
      "Evolution — global ledare inom live casino (riktiga dealers som streamar till spelare). Grundat i Sverige 2006, snabb tillväxt.",
    why: "Hög marginal, snabb tillväxt → P/E och P/B är höga. Risk: reglering av onlinespel kan ändra spelplanen över en natt.",
  },
  "AZN.ST": {
    description:
      "AstraZeneca — global läkemedelsjätte med svensk-brittisk historia. Stora behandlingsområden: onkologi, hjärt-kärl, andningsvägar.",
    why: "Dyrast på börsen (många hundra kr per aktie). Defensiv — människor blir sjuka även i lågkonjunktur. Patentcykler är centrala.",
  },
  "SAND.ST": {
    description:
      "Sandvik — svensk industrikoncern inom verktyg för bergsindustri, gruvor och tunnelbyggen. Världsledande inom hårdmetallsverktyg.",
    why: "Beroende av råvarupriser och gruvinvesteringar globalt. Cykliskt men med stabilt teknologiledarskap.",
  },
  "ASSA-B.ST": {
    description:
      "Assa Abloy — global ledare inom lås, dörrlösningar och passersystem. Världens största inom sitt område.",
    why: "Stabil förvärvsmaskin: köper små låsbolag globalt och integrerar. Tillväxt via förvärv är en svår men beprövad strategi.",
  },
  "BOL.ST": {
    description:
      "Boliden — svensk gruv- och smältverksgrupp. Stora gruvor i Aitik och Garpenberg. Producerar främst koppar, zink, bly, guld och silver.",
    why: "Råvarupriserna avgör vinsten — Boliden är väderprognosen för Sveriges gruvindustri. Cyklisk på riktigt.",
  },
  "ABB.ST":
    {
      description:
        "ABB — svensk-schweizisk industri- och teknikkoncern inom robotteknik, elnät och processautomation. Klassisk 'gammal industri som blir teknik'.",
      why: "Storbolag som omformat sig flera gånger. Pedagogiskt: bolagsförändring över decennier — vad bolaget gör nu är inte vad det gjorde 1988.",
    },
  // Fonder
  "AVANZA-GLOBAL": {
    description:
      "Avanza Global — bred globalfond med cirka 830 bolag, främst i USA. Avanzas egen 'kärnfond' för långsiktigt sparande.",
    why: "Avgift 0,09 %. En av de billigaste globalfonderna på marknaden — pedagogiskt: detta är 'kärnan' lektion 6 pratar om.",
  },
  "LF-GLOBAL-INDEXNARA": {
    description:
      "Länsförsäkringar Global Indexnära — bred globalfond, cirka 1000 bolag i utvecklade länder. Klassisk konkurrent till Avanza Global.",
    why: "Avgift 0,21 %. Marginellt högre än Avanza Global men fortfarande billig. Bra alternativ för dem som inte är Avanza-kunder.",
  },
  "DNB-GLOBAL-INDEKS": {
    description:
      "DNB Global Indeks — norsk fondförvaltning, bred globalfond utan ESG-filter. Riktigt brett — innehåller även tobaks- och försvarsbolag.",
    why: "Avgift 0,30 %. Pedagogiskt: visa skillnaden mellan ESG-fonder och 'allt'-fonder. Etiska val kan kosta avkastning.",
  },
  "SEB-SVERIGE-INDEXNARA": {
    description:
      "SEB Sverige Indexnära — bred Sverigefond, bredare än bara OMXS30. Innehåller även mindre svenska bolag.",
    why: "Avgift 0,20 %. Pedagogiskt: vill du ha mer Sverige-tilt än vad globalfonden ger (där Sverige är ~1 %), är detta klassiskt val.",
  },
};
