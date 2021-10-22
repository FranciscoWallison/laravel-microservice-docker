import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { IconButton, Menu as MuiMenu, MenuItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import routes, { MyRouteProps } from '../../routes';

const listRoutes = {
    'dashboard': 'Dashboard',
    'categories.list': 'Categorias',
    'cast_members.list': 'Membros de elenco',
    'genres.list': 'Gêneros',
    'videos.list': 'Videos'
};

const menuRoutes = routes.filter( route => Object.keys(listRoutes).includes(route.name));

export const MenuCustom = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <React.Fragment>
            <IconButton color="inherit" aria-label="open drawer" aria-controls="menu-appbar"
                aria-haspopup="true" onClick={handleOpen}>
                <MenuIcon />
            </IconButton>

            <MuiMenu id="menu-appbar"
                onClose={handleClose}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                getContentAnchorEl={null}
            >
                {
                    Object.keys(listRoutes).map((routeName, key) => {
                        const route = menuRoutes.find(route => route.name === routeName) as MyRouteProps;
                        return (
                            <MenuItem onClick={handleClose} key={key} component={Link} to={route.path as string}>
                                {listRoutes[routeName]}
                            </MenuItem>
                        )
                    })
                }
            </MuiMenu>
        </React.Fragment>
    );
};