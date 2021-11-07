import { useSnackbar } from "notistack";
import { useEffect } from "react";

const useSnackbarFormError = (submitCount, errors) => {

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const hasErrors = Object.keys(errors).length !== 0;
        if (submitCount > 0 && hasErrors) {
            enqueueSnackbar("Formulário inválido. Reveja os campos marcados de vermelho", { variant: "error" });
        }
        // eslint-disable-next-line
    }, [submitCount])

};

export default useSnackbarFormError;