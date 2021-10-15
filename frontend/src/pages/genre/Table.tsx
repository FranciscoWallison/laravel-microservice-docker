// @flow 
import { useEffect, useRef, useState, useContext } from 'react';
import genresHttp from '../../util/http/genres-http';
import { format, parseISO} from 'date-fns';
import { Genre, ListResponse, Category } from '../../util/models';
import DefaultTable, { TableColumn, MuiDataTableRefComponent } from "../../components/Table";
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { useSnackbar } from "notistack";
import LoadingContext from "../../components/Loading/LoadingContext";
import useFilter from "../../hooks/useFilter";
import * as yup from "../../util/vendor/yup";

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        options: {
            sort: false,
            filter: false,
            empty: false,
        }
    },
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
    },
    {
        name:  "actions",
        label: "Ações",
        options: {
            sort: false,
                customBodyRender: (value, tableMeta) => {
                    console.log('tableMeta', tableMeta, value)
                    return (
               
                        <IconButton
                            color={'secondary'}
                            component={Link}
                            to={`/genres/${(tableMeta as any).rowData[0]}/edit`}
                        >
                            <EditIcon/>
                        </IconButton>
         
                    )
                }
        }
    }
]

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table = () => {

    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState<Genre[]>([]);
    const subscribed = useRef(true);
    const loading = useContext(LoadingContext);
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
    // eslint-disable-next-line
    const [categories, setCategories] = useState<Category[]>([]);

    const {
        columns,
        filterManager,
        filterState,
        debouncedFilterState,
        totalRecords,
        setTotalRecords,
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debounceTime,
        rowsPerPage,
        rowsPerPageOptions,        
        tableRef,
        extraFilter: {
            createValidationSchema: () => {
                return yup.object().shape({
                    categories: yup.mixed()
                        .nullable()
                        .transform(value => {
                            return !value || value === '' ? undefined : value.split(",");
                        })
                        .default(null)
                });
            },
            formatSearchParams: (debouncedState) => {
                return debouncedState.extraFilter ? {
                    ...(
                        debouncedState.extraFilter.categories &&
                        { categories: debouncedState.extraFilter.categories.join(',') }
                    )
                } : undefined
            },
            getStateFromURL: (queryParams) => {
                return {
                    categories: queryParams.get('categories')
                }
            }
        }
    });

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