"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NowPlaying = {
  connected: boolean;
  playing: boolean;
  track?: string;
  artist?: string;
  album?: string;
  albumArt?: string | null;
  progressMs?: number;
  durationMs?: number;
};

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function SpotifyApp() {
  const [data, setData] = useState<NowPlaying | null>(null);
  const [fetchedAt, setFetchedAt] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setFetchedAt(Date.now());
        }
      } catch {
        if (!cancelled) setData({ connected: false, playing: false });
      }
    };

    load();
    const interval = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  const header = (
    <div className="flex items-center gap-2">
      <Image
        src="/spotify.webp"
        alt=""
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="text-sm font-bold text-zinc-50">Spotify</span>
    </div>
  );

  if (!data) {
    return (
      <div className="flex h-full flex-col justify-between text-xs">
        {header}
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          Loading…
        </div>
      </div>
    );
  }

  if (!data.connected) {
    return (
      <div className="flex h-full flex-col justify-between text-xs">
        {header}
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-zinc-500">
          <div>Not connected to Spotify yet.</div>
        </div>
      </div>
    );
  }

  if (!data.track) {
    return (
      <div className="flex h-full flex-col justify-between text-xs">
        {header}
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          No recent listening activity.
        </div>
      </div>
    );
  }

  const { playing, track, artist, album, albumArt, durationMs = 1 } = data;
  const elapsedSinceFetch = playing ? Math.max(0, now - fetchedAt) : 0;
  const progressMs = Math.min(durationMs, (data.progressMs ?? 0) + elapsedSinceFetch);
  const pct = Math.min(100, (progressMs / durationMs) * 100);

  return (
    <div className="flex h-full flex-col justify-between text-xs">
      {header}

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        {albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={albumArt}
            alt=""
            className="h-40 w-40 rounded-md object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gradient-to-br from-[#1ed760] to-[#0b0c0f] text-4xl shadow-lg">
            ♪
          </div>
        )}

        <div className="text-center">
          <div className="text-sm font-semibold text-zinc-50">{track}</div>
          <div className="mt-1 text-zinc-400">{artist}</div>
          <div className="text-zinc-600">{album}</div>
        </div>

        <div className="w-full max-w-[220px]">
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-[#1ed760]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
            <span>{formatTime(progressMs)}</span>
            <span>{formatTime(durationMs)}</span>
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-wide text-zinc-500">
          {playing ? "Currently listening to" : "Last played"}
        </div>
      </div>
    </div>
  );
}
