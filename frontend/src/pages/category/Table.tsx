// @flow 
import { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useRef, useState } from "react";
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
import reducer, {INITIAL_STATE, Creators} from '../../store/filter';
import useFilter from '../../hooks/useFilter';

const columnsDefinitions: MUIDataTableColumn[] = [
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

const Table = () => {
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        columns,
        filterManager,
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords
    } = useFilter({
        columns: columnsDefinitions,
        debounceTime: 500,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 25, 50]
    });
    //const filterState = filterManager.clearSearchText(debouncedFilterState.search);

    useEffect ( () => {
        subscribed.current = true;
        getData()
        return () => {
            subscribed.current = false;
        }
        // eslint-disable-next-line
    }, [
        filterState.search,
        filterState.pagination.page,
        filterState.pagination.per_page,
        filterState.order
    ])

    async function getData() {
        setLoading(true);
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
                }
            });
            if(subscribed.current){
                setData(data.data);
                setTotalRecords(data.meta.toral);
                // setfilterState((prevSate => ({
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
        <MuiThemeProvider theme={makeActionStyles(columnsDefinitions)}>
            <DefaultTable
                title="Listagem de categorias"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={500}
                options={{
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    count: totalRecords,
                    customToolbar: () => {
                        return <FilterResetButton handleClick={() => Creators.setReset({state: INITIAL_STATE})} />
                    },
                    onSearchChange: (value) => filterManager.changeSearch(value),
                    onChangePage: (page) => filterManager.changePage(page),
                    onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                    onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeSort(changedColumn, direction)
                }}
            />
        </MuiThemeProvider>
       
    );
};

export default Table;