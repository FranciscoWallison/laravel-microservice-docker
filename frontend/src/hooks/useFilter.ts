import { MUIDataTableColumn } from "mui-datatables";
import reducer, {INITIAL_STATE, Creators } from "../store/filter";
import { Dispatch, Reducer, useReducer, useState } from "react";
import { Actions as FilterActions, State, State as FilterState } from "../store/filter/types";
import { useDebounce } from "use-debounce/lib";
import { useHistory } from 'react-router-dom';
import { History } from 'history';

interface FilterManagerOptions {
    columns: MUIDataTableColumn[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    debounceTime: number;
    history: History;
}

interface UseFilterOptions extends Omit<FilterManagerOptions, 'history'> {
}

export default function useFilter(options: UseFilterOptions) {
    const history = useHistory();
    const filterManager = new FilterManager({ ...options, history });
    const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
    const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
    const [totalRecords, setTotalRecords] =  useState<number>(0);
    filterManager.state = filterState;
    filterManager.dispatch = dispatch;

    filterManager.applyOrdersInColumns();
    return {
        columns: filterManager.columns,
        filterManager,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords        
    }

}


export class FilterManager {

    state: FilterState = null as any;
    dispatch: Dispatch<FilterActions> = null as any;
    columns: MUIDataTableColumn[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    history: History;

    constructor(options: FilterManagerOptions)
    {
        const {columns, rowsPerPage, rowsPerPageOptions, history, debounceTime} = options;
        this.columns = columns;
        this.rowsPerPage = rowsPerPage;
        this.rowsPerPageOptions = rowsPerPageOptions;
        this.history = history;
    }

    changeSearch(value: any){
        this.dispatch(Creators.setSearch({search: value}));
    }
   
    changePage(page: any){
        this.dispatch(Creators.setPage({page: page +1}))
    }
    changeRowsPerPage(perPage: any){
        this.dispatch(Creators.setPerPage({per_page: perPage}))
    }
    changeSort(changedColumn: string, direction: string) {
        this.dispatch(Creators.setOrder({
            sort: changedColumn,
            dir: direction.includes('desc') ? 'desc' : 'asc'
        }));
        //this.resetTablePagination();
    }

    applyOrdersInColumns() {
        this.columns = this.columns.map(column => {
            return column.name === this.state.order.sort
                ? {
                    ...column,
                    options: {
                        ...column.options,
                        sortDirection: this.state.order.dir as any
                    }
                }
                : column;
        });
    }

    cleanSearchText(text: any){
        let newText = text;
        if(text && text.value !== undefined){
            text = text.value;
        }
        return newText;
    }

    pushHistory() {
        const newLocation = {
            pathname: this.history.location.pathname,
            search: "?" + new URLSearchParams(this.formatSearchParams() as any),
            state: {
                ...this.state,
                search: this.cleanSearchText(this.state.search)
            }
        };

        this.history.push(newLocation);
    }

    private formatSearchParams() {
        const search = this.cleanSearchText(this.state.search);

        return {
            ...(search && search !== '' && { search: search }),
            ...(this.state.pagination.page !== 1 && { page: this.state.pagination.page }),
            ...(this.state.pagination.per_page !== 15 && { per_page: this.state.pagination.per_page }),
            ...(
                this.state.order.sort && {
                    sort: this.state.order.sort,
                    dir: this.state.order.dir,
                }

            )
        }
    }


}