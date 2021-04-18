import {createMuiTheme} from "@material-ui/core";
import { PaletteOptions, SimplePaletteColorOptions } from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
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
}

const theme = createMuiTheme( {
    palette,
    overrides: {
        MUIDataTable: {
            paper: {
                boxShadow: "none",
                // marginTop: "5%",
            }
        },
        MUIDataTableToolbar: {
            root: {
                minHeight: '58px',
                backgroundColor: palette.background?.default,
            },
            icon: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
                '&:hover, &:active, &:focus': {
                    color: (palette!.secondary as SimplePaletteColorOptions).dark,
                },
            },
            iconActive: {
                color: (palette!.secondary as SimplePaletteColorOptions).dark,
                '&:hover, &:active, &:focus': {
                    color: (palette!.secondary as SimplePaletteColorOptions).dark,
                },
            },
        },
        MUIDataTableHeadCell: {
            headers: {
                borderColor: '#a03838'
            },
            fixedHeaderCommon: {
                paddingTop: 8,
                paddingBottom: 8,
                backgroundColor: (palette!.primary as SimplePaletteColorOptions).main,
                color: '#000000',
                '&[aria-sort]': {
                    backgroundColor: '#459ac4',
                },
            },
            sortActive: {
                color: '#000000',
            },
            sortAction: {
                alignItems: 'center',
            },
            sortLabelRoot: {
                '& svg': {
                    color: '#000000 !important',
                },
            },
        },
        MUIDataTableSelectCell: {
            root: {
                backgroundColor: 'transparent !important',
            },
            headerCell: {
                backgroundColor: `${(palette!.primary as SimplePaletteColorOptions).main} !important`,
                '& span': {
                    color: '#ffffff !important',
                },
            },
        },
        MUIDataTableBodyCell: {
            root: {
                padding: 8,
                color: (palette!.secondary as SimplePaletteColorOptions).main,
                '&:hover, &:active, &:focus': {
                    color: (palette!.secondary as SimplePaletteColorOptions).main,
                },
            },
        },
        MUIDataTableToolbarSelect: {
            title: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
            },
            iconButton: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
            },
        },
        MUIDataTableBodyRow: {
            root: {
                '&:nth-child(odd)': {
                    backgroundColor: palette!.background!.default,
                },
            },
        },
        MUIDataTablePagination: {
            root: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
            },
        },
    }
});

export default theme;