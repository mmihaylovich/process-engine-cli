import { CorezoidProcessItem } from './../../entity/CorezoidProcessItem';
import { ISettingsSource } from './ISettingsSource';
import { AppSettings } from '../../entity/AppSettings';
import { CorezoidApiSettings } from '../../entity/CorezoidApiSettings';
import { CorezoidWatchSettings } from '../../entity/CorezoidWatchSettings';
import { Tools } from '../../utils/Tools';

export class ConfigFileSettingsSource implements ISettingsSource {

    constructor(private _configuration: any) { }

    enrich(settings: AppSettings): void {
        if (this._configuration) {
            settings.corezoidApiSettings = settings.corezoidApiSettings || new CorezoidApiSettings();
            settings.corezoidApiSettings.url = Tools.coalesce(this._configuration.api_url, settings.corezoidApiSettings.url);
            settings.corezoidApiSettings.keyLogin = Tools.coalesce(this._configuration.api_login, settings.corezoidApiSettings.keyLogin);
            settings.corezoidApiSettings.keySecret = Tools.coalesce(this._configuration.api_key, settings.corezoidApiSettings.keySecret);
            settings.corezoidApiSettings.cookie = Tools.coalesce(this._configuration.api_cookie, settings.corezoidApiSettings.cookie);
            settings.corezoidApiSettings.viaCookie =
                Tools.coalesce(!this._configuration.auth_with_api_key, settings.corezoidApiSettings.viaCookie);

            settings.corezoidWatchSettings = settings.corezoidWatchSettings || new CorezoidWatchSettings();
            settings.corezoidWatchSettings.process = settings.corezoidWatchSettings.process || new CorezoidProcessItem();
            if (this._configuration.watch) {
                settings.corezoidWatchSettings.interval =
                    Tools.coalesce(this._configuration.watch.refresh_interval, settings.corezoidWatchSettings.interval);
                settings.corezoidWatchSettings.process.id =
                    Tools.coalesce(this._configuration.watch.object_id, settings.corezoidWatchSettings.process.id);
                settings.corezoidWatchSettings.process.objectType =
                    Tools.coalesce(this._configuration.watch.object_type, settings.corezoidWatchSettings.process.objectType);
                settings.corezoidWatchSettings.workdir =
                    Tools.coalesce(this._configuration.watch.workdir, settings.corezoidWatchSettings.workdir);
                settings.corezoidWatchSettings.staticFolders=
                    Tools.coalesce(this._configuration.watch.staticFolders, settings.corezoidWatchSettings.staticFolders);
            }
        }
    }

}
