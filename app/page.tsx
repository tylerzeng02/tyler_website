"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BootScreen from "./components/BootScreen";
import Terminal from "./components/Terminal";
import AppWindow from "./components/AppWindow";
import SettingsApp from "./components/SettingsApp";
import SpotifyApp from "./components/SpotifyApp";
import Dock, {
  TerminalIcon,
  SpotifyIcon,
  SettingsIcon,
  type DockApp,
} from "./components/Dock";
import { BG_THEMES, type Pattern } from "./components/SettingsApp";

type AppId = "terminal" | "settings" | "spotify";
type Status = "open" | "minimized" | "closed";

const CASCADE: Record<AppId, { x: number; y: number }> = {
  terminal: { x: 0, y: 0 },
  settings: { x: -170, y: -50 },
  spotify: { x: 190, y: 30 },
};

const ENTRANCE_STYLE: CSSProperties = {
  transform: "scale(0.94) translateY(12px)",
  opacity: 0,
};

export default function Home() {
  const [screen, setScreen] = useState<"boot" | "terminal">("boot");
  const [statuses, setStatuses] = useState<Record<AppId, Status>>({
    terminal: "open",
    settings: "closed",
    spotify: "closed",
  });
  const [zOrder, setZOrder] = useState<AppId[]>(["terminal", "settings", "spotify"]);
  const [winStyles, setWinStyles] = useState<Record<AppId, CSSProperties>>({
    terminal: ENTRANCE_STYLE,
    settings: {},
    spotify: {},
  });

  const [bgTheme, setBgTheme] = useState("Graphite");
  const [pattern, setPattern] = useState<Pattern>("dots");
  const [accent, setAccent] = useState("#99bbb4");

  const windowRefs = useRef<Record<AppId, HTMLDivElement | null>>({
    terminal: null,
    settings: null,
    spotify: null,
  });
  const dockIconRefs = useRef<Record<AppId, HTMLButtonElement | null>>({
    terminal: null,
    settings: null,
    spotify: null,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  useEffect(() => {
    const theme = BG_THEMES.find((t) => t.name === bgTheme) ?? BG_THEMES[0];
    document.documentElement.style.setProperty("--dot-bg", theme.bg);
    document.documentElement.style.setProperty("--dot-color", theme.dot);
  }, [bgTheme]);

  // Animate the terminal + welcome screen in on first load.
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setWinStyles((s) => ({
          ...s,
          terminal: {
            transform: "scale(1) translateY(0)",
            opacity: 1,
            transitionProperty: "transform, opacity",
            transitionDuration: "550ms, 450ms",
            transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1), ease-out",
          },
        }));
        window.setTimeout(() => {
          setWinStyles((s) => ({ ...s, terminal: {} }));
        }, 550);
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  const bringToFront = (id: AppId) => {
    setZOrder((z) => [...z.filter((x) => x !== id), id]);
  };

  const handleMinimize = (id: AppId) => {
    const winEl = windowRefs.current[id];
    const iconEl = dockIconRefs.current[id];

    if (winEl && iconEl) {
      const winRect = winEl.getBoundingClientRect();
      const iconRect = iconEl.getBoundingClientRect();
      const dx =
        iconRect.left + iconRect.width / 2 - (winRect.left + winRect.width / 2);
      const dy =
        iconRect.top + iconRect.height / 2 - (winRect.top + winRect.height / 2);
      const scale = Math.max(iconRect.width / winRect.width, 0.03);

      setWinStyles((s) => ({
        ...s,
        [id]: {
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          opacity: 0,
          pointerEvents: "none",
          transitionProperty: "transform, opacity",
          transitionDuration: "500ms, 400ms",
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1), ease-in",
        },
      }));
    }
    setStatuses((s) => ({ ...s, [id]: "minimized" }));
  };

  const handleRestore = (id: AppId) => {
    setStatuses((s) => ({ ...s, [id]: "open" }));
    bringToFront(id);
    setWinStyles((s) => ({
      ...s,
      [id]: {
        transform: "translate(0,0) scale(1)",
        opacity: 1,
        transitionProperty: "transform, opacity",
        transitionDuration: "450ms, 350ms",
        transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1), ease-out",
      },
    }));
    window.setTimeout(() => {
      setWinStyles((s) => ({ ...s, [id]: {} }));
    }, 450);
  };

  const handleClose = (id: AppId) => {
    setWinStyles((s) => ({
      ...s,
      [id]: {
        transform: "scale(0.9)",
        opacity: 0,
        transitionProperty: "transform, opacity",
        transitionDuration: "220ms, 200ms",
        transitionTimingFunction: "ease-in",
      },
    }));
    window.setTimeout(() => {
      setStatuses((s) => ({ ...s, [id]: "closed" }));
      if (id === "terminal") setScreen("boot");
      setWinStyles((s) => ({ ...s, [id]: {} }));
    }, 220);
  };

  const handleReopen = (id: AppId) => {
    setStatuses((s) => ({ ...s, [id]: "open" }));
    bringToFront(id);
    setWinStyles((s) => ({
      ...s,
      [id]: { transform: "scale(0.9)", opacity: 0, transition: "none" },
    }));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setWinStyles((s) => ({
          ...s,
          [id]: {
            transform: "scale(1)",
            opacity: 1,
            transitionProperty: "transform, opacity",
            transitionDuration: "260ms, 240ms",
            transitionTimingFunction: "ease-out",
          },
        }));
        window.setTimeout(() => {
          setWinStyles((s) => ({ ...s, [id]: {} }));
        }, 260);
      });
    });
  };

  const handleDockIconClick = (id: AppId) => {
    const status = statuses[id];
    if (status === "minimized") handleRestore(id);
    else if (status === "closed") handleReopen(id);
    else bringToFront(id);
  };

  const dockApps: DockApp[] = [
    {
      id: "terminal",
      label: statuses.terminal === "closed" ? "Open Terminal" : "Terminal",
      icon: <TerminalIcon />,
      running: statuses.terminal !== "closed",
      onClick: () => handleDockIconClick("terminal"),
      setRef: (el) => {
        dockIconRefs.current.terminal = el;
      },
    },
    {
      id: "spotify",
      label: statuses.spotify === "closed" ? "Open Spotify" : "Spotify",
      icon: <SpotifyIcon />,
      running: statuses.spotify !== "closed",
      onClick: () => handleDockIconClick("spotify"),
      setRef: (el) => {
        dockIconRefs.current.spotify = el;
      },
    },
    {
      id: "settings",
      label: statuses.settings === "closed" ? "Open Settings" : "Settings",
      icon: <SettingsIcon />,
      running: statuses.settings !== "closed",
      onClick: () => handleDockIconClick("settings"),
      setRef: (el) => {
        dockIconRefs.current.settings = el;
      },
    },
  ];

  return (
    <div
      data-pattern={pattern}
      className="bg-dot-grid relative min-h-screen w-full flex-1 overflow-hidden p-4 pb-28 sm:p-10 sm:pb-32"
    >
      {statuses.terminal !== "closed" &&
        (screen === "terminal" ? (
          <Terminal
            onGoHome={() => setScreen("boot")}
            onClose={() => handleClose("terminal")}
            onMinimize={() => handleMinimize("terminal")}
            onFocus={() => bringToFront("terminal")}
            zIndex={zOrder.indexOf("terminal") + 1}
            initialX={CASCADE.terminal.x}
            initialY={CASCADE.terminal.y}
            animStyle={winStyles.terminal}
            setWindowRef={(el) => {
              windowRefs.current.terminal = el;
            }}
          />
        ) : (
          <BootScreen
            onContinue={() => setScreen("terminal")}
            onClose={() => handleClose("terminal")}
            onMinimize={() => handleMinimize("terminal")}
            onFocus={() => bringToFront("terminal")}
            zIndex={zOrder.indexOf("terminal") + 1}
            initialX={CASCADE.terminal.x}
            initialY={CASCADE.terminal.y}
            animStyle={winStyles.terminal}
            setWindowRef={(el) => {
              windowRefs.current.terminal = el;
            }}
          />
        ))}

      {statuses.settings !== "closed" && (
        <AppWindow
          title="Settings"
          onClose={() => handleClose("settings")}
          onMinimize={() => handleMinimize("settings")}
          onFocus={() => bringToFront("settings")}
          zIndex={zOrder.indexOf("settings") + 1}
          defaultWidth={420}
          defaultHeight={480}
          minWidth={360}
          minHeight={400}
          initialX={CASCADE.settings.x}
          initialY={CASCADE.settings.y}
          animStyle={winStyles.settings}
          setWindowRef={(el) => {
            windowRefs.current.settings = el;
          }}
        >
          <SettingsApp
            bgTheme={bgTheme}
            onBgThemeChange={setBgTheme}
            accent={accent}
            onAccentChange={setAccent}
            pattern={pattern}
            onPatternChange={setPattern}
          />
        </AppWindow>
      )}

      {statuses.spotify !== "closed" && (
        <AppWindow
          title="Spotify"
          onClose={() => handleClose("spotify")}
          onMinimize={() => handleMinimize("spotify")}
          onFocus={() => bringToFront("spotify")}
          zIndex={zOrder.indexOf("spotify") + 1}
          defaultWidth={340}
          defaultHeight={480}
          minWidth={300}
          minHeight={400}
          initialX={CASCADE.spotify.x}
          initialY={CASCADE.spotify.y}
          animStyle={winStyles.spotify}
          setWindowRef={(el) => {
            windowRefs.current.spotify = el;
          }}
        >
          <SpotifyApp />
        </AppWindow>
      )}

      <Dock apps={dockApps} />
    </div>
  );
}
