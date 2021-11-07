import * as React from 'react';
import { useEffect, useState } from 'react';

import { Fade, ListItemSecondaryAction, IconButton, Theme } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch } from "react-redux";
import { useDebounce } from "use-debounce";

import { Upload } from "../../store/upload/types";
import { Creators } from '../../store/upload';
import { hasError, isFinished } from "../../store/upload/getters";

const useStyle = makeStyles((theme: Theme) => ({
    successIcon: {
        color: theme.palette.success.main
    },
    errorIcon: {
        color: theme.palette.error.main
    }
}));

interface UploadActionProps {
    upload: Upload;
    hover: boolean;
}

const UploadAction: React.FC<UploadActionProps> = (props) => {
    const classes = useStyle();
    const { upload, hover } = props;
    const dispatch = useDispatch();

    const error = hasError(upload);

    const [show, setShow] = useState(false);
    const [debouncedShow] = useDebounce(show, 2500);

    useEffect(() => {
        setShow(isFinished(upload));
    }, [upload]);

    return (
        debouncedShow ? (<Fade in={true} timeout={{ enter: 1000 }}>
            <ListItemSecondaryAction>
                <span hidden={hover}>
                    {
                        upload.progress === 1 && !error && (
                            <IconButton className={classes.successIcon}>
                                <CheckCircleIcon />
                            </IconButton>
                        )
                    }
                    {error && (
                        <IconButton className={classes.errorIcon}>
                            <ErrorIcon />
                        </IconButton>
                    )
                    }
                </span>
                <span hidden={!hover}>
                    <IconButton
                        color={"primary"}
                        onClick={() => dispatch(Creators.removeUpload({ id: upload.video.id }))}
                    >
                        <DeleteIcon />
                    </IconButton>
                </span>
            </ListItemSecondaryAction>
        </Fade>) : null
    );
};

export default UploadAction;