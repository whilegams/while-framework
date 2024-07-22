import { Container } from 'pixi.js';
import gsap from 'gsap';
import { appService } from './AppService';

export class Page extends Container {
  constructor(protected readonly props?: any) {
    super();
  }

  public init(): void {}

  public destroy(): void {
    super.destroy({ children: true });
  }

  public update(dt: number): void {}

  public resize(width: number, height: number, scale: number): void {}
}

export class PageService extends Container {
  private currentPage: Page | undefined;

  constructor() {
    super();
  }

  public async setPage(pageClass: typeof Page, props?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentPage) {
        console.log(`PageService::setPage() - Close previous page ${name}`);

        const fadedPage = this.currentPage;

        gsap.killTweensOf(fadedPage);
        gsap.to(fadedPage, 0.3, {
          alpha: 0,
          onComplete: () => {
            if (fadedPage) {
              fadedPage.destroy();
              this.removeChild(fadedPage);
            }
          },
        });
      }

      this.currentPage = new pageClass(props);
      this.currentPage.alpha = 0;
      this.currentPage.init();
      this.currentPage.resize(
        appService.getWidth(),
        appService.getHeight(),
        appService.getScale()
      );

      this.addChild(this.currentPage);

      gsap.killTweensOf(this.currentPage);
      gsap.to(this.currentPage, 0.3, { alpha: 1 });

      console.log(`PageService::setPage() Open new page ${name}`);

      resolve();
    });
  }

  public resize(width: number, height: number, scale: number): void {
    if (this.currentPage) {
      this.currentPage.resize(width, height, scale);
    }
  }

  public update(dt: number = 1): void {
    if (this.currentPage) {
      this.currentPage.update(dt);
    }
  }

  public getCurrentPage(): Page | undefined {
    return this.currentPage;
  }

  public getCurrentPageName(): string | null {
    return this.currentPage ? this.currentPage.name : null;
  }
}

export const pageService = new PageService();
