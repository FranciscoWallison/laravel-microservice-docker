// @flow 
import { useEffect, useState, useRef, useContext } from "react";
import { format, parseISO} from 'date-fns';
import castMemberHttp from '../../util/http/cast-members-http';
import { CastMember, ListResponse, CastMemberTypeMap } from '../../util/models';
import DefaultTable, {MuiDataTableRefComponent, TableColumn} from "../../components/Table";
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from "notistack";
import LoadingContext from "../../components/Loading/LoadingContext";
import useFilter from "../../hooks/useFilter";
import * as yup from '../../util/vendor/yup';

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
    const loading = useContext(LoadingContext);
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