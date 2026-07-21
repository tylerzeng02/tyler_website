"use client";

export type BgTheme = {
  name: string;
  bg: string;
  dot: string;
};

export const BG_THEMES: BgTheme[] = [
  { name: "Graphite", bg: "#e5e5e7", dot: "rgba(0, 0, 0, 0.18)" },
  { name: "Cream", bg: "#efe7da", dot: "rgba(70, 50, 20, 0.18)" },
  { name: "Sky", bg: "#dbe6ee", dot: "rgba(20, 50, 80, 0.2)" },
  { name: "Sage", bg: "#dee7e0", dot: "rgba(20, 50, 40, 0.2)" },
  { name: "Midnight", bg: "#1c1e22", dot: "rgba(255, 255, 255, 0.14)" },
];

export const ACCENTS = [
  { name: "Sage", value: "#99bbb4" },
  { name: "Sky", value: "#8ab4e0" },
  { name: "Lavender", value: "#b3a6e0" },
  { name: "Amber", value: "#e0b374" },
  { name: "Rose", value: "#e08a9e" },
];

export const PATTERNS = [
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "plain", label: "Plain" },
] as const;

export type Pattern = (typeof PATTERNS)[number]["id"];

export default function SettingsApp({
  bgTheme,
  onBgThemeChange,
  accent,
  onAccentChange,
  pattern,
  onPatternChange,
}: {
  bgTheme: string;
  onBgThemeChange: (name: string) => void;
  accent: string;
  onAccentChange: (value: string) => void;
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto text-xs">
      <div className="text-sm font-bold text-zinc-50">Settings</div>

      <div>
        <div className="mb-2 font-semibold text-[var(--accent)]">
          Desktop background
        </div>
        <div className="flex flex-wrap gap-3">
          {BG_THEMES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => onBgThemeChange(t.name)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="h-9 w-9 rounded-full border-2 transition"
                style={{
                  background: t.bg,
                  borderColor: bgTheme === t.name ? "var(--accent)" : "transparent",
                }}
              />
              <span className="text-[10px] text-zinc-400">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-[var(--accent)]">
          Background pattern
        </div>
        <div className="flex gap-1.5 rounded-md border border-zinc-800 p-1">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPatternChange(p.id)}
              className={`flex-1 rounded px-2 py-1.5 transition ${
                pattern === p.id
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-[var(--accent)]">
          Accent color
        </div>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.name}
              type="button"
              onClick={() => onAccentChange(a.value)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="h-9 w-9 rounded-full border-2 transition"
                style={{
                  background: a.value,
                  borderColor: accent === a.value ? "var(--accent)" : "transparent",
                }}
              />
              <span className="text-[10px] text-zinc-400">{a.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto text-[10px] text-zinc-600">
        Changes apply instantly across the desktop.
      </div>
    </div>
  );
}
