import 'reflect-metadata';
import { IExecutor } from './interfaces/IExecutor';
import { injectable } from 'inversify';
import { IConfigurationSelector } from './interfaces/IConfigurationSelector';
import * as fs from 'fs-extra';

@injectable()
export class InitProjectExecutor implements IExecutor, IConfigurationSelector {

    getConfigurationSelector(): string {
        return '';
    }
    getCommand(): string {
        return 'init';
    }

    execute(params: Object): void {
        const envBody =
`COREZOID_API_LOGIN=
COREZOID_API_KEY=
COREZOID_USER_COOKIE=
`
        const crzconfigBody =
`{
    "api_url": "https://admin.corezoid.com/",
    "auth_with_api_key": true,
    "watch": {
        "refresh_interval": 60,
        "object_id": 0,
        "object_type": "folder",
        "workdir": "C:/Projects/"
    }
}
`
        fs.writeFileSync('./.env', envBody);
        fs.writeFileSync('./crzconfig.json', crzconfigBody);
    }

}
