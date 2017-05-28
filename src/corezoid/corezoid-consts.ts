import { StringUtils } from '../utils/StringUtils';

export const CRZ_API_1_URL = '/api/1/json/'
export const CRZ_API_2_URL = '/api/2/json/'

export let CRZ_REQ_FOLDER_BRANCH: [string, any, string] = [undefined, undefined, undefined];
CRZ_REQ_FOLDER_BRANCH[0] =
    `{"ops":[{"obj_id":0,"type":"list","obj":"folder_branch"}]}`;
StringUtils.refreshRequest(CRZ_REQ_FOLDER_BRANCH);

export let CRZ_REQ_FOLDER: [string, any, string] = [undefined, undefined, undefined];
CRZ_REQ_FOLDER[0] =
`{"ops":[{"obj_id":0,"sort":"date","order":"asc","company_id":null,"filter":"conv","type":"list","obj":"folder","obj_type":0}]}`
StringUtils.refreshRequest(CRZ_REQ_FOLDER);
