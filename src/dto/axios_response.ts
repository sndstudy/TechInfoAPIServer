import { IQiitaResponse } from "./qiita_response";

export interface IAxiosResponse {

    data?: any;
    status?: number;
    statusText?: string;
    headers?: object;
    config?: object;
    request?: object;
    response?: any;

}
