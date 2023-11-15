import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
// Cloned from: https://github.com/holtzy/react-graph-gallery
// Hook:
// - check the dimension of a target ref
// - listen to window size change
// - return width and height

export const useScreenDimensions = () => {

  const [dimensions, setDimensions] = useState(1);

  const handleResize = () => {
    setDimensions(window.innerHeight / window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}

