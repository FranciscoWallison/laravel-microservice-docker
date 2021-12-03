import * as React from 'react';
import { useState } from "react";

import { useSnackbar } from "notistack";
import classNames from 'classnames';
import { useSelector } from "react-redux";

import { UploadItem } from "./UploadItem";

import { Upload, UploadModule } from "../../store/upload/types";
import { countInProgress } from "../../store/upload/getters";

import { Card, CardActions, Typography, IconButton, Collapse, Theme, List } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        width: 450
    },
    cardActionRoot: {
        padding: "8px 8px 8px 16px",
        backgroundColor: theme.palette.primary.main
    },
    title: {
        fontWeight: "bold",
        color: theme.palette.primary.contrastText
    },
    icons: {
        marginLeft: "auto !important",
        color: theme.palette.primary.contrastText
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })

    },
    expandOpen: {
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0
    }
}));

interface SnackbarUploadProps {
    id: string | number;
}

const SnackbarUpload = React.forwardRef<any, SnackbarUploadProps>((props, ref) => {

    const { id } = props;
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState<boolean>(true);

    const uploads = useSelector<UploadModule, Upload[]>((state) => state.upload.uploads);

    const totalInProgress = countInProgress(uploads);

    return (
      
            <Card ref={ref} className={classes.card}>
                <CardActions classes={{ root: classes.cardActionRoot }}>
                    <Typography variant={"subtitle2"} className={classes.title}>
                        Fazendo o upload de {totalInProgress} vídeo(s)
                    </Typography>
                    <div className={classes.icons}>
                        <IconButton color={"inherit"} onClick={() => setExpanded(!expanded)}>
                            <ExpandMoreIcon className={classNames(classes.expand, { [classes.expandOpen]: !expanded })} />
                        </IconButton>
                        <IconButton color={"inherit"} onClick={() => closeSnackbar(id)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </CardActions>
                <Collapse in={expanded}>
                    <List className={classes.list}>
                        {uploads.map((upload: Upload, key) => (
                            <UploadItem key={key} upload={upload} />
                        ))}

                    </List>
                </Collapse>
            </Card>
  
        
    );
});

export default SnackbarUpload;
