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
 */
export const lessonMedia: Record<string, LessonMedia> = {
  "01-vad-ar-en-aktie": {
    filmEmbedUrl: "https://app.heygen.com/embeds/a1b5bcfecd414a24a97ccd3da43ffce4",
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
    // filmEmbedUrl: "",
    // podcastSourceUrl: "",
    // presentationSourceUrl: "",
    // flashcardsSourceUrl: "",
    // longQuizSourceUrl: "",
  },
  "03-fonder-lasagne": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "04-ranta-pa-ranta": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "05-risk": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "06-diversifiering": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "07-isk-vs-af-vs-kf": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "08-nyckeltal": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "09-psykologi": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
  "10-din-egen-plan": {
    // Fyll i NotebookLM-URL:er när de är klara
  },
};
