import type { MDXComponents } from "mdx/types";

import { Faktaruta } from "./Faktaruta";
import { Forsoksjalv } from "./Forsoksjalv";
import { Metafor } from "./Metafor";
import { NyckeltalsTabell } from "./NyckeltalsTabell";
import { Quiz } from "./Quiz";
import { SimulatorTask } from "./SimulatorTask";
import { Varning } from "./Varning";

export const mdxComponents: MDXComponents = {
  Metafor,
  Faktaruta,
  Varning,
  NyckeltalsTabell,
  Försökssjälv: Forsoksjalv,
  Quiz,
  SimulatorTask,
};

const hide = () => null;

function namedHide(tag: string) {
  const fn = () => null;
  (fn as { displayName?: string }).displayName = tag;
  return fn;
}

export const mdxComponentsWithoutQuiz: MDXComponents = {
  Quiz: hide,
};

export const mdxComponentsQuizOnly: MDXComponents = {
  h1: namedHide("h1"),
  h2: namedHide("h2"),
  h3: namedHide("h3"),
  h4: namedHide("h4"),
  h5: namedHide("h5"),
  h6: namedHide("h6"),
  p: namedHide("p"),
  ul: namedHide("ul"),
  ol: namedHide("ol"),
  li: namedHide("li"),
  a: namedHide("a"),
  blockquote: namedHide("blockquote"),
  hr: namedHide("hr"),
  table: namedHide("table"),
  thead: namedHide("thead"),
  tbody: namedHide("tbody"),
  tr: namedHide("tr"),
  th: namedHide("th"),
  td: namedHide("td"),
  pre: namedHide("pre"),
  code: namedHide("code"),
  img: namedHide("img"),
  Metafor: hide,
  Faktaruta: hide,
  Varning: hide,
  NyckeltalsTabell: hide,
  Försökssjälv: hide,
  SimulatorTask: hide,
};
