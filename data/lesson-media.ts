export type LessonMedia = {
  filmEmbedUrl?: string;
  podcastEmbedUrl?: string;
  presentationEmbedUrl?: string;
};

export const lessonMedia: Record<string, LessonMedia> = {
  "01-vad-ar-en-aktie": {
    filmEmbedUrl: "https://app.heygen.com/embeds/a1b5bcfecd414a24a97ccd3da43ffce4",
  },
};
