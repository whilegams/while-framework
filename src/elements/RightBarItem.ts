import i18next from 'i18next';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { defaultButtonTextStyle, theme } from '../consts';
import { assetService } from '../services';
import { getDeviceScale } from '../utils';

export interface RightBarItemArgs {
  id: number;
  icon: {
    on: string;
    off: string;
  };
  text: string;
}

export const RightBarItemEvent = {
  click: 'RightBarItemEvent.click',
  over: 'RightBarItemEvent.over',
  out: 'RightBarItemEvent.out',
};

export class RightBarItem extends Container {
  private readonly args: RightBarItemArgs;

  private readonly bg: Graphics;
  private readonly icon: Sprite;

  private readonly labelText: Text;

  private selected = false;

  constructor(args: RightBarItemArgs) {
    super();

    this.args = args;

    this.interactive = true;
    this.eventMode = 'dynamic';
    this.cursor = 'pointer';

    this.bg = new Graphics();
    this.bg.visible = false;
    this.addChild(this.bg);

    this.icon = new Sprite(assetService.getByName(args.icon.off));
    this.icon.scale.set(getDeviceScale());
    this.icon.anchor.set(0, 0.5);
    this.icon.x = 5;
    this.addChild(this.icon);

    this.labelText = new Text({
      text: i18next.t(args.text),
      style: {
        ...defaultButtonTextStyle,
        fontSize: 16,
        align: 'left',
      },
      anchor: { x: 0, y: 0.5 },
    });
    this.labelText.x = 40;
    this.addChild(this.labelText);

    this.on('pointerdown', this.onPointerDown);
    this.on('mouseover', this.onMouseOver);
    this.on('mouseout', this.onMouseOut);
  }

  public resize(width: number, height: number): void {
    this.bg
      .clear()
      .roundRect(0, -height / 2, width, height, 4)
      .fill(theme.rightBarItemBgColor);
  }

  public setSelected(value: boolean): void {
    this.selected = value;
    this.icon.texture = assetService.getByName(
      value ? this.args.icon.on : this.args.icon.off
    );
  }

  public isSelected(): boolean {
    return this.selected;
  }

  private onPointerDown = (): void => {
    this.emit(RightBarItemEvent.click, this.args.id);
  };

  private onMouseOver = (): void => {
    this.bg.visible = true;
    this.emit(RightBarItemEvent.over, this.args.id);
  };

  private onMouseOut = (): void => {
    this.bg.visible = false;
    this.emit(RightBarItemEvent.out, this.args.id);
  };
}
