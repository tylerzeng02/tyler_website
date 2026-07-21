import { NextResponse } from "next/server";

type SpotifyArtist = { name: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { name: string; images?: { url: string }[] };
  duration_ms: number;
};

async function getAccessToken() {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to refresh Spotify token");
  return res.json() as Promise<{ access_token: string }>;
}

function trackPayload(item: SpotifyTrack, playing: boolean, progressMs: number) {
  return {
    connected: true,
    playing,
    track: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album.name,
    albumArt: item.album.images?.[0]?.url ?? null,
    progressMs,
    durationMs: item.duration_ms,
  };
}

export async function GET() {
  if (!process.env.SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ connected: false, playing: false });
  }

  try {
    const { access_token } = await getAccessToken();

    const nowRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
      },
    );

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data?.item) {
        return NextResponse.json(
          trackPayload(data.item, data.is_playing, data.progress_ms ?? 0),
        );
      }
    }

    const recentRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
      },
    );
    const recentData = await recentRes.json();
    const item = recentData.items?.[0]?.track;

    if (!item) {
      return NextResponse.json({ connected: true, playing: false });
    }

    return NextResponse.json(trackPayload(item, false, 0));
  } catch (err) {
    return NextResponse.json(
      { connected: false, playing: false, error: String(err) },
      { status: 500 },
    );
  }
}
