export type Flashcard = {
  front: string;
  back: string;
};

/**
 * Flashcards i appen är tomma — alla flashcards-set ligger numera i
 * NotebookLM och länkas via `lesson-media.ts` (flashcardsSourceUrl).
 * Strukturen behålls om vi senare vill lägga in egna kort igen.
 */
export const lessonFlashcards: Record<string, Flashcard[]> = {};
