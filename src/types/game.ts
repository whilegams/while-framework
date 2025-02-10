export type Currency = string;
export type CurrencyIcon = string;
export type Balance = number;

export const currencyType = {
  usd: 'usd',
  ton: 'ton',
  rub: 'rub',
} as const;

export type GameId = string;
export type GameUrl = string;
