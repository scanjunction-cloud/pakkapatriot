/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Shell, Copy, Check, Info, X } from "lucide-react";

/**
 * Game server for online multiplayer.
 * - Local dev: run `node server.js` in the chaukabaara folder (port 8377).
 * - Override for production by setting VITE_CHAUK_SERVER (e.g. https://games.yourdomain.com).
 */
const DEFAULT_SERVER = (import.meta.env.VITE_CHAUK_SERVER as string | undefined) || "ws://localhost:8377";

function toWsUrl(server: string): string {
  const s = server.trim();
  if (/^wss?:\/\//i.test(s)) return s;
  if (/^https:\/\//i.test(s)) return "wss://" + s.slice(8);
  if (/^http:\/\//i.test(s)) return "ws://" + s.slice(7);
  return s; // raw host — let the game resolve protocol
}

/**
 * Only honor an explicit ?server= override when it targets the same host as the
 * configured default. This stops a crafted share link (e.g. ?server=ws://evil.example)
 * from silently connecting players to a rogue server.
 */
function normalizeServer(raw: string | null): string {
  const fallback = toWsUrl(DEFAULT_SERVER);
  if (!raw) return fallback;
  const candidate = toWsUrl(raw);
  try {
    const a = new URL(candidate);
    const b = new URL(fallback);
    if (a.host === b.host) return candidate;
  } catch {
    /* malformed override — ignore and use the default */
  }
  return fallback;
}

export default function ChaukabaaraGamePage() {
  const [params] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [serverReady, setServerReady] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Allow ?server=... & ?room=XXXX on the pakkapatriot URL to be forwarded to the game.
  const room = params.get("room");
  const server = normalizeServer(params.get("server"));

  const qs = new URLSearchParams();
  qs.set("server", server);
  if (room) qs.set("room", room.toUpperCase());
  const gameSrc = `/chaukabaara/index.html?${qs.toString()}`;

  // Lightweight reachability probe so players know whether online mode will work.
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ws: WebSocket | null = null;
    const clearTimer = () => { if (timer) { clearTimeout(timer); timer = undefined; } };
    setServerReady(null);
    setBannerDismissed(false);
    try {
      ws = new WebSocket(server);
      ws.onopen = () => {
        clearTimer(); // a successful connect must cancel the fallback timeout
        if (alive) { setServerReady(true); ws!.close(); }
      };
      ws.onerror = () => {
        clearTimer();
        if (alive) { setServerReady(false); ws!.close(); }
      };
      timer = setTimeout(() => {
        if (alive) { setServerReady(false); try { ws && ws.close(); } catch { /* noop */ } }
      }, 3500);
    } catch {
      if (alive) setServerReady(false);
    }
    return () => { alive = false; clearTimer(); if (ws) { try { ws.close(); } catch { /* noop */ } } };
  }, [server]);

  const copyLink = async () => {
    // Share only the room join link (room code travels via the game's own lobby);
    // never bake the server address into shared links.
    const url = `${window.location.origin}${window.location.pathname}${room ? `?room=${room.toUpperCase()}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col bg-[#0A2240]">
      {/* Slim control bar */}
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 bg-[#0A2240] border-b border-[#1F3D5E] text-white shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/play"
            className="flex items-center gap-1.5 text-xs font-bold text-[#B5CADF] hover:text-[#F6B828] transition-colors shrink-0"
          >
            <ArrowLeft size={16} /> Back to Play
          </Link>
          <span className="hidden sm:flex items-center gap-1.5 text-sm font-black tracking-wide min-w-0">
            <Shell size={15} className="text-[#F6B828] shrink-0" />
            <span className="truncate">Chaukabaara</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {serverReady !== null && (
            <span
              className={`hidden md:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                serverReady
                  ? "bg-[#1E4D2B] text-[#7CE38B]"
                  : "bg-[#4D1B1B] text-[#FF9B9B]"
              }`}
              title={serverReady
                ? `Online rooms available via ${server}`
                : `No game server at ${server} — online mode will be offline. Start it with "node server.js" or set VITE_CHAUK_SERVER.`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${serverReady ? "bg-[#7CE38B] animate-pulse" : "bg-[#FF9B9B]"}`} />
              {serverReady ? "Online server" : "Offline mode"}
            </span>
          )}
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#B5CADF] hover:text-white border border-[#1F3D5E] hover:border-[#F6B828] px-2.5 py-1.5 rounded-full transition-colors"
            title="Copy a join link for this game"
          >
            {copied ? <Check size={13} className="text-[#7CE38B]" /> : <Copy size={13} />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy link"}</span>
          </button>
        </div>
      </div>

      {/* The game, full-screen */}
      <div className="flex-1 min-h-0 relative bg-[#FCFAF5]">
        <iframe
          src={gameSrc}
          title="Chaukabaara — ancient Indian board game"
          className="absolute inset-0 w-full h-full border-0"
          allow="clipboard-write; autoplay"
        />
        {serverReady === false && !bannerDismissed && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 max-w-md w-[calc(100%-24px)] bg-[#0A2240]/95 backdrop-blur text-white text-[11px] font-medium px-4 py-2.5 rounded-xl border border-[#1F3D5E] shadow-2xl flex items-start gap-2">
            <Info size={14} className="text-[#F6B828] shrink-0 mt-0.5" />
            <span className="flex-grow">
              <b className="font-black">Online rooms are unavailable</b> — the game server isn't reachable at{" "}
              <code className="text-[#F6B828]">{server}</code>. Play hot-seat locally now, or start the server and set{" "}
              <code className="text-[#F6B828]">VITE_CHAUK_SERVER</code>.
            </span>
            <button
              onClick={() => setBannerDismissed(true)}
              className="shrink-0 text-[#B5CADF] hover:text-white transition-colors"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
