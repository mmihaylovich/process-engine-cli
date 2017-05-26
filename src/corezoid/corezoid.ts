import { CRZ_API_2_BASE_URL } from './corezoid-consts';
import {ifError } from "assert";

class Corezoid {

    private interval: number = 25

    private client = require('restify').createJsonClient({ url: CRZ_API_2_BASE_URL });


    private getFoldersRequest = `{
    "ops": [{
        "obj_id": 0,
        "sort": "date",
        "order": "asc",
        "filter": "conv",
        "type": "list",
        "obj": "folder",
        "obj_type": 0
    }]
}`
    
    getFolders(): any {
        this.client.get('/', function (err: any, req: any, res: any, obj : any) {
            assert.ifError(err);
            console.log(JSON.stringify(obj, null, 2));
        });
    }

}