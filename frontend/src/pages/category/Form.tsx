import * as React from 'react';
import {Box, Button, Checkbox, makeStyles, Theme, TextField} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import { useForm } from 'react-hook-form';

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
    const {register, getValues} = useForm();

    return (
        <form>
            <TextField                
                inputRef={register}
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
                inputRef={register}
            />

            <Checkbox
                name="is_active"
                innerRef={register}
            />
            Ativo?

            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => console.log(getValues())}>Salvar e continuar editando</Button>
                <Button {...buttonProps} type="submit">Salvar</Button>
            </Box>
        </form>
    )


}