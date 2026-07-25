"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import BootScreen from "./components/BootScreen";
import Terminal from "./components/Terminal";
import AppWindow from "./components/AppWindow";
import SettingsApp from "./components/SettingsApp";
import SpotifyApp from "./components/SpotifyApp";
import PdfViewerApp from "./components/PdfViewerApp";
import PhotosApp from "./components/PhotosApp";
import Dock, {
  TerminalIcon,
  SpotifyIcon,
  SettingsIcon,
  PhotosIcon,
  type DockApp,
} from "./components/Dock";
import { BG_THEMES, type Pattern } from "./components/SettingsApp";
import WidgetSlot from "./components/widgets/WidgetSlot";
import PhotoWidget from "./components/widgets/PhotoWidget";
import ClockWidget from "./components/widgets/ClockWidget";
import CalendarWidget from "./components/widgets/CalendarWidget";
import FileIcon from "./components/widgets/FileIcon";
import { gridToPx, type GridRect } from "./lib/widgetGrid";

type AppId = "terminal" | "settings" | "spotify" | "pdf" | "photos";
type Status = "open" | "minimized" | "closed";

type WidgetId =
  | "aurora"
  | "abstract"
  | "clock"
  | "calendar"
  | "frankOcean"
  | "stickSeason";

// Fixed, non-editable widget arrangement.
const WIDGET_LAYOUT: Record<WidgetId, GridRect> = {
  stickSeason: { col: 0, row: 0, w: 4, h: 6 },
  aurora: { col: 4, row: 0, w: 5, h: 3 },
  frankOcean: { col: 4, row: 3, w: 3, h: 3 },
  clock: { col: 0, row: 6, w: 3, h: 3 },
  calendar: { col: 3, row: 6, w: 4, h: 3 },
  abstract: { col: 0, row: 9, w: 4, h: 3 },
};

// The empty grid square bounded by the abstract artwork (left) and the
// calendar (above).
const HL_PHYSICS_ICON_BOX = gridToPx({ col: 4, row: 9, w: 3, h: 3 });

