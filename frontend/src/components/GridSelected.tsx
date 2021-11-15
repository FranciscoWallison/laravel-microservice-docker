import * as React from 'react';

import { GridProps, Theme, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: '#f1f1f1',
        borderRadius: '4px',
        padding: theme.spacing(1, 1),
        color: theme.palette.secondary.main
    }
}));

interface GridSelected extends GridProps {

}

const GridSelected: React.FC<GridSelected> = (props) => {
    const classes = useStyles();
    return (
        <Grid container wrap={"wrap"} className={classes.root} {...props}>
            {props.children}
        </Grid>
    );
};

export default GridSelected;