import { FancyButton } from '@pixi/ui';
import { GameConfig, theme } from 'consts';

import { Container, Graphics, Sprite } from 'pixi.js';
import { assetService } from 'services';
import { currencyType } from 'types';
import { getDeviceScale } from 'utils';

import { RightBar } from './RightBar';
import { Wallet, WalletEvent } from './Wallet';
import { WalletList } from './WalletList';

export class NavBar extends Container {
  private readonly bg: Graphics;

  private readonly profileButton: FancyButton;
  private readonly rightBar: RightBar;
  private readonly wallet: Wallet;
  private readonly walletList: WalletList;

  private readonly menuButton: Sprite;
  private readonly logoButton: FancyButton;

  constructor(gamesJson: GameConfig) {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.profileButton = new FancyButton({
      defaultView: new Sprite(assetService.getByName('btn_profile')),
      anchorX: 0.5,
      anchorY: 0.5,
      scale: getDeviceScale(),
    });
    this.addChild(this.profileButton);

    this.rightBar = new RightBar({
      itemList: gamesJson.map((o) => ({
        ...o.rightBar,
        id: o.id,
      })),
      opened: false,
    });
    this.addChild(this.rightBar);

    this.menuButton = new Sprite(assetService.getByName('btn_menu_off'));
    this.menuButton.anchor.set(0.5);
    this.menuButton.scale.set(getDeviceScale());
    this.menuButton.interactive = true;
    this.menuButton.cursor = 'pointer';
    this.addChild(this.menuButton);

    this.logoButton = new FancyButton({
      defaultView: new Sprite(assetService.getByName('favicon')),
      anchorX: 0.5,
      anchorY: 0.5,
      scale: getDeviceScale(),
    });
    this.addChild(this.logoButton);

    this.wallet = new Wallet({ currentCurrency: currencyType.ton });
    this.addChild(this.wallet);

    this.walletList = new WalletList({
      currencies: [
        {
          value: 999,
          type: currencyType.ton,
          icon: 'currency/default',
        },
        {
          value: 999,
          type: currencyType.usd,
          icon: 'currency/default',
        },
        {
          value: 999,
          type: currencyType.rub,
          icon: 'currency/default',
        },
      ],
    });
    this.walletList.visible = false;
    this.addChild(this.walletList);
  }

  public init(): void {
    this.wallet.init();
    this.wallet.on(WalletEvent.walletClick, this.onWalletClick);
    this.wallet.on(WalletEvent.listClick, this.onWalletListClick);

    this.menuButton.on('pointerdown', this.onMenuDown);
  }

  public destroy(): void {
    this.wallet.destroy();
    this.wallet.off(WalletEvent.walletClick, this.onWalletClick);
    this.wallet.off(WalletEvent.listClick, this.onWalletListClick);

    this.menuButton.off('pointerdown', this.onMenuDown);

    super.destroy();
  }

  public resize(width: number, height: number, scale = 1): void {
    const bgHeight = 55;

    this.rightBar.resize(width, height, scale);
    this.wallet.resize(width, height, scale);
    this.walletList.resize(this.wallet.width, this.wallet.width * 1.5, scale);

    this.bg
      .clear()
      .rect(0, 0, bgHeight, bgHeight)
      .fill(theme.navMenuBackgroundColor)
      .rect(bgHeight, 0, width - bgHeight, bgHeight) //Math.max(minHeight, Math.min(maxHeight, height * 0.1)))
      .fill(theme.navBackgroundColor);

    this.profileButton.x = width - this.profileButton.width / 2 - 20;
    this.profileButton.y = bgHeight / 2;

    this.menuButton.x = bgHeight / 2;
    this.menuButton.y = bgHeight / 2;

    this.logoButton.x =
      this.menuButton.x +
      this.menuButton.width / 2 +
      this.logoButton.width / 2 +
      20;
    this.logoButton.y = bgHeight / 2;

    this.wallet.x = this.logoButton.x + this.logoButton.width + 25;
    this.walletList.position.set(
      this.wallet.x,
      this.wallet.y + this.wallet.height + 10
    );
  }

  private onMenuDown = (): void => {
    this.rightBar.setOpened(!this.rightBar.isOpened());
    this.menuButton.texture = assetService.getByName(
      this.rightBar.isOpened() ? 'btn_menu_on' : 'btn_menu_off'
    );
  };

  private onWalletListClick = (): void => {
    this.walletList.visible = !this.walletList.visible;
  };

  private onWalletClick = (): void => {};
}
