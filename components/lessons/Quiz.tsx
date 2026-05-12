"use client";

import {
  Children,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Option = { letter: string; label: string; isCorrect: boolean };
type Question = {
  index: number;
  text: string;
  options: Option[];
  explanation?: string;
};

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return nodeText(props.children);
  }
  return "";
}

function tagOf(el: ReactElement): string {
  return typeof el.type === "string" ? el.type : "";
}

function parseQuiz(children: ReactNode): Question[] {
  const items = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement[];
  const questions: Question[] = [];
  let current: Question | null = null;
  let qNum = 0;

  for (const el of items) {
    const tag = tagOf(el);
    const text = nodeText(el).trim();
    if (!text) continue;

    if (tag === "p" && /^Fråga\s+\d+:/i.test(text)) {
      if (current) questions.push(current);
      qNum++;
      current = {
        index: qNum,
        text: text.replace(/^Fråga\s+\d+:\s*/i, "").trim(),
        options: [],
      };
    } else if (tag === "ul" && current) {
      const liItems = Children.toArray(
        (el.props as { children?: ReactNode }).children,
      ).filter(isValidElement) as ReactElement[];
      current.options = liItems.map((li) => {
        const liText = nodeText(li).trim();
        const isCorrect = /✓/.test(liText);
        const cleaned = liText.replace(/\s*✓\s*$/, "").trim();
        const match = cleaned.match(/^([A-Z])\)\s*(.*)$/);
        if (match) return { letter: match[1], label: match[2], isCorrect };
        return { letter: "", label: cleaned, isCorrect };
      });
    } else if (tag === "p" && /^Förklaring:/i.test(text) && current) {
      current.explanation = text.replace(/^Förklaring:\s*/i, "").trim();
    }
  }
  if (current) questions.push(current);
  return questions;
}

export function Quiz({ children }: { children: ReactNode }) {
  const questions = parseQuiz(children);

  if (questions.length === 0) {
    return (
      <section className="not-prose my-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
          Quiz
        </div>
        <div className="prose prose-neutral mt-4 max-w-none">{children}</div>
      </section>
    );
  }

  return (
    <section className="not-prose my-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
        Quiz · {questions.length} frågor
      </div>
      <div className="mt-6 space-y-8">
        {questions.map((q) => (
          <QuestionCard key={q.index} q={q} />
        ))}
      </div>
    </section>
  );
}

function QuestionCard({ q }: { q: Question }) {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;

  return (
    <div>
      <h4 className="text-base font-semibold text-neutral-900">
        {q.index}. {q.text}
      </h4>
      <ul className="mt-3 space-y-2">
        {q.options.map((opt, i) => {
          const isChosen = revealed && i === selected;
          const showAsCorrect = revealed && opt.isCorrect;
          const showAsWrong = isChosen && !opt.isCorrect;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  !revealed &&
                    "border-neutral-200 bg-white hover:border-primary hover:bg-primary-light",
                  revealed &&
                    !showAsCorrect &&
                    !showAsWrong &&
                    "border-neutral-200 bg-neutral-50 text-neutral-500",
                  showAsCorrect &&
                    "border-primary bg-primary-light text-primary-dark",
                  showAsWrong && "border-red-300 bg-red-50 text-red-700",
                )}
              >
                {opt.letter && (
                  <span className="font-semibold">{opt.letter}) </span>
                )}
                {opt.label}
                {showAsCorrect && " ✓"}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && q.explanation && (
        <p className="mt-3 rounded-lg bg-neutral-50 px-4 py-3 text-sm italic text-neutral-700">
          {q.explanation}
        </p>
      )}
    </div>
  );
}
