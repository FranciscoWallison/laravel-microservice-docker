import * as React from 'react';
import Form from "./Form/Index";
import { useParams } from 'react-router-dom';
import { Page } from "../../components/Page";
import { RouteParams } from '../../interfaces/RouteParams';

const PageForm = () => {
    const { id } = useParams<RouteParams>(); 
    return (
        <Page title={!id ? "Criar vídeo" : "Editar vídeo"}>
            <Form />
        </Page>
    );
};

export default PageForm;