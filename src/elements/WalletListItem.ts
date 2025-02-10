import { Container, Graphics, Rectangle, Sprite, Text } from 'pixi.js';
import { defaultButtonTextStyle, theme } from '../consts';
import { assetService, tr } from '../services';
import type { Balance, Currency, CurrencyIcon } from '../types';
import { getDeviceScale } from '../utils';

export interface WalletListItemArgs {
  value: Balance;
  type: Currency;
  icon: CurrencyIcon;
}

export const WalletListItemEvent = {
  click: 'WalletListItemEvent.click',
};

export class WalletListItem extends Container {
  private readonly bg: Graphics;
  private readonly icon: Sprite;
  private readonly valueText: Text;
  private readonly currencyText: Text;

  private hovered = false;

  constructor(args: WalletListItemArgs) {
    super();

    this.interactive = true;
    this.eventMode = 'dynamic';
    this.cursor = 'pointer';

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.icon = new Sprite(assetService.getByName(args.icon));
    this.icon.scale.set(getDeviceScale());
    this.icon.anchor.set(0.5);
    this.addChild(this.icon);

    this.valueText = new Text({
      text: args.value,
      style: {
        ...defaultButtonTextStyle,
        fontSize: 16,
        align: 'left',
      },
      anchor: { x: 0, y: 0.5 },
    });
    this.addChild(this.valueText);

    this.currencyText = new Text({
      text: tr(args.type).toString(),
      style: {
        ...defaultButtonTextStyle,
        fontSize: 16,
        align: 'left',
      },
      anchor: { x: 0, y: 0.5 },
    });
    this.addChild(this.currencyText);

    this.on('pointerdown', this.onPointerDown);
    this.on('mouseover', this.onMouseOver);
    this.on('mouseout', this.onMouseOut);
  }

  public resize(width: number, height: number, scale = 1): void {
    this.valueText.x = 10;
    this.valueText.y = height / 2;

    this.currencyText.x = width - this.currencyText.width - 10;
    this.currencyText.y = height / 2;

    this.icon.x = this.currencyText.x - this.icon.width;
    this.icon.y = height / 2;

    this.hitArea = new Rectangle(
      0,
      0,
      width - (this.icon.x - this.icon.width / 2 - 4),
      height
    );

    this.bg
      .clear()
      .roundRect(
        this.hovered ? 0 : this.icon.x - this.icon.width / 2 - 4,
        0,
        this.hovered ? width : width - (this.icon.x - this.icon.width / 2 - 4),
        height,
        4
      )
      .fill(theme.walletListItemBackgroundColor);
  }

  private onPointerDown = (): void => {
    this.emit(WalletListItemEvent.click);
  };

  private onMouseOver = (): void => {
    this.hovered = true;
  };

  private onMouseOut = (): void => {
    this.hovered = false;
  };
}
