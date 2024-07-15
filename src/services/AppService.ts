import { Application, BaseTexture, Container, IRenderer, MIPMAP_MODES } from 'pixi.js';
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

  private maxScale = 0.5;
  private scale: number;

  constructor(options: AppServiceOptions = AppServiceOptionsDefault) {
    const { width, height, backgroundColor } = options;

    this.initialWidth = width;
    this.initialHeight = height;
    this.width = width;
    this.height = height;
    this.scale = 1;

    this.app = new Application({
      width,
      height,
      backgroundColor,
      autoDensity: true,
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
  }

  public init(): void {
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    this.app.stage.addChild(pageService);

    this.resize();
    window.addEventListener('resize', this.resize);
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

  public resize = (): void => {
    const { innerWidth, innerHeight } = window;

    if (innerWidth !== this.width || innerHeight !== this.height) {
      this.width = innerWidth;
      this.height = innerHeight;

      this.scale = Math.min(
        this.maxScale,
        Math.min(
          this.width / this.initialWidth,
          this.height / this.initialWidth,
        ),
      );

      this.app.renderer.resize(this.width, this.height);
      this.app.stage.scale.set(this.scale);

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
