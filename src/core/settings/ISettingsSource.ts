import { AppSettings } from '../../entity/AppSettings';

export interface ISettingsSource {
    enrich(settings: AppSettings): void;
}

