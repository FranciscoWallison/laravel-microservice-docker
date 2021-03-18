import { RouteProps } from "react-router-dom";
import Dashboard from  "../pages/Dashboard";
import CategoryList from  "../pages/category/PageList";

export interface MyRouteProps extends RouteProps{
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categorias.list',
        label: 'Listar categorias',
        path: '/categories', //categories
        component: CategoryList,
        exact: true
    },
    {
        name:   'categorias.create',
        label:  'Criar categoria',
        path:   '/categories/create',
        component: CategoryList,
        exact: true 
    }
];

export default routes;