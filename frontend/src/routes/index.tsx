import { RouteProps } from "react-router-dom";
import Dashboard from  "../pages/Dashboard";
import CategoryList from  "../pages/category/PageList";
import CategoryForm from  "../pages/category/PageForm";
import CastMemberList from "../pages/cast-member/PageList";
import CastMemberForm from "../pages/cast-member/PageForm";
import GenreList from "../pages/genre/PageList";
import GenreForm from "../pages/genre/PageForm";

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
        component: CategoryForm,
        exact: true 
    },
    {
        name:   'categorias.edit',
        label:  'Editar categoria',
        path:   '/categories/:id/edit',
        component: CategoryForm,
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
        component: CastMemberForm,
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
        component: GenreForm,
        exact: true 
    }
];

export default routes;