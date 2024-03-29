/*  eslint-disable-next-line */
import * as React from 'react';
import {Checkbox, TextField, FormControlLabel} from "@material-ui/core";
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { RouteParams } from '../../interfaces/RouteParams';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import { DefaultForm } from '../../components/DefaultForm';

const validationSchema = yup.object().shape({
    name: yup.string()
    .label('Nome')
    .required()
    .max(255),
})

export const Form = () => {
    const {
        register,
        getValues,
        errors,
        handleSubmit,
        reset,
        watch,
        setValue,
        triggerValidation
    } = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<RouteParams>(); 
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

   

    useEffect( () => {
        if(!id){
            return;
        }

        (async function getCategory() {
            setLoading(true);
            try {
                const {data} = await categoryHttp.get(id);
                setCategory(data.data);
                reset(data.data);
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error'}
                )
            } finally {
                setLoading(false);
            }
        })();

    }, []);  /* eslint-disable-line */

    useEffect(() => {
        register({name: "is_active"})
    }, [register]);

    async function onSubmit(formData:any, event:any){
        setLoading(true);
        try {            
            const http = !category
                ?  categoryHttp.create(formData)
                : categoryHttp.update(category.id, formData)
            const {data} = await http;
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
        
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Error ao salva Categoria',
                { variant: "error" }                
            );

        } finally {
            setLoading(false)
        }
    }

    return (
        <DefaultForm onSubmit={handleSubmit(onSubmit)}>            
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

            {/* <Box dir={"rtl"}>                
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)} >Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box> */}
            <SubmitActions 
                disableButtons={loading}
                handleSave={() =>
                    triggerValidation().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })
                }
            />
        </DefaultForm>
    )


}