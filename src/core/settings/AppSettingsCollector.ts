import { CommandLineSettingsSource } from './CommandLineSettingsSource';
import { ConfigFileSettingsSource } from './ConfigFileSettingsSource';
import { EnvVarSettingsSource } from './EnvVarSettingsSource';
import { ISettingsSource } from './ISettingsSource';
import * as fs from 'fs';
import * as cli from 'cli';
import { Tools } from '../../utils/Tools';
import { AppSettings } from '../../entity/AppSettings';
import * as log4js from 'log4js';

interface CliOptions { [long: string]: { 0: string | boolean, 1: string, 2?: string, 3?: any } }
type CliCommands = { [name: string]: string } | string[];

export class AppSettingsCollector {
    private static logger = log4js.getLogger();

    private static args: CliOptions = {
        config: ['c', 'Config file', 'file', 'crzconfig.json'],
        item: ['i', 'Process item', 'int', null],
        'item-kind': ['ik', 'Process item kind (folder | conv | dashboard)', 'string', 'folder'],
        'output-dir': ['od', 'Output directory', 'string', null],
        'api-url': ['au', 'Api url', 'string', null],
        'api-login': ['al', 'Api login', 'string', null],
        'api-key': ['ak', 'Api key', 'string', null],
        'api-auth-kind': ['aa', 'Api auth kind (api-key | cookie)', 'string', null],
        'api-cookie': ['ac', 'Api cookie', 'string', null],
        'refresh-interval': ['ri', 'Refresh interval in seconds', 'int', null]
    }

    private static commands: CliCommands = ['watch'];

    static collectSettings(): AppSettings {
        const dotenv = require('dotenv');
        const c = dotenv.config();
        (<any>cli).option_width = 40;
        (<any>cli).width = 80;
        cli.enable('version');
        cli.setApp('crz', '1.0.0')
        const options = cli.parse(AppSettingsCollector.args, AppSettingsCollector.commands);
        let configBody: any = null;
        if (fs.existsSync(options.config)) {
            configBody = JSON.parse(fs.readFileSync(options.config).toString());
        }

        const result = new AppSettings();

        const srs: Array<ISettingsSource> =
            [new EnvVarSettingsSource(),
            new ConfigFileSettingsSource(configBody),
            new CommandLineSettingsSource(options)]

        srs.forEach(it => it.enrich(result));
        result.exec = { command: cli.command };

        result.corezoidWatchSettings.api = result.corezoidApiSettings;

        AppSettingsCollector.logger.debug(JSON.stringify(result, null, 2));

        return result;
    }

}
