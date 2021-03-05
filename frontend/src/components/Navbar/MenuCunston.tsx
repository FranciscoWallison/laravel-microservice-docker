// @flow 
import { IconButton, Menu as MyMenu, MenuItem} from '@material-ui/core';
import * as React from 'react';
import logo from '../../static/img/logo.png';
import MenuIcon from '@material-ui/icons/Menu'


export const MenuCunston = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event:any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return (
        <React.Fragment>
           <IconButton 
                edge="start" 
                color="inherit" 
                aria-label="open drawer" 
                aria-controls="menu-appbar" 
                aria-haspopup="true"
                onClick={handleOpen}
            >
                    <MenuIcon/>
            </IconButton>
            <MyMenu
                id="menu-appbar"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                getContentAnchorEl={null}
            >
                <MenuItem
                    onClick={handleClose}
                >
                    Categoria
                </MenuItem>
            </MyMenu>            
        </React.Fragment>
 
    );
};