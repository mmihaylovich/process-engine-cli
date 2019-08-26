import { ValidationResult } from './ValidationResult';
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

    /**
     * array of folder that will not be deleted during synchronize corezoid process
     */
    staticFolders: Array<string>;

    isValid(): ValidationResult {
        const result = new ValidationResult();
        if (!this.api) {
            result.messages.push('Api setting undefined');
        } else {
            if (!this.api.url) {
                result.messages.push('Api url is undefined');
            }
            if (this.api.viaCookie) {
                if (!this.api.cookie) {
                    result.messages.push('Api auth cookie is undefined');
                }
            } else {
                if (!this.api.keyLogin) {
                    result.messages.push('Api login is undefined');
                }
                if (!this.api.keySecret) {
                    result.messages.push('Api key (secret) is undefined');
                }
            }
        }
        if (!this.process) {
            result.messages.push('Process for watch is undefined');
        } else {
            if (!this.process.id) {
                result.messages.push('Process id for watch is undefined');
            }
            if (!this.process.objectType) {
                result.messages.push('Process type for watch is undefined');
            }
        }
        if (!this.interval) {
            result.messages.push('Interval for watch is undefined');
        }
        if (!this.workdir) {
            result.messages.push('Working directory is undefined');
        }
        result.valid = result.messages.length === 0;
        return result;
    }
}
export {CorezoidWatchSettings}
