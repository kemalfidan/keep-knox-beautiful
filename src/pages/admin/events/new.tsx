import React, { useState } from "react";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { Event } from "utils/types";
import { NextPage } from "next";
import constants from "utils/constants";
import CoreTypography from "src/components/core/typography/CoreTypography";
import colors from "src/components/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { isSameDay, format } from "date-fns";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { DateTimePicker } from "@material-ui/pickers";
import TodayIcon from "@material-ui/icons/Today";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

const AddEventPage: NextPage = () => {
    const styles = useStyles();
    const [selectedDate, handleDateChange] = useState<Date | null>(new Date());

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event.target);
    };

    return (
        <>
            <Header />

            <Container maxWidth="xl" className={styles.pageHeader}>
                <CoreTypography variant="h1">Add New Event</CoreTypography>
            </Container>

            <Container maxWidth="xl" className={styles.bodyWrapper}>
                <Container maxWidth="md" className={styles.formWrapper}>
                    <form className={styles.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                id="name"
                                label="Event Name"
                                fullWidth
                                color="secondary"
                                rowsMax={4}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <DateTimePicker
                                value={selectedDate}
                                variant="inline"
                                disablePast
                                onChange={handleDateChange}
                                label="Start Date"
                                showTodayButton
                                color="secondary"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <TodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <DateTimePicker
                                value={selectedDate}
                                variant="inline"
                                disablePast
                                onChange={handleDateChange}
                                label="End Date"
                                showTodayButton
                                color="secondary"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <TodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div>
                            <DateTimePicker
                                value={selectedDate}
                                variant="inline"
                                disablePast
                                onChange={handleDateChange}
                                label="Registration Starts"
                                showTodayButton
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <TodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <DateTimePicker
                                value={selectedDate}
                                variant="inline"
                                disablePast
                                onChange={handleDateChange}
                                label="Registration Ends"
                                showTodayButton
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <TodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div>
                            <TextField
                                id="duration"
                                label="Event Duration"
                                type="number"
                                rowsMax={4}
                                color="secondary"
                                // InputProps={{
                                //     endAdornment: <InputAdornment position="start">Hours</InputAdornment>,
                                // }}
                                onChange={handleChange}
                            />
                            <TextField
                                id="maxVolunteers"
                                label="Max Volunteers"
                                type="number"
                                rowsMax={4}
                                color="secondary"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <TextField
                                id="location"
                                label="Location"
                                variant="filled"
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                id="description"
                                label="Description"
                                variant="filled"
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                id="caption"
                                label="Caption"
                                variant="filled"
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            {/* <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            />
                            <label htmlFor="raised-button-file">
                            <Button variant="outlined" component="span">
                                Upload
                            </Button>
                            </label>  */}

                            <Button variant="contained" component="label" className={styles.button}>
                                <CoreTypography variant="body1">Browse</CoreTypography>
                                <input type="file" hidden />
                            </Button>
                        </div>
                        <Button variant="contained" type="submit" className={styles.button}>
                            <CoreTypography variant="body1">Create Event</CoreTypography>
                        </Button>
                    </form>
                </Container>
            </Container>

            <Footer />
        </>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageHeader: {
            backgroundColor: theme.palette.primary.main,
            textAlign: "center",
            height: "220px",
            color: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "30px",
        },
        bodyWrapper: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        formWrapper: {
            marginTop: "30px",
            marginBottom: "100px",
        },
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(2),
            },
        },
        margin: {
            margin: theme.spacing(1),
        },
        button: {
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
        },
    })
);

export default AddEventPage;
