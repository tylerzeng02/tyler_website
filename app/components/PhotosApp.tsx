"use client";

import Image from "next/image";
import { useState } from "react";

type AlbumId = "views" | "cwsf" | "art";

const ALBUMS: { id: AlbumId; label: string; photos: string[] }[] = [
  {
    id: "views",
    label: "views",
    photos: [
      "/IMG_3813.jpg",
      "/IMG_4253.jpg",
      "/IMG_6834.jpg",
      "/IMG_8444.jpg",
      "/IMG_9266.jpg",
      "/IMG_7287.jpg",
    ],
  },
  {
    id: "cwsf",
    label: "cwsf",
    photos: [
      "/IMG_7838.jpg",
      "/IMG_7837.jpg",
      "/IMG_7788.jpg",
      "/IMG_6716.jpg",
      "/IMG_6597.jpg",
      "/IMG_6583.jpg",
      "/IMG_6555.jpg",
      "/IMG_2999.jpg",
    ],
  },
  {
    id: "art",
    label: "art",
    photos: [
      "/IMG_2913.jpg",
      "/IMG_3954.jpg",
      "/IMG_4663.jpg",
      "/IMG_4744.jpg",
      "/IMG_4925.jpg",
      "/IMG_5058.jpg",
      "/IMG_5647.jpg",
      "/IMG_5839.jpg",
      "/IMG_6289.jpg",
      "/IMG_6290.jpg",
    ],
  },
];

export default function PhotosApp() {
  const [activeAlbum, setActiveAlbum] = useState<AlbumId>("views");

  const album = ALBUMS.find((a) => a.id === activeAlbum)!;

  return (
    <div className="flex h-full min-h-0 gap-4 text-xs">
      <div className="flex w-32 shrink-0 flex-col gap-1">
        <div className="mb-1 text-sm font-bold text-zinc-50">Photos</div>
        {ALBUMS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActiveAlbum(a.id)}
            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-left transition ${
              activeAlbum === a.id
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>{a.label}</span>
            <span className="text-[10px] text-zinc-600">{a.photos.length}</span>
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {album.photos.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-zinc-500">
            No photos in this album yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {album.photos.map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-md ring-1 ring-white/10"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
