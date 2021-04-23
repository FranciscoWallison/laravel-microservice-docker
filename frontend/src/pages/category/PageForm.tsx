import * as React from 'react';
import {Form} from "./Form";
import {Page} from "../../components/Page";
import { useParams } from 'react-router-dom';
import { RouteParams } from '../../interfaces/RouteParams';

const PageForm = () => {
    const { id } = useParams<RouteParams>(); 
    return (
        <Page title={!id ? 'Criar categoria' : 'Editar categoria'}>
            <Form/>
        </Page>
    );
};

export default PageForm;