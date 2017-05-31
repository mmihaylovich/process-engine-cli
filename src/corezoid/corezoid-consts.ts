import { StringUtils } from '../utils/StringUtils';

export const CRZ_API_1_URL = '/api/1/json/'
export const CRZ_API_2_URL = '/api/2/json/'
export const CRZ_API_2_URL_DOWNLOAD = '/api/2/download/'

export let CRZ_REQ_FOLDER_BRANCH: [string, any, string] = [undefined, undefined, undefined];
CRZ_REQ_FOLDER_BRANCH[0] =
    `{"ops":[{"obj_id":0,"type":"list","obj":"folder_branch"}]}`;
StringUtils.refreshRequest(CRZ_REQ_FOLDER_BRANCH);

export let CRZ_REQ_FOLDER: [string, any, string] = [undefined, undefined, undefined];
CRZ_REQ_FOLDER[0] =
`{"ops":[{"obj_id":0,"sort":"date","order":"asc","company_id":null,"filter":"conv","type":"list","obj":"folder","obj_type":0}]}`
StringUtils.refreshRequest(CRZ_REQ_FOLDER);

export let CRZ_REQ_SCHEME: [string, any, string] = [undefined, undefined, undefined];
CRZ_REQ_SCHEME[0] =
`{"ops":[{"obj":"obj_scheme","obj_id":0,"obj_type":"conv","company_id":null,"async":false}]}`
StringUtils.refreshRequest(CRZ_REQ_SCHEME);

export let CRZ_REQ_SCHEME2: [string, any, string] = [undefined, undefined, undefined];
CRZ_REQ_SCHEME2[0] =
`{
  "ops": [
    {
      "type": "get",
      "obj": "obj_scheme",
      "obj_id":0,
      "obj_type": "conv",
      "async": false
    }
  ]
}`
StringUtils.refreshRequest(CRZ_REQ_SCHEME2);
