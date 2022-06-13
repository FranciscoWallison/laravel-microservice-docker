// @flow 
import { useEffect, useRef, useState } from 'react';
import genresHttp from '../../util/http/genres-http';
import { format, parseISO} from 'date-fns';
import { Genre, ListResponse, Category } from '../../util/models';
import DefaultTable, { TableColumn, MuiDataTableRefComponent } from "../../components/Table";
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { useSnackbar } from "notistack";
import useFilter from "../../hooks/useFilter";
import * as yup from "../../util/vendor/yup";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import categoryHttp from "../../util/http/category-http";
import FilterResetButton from "../../components/Table/FilterResetButton";

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
        options: {
            filter: false,
        }
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            filterOptions: {
                names: ['Sim', 'Nāo']
            },
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />
            }
        }
    },
    {
        name:  "categories",
        label: "Categorias",
        options: {
            filterType: 'multiselect',
            filterOptions: {
                names: []
            },
            customBodyRender: (value, tableMeta, updateValue) => {
                console.log('value-customBodyRender', typeof value === 'undefined')
                return  typeof value === 'undefined' ? "" : value.map((value: any) => value.name).join(', ') ;
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
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
    // eslint-disable-next-line
    const [categories, setCategories] = useState<Category[]>();

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

    const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
    const columnCategories = columns[indexColumnCategories];
    const categoriesFilterValue = debouncedFilterState.extraFilter && debouncedFilterState.extraFilter.categories;
    (columnCategories.options as any).filterList = categoriesFilterValue ? categoriesFilterValue : [];

    const serverSideFilterList = columns.map(column => []);
    if (categoriesFilterValue) {
        serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
    }

    useEffect(() => {
        subscribed.current = true;

        (async () => {

            try {
                const { data } = await categoryHttp.list({ queryParams: { all: '' } });

                if (subscribed.current) {
                    setCategories(data.data);
                    (columnCategories.options as any).filterOptions.names = data.data.map((category: any) => category.name);
                }
            } catch (e) {
                if (categoryHttp.isCancelledRequest(e)) {
                    return;
                }
                enqueueSnackbar("Não foi possível carregar as informações", { variant: "error" });
            }


        })();

        return () => {
            subscribed.current = false
        }
        // eslint-disable-next-line
    }, [enqueueSnackbar]);
    
    const filteredSearch = filterManager.cleanSearchText(debouncedFilterState.search);

    useEffect(() => {
        subscribed.current = true;
        getData();
        filterManager.pushHistory();
        return () => {
            subscribed.current = false;
        }
        // eslint-disable-next-line
    }, [
        filteredSearch,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        // eslint-disable-next-line
        JSON.stringify(debouncedFilterState.extraFilter)
    ]);

    async function getData() {
        setLoading(true);
        try {
            const { data } = await genresHttp.list<ListResponse<Genre>>({
                queryParams: {
                    search: filterManager.cleanSearchText(debouncedFilterState.search),
                    page: debouncedFilterState.pagination.page,
                    per_page: debouncedFilterState.pagination.per_page,
                    sort: debouncedFilterState.order.sort,
                    dir: debouncedFilterState.order.dir,
                    ...(
                        debouncedFilterState.extraFilter &&
                        debouncedFilterState.extraFilter.categories &&
                        { categories: debouncedFilterState.extraFilter.categories.join(',') }
                    )
                }
            });

            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }

        } catch (e) {
            if (genresHttp.isCancelledRequest(e)) {
                return;
            }
            enqueueSnackbar("Não foi possível carregar as informações", { variant: "error" });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <DefaultTable
        title={"Gêneros"}
        columns={filterManager.columns}
        data={data}
        loading={loading}
        debouncedSearchTime={debouncedSearchTime}
        ref={tableRef}
        options={{
            serverSide: true,
            searchText: filterState.search as any,
            page: filterState.pagination.page - 1,
            rowsPerPage: rowsPerPage,
            rowsPerPageOptions: rowsPerPageOptions,
            count: totalRecords,
            customToolbar: () => {
                return <FilterResetButton handleClick={() => filterManager.resetFilter()} />
            },
            onFilterChange: (column, filterList, type) => {

                const columnIndex = columns.findIndex(c => c.name === column);

                if (columnIndex && filterList[columnIndex]) {
                    filterManager.changeExtraFilter({
                        [column]: filterList[columnIndex].length ? filterList[columnIndex] : null
                    })
                } else {
                    filterManager.cleanExtraFilter();
                }

            },
            onSearchChange: (value) => filterManager.changeSearch(value),
            onChangePage: (page) => filterManager.changePage(page),
            onChangeRowsPerPage: (per_page) => filterManager.changeRowsPerPage(per_page),
            onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSort(changedColumn, direction)
        }}
    />
    );
};

export default Table;