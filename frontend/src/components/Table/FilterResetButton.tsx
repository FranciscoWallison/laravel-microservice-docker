import * as React from 'react';

import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    IconButton: (theme.overrides as any).MUIDataTableToolbar.icon
}));


interface FilterResetButtonProps {
    handleClick: () => void;
}

const FilterResetButton: React.FC<FilterResetButtonProps> = (props) => {
    const classes = useStyles();
    return (
        <Tooltip title={"Limpar busca"}>
            <IconButton onClick={props.handleClick}>
                <ClearAllIcon className={classes.IconButton} />
            </IconButton>
        </Tooltip>
    );
};


export default FilterResetButton;