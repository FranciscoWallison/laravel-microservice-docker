import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {Box, Button, makeStyles, Theme, TextField} from "@material-ui/core";
import genresHttp from '../../util/http/genres-http';
import {ButtonProps} from "@material-ui/core/Button";
import { MenuItem } from '@material-ui/core';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import { RouteParams } from '../../interfaces/RouteParams';
import {Genre } from '../../util/models';
import { DefaultForm } from '../../components/DefaultForm';

const useStyle = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
    categories_id: yup.array()
        .label('Categorias')
        .required(),
})

export const Form = () => {
    const {register, getValues, handleSubmit, setValue, watch, errors, reset} = useForm({
        validationSchema,
        defaultValues: {
            categories_id: []
        }
    });

    const classes = useStyle();
    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<RouteParams>();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "outlined",
        disabled: loading
    };
    
    useEffect( () => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            const promises =[categoryHttp.list({queryParams: {all: ''}})];
            if(id){
                promises.push(genresHttp.get(id));
            }
            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);                
                if(isSubscribed){
                    setCategories(categoriesResponse.data.data);
                    if(id){
                        setGenre(genreResponse.data.data);
                        const categories_id = genreResponse.data.data.categories.map((category: any) => category.id);
                        reset({
                            ...genreResponse.data.data,
                            categories_id
                        });
                    }
                }
                
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

        return () => {
            isSubscribed = false;
        }

    }, []);  /* eslint-disable-line */
    
    useEffect( () => {
        register({name: "categories_id"})
    }, [register]);

    useEffect( () => {
        categoryHttp
            .list()
            .then(
                ({data}:any) => setCategories(data.data)
            )
    }, []);

    async function onsubmit(formData:any, event:any){
        setLoading(true);

        try {
            const http = !genre
                ? genresHttp.create(formData)
                : genresHttp.update(genre.id, formData)
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Gênero salva com sucesso',
                { variant: "success" }
            );
            setTimeout(() => {
                event
                ? (
                    id
                        ? history.replace(`/genres/${data.data.id}/edit`)
                        : history.push(`/genres/${data.data.id}/edit`)
                )
                : history.push('/genres');
            }) 
        
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Error ao salva Gênero',
                { variant: "error" }                
            );

        } finally {
            setLoading(false)
        }

        genresHttp
            .create(formData)
            .then((response:any) => console.log(response));
    }

    return (
        <DefaultForm onSubmit={handleSubmit(onsubmit)}>
            <TextField                
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"} 
                inputRef={register}
                disabled={loading}
                error={(errors as any).name !== undefined}
                helperText={(errors as any).name && (errors as any).name.message}
                InputLabelProps={{shrink: true}}
            />
            <TextField
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categorias"
                margin={"normal"}
                variant={"outlined"}
                fullWidth
                onChange={(e:any) => {
                    setValue('categories_id', e.target.value);
                }}
                SelectProps={{
                    multiple: true
                }}
                error={(errors as any).categories_id !== undefined}
                helperText={(errors as any).categories_id && (errors as any).categories_id.message}
                InputLabelProps={{shrink: true}}
                disabled={loading}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {
                    categories.map(

                        (category, key) => (
                            <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                        )
                    )
                }
            </TextField>

            <Box dir={"rtl"}>                
                <Button {...buttonProps} onClick={() => onsubmit(getValues(), null)} >Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </DefaultForm>
    )


}