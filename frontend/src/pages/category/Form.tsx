/*  eslint-disable-next-line */
import * as React from 'react';
import {Box, Button, Checkbox, makeStyles, Theme, TextField, FormControlLabel} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { RouteParams } from '../../interfaces/RouteParams';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { CategoryInterface } from '../../interfaces/CategoryInterface'
import { useSnackbar } from 'notistack';

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
    const {
        register,
        getValues,
        errors,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<RouteParams>(); 
    const [category, setCategory] = useState<CategoryInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "outlined",
        disabled: loading
    };

    useEffect(() => {
        register({name: "is_active"})
    }, [register]);

    useEffect( () => {
        if(!id){
            return;
        }
        setLoading(true);
        categoryHttp.get(id)
            .then(({data}) => {
                setCategory(data.data);
                reset(data.data);
            })
            .finally(() => setLoading(false));
    }, []);  /* eslint-disable-line */

    async function onSubmit(formData:any, event:any){
        try {
        setLoading(true);
        const http = !category
            ?  categoryHttp.create(formData)
            : categoryHttp.update(category.id, formData)
        
        http
        .then(({data}) => {
            //quando o evento de enviar. validar editar e criar.    
            snackbar.enqueueSnackbar(
                'Categoria salva com sucesso',
                { variant: "success" }                
            );
            setTimeout(() => {
                event
                ? (
                    id
                        ? history.replace(`/categories/${data.data.id}/edit`)
                        : history.push(`/categories/${data.data.id}/edit`)
                )
                : history.push('/categories');
            })
        })
        .catch((error) => {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Error ao salva Categoria',
                { variant: "error" }                
            );
        })
        .finally(() => setLoading(false));

        
        } catch (e) {
           console.log(e);

        }
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
                disabled={loading}
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
                disabled={loading}
            />
            <FormControlLabel 
                disabled={loading}
                control={
                    <Checkbox
                        name="is_active"
                        innerRef={register}
                        onChange={ () =>
                            setValue('is_active', !getValues()['is_active'])
                        }
                        checked={watch('is_active') as any}
                        
                    />
                }
                label={'Ativo?'}
                labelPlacement={'end'}
            />

            <Box dir={"rtl"}>                
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)} >Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )


}