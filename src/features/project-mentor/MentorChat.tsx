"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SearchEngine } from "@/features/project-mentor/SearchEngine";
import type { MentorMessage } from "@/features/project-mentor/types";
import type { ProjectMentor } from "@/types/project";

/** Max suggested starter questions surfaced beneath the input. */
const MAX_SUGGESTIONS = 4;

interface MentorChatProps {
  mentor: ProjectMentor;
  /** Project title — used only for accessible labels. */
  projectTitle: string;
}

/**
 * Project Mentor — a client-side Q&A island backed by hybrid search over
 * `project.mentor.knowledgeBase` (ADR-009). No external AI: answers are the
 * authored knowledge-base entries, and anything below the confidence threshold
 * returns the project's own `fallback` string. Never fabricates content.
 */
export function MentorChat({ mentor, projectTitle }: MentorChatProps) {
  const engine = useMemo(
    () => new SearchEngine(mentor.knowledgeBase),
    [mentor.knowledgeBase]
  );

  // Empty knowledge base (e.g. research / in-progress projects): show the
  // project's own fallback gracefully, no interactive input.
  if (engine.isEmpty) {
    return (
      <Card className="gap-3 p-5">
        <MentorHeader greeting={mentor.greeting} />
        <p className="text-sm text-muted-foreground">{mentor.fallback}</p>
      </Card>
    );
  }

  return (
    <ActiveMentor
      engine={engine}
      mentor={mentor}
      projectTitle={projectTitle}
    />
  );
}

function ActiveMentor({
  engine,
  mentor,
  projectTitle,
}: {
  engine: SearchEngine;
  mentor: ProjectMentor;
  projectTitle: string;
}) {
  const [messages, setMessages] = useState<MentorMessage[]>(() => [
    { id: 0, role: "mentor", text: mentor.greeting },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view when the transcript grows (no animation).
  // Skipped while only the greeting exists — `scrollIntoView` also scrolls
  // ancestor containers, so running on mount would jump the page to this card.
  useEffect(() => {
    if (messages.length > 1) {
      endRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [messages]);

  function ask(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question) return;

    const results = engine.search(question);
    const best = results[0];

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", text: question },
      best
        ? {
            id: nextId.current++,
            role: "mentor",
            text: best.entry.answer,
            source: best.entry,
          }
        : { id: nextId.current++, role: "mentor", text: mentor.fallback },
    ]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  const suggestions = mentor.knowledgeBase.slice(0, MAX_SUGGESTIONS);

  return (
    <Card className="gap-4 p-5">
      <MentorHeader greeting={mentor.greeting} />

      <ScrollArea className="h-72 w-full">
        <ol
          role="log"
          aria-live="polite"
          aria-label={`Project Mentor conversation about ${projectTitle}`}
          className="flex flex-col gap-4 pr-3"
        >
          {messages.map((message) => (
            <li key={message.id} className="flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                {message.role === "user" ? "You" : "Mentor"}
              </span>
              {message.source && (
                <Badge variant="secondary" className="w-fit font-mono">
                  {message.source.topic}
                </Badge>
              )}
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  message.role === "user"
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {message.text}
              </p>
            </li>
          ))}
        </ol>
        {/* Scroll sentinel — outside the <ol> (only <li> may be a list child). */}
        <div ref={endRef} aria-hidden />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about this project…"
          aria-label={`Ask a question about ${projectTitle}`}
          className="h-9"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          className="size-9 shrink-0"
          disabled={!input.trim()}
          aria-label="Ask the Project Mentor"
        >
          <Send />
        </Button>
      </form>

      {suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Try asking
          </span>
          <ul className="flex flex-wrap gap-2">
            {suggestions.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => ask(entry.question)}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {entry.question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function MentorHeader({ greeting }: { greeting: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        aria-hidden
      >
        <Sparkles className="size-4" />
      </span>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
          Project Mentor
        </h3>
        <p className="text-sm text-muted-foreground">{greeting}</p>
      </div>
    </div>
  );
}
