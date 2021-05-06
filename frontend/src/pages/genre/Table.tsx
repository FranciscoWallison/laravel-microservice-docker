// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from "react";
import genresHttp from '../../util/http/genres-http';
import { format, parseISO} from 'date-fns';
import { Genre, ListResponse } from '../../util/models';
import DefaultTable from "../../components/Table";

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
        let isCancelled = false;
        (async () => {
            const {data} = await genresHttp.list<ListResponse<Genre>>()
            if(!isCancelled){
                setData(data.data as any)
            }
        })();

        return () => {
            isCancelled = true;
        }
    }, []);
    
    return (
       <DefaultTable
        title="Listagem de gêneros"
        columns={columnsDefinition}
        data={data}
       />
    );
};

export default Table;