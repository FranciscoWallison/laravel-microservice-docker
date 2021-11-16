import * as React from 'react';
import { MutableRefObject, RefAttributes, useCallback, useImperativeHandle, useRef } from "react";

import { FormControl, FormControlProps, Typography } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";

import useHttpHandled from "../../../hooks/useHttpHandled";
import useCollectionManager from "../../../hooks/useCollectionManager";
import castMemberHttp from "../../../util/http/cast-members-http";
import { AsyncAutoComplete, AsyncAutoCompleteComponent } from "../../../components/AsyncAutoComplete";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";

interface CastMemberFieldProps extends RefAttributes<CastMemberFieldComponent> {
    castMembers: any[];
    setCastMembers: (cast_members: void) => void;
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps
}

export interface CastMemberFieldComponent {
    clear: () => void;
}

export const CastMemberField = React.forwardRef<CastMemberFieldComponent, CastMemberFieldProps>((props, ref) => {
    const {
        castMembers,
        setCastMembers,
        error,
        disabled
    } = props;

    const autoCompleteHttp = useHttpHandled();
    const { addItem, removeItem } = useCollectionManager(castMembers, setCastMembers);

    const autoCompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>;

    const fetchOptions = useCallback((searchText) => {
        return autoCompleteHttp(
            castMemberHttp.list({ queryParams: { search: searchText, all: "" } })
        ).then(data => data.data).catch(error => console.log(error));
    }, [autoCompleteHttp])

    useImperativeHandle(ref, () => ({
        clear: () => autoCompleteRef.current.clear()
    }));

    return (
        <React.Fragment>
            <AsyncAutoComplete
                ref={autoCompleteRef}
                fetchOptions={fetchOptions}
                TextFieldProps={{
                    label: "Membros de elenco",
                    error: error !== undefined
                }}
                AutocompleteProps={{
                    clearOnEscape: true,
                    freeSolo: true,
                    getOptionSelected: (option, value) => option.id === value.id,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled
                }}
            />
            <FormControl
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
                fullWidth
                margin={"normal"}
            >
                <GridSelected>
                    {
                        castMembers.map((castMember, key) => (
                            <GridSelectedItem key={key} onDelete={() => removeItem(castMember)} xs={6}>
                                <Typography>{castMember.name}</Typography>
                            </GridSelectedItem>
                        ))
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>

        </React.Fragment>
    );
});