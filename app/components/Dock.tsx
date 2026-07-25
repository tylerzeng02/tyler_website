"use client";

import Image from "next/image";
import { useState, type PointerEvent, type ReactNode } from "react";

export type DockApp = {
  id: string;
  label: string;
  icon: ReactNode;
  running: boolean;
  onClick: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
};

const DEFAULT_ICON_SIZE = 52;
const MIN_ICON_SIZE = 28;
const MAX_ICON_SIZE = 84;

export default function Dock({
  apps,
  containerRef,
}: {
  apps: DockApp[];
  containerRef?: (el: HTMLDivElement | null) => void;
}) {
  const [iconSize, setIconSize] = useState(DEFAULT_ICON_SIZE);

  const startResize = (e: PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startSize = iconSize;

    const handleMove = (ev: globalThis.PointerEvent) => {
      // dragging up (cursor moves to smaller Y) grows the dock
      const delta = startY - ev.clientY;
      setIconSize(
        Math.max(MIN_ICON_SIZE, Math.min(MAX_ICON_SIZE, startSize + delta)),
      );
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const padding = Math.round(iconSize * 0.2);
  const gap = Math.round(iconSize * 0.15);
  const radius = Math.round(iconSize * 0.275);
  const dotSize = Math.max(3, Math.round(iconSize * 0.1));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex flex-col items-center">
      <div
        onPointerDown={startResize}
        className="group mb-1 flex h-3 w-12 cursor-ns-resize items-center justify-center touch-none"
      >
        <div className="pointer-events-auto h-1 w-10 rounded-full bg-white/0 transition-colors group-hover:bg-white/50" />
      </div>
      <div
        ref={containerRef}
        className="pointer-events-auto flex items-end rounded-2xl border border-white/30 bg-white/25 shadow-xl backdrop-blur-xl transition-[padding,gap] duration-100"
        style={{ padding, gap }}
      >
        {apps.map((app) => (
          <button
            key={app.id}
            ref={app.setRef}
            type="button"
            aria-label={app.label}
            onClick={app.onClick}
            className="group relative flex shrink-0 items-center justify-center shadow-sm transition-transform duration-150 hover:-translate-y-1.5 hover:scale-110"
            style={{ width: iconSize, height: iconSize, borderRadius: radius }}
          >
            {app.icon}
            {app.running && (
              <span
                className="absolute rounded-full bg-zinc-700"
                style={{
                  width: dotSize,
                  height: dotSize,
                  bottom: -dotSize * 1.5,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TerminalIcon() {
  return (
    <Image
      src="/dock-terminal.png"
      alt=""
      width={256}
      height={256}
      className="h-full w-full object-contain"
    />
  );
}

export function SpotifyIcon() {
  return (
    <Image
      src="/dock-spotify.png"
      alt=""
      width={256}
      height={256}
      className="h-full w-full object-contain"
    />
  );
}

export function SettingsIcon() {
  return (
    <Image
      src="/dock-settings.png"
      alt=""
      width={256}
      height={256}
      className="h-full w-full object-contain"
    />
  );
}

export function PdfIcon() {
  return (
    <Image
      src="/dock-pdf.png"
      alt=""
      width={256}
      height={256}
      className="h-full w-full object-contain"
    />
  );
}

export function PhotosIcon() {
  return (
    <Image
      src="/dock-photos.png"
      alt=""
      width={256}
      height={256}
      className="h-full w-full object-contain"
    />
  );
}
