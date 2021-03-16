import * as React from 'react';
import { Container, makeStyles, Typography, Box} from '@material-ui/core';

const useStyles = makeStyles({
    title: {
        color: '#999999'
    },
});

type PageProps = {
    title: string
};
export const Page: React.FC<PageProps> = (props) => {
    const classes = useStyles();

    return (
        <Container>
            <Typography className={classes.title} component="h1" variant="h5">
                {props.title}
            </Typography>
            <Box paddingTop={2}>
                {props.children}
            </Box>           
        </Container>        
    );
};