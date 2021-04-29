import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import casteMemberHttp from '../../util/http/cast-members-http';
import {
    Box, 
    Button, 
    makeStyles, 
    Theme, 
    TextField, 
    FormControl, 
    FormLabel, 
    RadioGroup, 
    FormControlLabel, 
    Radio
} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import * as yup from '../../util/vendor/yup';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import { RouteParams } from '../../interfaces/RouteParams';
import { FormHelperText } from '@material-ui/core';

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
    type: yup.number()
        .label('Tipo')
        .required(),
})

export const Form = () => {

    const {register, getValues, handleSubmit, setValue, errors, reset, watch} = useForm({
        validationSchema
    });

    const classes = useStyle();
    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<RouteParams>();
    const [castMember, setCastMember] = useState<{id: string} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "outlined",
        disabled: loading
    };

    useEffect( () => {
        if(!id){
            return;
        }

        async function getCatMember() {
            setLoading(true);
            try {
                const {data} = await casteMemberHttp.get(id);
                setCastMember(data.data);
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
        }

        getCatMember();

    }, []);  /* eslint-disable-line */

    useEffect(() => {
        register({name: "type"})
    }, [register]);

    async function onsubmit(formData:any, event:any){
        setLoading(true);

        try {
            const http = !castMember
                ? casteMemberHttp.create(formData)
                : casteMemberHttp.update(castMember.id, formData)
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Membro do elenco salva com sucesso',
                { variant: "success" }
            );
            setTimeout(() => {
                event
                ? (
                    id
                        ? history.replace(`/cast-members/${data.data.id}/edit`)
                        : history.push(`/cast-members/${data.data.id}/edit`)
                )
                : history.push('/cast-members');
            }) 
        
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Error ao salva Membro do elenco',
                { variant: "error" }                
            );

        } finally {
            setLoading(false)
        }

    }

    return (
        <form onSubmit={handleSubmit(onsubmit)}>
            <TextField                
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"} 
                inputRef={register}
                disabled={loading}
                error={(errors as any).name !== undefined}
                InputLabelProps={{shrink: true}}
            />

            <FormControl 
                margin={"normal"}
                error={(errors as any).type !== undefined}
                disabled={loading}
            >
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup 
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}
                >
                    <FormControlLabel value="1" control={<Radio/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio/>} label="Ator"/>
                </RadioGroup>
                {
                    errors.type &&
                        <FormHelperText id="type-helper-text">{(errors.type as any).message}</FormHelperText>
                        
                }
            </FormControl>

            <Box dir={"rtl"}>                
                <Button {...buttonProps} onClick={() => onsubmit(getValues(), null)} >Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )


}