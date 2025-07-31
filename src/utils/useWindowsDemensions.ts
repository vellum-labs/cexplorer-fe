import { useState, useEffect } from "react";

interface WindowDimensions {
  width: number;
  height: number;
}

function getWindowDimensions(): WindowDimensions {
  if (typeof window === "undefined") {
    return {
      width: 1200,
      height: 800,
    };
  }
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("resize", handleResize, { signal });
    return () => {
      controller.abort();
    };
  }, []);

  return windowDimensions;
}
