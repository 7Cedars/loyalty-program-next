import React, { useState, useEffect, useLayoutEffect } from "react";
// Cloned from: https://github.com/holtzy/react-graph-gallery
// Hook:
// - check the dimension of a target ref
// - listen to window size change
// - return width and height

export const useScreenDimensions = () => {

  const getDimensions = () => {

    if (window) { // did not solve bug yet.. 
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    } else {
      return {width: 0, height: 0} 
    }
  };

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = () => {
    setDimensions(getDimensions());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, []);

  return dimensions;
}

