import { ISettingsSource } from './ISettingsSource';
import { AppSettings } from "../../entity/AppSettings";
import { CorezoidApiSettings } from "../../entity/CorezoidApiSettings";
import { Tools } from "../../utils/Tools";

export class EnvVarSettingsSource implements ISettingsSource {

    enrich(settings: AppSettings): void {
        settings.corezoidApiSettings = settings.corezoidApiSettings || new CorezoidApiSettings();
        settings.corezoidApiSettings.keyLogin = Tools.coalesce(process.env.COREZOID_API_LOGIN, settings.corezoidApiSettings.keyLogin);
        settings.corezoidApiSettings.keySecret = Tools.coalesce(process.env.COREZOID_API_KEY, settings.corezoidApiSettings.keySecret);
        settings.corezoidApiSettings.cookie = Tools.coalesce(process.env.COREZOID_USER_COOKIE, settings.corezoidApiSettings.cookie);
    }

}
