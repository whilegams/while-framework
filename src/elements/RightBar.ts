import gsap from 'gsap';
import { Container, Graphics } from 'pixi.js';
import { theme } from '../consts';
import { RightBarItem, type RightBarItemArgs } from './RightBarItem';

export interface RightBarArgs {
  itemList: RightBarItemArgs[];
  opened?: boolean;
}

const rightBarStyle = {
  panelWidth: 150,
  navHeight: 55,
  navShadowHeight: 3,
  itemHeight: 36,
  itemContainer: {
    start: { x: 8, y: 0 },
    margin: { x: 0, y: 5 },
  },
} as const;

export class RightBar extends Container {
  private readonly bg: Graphics;

  private readonly itemList: RightBarItem[];
  private readonly itemContainer: Container;

  private opened = false;

  constructor(args: RightBarArgs) {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.itemList = [];
    this.itemContainer = new Container();
    this.addChild(this.itemContainer);

    args.itemList.forEach(this.addItem);

    this.setOpened(args?.opened ?? true, true);
    this.selectItem(0);
  }

  public setOpened(value: boolean, atNow = false): void {
    this.opened = value;

    gsap.killTweensOf(this);

    const toX = value ? 0 : -rightBarStyle.panelWidth;

    if (atNow) {
      this.x = toX;
    } else {
      gsap.to(this, { x: toX, duration: 0.25 });
    }
  }

  public isOpened(): boolean {
    return this.opened;
  }

  public resize(width: number, height: number, scale = 1): void {
    const {
      panelWidth,
      navHeight,
      navShadowHeight,
      itemHeight,
      itemContainer,
    } = rightBarStyle;

    this.bg
      .clear()
      .rect(0, navHeight, panelWidth, navHeight + navShadowHeight)
      .fill(theme.rightNavShadowColor)
      .rect(
        0,
        navHeight + navShadowHeight,
        panelWidth,
        height - navHeight - navShadowHeight
      )
      .fill(theme.rightBackgroundColor);

    this.itemContainer.x = itemContainer.start.x;
    this.itemContainer.y =
      itemContainer.start.y +
      navHeight +
      navShadowHeight +
      rightBarStyle.itemHeight;

    this.itemList.forEach((item, index) => {
      item.resize(panelWidth - this.itemContainer.x * 2, itemHeight);
      item.position.set(0, (itemHeight + itemContainer.margin.y) * index);
    });
  }

  private addItem = (itemArgs: RightBarItemArgs): void => {
    const item = new RightBarItem(itemArgs);

    this.itemList.push(item);
    this.itemContainer.addChild(item);
  };

  private removeItem = (item: RightBarItem): void => {
    if (this.itemList.includes(item)) {
      this.itemList.splice(this.itemList.indexOf(item), 1);
    }
    if (this.itemContainer.children.includes(item)) {
      this.itemContainer.removeChild(item);
    }
  };

  private selectItem = (index: number): void => {
    this.itemList.forEach((item) => item.setSelected(false));

    if (index >= 0 && index < this.itemList.length) {
      const item = this.itemList[index];
      item.setSelected(true);
    }
  };
}
