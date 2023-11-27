import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
// Cloned from: https://github.com/holtzy/react-graph-gallery
// Hook:
// - check the dimension of a target ref
// - listen to window size change
// - return width and height

export const useScreenDimensions = () => {

  const [dimensions, setDimensions] = useState({height: 1, width: 1});

  // console.log("dimensions: ", dimensions)

  const handleResize = () => {
    setDimensions({
      height: window.innerHeight, 
      width: window.innerWidth
    })
  };

  useEffect(() => {
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return dimensions;
}

