"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

export default function AppWindow({
  title,
  onClose,
  onMinimize,
  onFocus,
  zIndex = 10,
  defaultWidth = 768,
  defaultHeight = 620,
  minWidth = 340,
  minHeight = 260,
  initialX = 0,
  initialY = 0,
  animStyle,
  setWindowRef,
  children,
}: {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onFocus?: () => void;
  zIndex?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  initialX?: number;
  initialY?: number;
  animStyle?: CSSProperties;
  setWindowRef?: (el: HTMLDivElement | null) => void;
  children: ReactNode | ((maximized: boolean) => ReactNode);
}) {
  const [maximized, setMaximized] = useState(false);
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [pos, setPos] = useState({ x: initialX, y: initialY });

  useEffect(() => {
    if (!maximized) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMaximized(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [maximized]);

  const startDrag = (e: React.PointerEvent) => {
    if (maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    onFocus?.();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = pos;

    const handleMove = (ev: PointerEvent) => {
      const nextX = startPos.x + (ev.clientX - startX);
      const nextY = startPos.y + (ev.clientY - startY);
      const minVisible = 80;
      setPos({
        x: Math.max(
          -window.innerWidth / 2 + minVisible,
          Math.min(nextX, window.innerWidth / 2 - minVisible),
        ),
        y: Math.max(
          -window.innerHeight / 2 + minVisible,
          Math.min(nextY, window.innerHeight / 2 - minVisible),
        ),
      });
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus?.();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;

    const handleMove = (ev: PointerEvent) => {
      const maxW = window.innerWidth - 32;
      const maxH = window.innerHeight - 160;
      setSize({
        width: Math.max(minWidth, Math.min(startW + (ev.clientX - startX), maxW)),
        height: Math.max(minHeight, Math.min(startH + (ev.clientY - startY), maxH)),
      });
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const baseTransform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`;

  return (
    <div
      ref={setWindowRef}
      onPointerDown={onFocus}
      style={
        maximized
          ? { zIndex, ...animStyle }
          : {
              width: size.width,
              height: size.height,
              zIndex,
              position: "absolute",
              left: "50%",
              top: "50%",
              ...animStyle,
              transform: animStyle?.transform
                ? `${baseTransform} ${animStyle.transform}`
                : baseTransform,
            }
      }
      className={`flex flex-col overflow-hidden border-black/10 bg-[#0b0c0f] shadow-2xl shadow-black/40 transition-[border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        maximized
          ? "fixed inset-0 h-screen w-screen max-w-none rounded-none border-0"
          : "max-w-full rounded-xl border"
      }`}
    >
      <div
        onPointerDown={startDrag}
        className={`flex items-center gap-2 border-b border-white/5 bg-[#17181c] px-4 py-2.5 ${
          maximized ? "" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="group flex gap-1.5">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] transition hover:brightness-110"
          >
            <svg
              viewBox="0 0 8 8"
              className="h-1.5 w-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <path
                d="M1 1L7 7M7 1L1 7"
                stroke="#7a0e0e"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Minimize"
            onClick={onMinimize}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] transition hover:brightness-110"
          >
            <svg
              viewBox="0 0 8 8"
              className="h-1.5 w-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <path
                d="M1 4H7"
                stroke="#985712"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label={maximized ? "Exit full screen" : "Full screen"}
            onClick={() => setMaximized((m) => !m)}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] transition hover:brightness-110"
          >
            <svg
              viewBox="0 0 8 8"
              className="h-2 w-2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <polygon points="1.3,1.3 4.3,1.3 1.3,4.3" fill="#0f5c22" />
              <polygon points="6.7,6.7 3.7,6.7 6.7,3.7" fill="#0f5c22" />
            </svg>
          </button>
        </div>
        <div className="flex-1 truncate text-center font-mono text-xs text-zinc-400">
          {title}
        </div>
        <div className="w-[52px]" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-6 font-serif text-sm text-zinc-300 sm:p-8">
        {typeof children === "function" ? children(maximized) : children}
      </div>

      {!maximized && (
        <div
          onPointerDown={startResize}
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none"
        >
          <svg viewBox="0 0 16 16" className="h-full w-full opacity-40">
            <path
              d="M14 2L2 14M14 7L7 14M14 12L12 14"
              stroke="#8a8f8d"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
