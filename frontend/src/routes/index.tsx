import { RouteProps } from "react-router-dom";
import Dashboard from  "../pages/Dashboard";
import CategoryList from  "../pages/category/PageList";
import CastMemberList from "../pages/cast-member/PageList";
import GenreList from "../pages/genre/PageList";

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
    //categories
    {
        name: 'categorias.list',
        label: 'Listar categorias',
        path: '/categories', 
        component: CategoryList,
        exact: true
    },
    {
        name:   'categorias.create',
        label:  'Criar categoria',
        path:   '/categories/create',
        component: CategoryList,
        exact: true 
    },
    //cast-members
    {
        name: 'cast_members.list',
        label: 'Listar de membros de elencos',
        path: '/cast-members', 
        component: CastMemberList,
        exact: true
    },
    {
        name:   'cast_members.create',
        label:  'Criar membro de elenco',
        path:   '/cast-members/create',
        component: CastMemberList,
        exact: true 
    },
    //genres
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres', 
        component: GenreList,
        exact: true
    },
    {
        name:   'genres.create',
        label:  'Criar gênero',
        path:   '/genres/create',
        component: GenreList,
        exact: true 
    }
];

export default routes;