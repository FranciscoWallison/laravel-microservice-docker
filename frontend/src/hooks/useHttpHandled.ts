import { useCallback } from "react";

import { useSnackbar } from "notistack";
import Axios from "axios";

const useHttpHandled = () => {

    const { enqueueSnackbar } = useSnackbar();

    return useCallback(async (request: Promise<any>) => {
        try {

            const { data } = await request;

            return data;

        } catch (e) {
            if (!Axios.isCancel(e)) {
                enqueueSnackbar("Não foi possível carregar as informações", { variant: "error" });
            }
            throw e;
        }
    }, [enqueueSnackbar]);
};

export default useHttpHandled;