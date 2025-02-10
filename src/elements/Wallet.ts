import { FancyButton } from '@pixi/ui';
import { defaultButtonTextStyle, theme } from 'consts';
import i18next from 'i18next';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { assetService } from 'services';
import { Currency } from 'types';
import { getDeviceScale } from 'utils';

export interface WalletArgs {
  currentCurrency: Currency;
}

const walletStyle = {
  panelWidth: 150,
  panelHeight: 55,
} as const;

export const WalletEvent = {
  walletClick: 'WalletEvent.walletClick',
  listClick: 'WalletEvent.listClick',
} as const;

export class Wallet extends Container {
  private readonly bg: Graphics;
  private readonly walletButton: FancyButton;
  private readonly balanceLabelText: Text;
  private readonly balanceValueText: Text;
  private readonly openButton: FancyButton;

  private opened = false;

  constructor(args: WalletArgs) {
    super();

    const { panelHeight } = walletStyle;

    this.walletButton = new FancyButton({
      defaultView: new Graphics()
        .roundRect(0, 0, panelHeight, panelHeight, 4)
        .fill(theme.walletButtonBackgroundColor),
      icon: new Sprite(assetService.getByName('btn_wallet')),
      defaultIconScale: getDeviceScale(),
      defaultIconAnchor: 0.5,
      iconOffset: { x: -2, y: 0 },
    });
    this.addChild(this.walletButton);

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.balanceLabelText = new Text({
      text: i18next.t('balance'),
      style: {
        ...defaultButtonTextStyle,
        fontSize: 14,
        align: 'left',
      },
      anchor: { x: 0, y: 0.5 },
      alpha: 0.5,
    });
    this.addChild(this.balanceLabelText);

    this.balanceValueText = new Text({
      text: 1000,
      style: {
        ...defaultButtonTextStyle,
        fontSize: 18,
        align: 'left',
      },
      anchor: { x: 0, y: 0.5 },
    });
    this.addChild(this.balanceValueText);

    this.openButton = new FancyButton({
      defaultView: new Sprite(assetService.getByName('btn_wallet_currency')),
      scale: getDeviceScale(),
    });
    this.addChild(this.openButton);
  }

  public init(): void {
    this.walletButton.onDown.connect(this.onWalletDown);
    this.openButton.onDown.connect(this.onOpenDown);
  }

  public destroy(): void {
    this.walletButton.onDown.disconnect(this.onWalletDown);
    this.openButton.onDown.disconnect(this.onOpenDown);

    super.destroy();
  }

  public setOpened(value: boolean, atNow = false): void {
    this.opened = value;
  }

  public isOpened(): boolean {
    return this.opened;
  }

  public resize(width: number, height: number, scale = 1): void {
    const { panelWidth, panelHeight } = walletStyle;

    this.bg
      .clear()
      .rect(this.walletButton.width - 4, 0, panelWidth, panelHeight)
      .fill(theme.walletBackgroundColor);

    this.balanceLabelText.position.set(this.walletButton.width + 10, 17);
    this.balanceValueText.position.set(
      this.balanceLabelText.x,
      this.balanceLabelText.y + 22
    );

    this.openButton.position.set(
      this.walletButton.width - 4 + panelWidth - this.openButton.width - 8,
      panelHeight - this.openButton.height - 8
    );
  }

  private onWalletDown = (): void => {
    this.emit(WalletEvent.walletClick);
  };

  private onOpenDown = (): void => {
    this.emit(WalletEvent.listClick);
  };
}
