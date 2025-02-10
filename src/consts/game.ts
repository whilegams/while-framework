import { isMobile, Size } from 'pixi.js';

export enum TableStyle {
  european,
  american,
}

export const initialSizePortrait: Size = { width: 1080, height: 1920 };
export const initialSizeLandscape: Size = { height: 1200, width: 1920 };

export const initialSizeLimit = isMobile.any ? 1 : 0.5;

export const getInitialSize = (isPortrait = true) => {
  return isPortrait ? initialSizePortrait : initialSizeLandscape;
};

export const bgImage = {
  [TableStyle.european]: 'bg_green',
  [TableStyle.american]: 'bg_red',
};

export interface GameConfigItem {
  id: number;
  name: string;
  rightBar: {
    icon: {
      on: string;
      off: string;
    };
    text: string;
  };
  main: {
    icon: {
      bg: string;
      icon: string;
    };
    title: string;
    label: string;
  };
}

export type GameConfig = GameConfigItem[];
