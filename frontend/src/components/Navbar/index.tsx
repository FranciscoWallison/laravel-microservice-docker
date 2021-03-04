// @flow 
import { AppBar, Toolbar, Typography, Button, makeStyles, Theme} from '@material-ui/core';
import * as React from 'react';
import logo from '../../static/img/logo.png';
const useStyles = makeStyles( (theme: Theme) => ({
    toolbar: {
    backgroundColor: '#000000'
    },
    title: {
        flexGrow: 1,
        textAlign: 'center'
    },
    logo: {
        width: 100,
        [theme.breakpoints.up('sm')]: {
            width: 170
        }
    }
}));

type Props = {
    
};
export const Navbar = (props: Props) => {
    const classes = useStyles();
    
    return (
        
        <AppBar>
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title}>
                    <img src={logo} alt="codeFlix" className={classes.logo}/>                    
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
};