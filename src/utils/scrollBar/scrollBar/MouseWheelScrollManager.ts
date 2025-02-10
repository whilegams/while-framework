import { EventEmitter } from 'pixi.js';
import { ScrollBarView } from './ScrollBarView';
import { ScrollBarEventTypes } from './ScrollBarEvent';
import { SliderViewUtil } from '../SliderViewUtil';
import { ScrollBarViewUtil } from './ScrollBarViewUtil';

/**
 * ScrollBarViewを受け取り、マウスホイールによる操作を行うクラス
 */
export class MouseWheelScrollManager extends EventEmitter<ScrollBarEventTypes> {
  public delta = 16;
  protected scrollBarView: ScrollBarView;
  private _isStart = false;

  constructor(scrollBarView: ScrollBarView) {
    super();
    this.scrollBarView = scrollBarView;

    const target = this.scrollBarView.contents.target;
    target.eventMode = 'static';

    this.start();
  }

  public start(): void {
    if (this._isStart) return;
    const target = this.scrollBarView.contents.target;
    target.on('wheel', this.wheelHandler);
    this._isStart = true;
  }

  public stop(): void {
    const target = this.scrollBarView.contents.target;
    target.off('wheel', this.wheelHandler);
    this._isStart = false;
  }

  //TODO add support deltaX / deltaY
  private wheelHandler = (e: WheelEvent) => {
    const shift = e.deltaY > 0 ? -this.delta : this.delta;
    this.scroll(shift);
  };

  private scroll(delta: number): void {
    const target = this.scrollBarView.contents.target;
    const mask = this.scrollBarView.contents.mask;
    const isHorizontal = this.scrollBarView.isHorizontal;

    const pos = SliderViewUtil.getPosition(target, isHorizontal) + delta;
    ScrollBarViewUtil.clampTargetPosition(target, mask, pos, isHorizontal);

    this.emit('update_target_position');
    this.scrollBarView.scrollBarEventEmitter.emit('stop_inertial_tween');
  }
}
