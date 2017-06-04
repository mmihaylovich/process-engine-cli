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

    static args: CliOptions = {
        config: ['c', 'Config file', 'file', 'crzconfig.json'],
        item: ['i', 'Process item', 'int', null],
        'output-dir': ['od', 'Output directory', 'string', null],
        'api-url': ['au', 'Api url', 'string', null],
        'api-login': ['al', 'Api login', 'string', null],
        'api-key': ['ak', 'Api key', 'string', null],
        'api-auth-kind': ['aa', 'Api auth kind', 'string', 'api-key'],
        'api-cookie': ['ac', 'Api cookie', 'string', null],
        'refresh-interval': ['ri', 'Refresh interval in seconds', 'int', null]
    }

    static commands: CliCommands = ['watch'];

    static collectSettings(): AppSettings {
        const dotenv = require('dotenv');
        const c = dotenv.config();
        cli.enable('version');
        cli.setApp('corezoid-cli', '1.0.0')
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

        AppSettingsCollector.logger.debug(JSON.stringify(result, null, 2));

        return result;
    }

}
