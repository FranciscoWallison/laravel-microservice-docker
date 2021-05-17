import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

export default class HttpResource {

    constructor(protected http: AxiosInstance, protected resource:any){

    }
    
    list<T = any>(options?: { queryParams?: any }): Promise<AxiosResponse<T>> {
        const config: AxiosRequestConfig = {};
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

    update<T = any>(id: any, data: any): Promise<AxiosResponse<T>> {
        return this.http.put<T>(`${this.resource}/${id}`, data);
    }

    delete<T = any>(id: any): Promise<AxiosResponse<T>> {
        return this.http.delete<T>(`${this.resource}/${id}`);
    }
}