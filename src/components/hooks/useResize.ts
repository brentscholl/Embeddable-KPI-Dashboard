import { MutableRefObject, useLayoutEffect, useState } from 'react';

/**
 * Hook to observe and track the dimensions (width and height) of a given DOM element.
 * @param ref - A React ref object pointing to the DOM element to observe.
 * @returns [width, height] - The current width and adjusted height of the element.
 */
const useResizeObserver = (ref: MutableRefObject<HTMLDivElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 10, height: 100 });

  useLayoutEffect(() => {
    if (!ref?.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry?.contentRect) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: width || 10, // Fallback to 10 if width is not defined
          height: Math.max(height - 15, 100), // Adjust height with a minimum of 100
        });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return [dimensions.width, dimensions.height];
};

export default useResizeObserver;
