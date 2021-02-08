import { useEffect, useState } from 'react';
import { debounce } from '../utils/debounce';

const useWindowSizeListener = (
  width = 0,
  setWidth = (newWidth: number) => {},
  height = 0,
  setHeight = (newHeight: number) => {},
) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const debouncedResizeHandler = debounce(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);

    if (window.innerWidth * 0.75 < width) {
      setWidth(window.innerWidth * 0.75);
    }
  }, 100);

  useEffect(() => {
    const resizeListener = () => {
      debouncedResizeHandler();
    };

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [debouncedResizeHandler, setWidth, width]);

  return [innerWidth, innerHeight] as const;
};

export default useWindowSizeListener;
