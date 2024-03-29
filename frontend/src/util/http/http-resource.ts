import {AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource} from "axios";
import axios from 'axios';
import { objectToFormData } from 'object-to-formdata';

export default class HttpResource {

    private cancelList: CancelTokenSource | null = null;

    constructor(protected http: AxiosInstance, protected resource:any){

    }
    
    list<T = any>(options?: { queryParams?: any }): Promise<AxiosResponse<T>> {
        if(this.cancelList){
            this.cancelList.cancel('list cancelled');
        }
        this.cancelList = axios.CancelToken.source();
        
        const config: AxiosRequestConfig = {
            cancelToken: this.cancelList.token,
        };
        if(options && options.queryParams) {
            config.params = options.queryParams;
        }
        return this.http.get<T>(this.resource, config);
    }

    get<T = any>(id: any): Promise<AxiosResponse<T>> {
        return this.http.get<T>(`${this.resource}/${id}`);
    }

    create<T = any>(data: any): Promise<AxiosResponse<T>> {
        return this.http.post<T>(this.resource, data);
    }

    update<T = any>(id: any, data: any, options?: { http?: { usePost: boolean }, config?: AxiosRequestConfig }): Promise<AxiosResponse<T>> {
        let sendData = data;
        if (this.containsFile(data)) {
            sendData = this.getFormData(data);
        }
        const { http, config } = (options || {}) as any;
        return !options || !http || !http.usePost
            ? this.http.put<T>(`${this.resource}/${id}`, sendData, config)
            : this.http.post<T>(`${this.resource}/${id}`, sendData, config)
    }

    partialUpdate<T = any>(id: any, data, options?: { http?: { usePost: boolean }, config?: AxiosRequestConfig }): Promise<AxiosResponse<T>> {
        let sendData = data;
        if (this.containsFile(data)) {
            sendData = this.getFormData(data);
        }
        const { http, config } = (options || {}) as any;
        return !options || !http || !http.usePost
            ? this.http.patch<T>(`${this.resource}/${id}`, sendData, config)
            : this.http.post<T>(`${this.resource}/${id}`, sendData, config)
    }

    delete<T = any>(id: any): Promise<AxiosResponse<T>> {
        return this.http.delete<T>(`${this.resource}/${id}`);
    }

    deleteCollection<T = any>(queryParams: any): Promise<AxiosResponse<T>> {
        const config: AxiosRequestConfig = {};

        if (queryParams) {
            config['params'] = queryParams;
        }
        return this.http.delete<T>(`${this.resource}`, config);
    }

    isCancelledRequest(error: any){
        return axios.isCancel(error);
    }

    containsFile(data: any) {
        return Object.values(data).filter(el => el instanceof File).length !== 0;
    }

    getFormData(data: any) {
        return objectToFormData(data, { booleansAsIntegers: true });
    }
}