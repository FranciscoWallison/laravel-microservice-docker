// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from "react";
import categoryHttp from '../../util/http/category-http';
import { format, parseISO} from 'date-fns';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable from "../../components/Table";

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:  "name",
        label: "Nome",
    },    
    {
        name:  "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return value ? <BadgeYes/> : <BadgeNo/>  ;
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
];

type Props = {};
const Table = (props: Props) => {

    const [data, setData] = useState<Category[]>([]);

    useEffect( () => {
        let isCancelled = false;
        (async () => {
            const {data} = await categoryHttp.list<ListResponse<Category>>();
            if(!isCancelled){
                setData(data.data)
            }
        })();

        return () => {
            isCancelled = true;
        }
    }, []);
    
    return (
       <DefaultTable
        title="Listagem de categorias"
        columns={columnsDefinition}
        data={data}
       />
    );
};

export default Table;