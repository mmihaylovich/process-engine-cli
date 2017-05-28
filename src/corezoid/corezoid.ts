import * as consts from './corezoid-consts';
import { ifError } from 'assert';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
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
            url: this._url,
            headers: { 'Cookie': process.env.COREZOID_API_COOKIES }
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

    private appendAuthDownload(url: string, body: string): string {
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

    private logHttp(err: any, req: any, res: any, obj: any, reqBody: any): void {
        Corezoid.logger.debug(
            `
======== BEGIN ============
${reqBody}
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
    }

    getFolders2(): Observable<any> {
        return this.expanddir(this._folderId);
    }

    getBody(object_id: number, object_type: string): Observable<any> {
        const subject: Subject<any> = new Subject();
        const that = this;

        consts.CRZ_REQ_SCHEME[1].ops[0].obj_type = object_type;
        consts.CRZ_REQ_SCHEME[1].ops[0].obj_id = object_id;
        StringUtils.refreshRequest(consts.CRZ_REQ_SCHEME);

        const body = <string>consts.CRZ_REQ_SCHEME[2];
        Corezoid.logger.debug('Request body:' + body);

        this._client.post(consts.CRZ_API_2_URL_DOWNLOAD
            , consts.CRZ_REQ_SCHEME[1]
            , function (err: any, req: any, res: any, obj: any) {
                if (err) {
                    subject.error(new ErrorResult('ERAPI', err.message));
                } else {
                    subject.next(obj);
                    subject.complete();
                }
                that.logHttp(err, req, res, obj, body);
            });


        return subject;
    }

    getFolders(): Observable<Object> {
        const that = this;
        const subject: Subject<Object> = new Subject();

        consts.CRZ_REQ_FOLDER[1].ops[0].obj_id = this._folderId;
        StringUtils.refreshRequest(consts.CRZ_REQ_FOLDER);

        const body = <string>consts.CRZ_REQ_FOLDER[2];
        Corezoid.logger.debug('Request body:' + body);

        this._client.post(consts.CRZ_API_2_URL
            , consts.CRZ_REQ_FOLDER[1]
            , function (err: any, req: any, res: any, obj: any) {
                if (err) {
                    subject.error(new ErrorResult('ERAPI', err.message));
                } else {
                    subject.next(obj);
                    subject.complete();
                }
                that.logHttp(err, req, res, obj, body);
            });

        return subject;
    }


    //
    // Asynchronously reads the files in the directory and emits an Array of dir + filename.
    //
    private readdir(folder: number): Observable<any> {
        const that = this;
        return Observable.create(function (observer: Observer<any>) {
            /*fs.readdir(dir, function cb(e, files) {
                if (e) return observer.onError(e);
                observer.onNext(files.map(function (file) {
                    return dir + file;
                }));
                observer.onCompleted();
            });*/
            // проставим интересующий нас id в шаблон запроса
            consts.CRZ_REQ_FOLDER[1].ops[0].obj_id = folder;
            // обновим отправляемое тело запроса
            StringUtils.refreshRequest(consts.CRZ_REQ_FOLDER);
            const body = <string>consts.CRZ_REQ_FOLDER[2];
            Corezoid.logger.debug('Request body:' + body);

            that._client.post(that.appendAuth(consts.CRZ_API_2_URL, body)
                , consts.CRZ_REQ_FOLDER[1]
                , function (err: any, req: any, res: any, obj: any) {
                    that.logHttp(err, req, res, obj, body);
                    if (err) {
                        return observer.error(err);
                    }

                    observer.next(obj.ops[0].list.map(
                        function (item: any) {
                            return {
                                obj_type: item.obj_type
                                , obj_id: item.obj_id
                                , title: item.title
                                , parent_obj_id: obj.ops[0].obj_id
                            };
                        })
                    );
                    observer.complete();
                });

        });
    };

    //
    // Asynchronously list the file stats of a directory.
    //
    private ls(folder: number): Observable<any> {
        const that = this;
        return this.readdir(folder).flatMap(function (files: any) {
            return Observable.from(files).flatMap( (files2: any) => that.enrich(files2));
        });
    }

    private enrich(item: any) {
        const that = this;
        return Observable.create(function (observer: any) {
            if (item.obj_type === 'folder') {
                observer.next(item);
                observer.complete();
            } else {
                consts.CRZ_REQ_SCHEME[1].ops[0].obj_type = item.obj_type;
                consts.CRZ_REQ_SCHEME[1].ops[0].obj_id = item.obj_id;
                StringUtils.refreshRequest(consts.CRZ_REQ_SCHEME);

                const body = <string>consts.CRZ_REQ_SCHEME[2];
                Corezoid.logger.debug('Request body:' + body);

                that._client.post(consts.CRZ_API_2_URL_DOWNLOAD
                    , consts.CRZ_REQ_SCHEME[1]
                    , function (err: any, req: any, res: any, obj: any) {
                        if (err) {
                            observer.error(new ErrorResult('ERAPI', err.message));
                        } else {
                            item.body = obj;
                            observer.next(item);
                            observer.complete();
                        }
                        that.logHttp(err, req, res, obj, body);
                    });
            }
        });
    };

    private expanddir(folder: number): Observable<any> {
        const that = this;
        return that.ls(folder)
            .expand(function (x: any) {
                return x.obj_type !== 'folder' ?
                    Observable.empty() :
                    that.ls(x.obj_id)
            })
    }
};

export { Corezoid }
