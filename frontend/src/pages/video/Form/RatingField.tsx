import * as React from 'react';
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel, { FormControlLabelProps } from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import Rating from "../../../components/Rating";
import { Box } from "@material-ui/core";

interface RatingFieldProps {
    value: string;
    setValue: (value: any) => void;
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps
}

const ratings: FormControlLabelProps[] = [
    { value: 'L', control: <Radio color={"primary"} />, label: <Rating rating={"L"} />, labelPlacement: "top" },
    { value: '10', control: <Radio color={"primary"} />, label: <Rating rating={"10"} />, labelPlacement: "top" },
    { value: '12', control: <Radio color={"primary"} />, label: <Rating rating={"12"} />, labelPlacement: "top" },
    { value: '14', control: <Radio color={"primary"} />, label: <Rating rating={"14"} />, labelPlacement: "top" },
    { value: '16', control: <Radio color={"primary"} />, label: <Rating rating={"16"} />, labelPlacement: "top" },
    { value: '18', control: <Radio color={"primary"} />, label: <Rating rating={"18"} />, labelPlacement: "top" },
];

export const RatingField: React.FC<RatingFieldProps> = (props) => {
    const { value, setValue, disabled, error } = props;

    return (
        <FormControl
            error={error !== undefined}
            disabled={disabled === true}
            {...props.FormControlProps}
        >
            <FormLabel component="legend">Classificação</FormLabel>
            <Box paddingTop={1}>
                <RadioGroup aria-label="classificacao"
                    name={"rating"}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    row
                >
                    {ratings.map(
                        (props, key) => <FormControlLabel key={key} {...props} />
                    )}
                </RadioGroup>
            </Box>
            {
                error && <FormHelperText>{error.message}</FormHelperText>
            }
        </FormControl>
    );
}; 