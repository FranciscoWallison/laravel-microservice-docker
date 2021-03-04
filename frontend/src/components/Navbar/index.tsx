// @flow 
import { AppBar, Toolbar, Typography, Button, makeStyles} from '@material-ui/core';
import * as React from 'react';
import logo from '../../static/img/logo.png';
const useStyles = makeStyles({
    toolbar: {
        backgroundColor: '#000000'
    },
    title: {
        flexGrow: 1,
        textAlign: 'center'
    }
});

type Props = {
    
};
export const Navbar = (props: Props) => {
    const classes = useStyles();
    
    return (
        
        <AppBar>
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title}>
                    <img src={logo} alt="codeFlix"/>                    
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
};