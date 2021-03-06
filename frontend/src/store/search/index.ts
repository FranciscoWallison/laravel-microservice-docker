import * as Typings from "./types";
import {createActions, createReducer} from 'reduxsauce';
import {
    SetSearchAction,
    SetPageAction,
    SetPerPageAction,
    SetOrderAction,
    State
} from "./types";


export const { Types, Creators } = createActions<
    {
        SET_SEARCH: string,
        SET_PAGE: string,
        SET_PER_PAGE: string,
        SET_ORDER: string,
    }, {
        setSearch(payload: SetSearchAction["payload"]): SetSearchAction;
        setPage(payload: SetPageAction["payload"]): SetPageAction;
        setPerPage(payload: SetPerPageAction["payload"]): SetPerPageAction;
        setOrder(payload: SetOrderAction["payload"]): SetOrderAction;
    }>
    ({
    setSearch: ["payload"],
    setPage: ["payload"],
    setPerPage: ["payload"],
    setOrder: ["payload"]
});

export const INITIAL_STATE: State = {
    search: '',
    pagination: {
        page: 1,
        total: 0,
        per_page: 15
    },
    order: {
        sort: null,
        dir: null
    }
};

const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_SEARCH]: setSearch as any,
    [Types.SET_PAGE]: setPage as any,
    [Types.SET_PER_PAGE]: setPerPage as any,
    [Types.SET_ORDER]: setOrder as any
});

export default reducer;

function setSearch(state = INITIAL_STATE, action: SetSearchAction) : State {
    return {
        ...state,
        search: action.payload.search,
        pagination: {
            ...state.pagination,
            page: 1
        }
    }
}


function setPage(state = INITIAL_STATE, action: SetPageAction) : State {
    return {
        ...state,
        pagination: {
            ...state.pagination,
            page: action.payload.page
        }
    };
}

function setPerPage(state = INITIAL_STATE, action: SetPerPageAction) : State {
    return {
        ...state,
        pagination: {
            ...state.pagination,
            per_page: action.payload.per_page
        }
    };
}

function setOrder(state = INITIAL_STATE, action: SetOrderAction) : State {
    return {
        ...state,
        pagination: {
            ...state.pagination,
            page: 1
        },
        order: {
            sort: action.payload.sort,
            dir: action.payload.dir
        }
    };
}