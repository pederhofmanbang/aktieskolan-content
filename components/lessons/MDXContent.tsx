"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";

import { mdxComponents } from "./mdx-components";

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
