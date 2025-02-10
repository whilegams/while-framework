import { Container, Graphics } from 'pixi.js';
import { theme } from '../consts';
import type { Balance, Currency, CurrencyIcon } from '../types';
import { WalletListItem, type WalletListItemArgs } from './WalletListItem';

export interface WalletListArgs {
  currencies: {
    value: Balance;
    type: Currency;
    icon: CurrencyIcon;
  }[];
}

const walletListStyle = {
  panelWidth: 200,
  panelHeight: 200,
  itemHeight: 30,
  itemMargin: { x: 0, y: 5 },
} as const;

export class WalletList extends Container {
  private readonly bg: Graphics;

  private readonly itemList: WalletListItem[];
  private readonly itemContainer: Container;

  constructor(args: WalletListArgs) {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.itemList = [];
    this.itemContainer = new Container();
    this.addChild(this.itemContainer);

    args.currencies.forEach(this.addItem);
  }

  public resize(width: number, height: number, scale = 1): void {
    const { panelWidth, panelHeight, itemHeight, itemMargin } = walletListStyle;

    this.bg
      .clear()
      .roundRect(0, 0, width, height, 6)
      .fill(theme.walletBackgroundColor);

    this.itemContainer.x = 5;
    this.itemContainer.y = 5;

    this.itemList.forEach((item, index) => {
      item.resize(panelWidth - this.itemContainer.x * 2, itemHeight);
      item.position.set(0, (itemHeight + itemMargin.y) * index);
    });
  }

  private addItem = (itemArgs: WalletListItemArgs): void => {
    const item = new WalletListItem(itemArgs);

    this.itemList.push(item);
    this.itemContainer.addChild(item);
  };

  private removeItem = (item: WalletListItem): void => {
    if (this.itemList.includes(item)) {
      this.itemList.splice(this.itemList.indexOf(item), 1);
    }
    if (this.itemContainer.children.includes(item)) {
      this.itemContainer.removeChild(item);
    }
  };
}
