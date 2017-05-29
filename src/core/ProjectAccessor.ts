import { Observable } from 'rxjs/Rx';
import { Corezoid } from '../corezoid/corezoid';
import * as log4js from 'log4js';

export class ProjectAccessor {
    private static logger = log4js.getLogger();
    private _objects: Array<any> = [];

    public collect(obs: Observable<Object>, callback: Function) {
        this._objects = [];
        const that = this;
        obs.subscribe(
            (value) => {
                const corezoid = new Corezoid();
                corezoid.getFolders2().subscribe(
                    (s: any) => {
                        that._objects.push(s);
                        ProjectAccessor.logger.info('PREPARED:' + JSON.stringify(s));
                    },
                    (error) => { console.error(error) },
                    () => { callback(that._objects) }
                );
            },
            (error) => { console.error(error) },
        )
    }

    public getObjects() {
        return this._objects
    }

}