const CASCADE: Record<AppId, { x: number; y: number }> = {
  terminal: { x: 0, y: 0 },
  settings: { x: -170, y: -50 },
  spotify: { x: 190, y: 30 },
  pdf: { x: 40, y: -80 },
  photos: { x: -40, y: 60 },
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
    pdf: "closed",
    photos: "closed",
  });
  const [zOrder, setZOrder] = useState<AppId[]>([
    "terminal",
    "settings",
    "spotify",
    "pdf",
    "photos",
  ]);
  const [winStyles, setWinStyles] = useState<Record<AppId, CSSProperties>>({
    terminal: ENTRANCE_STYLE,
    settings: {},
    spotify: {},
    pdf: {},
    photos: {},
  });

  const [bgTheme, setBgTheme] = useState("Graphite");
  const [pattern, setPattern] = useState<Pattern>("dots");
  const [accent, setAccent] = useState("#99bbb4");

  const windowRefs = useRef<Record<AppId, HTMLDivElement | null>>({
    terminal: null,
    settings: null,
    spotify: null,
    pdf: null,
    photos: null,
  });
  const dockIconRefs = useRef<Record<AppId, HTMLButtonElement | null>>({
    terminal: null,
    settings: null,
    spotify: null,
    pdf: null,
    photos: null,
  });
  const dockContainerRef = useRef<HTMLDivElement | null>(null);

  // Position a freshly-opened window centered in the space between the top
  // of the page and the top of the taskbar. Read fresh each time an app
  // opens (rather than cached) so it tracks the dock's current size/position.
  const getReopenPosition = (): { x: number; y: number } => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    const dockTop =
      dockContainerRef.current?.getBoundingClientRect().top ?? window.innerHeight;
    return { x: 0, y: dockTop / 2 - window.innerHeight / 2 };
  };

  // Position used whenever an app transitions from "closed" to "open".
  // Restoring from "minimized" bypasses this and keeps the window's
  // existing position (AppWindow stays mounted across a minimize, so its
  // internal position state survives untouched).
  const [reopenPositions, setReopenPositions] =
    useState<Record<AppId, { x: number; y: number }>>(CASCADE);

  // The terminal starts "open" rather than going through handleReopen, so it
  // never gets the computed position above — correct it once, right after
  // mount (before paint) so the very first window the visitor sees is
  // positioned the same way as any other freshly-opened app.
  useLayoutEffect(() => {
    setReopenPositions((p) => ({ ...p, terminal: getReopenPosition() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setReopenPositions((p) => ({ ...p, [id]: getReopenPosition() }));
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
    {
      id: "photos",
      label: statuses.photos === "closed" ? "Open Photos" : "Photos",
      icon: <PhotosIcon />,
      running: statuses.photos !== "closed",
      onClick: () => handleDockIconClick("photos"),
      setRef: (el) => {
        dockIconRefs.current.photos = el;
      },
    },
  ];

  return (
    <div
      data-pattern={pattern}
      className="bg-dot-grid relative min-h-screen w-full flex-1 overflow-hidden p-4 pb-28 sm:p-10 sm:pb-32"
    >
      <WidgetSlot layout={WIDGET_LAYOUT.aurora}>
        <PhotoWidget src="/aurora-borealis.jpeg" />
      </WidgetSlot>
      <WidgetSlot layout={WIDGET_LAYOUT.abstract}>
        <PhotoWidget src="/abstract.jpeg" />
      </WidgetSlot>
      <WidgetSlot layout={WIDGET_LAYOUT.clock}>
        <ClockWidget />
      </WidgetSlot>
      <WidgetSlot layout={WIDGET_LAYOUT.calendar}>
        <CalendarWidget />
      </WidgetSlot>
      <WidgetSlot layout={WIDGET_LAYOUT.frankOcean}>
        <PhotoWidget src="/frank-ocean.jpg" />
      </WidgetSlot>
      <WidgetSlot layout={WIDGET_LAYOUT.stickSeason}>
        <PhotoWidget src="/stick-season.jpg" />
      </WidgetSlot>

      {statuses.terminal !== "closed" &&
        (screen === "terminal" ? (
          <Terminal
            key={`terminal-${reopenPositions.terminal.x}-${reopenPositions.terminal.y}`}
            onGoHome={() => setScreen("boot")}
            onClose={() => handleClose("terminal")}
            onMinimize={() => handleMinimize("terminal")}
            onFocus={() => bringToFront("terminal")}
            zIndex={zOrder.indexOf("terminal") + 1}
            initialX={reopenPositions.terminal.x}
            initialY={reopenPositions.terminal.y}
            animStyle={winStyles.terminal}
            setWindowRef={(el) => {
              windowRefs.current.terminal = el;
            }}
          />
        ) : (
          <BootScreen
            key={`terminal-${reopenPositions.terminal.x}-${reopenPositions.terminal.y}`}
            onContinue={() => setScreen("terminal")}
            onClose={() => handleClose("terminal")}
            onMinimize={() => handleMinimize("terminal")}
            onFocus={() => bringToFront("terminal")}
            zIndex={zOrder.indexOf("terminal") + 1}
            initialX={reopenPositions.terminal.x}
            initialY={reopenPositions.terminal.y}
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
          initialX={reopenPositions.settings.x}
          initialY={reopenPositions.settings.y}
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
          initialX={reopenPositions.spotify.x}
          initialY={reopenPositions.spotify.y}
          animStyle={winStyles.spotify}
          setWindowRef={(el) => {
            windowRefs.current.spotify = el;
          }}
        >
          <SpotifyApp />
        </AppWindow>
      )}

      {statuses.pdf !== "closed" && (
        <AppWindow
          title="HL Physics.pdf"
          onClose={() => handleClose("pdf")}
          onMinimize={() => handleMinimize("pdf")}
          onFocus={() => bringToFront("pdf")}
          zIndex={zOrder.indexOf("pdf") + 1}
          defaultWidth={560}
          defaultHeight={640}
          minWidth={360}
          minHeight={420}
          initialX={reopenPositions.pdf.x}
          initialY={reopenPositions.pdf.y}
          animStyle={winStyles.pdf}
          setWindowRef={(el) => {
            windowRefs.current.pdf = el;
          }}
        >
          <PdfViewerApp src="/hl-physics.pdf" />
        </AppWindow>
      )}

      {statuses.photos !== "closed" && (
        <AppWindow
          title="Photos"
          onClose={() => handleClose("photos")}
          onMinimize={() => handleMinimize("photos")}
          onFocus={() => bringToFront("photos")}
          zIndex={zOrder.indexOf("photos") + 1}
          defaultWidth={640}
          defaultHeight={520}
          minWidth={420}
          minHeight={360}
          initialX={reopenPositions.photos.x}
          initialY={reopenPositions.photos.y}
          animStyle={winStyles.photos}
          setWindowRef={(el) => {
            windowRefs.current.photos = el;
          }}
        >
          <PhotosApp />
        </AppWindow>
      )}

      <div
        className="absolute z-0 flex items-center justify-center"
        style={{
          left: HL_PHYSICS_ICON_BOX.left,
          top: HL_PHYSICS_ICON_BOX.top,
          width: HL_PHYSICS_ICON_BOX.width,
          height: HL_PHYSICS_ICON_BOX.height,
        }}
      >
        <FileIcon
          label="HL Physics.pdf"
          thumbnail="/hl-physics-icon.jpg"
          onOpen={() => handleDockIconClick("pdf")}
          setRef={(el) => {
            dockIconRefs.current.pdf = el;
          }}
        />
      </div>

      <Dock
        apps={dockApps}
        containerRef={(el) => {
          dockContainerRef.current = el;
        }}
      />
    </div>
  );
}
