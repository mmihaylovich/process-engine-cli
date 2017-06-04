import { CorezoidProcessItem } from './../../entity/CorezoidProcessItem';
import { ISettingsSource } from './ISettingsSource';
import { AppSettings } from '../../entity/AppSettings';
import { CorezoidApiSettings } from '../../entity/CorezoidApiSettings';
import { Tools } from '../../utils/Tools';
import { CorezoidWatchSettings } from '../../entity/CorezoidWatchSettings';

export class CommandLineSettingsSource implements ISettingsSource {

    constructor(private _configuration: any) { }

    enrich(settings: AppSettings): void {
        if (this._configuration) {
            settings.corezoidApiSettings = settings.corezoidApiSettings || new CorezoidApiSettings();
            settings.corezoidApiSettings.url = Tools.coalesce(this._configuration['api-url'], settings.corezoidApiSettings.url);
            settings.corezoidApiSettings.keyLogin = Tools.coalesce(this._configuration['api-login'], settings.corezoidApiSettings.keyLogin);
            settings.corezoidApiSettings.keySecret = Tools.coalesce(this._configuration['api-key'], settings.corezoidApiSettings.keySecret);
            settings.corezoidApiSettings.cookie = Tools.coalesce(this._configuration['api-cookie'], settings.corezoidApiSettings.cookie);
            if (this._configuration['api-auth-kind']) {
                settings.corezoidApiSettings.viaCookie = this._configuration['api-auth-kind'];
            }

            settings.corezoidWatchSettings = settings.corezoidWatchSettings || new CorezoidWatchSettings();
            settings.corezoidWatchSettings.process = settings.corezoidWatchSettings.process || new CorezoidProcessItem();

            settings.corezoidWatchSettings.interval =
                Tools.coalesce(this._configuration['refresh-interval'], settings.corezoidWatchSettings.interval);
            settings.corezoidWatchSettings.process.id =
                Tools.coalesce(this._configuration['item'], settings.corezoidWatchSettings.process.id);
            settings.corezoidWatchSettings.process.objectType =
                Tools.coalesce(this._configuration['item-kind'], settings.corezoidWatchSettings.process.objectType);
            settings.corezoidWatchSettings.workdir =
                Tools.coalesce(this._configuration['output-dir'], settings.corezoidWatchSettings.workdir);
        }
    }
}
