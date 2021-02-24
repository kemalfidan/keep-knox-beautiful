import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CoreTypography from "src/components/core/typography";
import constants from "utils/constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            flexWrap: "wrap",
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 250,
        },
    })
);

export default function DateAndTimePickers() {
    const classes = useStyles();

    const printDate = (e: React.SyntheticEvent) => {
        const textArea = e.target as HTMLTextAreaElement;
        console.log(textArea.value);
    };

    return (
        <>
            <CoreTypography variant="h1">{`${constants.org.name.full} events`}</CoreTypography>
            <form className={classes.container} noValidate>
                <TextField
                    id="datetime-local"
                    label="Event Start"
                    type="datetime-local"
                    defaultValue="2021-05-24T10:30"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={printDate}
                />
            </form>
            {/* <form className={classes.container} noValidate>
                <TextField
                    id="date-local"
                    label="Event Start"
                    type="date"
                    defaultValue="2021-05-24T10:30"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={printDate}
                />
            </form>
            <form className={classes.container} noValidate>
                <TextField
                    id="time-local"
                    label="Event Start"
                    type="time"
                    defaultValue="10:30"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={printDate}
                />
            </form> */}

        </>
    );
}
