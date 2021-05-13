// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from "react";
import { format, parseISO} from 'date-fns';
import castMemberHttp from '../../util/http/cast-members-http';
import { CastMember, ListResponse } from '../../util/models';
import DefaultTable from "../../components/Table";
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit'

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
    },
    {
        name:  "actions",
        label: "Ações",
        options: {
            sort: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <samp>
                            <IconButton
                                color={'secondary'}
                                component={Link}
                                to={`/cast-members/${(tableMeta as any).rowIndex[0]}/edit`}
                            />
                            <EditIcon/>
                        </samp>
                    )
                }
        }
    }
]

type Props = {};
const Table = (props: Props) => {

    const [data, setData] = useState<CastMember[]>([]);

    useEffect( () => {
        let isCancelled = false;
        (async () => {
            const {data} = await castMemberHttp.list<ListResponse<CastMember>>();
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
        title="Listagem de membros de elencos"
        columns={columnsDefinition}
        data={data}
       />
    );
};

export default Table;