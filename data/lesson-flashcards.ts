export type Flashcard = {
  front: string;
  back: string;
};

export const lessonFlashcards: Record<string, Flashcard[]> = {
  "01-vad-ar-en-aktie": [
    {
      front: "Vad är en aktie?",
      back: "Ett ägarbevis i ett riktigt bolag — en liten bit av företaget.",
    },
    {
      front: "Du äger 50 aktier i ett bolag med 5 000 utestående aktier. Hur stor andel äger du?",
      back: "1 % (50 / 5 000 = 0,01).",
    },
    {
      front: "Varför noteras bolag på börsen?",
      back: "För att få in kapital till tillväxt och/eller låta tidiga ägare realisera en del av värdet.",
    },
    {
      front: "Vad är den största praktiska skillnaden mellan A- och B-aktier?",
      back: "Rösträtten. A-aktier har starkare röst (oftast 1 vs 1/10). Utdelningen per aktie är samma; B-aktien är mer omsatt.",
    },
    {
      front: "Vad är en utdelning?",
      back: "Din andel av bolagets vinst som betalas ut till aktieägarna.",
    },
    {
      front: "Vad får du som aktieägare?",
      back: "Andel av vinsten (utdelning), rösträtt på bolagsstämman och andel av bolagets värde.",
    },
    {
      front: "Vad innebär det att äga 1 % av ett bolag?",
      back: "Du har 1 % av rösterna på stämman och får 1 % av eventuell utdelning.",
    },
  ],
};
