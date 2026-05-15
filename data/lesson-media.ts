export type LessonMedia = {
  /**
   * En eller flera embed-URL:er till lektionsfilmer. Visas i Film-fliken,
   * staplade ovanför varandra om det är fler än en.
   */
  filmEmbedUrls?: string[];
  podcastAudioUrl?: string;
  podcastSourceUrl?: string;
  presentationPdfUrl?: string;
  presentationSourceUrl?: string;
  flashcardsSourceUrl?: string;
  longQuizSourceUrl?: string;
};

/**
 * Mediakällor per lektion. När fältet är tomt visas "Kommer snart" i
 * lektion-tab:en.
 *
 * Film-URL:er pekar mot Peders YouTube-playlist
 * https://www.youtube.com/playlist?list=PL4RcHBLLdLTPbxK4Bzz6RTyGI2mL1VnTk
 * Embed-format: https://www.youtube.com/embed/<VIDEO_ID>?rel=0
 *
 * Lektion 1 har två filmer: YouTube-versionen + den ursprungliga Heygen-versionen.
 *
 * Presentations-PDF:er ligger i /public/pdfs/. Mellanslag i filnamnen
 * måste URL-kodas som %20 i path-strängen.
 */
export const lessonMedia: Record<string, LessonMedia> = {
  "01-vad-ar-en-aktie": {
    filmEmbedUrls: [
      "https://www.youtube.com/embed/IRfCZRoq414?rel=0",
      "https://app.heygen.com/embeds/a1b5bcfecd414a24a97ccd3da43ffce4",
    ],
    podcastAudioUrl:
      "https://xnz9pjud9djlrctb.public.blob.vercel-storage.com/Fr%C3%A5n_konsument_till_del%C3%A4gare_i_vardagen%20%281%29.m4a",
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
    filmEmbedUrls: ["https://www.youtube.com/embed/ltP5X9c6OJg?rel=0"],
    presentationPdfUrl: "/pdfs/2%20Mastering_Market_Mechanics.pdf",
  },
  "03-fonder-lasagne": {
    filmEmbedUrls: ["https://www.youtube.com/embed/iILt78lI45Q?rel=0"],
    presentationPdfUrl: "/pdfs/3%20The_Investor_Menu.pdf",
  },
  "04-ranta-pa-ranta": {
    filmEmbedUrls: ["https://www.youtube.com/embed/ukcvU2baUY0?rel=0"],
    presentationPdfUrl: "/pdfs/4%20The_Snowball_Effect.pdf",
  },
  "05-risk": {
    filmEmbedUrls: ["https://www.youtube.com/embed/L8cwInccahk?rel=0"],
    presentationPdfUrl: "/pdfs/5%20The_Price_of_Return.pdf",
  },
  "06-diversifiering": {
    filmEmbedUrls: ["https://www.youtube.com/embed/znM-ddCPaYM?rel=0"],
    presentationPdfUrl: "/pdfs/6%20Diversification_Blueprint.pdf",
  },
  "07-isk-vs-af-vs-kf": {
    filmEmbedUrls: ["https://www.youtube.com/embed/u0lNbVdWlZ8?rel=0"],
    presentationPdfUrl: "/pdfs/7%20The_Wealth_Blueprint.pdf",
  },
  "08-nyckeltal": {
    filmEmbedUrls: ["https://www.youtube.com/embed/xskTpLmnr4Y?rel=0"],
    presentationPdfUrl: "/pdfs/8%20Mastering_Stock_Metrics.pdf",
  },
  "09-psykologi": {
    filmEmbedUrls: ["https://www.youtube.com/embed/C9RH1Oi7o6A?rel=0"],
    presentationPdfUrl: "/pdfs/9%20Mind_Over_Instinct.pdf",
  },
  "10-din-egen-plan": {
    filmEmbedUrls: ["https://www.youtube.com/embed/a3RoLtD81Wk?rel=0"],
    // PDF för lektion 10 saknas ännu — lägg till i /public/pdfs/ när den är klar
  },
};
