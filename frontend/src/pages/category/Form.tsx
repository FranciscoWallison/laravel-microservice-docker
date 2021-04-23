/*  eslint-disable-next-line */
import * as React from 'react';
import {Box, Button, Checkbox, makeStyles, Theme, TextField} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { RouteParams } from '../../interfaces/RouteParams';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { CategoryInterface } from '../../interfaces/CategoryInterface'

const useStyle = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

const validationSchema = yup.object().shape({
    name: yup.string()
    .label('Nome')
    .required()
    .max(255),
})

export const Form = () => {
    const classes = useStyle();
    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "outlined",
    };
    const {register, getValues, errors, handleSubmit, reset} = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    const { id } = useParams<RouteParams>(); 
    const [category, setCategory] = useState<CategoryInterface | null>(null);

    useEffect( () => {
        if(!id){
            return;
        }
        categoryHttp.get(id)
            .then(({data}) => {
                setCategory(data.data);
                reset(data.data);
            })
    }, []);  /* eslint-disable-line */

    function onSubmit(formData:any, event:any){
        const http = !category
            ?  categoryHttp.create(formData)
            : categoryHttp.update(category.id, formData)
        
        http.then((response) => console.log(response));
    }

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
                error={(errors as any).name !== undefined}
                helperText={(errors as any).name && (errors as any).name.message}
                InputLabelProps={{shrink: true}}
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
                InputLabelProps={{shrink: true}}
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