// @ts-nocheck

import { ScrollBox } from '@pixi/ui';

ScrollBox.prototype.isItemVisible = function (item, padding = 0) {
  let isVisible = false;
  const list = this.list;
  if (this.isVertical || this.isBidirectional) {
    const posY = item.y + list.y;
    if (posY + item.height >= -padding && posY <= this._height + padding) {
      isVisible = true;
    }
  }
  if (this.isHorizontal || this.isBidirectional) {
    const posX = item.x + list.x;
    if (posX + item.width >= -padding && posX <= this._width + padding) {
      isVisible = true;
    }
  }
  return isVisible;
};
