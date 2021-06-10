
import * as React from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps } from "mui-datatables";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { cloneDeep, merge, omit } from 'lodash';
import { useMediaQuery } from '@material-ui/core';
import DebouncedTableSearch from './DebouncedTableSearch';

export interface TableColumn extends MUIDataTableColumn {
    width? : string
}

export const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Classificar",
        },
        pagination: {
            next: "Próxima página",
            previous: "Página anterior",
            rowsPerPage: "Por página:",
            displayRows: "de",
        },
        toolbar: {
            search: "Busca",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver Colunas",
            filterTable: "Filtrar Tabelas",
        },
        filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "LIMPAR",
        },
        viewColumns: {
            title: "Ver Colunas",
            titleAria: "Ver/Esconder Colunas da Tabela",
        },
        selectedRows: {
            text: "registro(s) selecionados",
            delete: "Excluir",
            deleteAria: "Excluir registros selecionados",
        },
    },
    customSearchRender: (
        searchText: string,
        handleSearch: any,
        hideSearch: any,
        options: any
    ) => {
        return <DebouncedTableSearch 
            searchText={searchText}
            onSearch={handleSearch}
            onHide={hideSearch}
            options={options}
            //debouceTime={debouncedSearchTime}
        />
    }
};

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    loading?: boolean;
}

const Table: React.FC<TableProps> = (props) => {

    function extractMuiDateTableColumns(columns: TableColumn[]): MUIDataTableColumn[] {
        return columns.map(column => omit(column, 'width'))
    }

    function setColumnsWith( columns: TableColumn[] ){
        columns.forEach( (column, key) => {
            if(column.width) {
                const overrides = theme.overrides as any;
                overrides.MUIDataTableHeadCell.fixedHeaderCommon[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }
        })
    }

    function applyLoading(){
        const textLabels = (newProps.options as any).textLabels;
        textLabels.body.noMatch = 
            newProps.loading === true ? 'Carregando...': textLabels.body.noMatch;
    }

    function applyResponsive() {
        newProps.options.responsive = isSmOrDown ? 'scrollMaxHeight' : 'stacked';
    }
    
    function getOriginalMuiDataTableProps(){
        return omit(newProps, 'loading');
    }

    const theme = cloneDeep<Theme>(useTheme());
    const isSmOrDown  = useMediaQuery(theme.breakpoints.down('sm'));

    const newProps = merge(
        { options: cloneDeep( defaultOptions ) },
        props,
        { columns: extractMuiDateTableColumns(props.columns) }
    );
    
    applyLoading();
    applyResponsive();
        
    const originalProps = getOriginalMuiDataTableProps();

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps}/>
        </MuiThemeProvider>        
    )

} 

export default Table;



export function makeActionStyles(column: any) {

    return (theme: any) => {
        const copyTheme = cloneDeep(theme)
        const selector = `&[data-testid^="MuiDataTableBodyCell-${column.length-1}"]`;
        (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
            paddingTop: '0px',
            paddingBottom: '0px'
        };
        return copyTheme;
    }

}
