import { isMobile } from 'pixi.js';

export const getDeviceScale = (): number => {
  if (isMobile.any) {
    return 2;
  }
  return 1 / window.devicePixelRatio;
};
