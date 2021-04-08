import HttpResource from "./http-resource";
import {httpVideo} from "./index";

const categoryHttp = new HttpResource(httpVideo, "categories");


// class CategoryHttp extends HttpResource{
//     //personalizar
//     list(): Promise<AxiosResponse<T>> {
//         return super.list();
//     }
// }

export default categoryHttp;