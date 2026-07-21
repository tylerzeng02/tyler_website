"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export type DockApp = {
  id: string;
  label: string;
  icon: ReactNode;
  running: boolean;
  onClick: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
};

export default function Dock({ apps }: { apps: DockApp[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center">
      <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-white/30 bg-white/25 px-2.5 py-2 shadow-xl backdrop-blur-xl">
        {apps.map((app) => (
          <button
            key={app.id}
            ref={app.setRef}
            type="button"
            aria-label={app.label}
            onClick={app.onClick}
            className="group relative flex h-10 w-10 items-center justify-center rounded-[11px] shadow-sm transition-transform duration-150 hover:-translate-y-1.5 hover:scale-110"
          >
            {app.icon}
            {app.running && (
              <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-zinc-700" />
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
