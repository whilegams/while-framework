import i18next, { type Resource } from 'i18next';
import { getQueryByName } from '../utils';

export class LocaleService {
  public async init(resources: Resource): Promise<void> {
    await i18next.init({
      lng: getQueryByName('lang') ?? 'en',
      debug: true,
      resources,
    });
  }
}

export const localeService = new LocaleService();
