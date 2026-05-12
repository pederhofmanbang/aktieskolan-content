export type LessonMedia = {
  filmEmbedUrl?: string;
  podcastAudioUrl?: string;
  podcastSourceUrl?: string;
  presentationEmbedUrl?: string;
};

export const lessonMedia: Record<string, LessonMedia> = {
  "01-vad-ar-en-aktie": {
    filmEmbedUrl: "https://app.heygen.com/embeds/a1b5bcfecd414a24a97ccd3da43ffce4",
    podcastSourceUrl:
      "https://notebooklm.google.com/notebook/6475ad27-279b-4c71-a85c-d4d0480029ea/artifact/bc6468ef-fe55-4acf-b821-88a6caefb097",
  },
};
