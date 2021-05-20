// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useRef, useState } from "react";
import categoryHttp from '../../util/http/category-http';
import { format, parseISO} from 'date-fns';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyles } from "../../components/Table";
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider, Theme } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit'


interface Pagination{
    page: number;
    total: number;
    per_page: number;
}

interface SearchState {
    search: string;
    pagination: Pagination
}

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

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchState, setSearchState] = useState<SearchState>({
        search: '',
        pagination: {
            page: 1,
            total: 0,
            per_page: 10
        }
    });

    useEffect ( () => {
        subscribed.current = true;
        getData()
        return () => {
            subscribed.current = false;
        }
    }, [
        searchState.search,
        searchState.pagination.page,
        searchState.pagination.per_page,
    ])

    async function getData() {
        setLoading(true);
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: searchState.search,
                    page: searchState.pagination.page,
                    per_page: searchState.pagination.per_page
                }
            });
            if(subscribed.current){
                setData(data.data);
                setSearchState((prevSate => ({
                    ...prevSate, 
                    pagination: {
                        ...prevSate.pagination,
                        total: data.meta.toral
                    }
                })))
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
    }
    
    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition)}>
            <DefaultTable
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: searchState.search,
                    page: searchState.pagination.page - 1,
                    rowsPerPage: searchState.pagination.per_page,
                    count: searchState.pagination.total,
                    onSearchChange: (value: string) => setSearchState((prevState => ({
                        ...prevState,
                        search: value
                    }))),
                    onChangePage: (page) => setSearchState((prevState => ({
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            page: page + 1,
                        }
                    }))),
                    onChangeRowsPerPage: (perPage) => setSearchState((prevState => ({
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            per_page: perPage + 1,
                        }
                    }))),

                }}
            />
        </MuiThemeProvider>
       
    );
};

export default Table;