"use client";

import { useEffect, useState } from "react";

export default function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const hh = time ? time.getHours().toString().padStart(2, "0") : "--";
  const mm = time ? time.getMinutes().toString().padStart(2, "0") : "--";

  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-white shadow-xl shadow-black/30 ring-1 ring-black/10">
      <div className="absolute inset-2 rounded-2xl border-2 border-dashed border-zinc-300" />
      <span className="font-mono text-4xl font-semibold tracking-tight text-black">
        {hh}:{mm}
      </span>
    </div>
  );
}
