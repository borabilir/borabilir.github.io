import { useCallback, useEffect, useRef, useState } from "react";

type Props = (
  callback: (width: number, prev: number) => void,
  render?: boolean
) => void;

const useResize: Props = (callback, render) => {
  const ref = useRef<number>(0);
  const [value, setValue] = useState(0);
  const cb = useCallback(callback, []);

  const onResize = () => {
    if (render) {
      setValue(window.innerWidth || document.documentElement.clientWidth);
    } else {
      cb(
        window.innerWidth || document.documentElement.clientWidth,
        ref.current
      );
      ref.current = window.innerWidth || document.documentElement.clientWidth;
    }
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => callback(value, ref.current), [value]);
};

export default useResize;
