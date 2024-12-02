import { AbstractRenderer, Application, Container, Ticker } from 'pixi.js';
import { pageService } from './PageService';
import type { Renderer } from 'pixi.js/lib/rendering/renderers/types';

export interface AppServiceOptions {
  width: number;
  height: number;
  backgroundColor: number;
}

const AppServiceOptionsDefault = {
  width: 720,
  height: 1280,
  backgroundColor: 0xd3d3d3,
};

export class AppService {
  private readonly app: Application;
  private readonly initialWidth: number;
  private readonly initialHeight: number;
  private readonly backgroundColor: number;

  private width: number;
  private height: number;
  private scale: number;

  constructor(options: AppServiceOptions = AppServiceOptionsDefault) {
    const { width, height, backgroundColor } = options;

    this.backgroundColor = backgroundColor;

    AbstractRenderer.defaultOptions.resolution = window.devicePixelRatio || 1;

    this.initialWidth = width;
    this.initialHeight = height;
    this.width = 0;
    this.height = 0;
    this.scale = 1;

    this.app = new Application();

    Ticker.shared.add(this.update, this);
    this.update(Ticker.shared);
  }

  public async init(): Promise<void> {
    await this.app.init({
      width: this.initialWidth,
      height: this.initialHeight,
      backgroundColor: this.backgroundColor,
      autoDensity: true,
      resizeTo: window,
      autoStart: true,
      eventMode: 'passive',
      eventFeatures: {
        move: true,
        /** disables the global move events which can be very expensive in large scenes */
        globalMove: false,
        click: true,
        wheel: true,
      },
      view: document.createElement('canvas'),
    });
    document.body.appendChild(this.app.canvas);

    this.app.stage.addChild(pageService);

    this.resize();
    // window.addEventListener('resize', this.resize);
  }

  public destroy(): void {
    if (this.app) {
      this.app.destroy(true);
    }
  }

  public update = (ticker: Ticker): void => {
    pageService.update(ticker.deltaTime);

    this.resize();
  };

  public resize = (now = false): void => {
    if (
      now
        ? true
        : this.width !== window.innerWidth ||
          this.height !== window.innerHeight ||
          this.width === 0 ||
          this.height === 0
    ) {
      this.width = document.body.clientWidth;
      this.height = document.body.clientHeight;

      pageService.resize(this.width, this.height, this.scale);
    }
  };

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getScale(): number {
    return this.scale;
  }

  public getApp(): Application {
    return this.app;
  }

  public getRenderer(): Renderer {
    return this.app.renderer;
  }

  public getStage(): Container {
    return this.app.stage;
  }
}

export const appService = new AppService();
