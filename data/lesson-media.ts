export type LessonMedia = {
  filmEmbedUrl?: string;
  podcastAudioUrl?: string;
  podcastSourceUrl?: string;
  presentationPdfUrl?: string;
  presentationSourceUrl?: string;
  flashcardsSourceUrl?: string;
  longQuizSourceUrl?: string;
};

/**
 * Mediakällor per lektion. När fältet är tomt visas "Kommer snart" i
 * lektion-tab:en. Fyll i NotebookLM-URL:er i fälten nedan när de är klara.
 *
 * Film-URL:er pekar mot Peders YouTube-playlist
 * https://www.youtube.com/playlist?list=PL4RcHBLLdLTPbxK4Bzz6RTyGI2mL1VnTk
 * Embed-format: https://www.youtube.com/embed/<VIDEO_ID>?rel=0
 */
export const lessonMedia: Record<string, LessonMedia> = {
  "01-vad-ar-en-aktie": {
    filmEmbedUrl: "https://www.youtube.com/embed/IRfCZRoq414?rel=0",
    podcastSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/bc6468ef-fe55-4acf-b821-88a6caefb097",
    presentationPdfUrl: "/pdfs/Real_World_Ownership.pdf",
    presentationSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/4fddc52d-420a-491d-9f94-0217189d95c4",
    flashcardsSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/f4da2994-41aa-4498-80a8-6b02bc02ef08",
    longQuizSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/e33f5f7b-f9ab-43a9-8003-3d4781f8c839",
  },
  "02-borsen-och-mr-market": {
    filmEmbedUrl: "https://www.youtube.com/embed/ltP5X9c6OJg?rel=0",
  },
  "03-fonder-lasagne": {
    filmEmbedUrl: "https://www.youtube.com/embed/iILt78lI45Q?rel=0",
  },
  "04-ranta-pa-ranta": {
    filmEmbedUrl: "https://www.youtube.com/embed/ukcvU2baUY0?rel=0",
  },
  "05-risk": {
    filmEmbedUrl: "https://www.youtube.com/embed/L8cwInccahk?rel=0",
  },
  "06-diversifiering": {
    filmEmbedUrl: "https://www.youtube.com/embed/znM-ddCPaYM?rel=0",
  },
  "07-isk-vs-af-vs-kf": {
    filmEmbedUrl: "https://www.youtube.com/embed/u0lNbVdWlZ8?rel=0",
  },
  "08-nyckeltal": {
    filmEmbedUrl: "https://www.youtube.com/embed/xskTpLmnr4Y?rel=0",
  },
  "09-psykologi": {
    filmEmbedUrl: "https://www.youtube.com/embed/C9RH1Oi7o6A?rel=0",
  },
  "10-din-egen-plan": {
    filmEmbedUrl: "https://www.youtube.com/embed/a3RoLtD81Wk?rel=0",
  },
};
