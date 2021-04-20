import * as React from 'react';
import {Box, Button, Checkbox, makeStyles, Theme, TextField} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';

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
        color: 'secondary',
        variant: "outlined",
    };
    const {register, getValues, errors, handleSubmit} = useForm({
        defaultValues: {
            is_active: true
        }
    });

    function onSubmit(formData:any, event:any){
        categoryHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    console.log('errors', errors);
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <TextField                
                inputRef={register({
                    required: {
                        value: true,
                        message: 
                        'O campo nome é requerido'
                    },
                    maxLength: {
                        value: 2,
                        message: 
                        'O máximo caracteres é 2'
                    }
                })}
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"} 
            />
            {/* {
                errors.name && errors.name.type === 'required' && 
                (<p>{errors.name.message}</p>)
            } */}
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
                defaultChecked
            />
            Ativo?

            <Box dir={"rtl"}>                
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)} >Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )


}