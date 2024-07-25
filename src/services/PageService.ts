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

  public async close(): Promise<void> {
    return pageService.closeModal(this);
  }

  public update(dt: number): void {}

  public resize(width: number, height: number, scale: number): void {}
}

export class Modal extends Page {}

export class PageService extends Container {
  private readonly modalList: Modal[];

  private readonly pageContainer: Container;
  private readonly modalContainer: Container;

  private currentPage: Page | undefined;

  constructor() {
    super();

    this.modalList = [];

    this.pageContainer = new Container();
    this.modalContainer = new Container();

    this.addChild(this.pageContainer);
    this.addChild(this.modalContainer);
  }

  public async setPage(pageClass: typeof Page, props?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentPage) {
        const fadedPage = this.currentPage;

        gsap.killTweensOf(fadedPage);
        gsap.to(fadedPage, 0.3, {
          alpha: 0,
          onComplete: () => {
            if (fadedPage) {
              fadedPage.destroy();
              this.pageContainer.removeChild(fadedPage);
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

      this.pageContainer.addChild(this.currentPage);

      gsap.killTweensOf(this.currentPage);
      gsap.to(this.currentPage, 0.3, { alpha: 1 });

      resolve();
    });
  }

  public async openModal(modalClass: typeof Modal, props?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const modal = new modalClass(props);
      modal.alpha = 0;
      modal.init();
      modal.resize(
        appService.getWidth(),
        appService.getHeight(),
        appService.getScale()
      );

      this.modalList.push(modal);
      this.modalContainer.addChild(modal);

      gsap.killTweensOf(modal);
      gsap.to(modal, 0.3, { alpha: 1 });

      resolve();
    });
  }

  public async closeModal(modal: Modal): Promise<void> {
    return new Promise((resolve, reject) => {
      gsap.killTweensOf(modal);
      gsap.to(modal, 0.3, {
        alpha: 0,
        onComplete: () => {
          modal.destroy();

          this.modalList.splice(this.modalList.indexOf(modal), 1);
          this.modalContainer.removeChild(modal);

          resolve();
        },
      });
    });
  }

  public resize(width: number, height: number, scale: number): void {
    if (this.currentPage) {
      this.currentPage.resize(width, height, scale);
    }
    this.modalList.forEach((modal) => modal.resize(width, height, scale));
  }

  public update(dt: number = 1): void {
    if (this.currentPage) {
      this.currentPage.update(dt);
    }
    this.modalList.forEach((modal) => modal.update(dt));
  }

  public getCurrentPage(): Page | undefined {
    return this.currentPage;
  }

  public getCurrentPageName(): string | null {
    return this.currentPage ? this.currentPage.name : null;
  }
}

export const pageService = new PageService();
