import { useEffect, useState } from "react";

interface ExtendedScreenOrientation extends ScreenOrientation {
  lock?: (orientation: "portrait" | "landscape" | "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary" | "any" | "natural") => Promise<void>;
}

export function useOrientationLock() {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

  useEffect(() => {
    // Try Screen Orientation API lock if supported
    const lockScreenOrientation = async () => {
      if (typeof window !== "undefined" && window.screen?.orientation) {
        const orientation = window.screen.orientation as ExtendedScreenOrientation;
        if (typeof orientation.lock === "function") {
          try {
            await orientation.lock("portrait");
          } catch {
            // Ignore failures (e.g. non-fullscreen, browser policy restrictions, iOS Safari)
          }
        }
      }
    };

    lockScreenOrientation();

    const checkOrientation = () => {
      if (typeof window === "undefined") return;

      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      // Mobile screen criteria: max width 960px or max height 600px in landscape
      const isMobileSize =
        window.matchMedia("(max-width: 960px) and (max-height: 600px)").matches ||
        (window.matchMedia("(max-height: 500px)").matches && isLandscape);

      setIsLandscapeMobile(isLandscape && isMobileSize);
    };

    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener("change", checkOrientation);
    }

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener("change", checkOrientation);
      }
    };
  }, []);

  return { isLandscapeMobile };
}
