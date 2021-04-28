import * as React from 'react';
import { SnackbarProvider as NotSnackbarProvider, SnackbarProviderProps, WithSnackbarProps } from 'notistack';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export const SnackbarProvider: React.FC<SnackbarProviderProps> = (props) => {

    let snackbarProviderRef: WithSnackbarProps;

    const defaultProps: SnackbarProviderProps =  {
        children: '',
        autoHideDuration: 3000,
        maxSnack:3,
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top'
        },
        preventDuplicate: true,
        ref: (el) => snackbarProviderRef = (el as any),
        action: (key) => (
            <IconButton
                color={"inherit"}
                style={{fontSize: 20}}
                onClick={() => snackbarProviderRef.closeSnackbar(key)}
            >
                <CloseIcon/>
            </IconButton>
        )
    }

    const newProps = {...defaultProps, ...props};

    return (
        <NotSnackbarProvider {...newProps}>
            {props.children}
        </NotSnackbarProvider>
    );
};