import * as React from 'react';
import {Box, Button, Checkbox, makeStyles, Theme, TextField} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";

const useStyle = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

export const Form = () => {
    const classes = useStyle();
    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined",
    };

    return (
        <form>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
            />
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
            />

            <Checkbox
                name="is_active"
            />
            Ativo?

            <Box dir={"rtl"}>
                <Button {...buttonProps}>Salvar e continuar editando</Button>
                <Button {...buttonProps} type="submit">Salvar</Button>
            </Box>
        </form>
    )


}