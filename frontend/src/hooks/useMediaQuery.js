// Hook para media queries responsive
// QUÉ HACE: Detecta breakpoints y tamaño de pantalla
// PARA QUÉ:
// - const { isMobile, isTablet, isDesktop } = useBreakpoint()
// - Componentes responsive
// - Conditional rendering por device
// - Sidebar behavior

import { useState, useEffect } from "react";

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

// Hooks de breakpoints específicos
export const useBreakpoint = () => {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2Xl = useMediaQuery("(min-width: 1536px)");

  const isMobile = !isSm;
  const isTablet = isSm && !isLg;
  const isDesktop = isLg;

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,

    // Current breakpoint
    current: is2Xl
      ? "2xl"
      : isXl
      ? "xl"
      : isLg
      ? "lg"
      : isMd
      ? "md"
      : isSm
      ? "sm"
      : "xs",
  };
};
