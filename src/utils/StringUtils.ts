import * as cjson from 'circular-json';

class StringUtils {
    static serializeRequest(req: any): string {
        return cjson.stringify(req);
    }
    static serializeResponse(resp: any): string {
        return cjson.stringify(resp);
    }
    static serializeError(err: any): string {
        return cjson.stringify(err);
    }
    static serializeObject(obj: any): string {
        return JSON.stringify(obj);
    }
    static refreshRequest(reqBody: [string, any, string]): void {
        if (reqBody[1] === undefined) {
            reqBody[1] = JSON.parse(reqBody[0]);
        }
        reqBody[2] = JSON.stringify(reqBody[1]);
    }
}

export { StringUtils }
