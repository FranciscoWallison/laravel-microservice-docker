// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useReducer, useRef, useState } from "react";
import categoryHttp from '../../util/http/category-http';
import { format, parseISO} from 'date-fns';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyles } from "../../components/Table";
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { FilterResetButton } from '../../components/Table/FilterResetButton';

interface Pagination{
    page: number;
    total: number;
    per_page: number;
}

interface Order {
    sort: string | null;
    dir: string | null;
}

interface SearchState {
    search: string;
    pagination: Pagination;
    order: Order;
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
        // options: {
        //     sortDirection: 'desc'
        // }
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

const INICIAL_STATE = {
    search: '',
    pagination: {
        page: 1,
        total: 0,
        per_page: 10
    },
    order: {
        sort: null,
        dir: null
    }
}

function reducer (state: any, action: any) {
    switch  (action.type){
        case 'search':
            return {
                ...state,
                search: action.search,
                pagination: {
                    ...state.pagination,
                    page: 1
                }
            }
            break;
        case 'page':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.page,
                }
            }
            break;
        case 'per_page':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    per_page: action.perPage,
                }
            }
            break;
        case 'order':
            return {
                ...state,
                order: {
                    sort: action.sort,
                    dir: action.dir,
                }
            }
            break;
        default:
            return INICIAL_STATE;
    }

}   

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchState, dispatch] = useReducer(reducer, INICIAL_STATE);
    //const [searchState, setSearchState] = useState<SearchState>(inicialState);

    const columns  = columnsDefinition.map(column => {
        return column.name === searchState.order.sort
        ? {
            ...column,
            options: {
                ...column.options,
                sortDirection: searchState.order.dir as any
            }
        } : column;
    })

    useEffect ( () => {
        subscribed.current = true;
        getData()
        return () => {
            subscribed.current = false;
        }
        // eslint-disable-next-line
    }, [
        searchState.search,
        searchState.pagination.page,
        searchState.pagination.per_page,
        searchState.order
    ])

    async function getData() {
        setLoading(true);
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: cleanSearchText(searchState.search),
                    page: searchState.pagination.page,
                    per_page: searchState.pagination.per_page,
                    sort: searchState.order.sort,
                    dir: searchState.order.dir,
                }
            });
            if(subscribed.current){
                setData(data.data);
                // setSearchState((prevSate => ({
                //     ...prevSate, 
                //     pagination: {
                //         ...prevSate.pagination,
                //         total: (data.meta as any).total
                //     }
                // })))
            }
        } catch (error) {
            console.error(error);
            if(categoryHttp.isCancelledRequest(error)){
                return;
            }
            snackbar.enqueueSnackbar(
                'Não foi possível carregar as informações',
                {variant: 'error'}
            )
        } finally {
            setLoading(false);
        }
    }

    function cleanSearchText(text: any){
        let newText = text;
        if(text && text.value !== undefined){
            text = text.value;
        }
        return newText;
    }
    
    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition)}>
            <DefaultTable
                title="Listagem de categorias"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={500}
                options={{
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: searchState.search,
                    page: searchState.pagination.page - 1,
                    rowsPerPage: searchState.pagination.per_page,
                    count: searchState.pagination.total,
                    customToolbar: () => (
                        <FilterResetButton
                            handleClick={() => dispatch({})}
                        />
                    ),
                    onSearchChange: (value: string) => dispatch({type: 'search', search: value}),
                    onChangePage: (page) => dispatch({type: 'page', page: page + 1}),
                    onChangeRowsPerPage: (perPage) => dispatch({type: 'per_page', per_page: perPage + 1}),
                    onColumnSortChange: (changedColumn: string, direction: string) => 
                        dispatch({
                            type: 'order', 
                            sort: changedColumn,
                            dir:direction.includes('desc') ? 'desc': 'asc',
                        }),
                }}
            />
        </MuiThemeProvider>
       
    );
};

export default Table;