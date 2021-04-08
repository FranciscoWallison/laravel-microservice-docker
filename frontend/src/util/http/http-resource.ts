import {AxiosInstance} from "axios";

export default class HttpResource {

    constructor(protected http: AxiosInstance, protected resource:any){

    }
    
    list() {
        return this.http.get(this.resource);
    }

    get() {

    }

    create() {

    }

    delete() {

    }
}