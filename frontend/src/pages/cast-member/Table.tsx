// @flow 
import { useEffect, useState, useRef } from "react";
import { format, parseISO} from 'date-fns';
import castMemberHttp from '../../util/http/cast-members-http';
import { CastMember, ListResponse, CastMemberTypeMap } from '../../util/models';
import DefaultTable, {MuiDataTableRefComponent, TableColumn} from "../../components/Table";
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from "notistack";
import useFilter from "../../hooks/useFilter";
import * as yup from '../../util/vendor/yup';
import FilterResetButton from "../../components/Table/FilterResetButton";
import { invert } from 'lodash';

const castMemberNames = Object.values(CastMemberTypeMap);

const columnsDefinition: TableColumn[] = [
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
                        
                        <IconButton
                                color={'secondary'}
                                component={Link}
                                to={`/cast-members/${(tableMeta as any).rowData[0]}/edit`}
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

type Props = {};
const Table = (props: Props) => {

    const { enqueueSnackbar } = useSnackbar();
    const subscribed = useRef(false);
    const [data, setData] = useState<CastMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;

    const {
        columns,
        filterManager,
        filterState,
        debouncedFilterState,
        totalRecords,
        setTotalRecords        
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debounceTime,
        rowsPerPage: rowsPerPage,
        rowsPerPageOptions: rowsPerPageOptions,       
        tableRef,
        extraFilter: {
            createValidationSchema: () => {
                return yup.object().shape({
                    type: yup
                        .string()
                        .nullable()
                        .transform(value => {
                            return !value || !castMemberNames.includes(value) ? undefined : value
                        })
                        .default(null)
                })
            },
            formatSearchParams: () => {
                return debouncedFilterState.extraFilter ? {
                    ...(debouncedFilterState.extraFilter.type &&
                        { type: debouncedFilterState.extraFilter.type }
                    )
                } : undefined
            },
            getStateFromURL: (queryParams) => {
                return {
                    type: queryParams.get('type')
                }
            }
        }
    });

    const indexColumnType = columns.findIndex(c => c.name === 'type');
    const columnType = columns[indexColumnType];
    const typeFilterValue = filterState.extraFilter && filterState.extraFilter.type as never;
    (columnType.options as any).filterList = typeFilterValue ? [typeFilterValue] : [];

    const serverSideFilterList = columns.map(column => []);
    if (typeFilterValue) {
        serverSideFilterList[indexColumnType] = [typeFilterValue];
    }

    const filteredSearch = filterManager.cleanSearchText(debouncedFilterState.search);

    useEffect(() => {

        subscribed.current = true;
        filterManager.pushHistory();
        getData();

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
            const { data } = await castMemberHttp.list<ListResponse<CastMember>>({
                queryParams: {
                    search: filterManager.cleanSearchText(debouncedFilterState.search),
                    page: debouncedFilterState.pagination.page,
                    per_page: debouncedFilterState.pagination.per_page,
                    sort: debouncedFilterState.order.sort,
                    dir: debouncedFilterState.order.dir,
                    ...(
                        debouncedFilterState.extraFilter &&
                        debouncedFilterState.extraFilter.type &&
                        { type: invert(CastMemberTypeMap)[debouncedFilterState.extraFilter.type] }
                    )
                }
            });

            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }


        } catch (e) {

            if (castMemberHttp.isCancelledRequest(e)) {
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
        title={"Membros de Elenco"}
        columns={filterManager.columns}
        data={data}
        loading={loading}
        debouncedSearchTime={debouncedSearchTime}
        ref={tableRef}
        options={{
            serverSideFilterList,
            serverSide: true,
            searchText: filterState.search as any,
            page: filterState.pagination.page - 1,
            rowsPerPage: filterState.pagination.per_page,
            rowsPerPageOptions: rowsPerPageOptions,
            count: totalRecords,            
            onFilterChange: (column, filterList, type) => {

                const columnIndex = columns.findIndex(c => c.name === column);

                if (columnIndex && filterList[columnIndex]) {
                    filterManager.changeExtraFilter({
                        [column]: filterList[columnIndex].length ? filterList[columnIndex][0] : null
                    })
                } else {
                    filterManager.cleanExtraFilter();
                }
            },
            customToolbar: () => {
                return <FilterResetButton 
                    handleClick={() => filterManager.resetFilter()} 
                />
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