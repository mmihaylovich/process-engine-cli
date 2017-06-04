import { CorezoidProcessItem } from './CorezoidProcessItem';
import { CorezoidApiSettings } from './CorezoidApiSettings';

class CorezoidWatchSettings {

    /**
     * settings for access to project
     */
    api: CorezoidApiSettings;

    /**
     * link to process or folder of processes
     */
    process: CorezoidProcessItem;

    /**
     * interval for refresh project in sec.
     */
    interval: number;

    /**
     * working directory
     */
    workdir: string;

}
export {CorezoidWatchSettings}
