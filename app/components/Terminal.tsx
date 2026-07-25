"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import AppWindow from "./AppWindow";
import { CONTENT_COMMANDS, type ContentCommand } from "../lib/commands";

type PaletteCommand = {
  id: string;
  description: string;
};

const META_COMMANDS: PaletteCommand[] = [
  { id: "help", description: "List all available commands" },
  { id: "home", description: "Back to the home screen" },
  { id: "clear", description: "Clear the terminal" },
];

const ALL_COMMANDS: PaletteCommand[] = [...CONTENT_COMMANDS, ...META_COMMANDS];

type TranscriptEntry = {
  key: string;
  command: string;
  output: ReactNode;
};

function HelpOutput() {
  return (
    <div className="space-y-1">
      {ALL_COMMANDS.map((c) => (
        <div key={c.id} className="flex gap-4">
          <span className="w-24 shrink-0 text-[var(--accent)]">/{c.id}</span>
          <span className="text-zinc-500">{c.description}</span>
        </div>
      ))}
    </div>
  );
}

export default function Terminal({
  onGoHome,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  initialX,
  initialY,
  animStyle,
  setWindowRef,
}: {
  onGoHome: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onFocus?: () => void;
  zIndex?: number;
  initialX?: number;
  initialY?: number;
  animStyle?: CSSProperties;
  setWindowRef?: (el: HTMLDivElement | null) => void;
}) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isSlash = input.startsWith("/");
  const query = input.slice(1).toLowerCase();

  const filtered = useMemo(() => {
    if (!isSlash) return [];
    return ALL_COMMANDS.filter((c) => c.id.startsWith(query));
  }, [isSlash, query]);

  const safeIndex = filtered.length
    ? Math.min(selectedIndex, filtered.length - 1)
    : 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [transcript]);

  const focusInput = () => inputRef.current?.focus();

  const run = (cmd: PaletteCommand | null, rawInput: string) => {
    if (cmd?.id === "clear") {
      setTranscript([]);
      setInput("");
      return;
    }

    if (cmd?.id === "home") {
      setInput("");
      onGoHome();
      return;
    }

    if (cmd) {
      const contentCmd = CONTENT_COMMANDS.find((c) => c.id === cmd.id) as
        | ContentCommand
        | undefined;
      const output = contentCmd ? contentCmd.content : <HelpOutput />;

      setTranscript((t) => [
        ...t,
        { key: crypto.randomUUID(), command: `/${cmd.id}`, output },
      ]);

      if (contentCmd) {
        setRecent((r) => [
          `/${cmd.id}`,
          ...r.filter((x) => x !== `/${cmd.id}`),
        ].slice(0, 3));
      }
    } else {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const output = (
        <span className="text-red-400">
          {`zsh: command not found: ${trimmed}. Type / to view available commands.`}
        </span>
      );

      setTranscript((t) => [
        ...t,
        { key: crypto.randomUUID(), command: trimmed, output },
      ]);
    }

    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isSlash && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(Math.min(safeIndex + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(Math.max(safeIndex - 1, 0));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setInput(`/${filtered[safeIndex].id}`);
        setSelectedIndex(0);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setInput("");
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (isSlash && filtered.length > 0) {
        run(filtered[safeIndex], input);
      } else {
        run(null, input);
      }
    }
  };

  return (
    <AppWindow
      title="guest — zsh — 100x35"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      zIndex={zIndex}
      defaultWidth={768}
      defaultHeight={620}
      initialX={initialX}
      initialY={initialY}
      animStyle={animStyle}
      setWindowRef={setWindowRef}
    >
      <div className="flex h-full flex-col font-mono" onClick={focusInput}>
        <div
          ref={scrollRef}
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1 pt-3"
        >
          <div className="relative mb-4 rounded-md border-2 border-[var(--accent)] px-4 pb-3 pt-2">
            <span className="absolute -top-2.5 left-4 bg-[#0b0c0f] px-2 text-xs font-semibold text-[var(--accent)]">
              {"Tyler Zeng's Portfolio"}
              <span className="text-[#b8b5b5]"> v1.0.0</span>
            </span>
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-0.5 text-center">
                <div className="text-xs font-bold text-zinc-50">
                  Welcome back, guest!
                </div>
                <Image
                  src="/blob2.png"
                  alt=""
                  width={1920}
                  height={1080}
                  className="h-auto w-32 sm:w-36"
                />
                <div className="text-xs text-[#b8b5b5]">
                  Grade 12 Student @ St. Robert CHS
                </div>
                <div className="text-xs text-[#b8b5b5]">
                  ~/tyler-zeng/portfolio
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 sm:border-l sm:border-zinc-800 sm:pl-6">
                <div>
                  <div className="text-xs font-semibold text-[var(--accent)]">
                    Tips for getting started
                  </div>
                  <div className="mt-1 text-xs text-[#b8b5b5]">
                    Type <span className="text-[#b8b5b5]">/</span> to view
                    commands
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--accent)]">
                    Recent activity
                  </div>
                  <div className="mt-1 text-xs text-[#b8b5b5]">
                    {recent.length
                      ? recent.join("  ·  ")
                      : "No recent activity"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {transcript.map((entry) => (
            <div key={entry.key} className="mb-4 text-xs">
              <div className="flex gap-2">
                <span className="text-[var(--accent)]">›</span>
                <span className="text-[var(--accent)]">{entry.command}</span>
              </div>
              <div className="mt-1.5 pl-4 text-white">{entry.output}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 shrink-0">
          <div className="overflow-hidden rounded-lg border border-zinc-700/70">
            {isSlash && filtered.length > 0 && (
              <div className="max-h-56 overflow-y-auto py-1">
                {filtered.map((c, i) => (
                  <button
                    key={c.id}
                    onMouseEnter={() => setSelectedIndex(i)}
                    onClick={() => run(c, input)}
                    className={`flex w-full items-baseline gap-4 px-4 py-1.5 text-left text-xs ${
                      i === safeIndex ? "bg-zinc-800/80" : ""
                    }`}
                  >
                    <span className="w-28 shrink-0 font-mono text-[var(--accent)]">
                      /{c.id}
                    </span>
                    <span className="truncate text-zinc-500">
                      {c.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div
              className={`flex items-center gap-2 px-4 py-2.5 ${
                isSlash && filtered.length > 0
                  ? "border-t border-zinc-800"
                  : ""
              }`}
            >
              <span className="text-[var(--accent)]">›</span>
              <input
                ref={inputRef}
                autoFocus
                spellCheck={false}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type / to view commands"
                className="flex-1 bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>
          <div className="mt-1.5 px-1 text-[11px] text-zinc-600">
            / commands · enter run
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
