import {SetSearchAction} from "./types";
import {createActions} from 'reduxsauce';

const { Types, Creatorn} = createActions({
    setSearch: ['payload'],
    setPage: ['payload'],
    setPerPage: ['payload'],
    setOrder: ['payload'],
})
