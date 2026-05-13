"use client";

import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";

import { mdxComponents } from "./mdx-components";

export function MDXContent({
  code,
  components,
}: {
  code: string;
  components?: MDXComponents;
}) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...mdxComponents, ...components }} />;
}
