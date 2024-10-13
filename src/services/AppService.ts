import {
  Application,
  BaseTexture,
  Container,
  IRenderer,
  MIPMAP_MODES,
  settings,
} from 'pixi.js';
import { pageService } from './PageService';

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

  private width: number;
  private height: number;
  private scale: number;

  constructor(options: AppServiceOptions = AppServiceOptionsDefault) {
    const { width, height, backgroundColor } = options;

    if (settings.RENDER_OPTIONS) {
      settings.RENDER_OPTIONS.hello = false;
    }

    settings.RESOLUTION = window.devicePixelRatio || 1;

    this.initialWidth = width;
    this.initialHeight = height;
    this.width = 0;
    this.height = 0;
    this.scale = 1;

    this.app = new Application({
      backgroundColor,
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
    });

    this.app.ticker.add(this.update, this);
    this.update();
  }

  public init(): void {
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    this.app.stage.addChild(pageService);

    this.resize();
    // window.addEventListener('resize', this.resize);
  }

  public setPixelArtMode(value: boolean): void {
    BaseTexture.defaultOptions.mipmap = value
      ? MIPMAP_MODES.OFF
      : MIPMAP_MODES.ON;
  }

  public destroy(): void {
    if (this.app) {
      this.app.destroy(true);
    }
  }

  public update = (dt: number = 1): void => {
    pageService.update(dt);

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

  public getRenderer(): IRenderer {
    return this.app.renderer;
  }

  public getStage(): Container {
    return this.app.stage;
  }
}

export const appService = new AppService();
