import * as React from 'react';
import {Box, Button, makeStyles, Theme} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';

const useStyles = makeStyles( (theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

interface SubmitActionsProps {
    disableeButtons?: boolean;
    handleSave: () => void
}

const SubmitActions: React.FC<SubmitActionsProps> = (props) => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "outlined",
        disabled: props.disableeButtons === undefined ? false : props.disableeButtons
    };

    return (
        <Box dir={"rtl"}>                
            <Button {...buttonProps} onClick={props.handleSave} >Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
        </Box>
    )

}

export default SubmitActions;