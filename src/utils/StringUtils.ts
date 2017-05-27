import * as cjson from 'circular-json';

class StringUtils {
    static serializeRequest (req: any): string {
        return cjson.stringify(req);
    }
    static serializeResponse (resp: any): string {
        return cjson.stringify(resp);
    }
    static serializeError (err: any): string {
        return cjson.stringify(err);
    }
    static serializeObject (obj: any): string {
        return cjson.stringify(obj);
    }
}

export {StringUtils}
