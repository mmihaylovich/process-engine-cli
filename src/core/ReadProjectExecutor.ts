import 'reflect-metadata';

import { injectable } from 'inversify';
import { ProjectAccessor } from './ProjectAccessor';
import { IExecutor } from './interfaces/IExecutor';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';


@injectable()
class ReadProjectExecutor implements IExecutor {
    execute(params: Object): void {
        const prj: ProjectAccessor = new ProjectAccessor()
        prj.collect(Observable.of(1), this._loadedData);
    }

    private _loadedData(objs: Array<any>) {
        console.log('loaded data:' + JSON.stringify(objs));
    }

}


export { ReadProjectExecutor }
