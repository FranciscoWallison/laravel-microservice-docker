import {createMuiTheme} from "@material-ui/core";

const theme = createMuiTheme( {
    palette: {
        primary:{
            main: '#79aec8',
            contrastText: '#fff'
        },
        secondary: {
            main: '#4db5ab',
            contrastText: '#fff'
        },
        background: {
            default: '#fafafa'
        }
    } ,
    overrides: {

    }
});

export default theme;