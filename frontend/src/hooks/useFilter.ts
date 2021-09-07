import { useReducer, useState } from "react";
import reducer, {INITIAL_STATE} from "../store/filter";

export default function useFilter() {
    const [searchState, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [totalRecords, setTotalRecords] =  useState<number>(0);

    return {
        searchState,
        dispatch,
        totalRecords,
        setTotalRecords
    }

}
