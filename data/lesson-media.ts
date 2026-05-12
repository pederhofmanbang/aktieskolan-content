export type LessonMedia = {
  filmEmbedUrl?: string;
  podcastAudioUrl?: string;
  podcastSourceUrl?: string;
  presentationSourceUrl?: string;
  flashcardsSourceUrl?: string;
  longQuizSourceUrl?: string;
};

export const lessonMedia: Record<string, LessonMedia> = {
  "01-vad-ar-en-aktie": {
    filmEmbedUrl: "https://app.heygen.com/embeds/a1b5bcfecd414a24a97ccd3da43ffce4",
    podcastSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/bc6468ef-fe55-4acf-b821-88a6caefb097",
    presentationSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/4fddc52d-420a-491d-9f94-0217189d95c4",
    flashcardsSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/f4da2994-41aa-4498-80a8-6b02bc02ef08",
    longQuizSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/e33f5f7b-f9ab-43a9-8003-3d4781f8c839",
  },
};
