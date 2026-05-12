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
