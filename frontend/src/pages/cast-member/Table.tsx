// @flow 
import  MUIDataTable,  { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from "react";
import { httpVideo } from '../../util/http';
import { format, parseISO} from 'date-fns';
import castMemberHttp from '../../util/http/cast-members-http';

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:  "name",
        label: "Nome",
    },
    {
        name:  "type",
        label: "Tipo",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return (CastMemberTypeMap as any)[value];
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
            const {data} = await castMemberHttp.list();
            if(!isCancelled){
                setData(data.data)
            }
        })();

        return () => {
            isCancelled = true;
        }
    }, []);
    
    return (
       <MUIDataTable
        title="Listagem de membros de elencos"
        columns={columnsDefinition}
        data={data}
       />
    );
};

export default Table;