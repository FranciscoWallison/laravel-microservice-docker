import {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import casteMemberHttp from '../../util/http/cast-members-http';
import {Box, Button, makeStyles, Theme, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio} from "@material-ui/core";
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
        color: 'secondary',
        variant: "outlined",
    };
    const {register, getValues, handleSubmit, setValue} = useForm();

    useEffect(() => {
        register({name: "type"})
    }, [register]);

    function onsubmit(formData:any, event:any){
        console.log("formData", formData)
        casteMemberHttp
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

            <FormControl margin={"normal"}>
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup 
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}
                >
                    <FormControlLabel value="1" control={<Radio/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio/>} label="Ator"/>
                </RadioGroup>
            </FormControl>

            <Box dir={"rtl"}>                
                <Button {...buttonProps} onClick={() => onsubmit(getValues(), null)} >Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )


}