
import * as React from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps } from "mui-datatables";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { cloneDeep, merge, omit } from 'lodash';

export interface TableColumn extends MUIDataTableColumn {
    width? : string
}

const defaultOptions: MUIDataTableOptions = {
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
        }
    }
};

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
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

    const theme = cloneDeep<Theme>(useTheme());

    const newProps = merge(
        { options: defaultOptions },
        props,
        { columns: extractMuiDateTableColumns(props.columns) }
    );

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...newProps}/>
        </MuiThemeProvider>        
    )

} 

export default Table;
