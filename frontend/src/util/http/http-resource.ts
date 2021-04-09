import {AxiosInstance} from "axios";

export default class HttpResource {

    constructor(protected http: AxiosInstance, protected resource:any){

    }
    
    list<T>() {
        return this.http.get<T>(this.resource);
    }

    get() {

    }

    create() {

    }

    delete() {

    }
}