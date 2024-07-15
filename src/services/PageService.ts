import { Container } from 'pixi.js';
import gsap from 'gsap';
import { appService } from './AppService';

export class Page extends Container {
  public init(): void {
  }

  public destroy(): void {
    super.destroy({ children: true });
  }

  public resize(width: number, height: number, scale: number): void {
  }
}

export class PageService extends Container {
  private readonly pages: Map<string, Page>;
  private currentPage: Page | undefined;

  constructor() {
    super();
    this.pages = new Map<string, Page>();
  }

  public addPage(name: string, page: Page): void {
    this.pages.set(name, page);
  }

  public async setPage(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const page = this.pages.get(name);
      if (!page) {
        return reject('Page not found');
      }
      if (this.children?.includes(page)) {
        return reject('Page already added');
      }

      if (this.currentPage) {
        console.log(`PageService::setPage() - Close previous page ${name}`);

        gsap.killTweensOf(this.currentPage);
        gsap.to(this.currentPage, 0.3, {
          alpha: 0,
          onComplete: () => {
            if (this.currentPage) {
              this.currentPage.destroy();
              this.removeChild(this.currentPage);
            }
          },
        });
      }

      this.currentPage = page;
      this.currentPage.name = name;
      this.currentPage.alpha = 0;
      this.currentPage.init();
      this.currentPage.resize(
        appService.getWidth(),
        appService.getHeight(),
        appService.getScale(),
      );

      this.addChild(this.currentPage);

      gsap.killTweensOf(this.currentPage);
      gsap.to(this.currentPage, 0.3, { alpha: 1 });

      console.log(`PageService::setPage() Open new page ${name}`);

      resolve();
    });
  }

  public resize(width: number, height: number, scale: number): void {
    this.pages.forEach((page) => page.resize(width, height, scale));
  }

  public getCurrentPage(): Page | undefined {
    return this.currentPage;
  }

  public getCurrentPageName(): string | null {
    return this.currentPage ? this.currentPage.name : null;
  }
}

export const pageService = new PageService();
