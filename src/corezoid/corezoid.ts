import * as consts from './corezoid-consts';
import { ifError } from 'assert';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ErrorResult } from '../entity/ErrorResult';
import * as config from 'config';
import * as restify from 'restify';
import * as log4js from 'log4js';
import { StringUtils } from '../utils/StringUtils';
import * as sha1 from 'sha1';

class Corezoid {
    private static logger = log4js.getLogger();
    private _interval: number
    private _url: string
    private _client: any
    private _folderId: number

    constructor() {
        this._init();
    }

    private _init(): void {
        this._url = config.get<string>('corezoid.api_url');
        this._interval = config.get<number>('corezoid.refresh_interval');
        this._folderId = config.get<number>('corezoid.folder_id');
        this._client = restify.createJsonClient({
            url: this._url
        });
    }

    /**
     * https://doc.corezoid.com/ru/api/README_v2.html
     * https://api.corezoid.com/api/2/json/{API_LOGIN}/{GMT_UNIXTIME}/{SIGNATURE}
     * {API_LOGIN} - логин авторизации
     *
     * {GMT_UNIXTIME} - время запроса, в формате unix time в секундах (epoch time), по Гринвичу (GMT+0).
     *
     * {SIGNATURE} - подпись запроса.
     * Подпись запроса Cчитается по формуле:
     *
     * hex( sha1({GMT_UNIXTIME} + {API_SECRET} + {CONTENT} + {API_SECRET}) ), где
     *
     *   `hex()` - функция, которая приводит бинарные данные к шестнадцатеричному формату
     *   `sha1()` - стандартная хеш-функция SHA-1, должна возвращать бинарные данные
     *   `{GMT_UNIXTIME}` - время запроса, в формате unix time в секундах (epoch time), по Гринвичу (GMT+0)
     *   `+` -  конкатенация текстовой строки
     *   `{API_SECRET}` - секретный ключ который выдается вместе с логином `{API_LOGIN}`
     *   `{CONTENT}` - тело запроса
     */
    private appendAuth(url: string, body: string): string {
        let result = url;
        const epoch = new Date().getTime().toString();
        const login = process.env.COREZOID_API_LOGIN;
        const secret = process.env.COREZOID_API_KEY;
        const signature = sha1(epoch + secret + body + secret);
        if (!result.endsWith('/')) {
            result = result + '/';
        }
        result = `${result}${login}/${epoch}/${signature}`;

        return result;
    }

    getFolders(): Observable<Object> {
        const subject: Subject<Object> = new Subject();
        subject.share();
        consts.CRZ_REQ_FOLDER[1].ops[0].obj_id = this._folderId;
        StringUtils.refreshRequest(consts.CRZ_REQ_FOLDER);

        const body = <string>consts.CRZ_REQ_FOLDER[2];
        Corezoid.logger.debug('Request body:' + body);

        this._client.post(this.appendAuth(consts.CRZ_API_2_URL, body)
            , consts.CRZ_REQ_FOLDER[1]
            , function (err: any, req: any, res: any, obj: any) {
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
        subject.subscribe()

        return subject;
    }
}

export { Corezoid }
