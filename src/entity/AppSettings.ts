
import { CorezoidApiSettings } from './CorezoidApiSettings';
import { CorezoidWatchSettings } from './CorezoidWatchSettings';

export class AppSettings {
    corezoidApiSettings = new CorezoidApiSettings();
    corezoidWatchSettings = new CorezoidWatchSettings();
    exec: {command: string};
}
