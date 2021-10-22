import * as React from 'react';
import { useRef, MutableRefObject, useImperativeHandle } from "react";

import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import InputFile, { InputFileComponent } from "../../../components/InputFile";

interface UploadFieldProps {
    label: string;
    accept: string;
    setValue: (value) => void;
    error?: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps
}

export interface UploadFieldComponent {
    clear: () => void;
}

export const UploadField =
    React.forwardRef<UploadFieldComponent, UploadFieldProps>
        ((props, ref) => {

            const fileRef = useRef() as MutableRefObject<InputFileComponent>;

            const { label, accept, setValue, disabled, error } = props;

            useImperativeHandle(ref, () => ({
                clear: () => fileRef.current.clear()
            }));

            return (
                <FormControl
                    error={error !== undefined}
                    disabled={disabled === true}
                    fullWidth
                    margin={"normal"}
                    {...props.FormControlProps}
                >
                    <InputFile
                        ref={fileRef}
                        TextFieldProps={{
                            label: label,
                            InputLabelProps: { shrink: true },
                            style: { backgroundColor: '#ffffff' },
                            disabled: disabled === true
                        }}
                        InputFileProps={{
                            accept,
                            onChange(event) {
                                const files = event.target.files as any;
                                files.length && setValue(files[0])
                            },
                            disabled: disabled === true
                        }}
                        ButtonFile={
                            <Button
                                endIcon={<CloudUploadIcon />}
                                variant={"contained"}
                                color={"primary"}
                                onClick={() => fileRef.current.openWindow()}
                                disabled={disabled === true}
                            >
                                Adicionar
                    </Button>
                        }
                    />

                </FormControl>
            );
        });