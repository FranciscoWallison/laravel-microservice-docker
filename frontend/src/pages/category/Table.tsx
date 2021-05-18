// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from "react";
import categoryHttp from '../../util/http/category-http';
import { format, parseISO} from 'date-fns';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyles } from "../../components/Table";
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider, Theme } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit'


const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'id',
        label:'ID',
        // width:'33%'.toString(),
        options: {
            sort: false
        }
    },
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
    },
    {
        name:  "actions",
        label: "Ações",
        options: {
            sort: false,
            customBodyRender: (value, tableMeta) => {
                return (
                  
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/categories/${(tableMeta as any).rowData[0]}/edit`}
                        >
                        <EditIcon/>
                    </IconButton>
                )
            }
        }
    }
];

const Table = () => {

    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const snackbar = useSnackbar();

    useEffect( () => {
        let isCancelled = false;
        (async () => {
            setLoading(true);
            try {
                const {data} = await categoryHttp.list<ListResponse<Category>>();
                if(!isCancelled){
                    setData(data.data)
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error'}
                )
            } finally {
                setLoading(false);
            }
            
        })();

        return () => {
            isCancelled = true;
        }
    }, []);
    
    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition)}>
            <DefaultTable
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{responsive: "scrollMaxHeight"}}
            />
        </MuiThemeProvider>
       
    );
};

export default Table;