import React from 'react'
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles } from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) =>
    createStyles({
        wrapForm: {
            display: "flex",
            justifyContent: "center",
            width: "95%",
            margin: `${theme.spacing(0)} auto`
        },
        wrapText: {
            width: "100%"
        },
        button: {
            //margin: theme.spacing(1),
        },
    })
)

interface TextInputProps {
    value: string;
    setValue(value: string): any;
    sendMessage(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>): void;
}


export const TextInput: React.FC<TextInputProps> = (props) => {
    const classes = useStyles();
    return (
        <>
            <form className={classes.wrapForm} noValidate autoComplete="off" onSubmit={(e: React.FormEvent<HTMLFormElement>) => props.sendMessage(e)}>
                <TextField
                    id="standard-text"
                    label="Message..."
                    className={classes.wrapText}
                    /* onSubmit={(e: SubmitEvent) => props.sendMessage(e)} */
                    value={props.value}
                    onChange={(e) => { props.setValue(e.currentTarget.value) }}
                    inputProps={{ maxLength: 255 }}
                />
                <Button variant="contained" color="primary" className={classes.button} onClick={(e) => props.sendMessage(e)}>
                    Send
                </Button>
            </form>
        </>
    )
}
