import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {Box, Button, makeStyles, Theme, TextField} from "@material-ui/core";
import genresHttp from '../../util/http/genres-http';
import {ButtonProps} from "@material-ui/core/Button";
import { MenuItem } from '@material-ui/core';
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
    
    const [categories, setCategories] = useState<any[]>([]);    
    const {register, getValues, handleSubmit, setValue, watch} = useForm({
        defaultValues: {
            categories_id: []
        }
    });
    // const category = getValues()['categories_id'];

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

    function onsubmit(formData:any, event:any){
        genresHttp
            .create(formData)
            .then((response:any) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onsubmit)}>
            <TextField                
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"} 
                inputRef={register}
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
                    setValue('categories_id', e.target.value, true);
                }}
                SelectProps={{
                    multiple: true
                }}
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
        </form>
    )


}