import * as consts from './corezoid-consts';
import {ifError } from 'assert';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ErrorResult} from '../entity/ErrorResult';
import * as config from 'config';
import * as restify from 'restify';
import * as log4js from 'log4js';
import {StringUtils} from '../utils/StringUtils';

class Corezoid {
    private static logger =  log4js.getLogger();
    private _interval: number
    private _url: string
    private _client: any

    constructor() {
        this._init();
    }

    private _init(): void {
        this._url = config.get<string>('corezoid.api_url');
        this._interval = config.get<number>('corezoid.refresh_interval');
        this._client = restify.createJsonClient({
                url : this._url
            });
    }

    getFolders():  Observable<Object> {
        const subject: Subject<Object> = new Subject();
        this._client.post(consts.CRZ_API_2_URL, function (err: any, req: any, res: any, obj: any) {
            if (err) {
                subject.error(new ErrorResult('ERAPI', err.message));
            } else {
                subject.next(obj);
                subject.complete();
            }
                        Corezoid.logger.debug(
`
======== BEGIN ============
======== ERROR ============
${StringUtils.serializeError(err)}
======== REQUEST ==========
${StringUtils.serializeRequest(req)}
======== RESPONSE =========
${StringUtils.serializeResponse(res)}
======== OBJECT ===========
${StringUtils.serializeObject(obj)}
======== END ==============
`
            );
        });
        return subject;
    }
}

export {Corezoid}
