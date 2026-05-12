import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";

export const Lesson = defineDocumentType(() => ({
  name: "Lesson",
  filePathPattern: "lessons/*.mdx",
  contentType: "mdx",
  fields: {
    slug: { type: "string", required: true },
    nummer: { type: "number", required: true },
    titel: { type: "string", required: true },
    underrubrik: { type: "string", required: true },
    metafor: { type: "string", required: true },
    mal: { type: "list", of: { type: "string" }, required: true },
    beraknad_tid_minuter: { type: "number", required: true },
    unlocks: { type: "string", required: true },
    nasta_lektion: { type: "string", required: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (lesson) => `/lektioner/${lesson.slug}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Lesson],
  mdx: {
    remarkPlugins: [remarkGfm],
  },
});
