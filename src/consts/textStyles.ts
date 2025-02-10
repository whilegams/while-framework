import { TextStyle } from 'pixi.js';

export const defaultFontStyle = {
  OpenSansCondensedLight: 'open-sans-condensed-light',
  Title: 'bartina-bold',
};

export const defaultButtonTextStyle = {
  fontFamily: defaultFontStyle.OpenSansCondensedLight,
  fill: 0xffffff,
} as TextStyle;

export const titleTextStyle = {
  fontFamily: defaultFontStyle.Title,
  fill: 0xffffff,
} as TextStyle;
