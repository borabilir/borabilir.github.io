import { useEffect, useState } from "react";
import useResize from './useResize';

type DeviceType = "desktop" | "tablet" | "phone";

type Props = () => {
  isPhone: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  type: DeviceType | undefined;
};

const useDevice: Props = () => {
  const [type, setType] = useState<DeviceType>();

  const onResize = (width: number) => {
    setType(width > 1030 ? "desktop" : width < 500 ? "phone" : "tablet");
  };

  useResize(onResize);

  useEffect(() => {
    const w = window.innerWidth || document.documentElement.clientWidth;
    setType(w > 1030 ? "desktop" : w < 500 ? "phone" : "tablet");
  }, []);

  return {
    type,
    isDesktop: type === "desktop",
    isTablet: type === "tablet",
    isPhone: type === "phone",
    isMobile: type === "phone" || type === "tablet",
  };
};

export default useDevice;
