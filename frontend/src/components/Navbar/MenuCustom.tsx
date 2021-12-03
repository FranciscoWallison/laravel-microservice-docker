// @flow 
import { IconButton, Menu as MyMenu, MenuItem} from '@material-ui/core';
import * as React from 'react';
import MenuIcon from '@material-ui/icons/Menu'
import routes, {MyRouteProps} from "../../routes";
import { Link } from 'react-router-dom';


interface MenuListerRoutes {
    'dashboard' : string,
    'categorias.list' : string,
    'cast_members.list' : string,
    'genres.list' : string,
    'videos.list' : string,
}
  
const listRoutes: MenuListerRoutes = {
    'dashboard' : 'Dashboard',
    'categorias.list' : 'Categorias',
    'cast_members.list' : 'Membros de elenco',
    'genres.list' : 'Gêneros',
    'videos.list': 'Videos'
};

const menuRoutes = routes.filter(route => Object.keys(listRoutes).includes(route.name));

const MenuCustom = () => {
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
                {
                     Object.keys(listRoutes).map(
                        (routeName, key) => {
                            const route = menuRoutes.find(route => route.name === routeName) as MyRouteProps;
                            return (
                                <MenuItem
                                    key={key}
                                    component={Link}
                                    to={route.path as string}
                                    onClick={handleClose}
                                >
                                   { listRoutes[routeName as keyof MenuListerRoutes ] }
                                </MenuItem>
                            )
                        }
                    )
                }
                
            </MyMenu>            
        </React.Fragment>
 
    );
};

export default MenuCustom;