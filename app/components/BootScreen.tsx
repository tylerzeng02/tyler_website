"use client";

import { useEffect, type CSSProperties } from "react";
import AppWindow from "./AppWindow";
import AsciiLogo from "./AsciiLogo";

export default function BootScreen({
  onContinue,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  initialX,
  initialY,
  animStyle,
  setWindowRef,
}: {
  onContinue: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onFocus?: () => void;
  zIndex?: number;
  initialX?: number;
  initialY?: number;
  animStyle?: CSSProperties;
  setWindowRef?: (el: HTMLDivElement | null) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") onContinue();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onContinue]);

  return (
    <AppWindow
      title="guest — zsh — 100x35"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      zIndex={zIndex}
      initialX={initialX}
      initialY={initialY}
      animStyle={animStyle}
      setWindowRef={setWindowRef}
    >
      <div className="flex flex-col gap-8">
        <div className="text-sm text-zinc-200">{"Welcome to..."}</div>

        <AsciiLogo />

        <button
          onClick={onContinue}
          className="flex w-fit items-center text-left text-sm text-zinc-400 transition hover:text-zinc-200"
        >
          <span>
            Press{" "}
            <span className="font-semibold text-zinc-100">Enter</span> to
            continue
          </span>
          <span className="ml-2 inline-block h-4 w-2 animate-pulse bg-zinc-100" />
        </button>
      </div>
    </AppWindow>
  );
}
