// @flow 
import  MUIDataTable,  { MUIDataTableColumn } from 'mui-datatables';
import { count } from 'node:console';
import * as React from 'react';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:  "name",
        label: "Nome",
    },
    {
        name:  "is_active",
        label: "Ativo?"
    },
    {
        name:  "created_at",
        label: "Criado em"
    }
]

const data = [
    {name: "teste1", is_active: true, created_at: "2021-03-22" },
    {name: "teste2", is_active: false, created_at: "2021-03-22" },
    {name: "teste3", is_active: true, created_at: "2021-03-22" },
    {name: "teste4", is_active: false, created_at: "2021-03-22" },
]

type Props = {};
const Table = (props: Props) => {

    const [count, setCount] = React.useState(0);

    React.useEffect( () => {
        console.log('qualquer coisa')
       // return () => console.log('Desmontando')
    }, []);

    React.useEffect( () => {
        console.log(count);
        return () => console.log('Desmontando')
    }, [count]);

    return (
    //    <MUIDataTable
    //     title="Listagem de categorias"
    //     columns={columnsDefinition}
    //     data={data}
    //    />
        <button onClick={() => setCount(count+1)}>{count}</button>
    );
};

export default Table;