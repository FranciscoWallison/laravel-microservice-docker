import * as React from 'react';
import { Fragment, MutableRefObject, RefAttributes, useImperativeHandle, useRef, useState } from 'react';

import { TextField, TextFieldProps } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";

export interface InputFileProps extends RefAttributes<InputFileComponent> {
    ButtonFile: React.ReactNode;
    InputFileProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    TextFieldProps?: TextFieldProps

}

export interface InputFileComponent {
    openWindow: () => void;
    clear: () => void;
}

const InputFile = React.forwardRef<InputFileComponent, InputFileProps>((props, ref) => {

    const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [fileName, setFileName] = useState<string>("");

    const textFieldProps: TextFieldProps = {
        variant: "outlined",
        ...props.TextFieldProps,
        InputProps: {
            ...(
                props.TextFieldProps && props.TextFieldProps.InputProps && { ...props.TextFieldProps.InputProps }
            ),
            readOnly: true,
            endAdornment: (
                <InputAdornment position={"end"}>
                    {props.ButtonFile}
                </InputAdornment>
            )
        },
        value: fileName
    };

    const inputFileProps = {
        ...props.InputFileProps,
        hidden: true,
        ref: fileRef,
        // multiple: true,
        onChange: (event: any) => {
            const files = event.target.files;
            if (files.length) {
                setFileName(
                    Array.from(files).map((file: any) => file.name).join(", ")
                );
            }

            if (props.InputFileProps && props.InputFileProps.onChange) {
                props.InputFileProps.onChange(event);
            }
        },

    };

    useImperativeHandle(ref, () => ({
        openWindow: () => fileRef.current.click(),
        clear: () => setFileName("")
    }));

    return (
        <Fragment>
            <input type="file" {...inputFileProps} />
            <TextField
                {...textFieldProps}
            />
        </Fragment>
    );
});


export default InputFile;