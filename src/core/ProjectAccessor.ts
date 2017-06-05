import { CorezoidProcessItem } from './../entity/CorezoidProcessItem';
import { Observable } from 'rxjs/Rx';
import { Corezoid } from '../corezoid/corezoid';
import * as log4js from 'log4js';
import { CorezoidApiSettings } from '../entity/CorezoidApiSettings';
import { cloneDeep } from 'lodash';

export class ProjectAccessor {
    private static logger = log4js.getLogger();
    private _objects: Array<any> = [];

    constructor(private _config: CorezoidApiSettings
        , private _item: CorezoidProcessItem) { };

    public collect(obs: Observable<Object>, callback: Function, cb_owner: any) {
        this._objects = [];
        const that = this;
        obs.subscribe(
            (value) => {
                const corezoid = new Corezoid(that._config);
                corezoid.getBody(that._item.id, that._item.objectType).subscribe(
                    (s: any) => {
                        that._objects.push(s);
                        ProjectAccessor.logger.info('PREPARED:' + JSON.stringify(s));
                    },
                    (error) => { console.error(error) },
                    () => {
                        const res = cloneDeep(this._objects);
                        this._objects = [];
                        callback(res, cb_owner);
                    }
                );
            },
            (error) => { console.error(error) },
        )
    }

    public getObjects() {
        return this._objects
    }

}
