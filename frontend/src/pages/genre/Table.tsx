// @flow 
import  MUIDataTable,  { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from "react";
import { httpVideo } from '../../util/http';
import { format, parseISO} from 'date-fns';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:  "name",
        label: "Nome",
    },
    {
        name:  "categories",
        label: "Categorias",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return value.map((value: any) => value.name).join(', ');
            }
        }
    },
    {
        name:  "created_at",
        label: "Criado em",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
            }
        }
    }
]

type Props = {};
const Table = (props: Props) => {

    const [data, setData] = useState([]);

    useEffect( () => {
        httpVideo.get('genres').then(
            response => setData(response.data.data)
        )
    }, []);
    
    return (
       <MUIDataTable
        title="Listagem de gêneros"
        columns={columnsDefinition}
        data={data}
       />
    );
};

export default Table;