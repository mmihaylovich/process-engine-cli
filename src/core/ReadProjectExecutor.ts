import 'reflect-metadata';

import { injectable } from 'inversify';
import { ProjectAccessor } from './ProjectAccessor';
import { IExecutor } from './interfaces/IExecutor';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';


@injectable()
class ReadProjectExecutor implements IExecutor {
    execute(params: Object): void {
        const prj: ProjectAccessor = new ProjectAccessor(Observable.of(1))
    }

}


export {ReadProjectExecutor}
