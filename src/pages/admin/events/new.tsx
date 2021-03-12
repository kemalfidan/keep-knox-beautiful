import React, { useState } from "react";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { Event } from "utils/types";
import { NextPage } from "next";
import constants from "utils/constants";
import CoreTypography from "src/components/core/typography/CoreTypography";
import colors from "src/components/core/colors";
import { isSameDay, format } from "date-fns";

// material ui
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { DateTimePicker } from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import TodayIcon from "@material-ui/icons/Today";
import PublishIcon from "@material-ui/icons/Publish";

interface IFormValues {
    name?: string;
    startDate?: MaterialUiPickersDate | undefined;
    endDate?: MaterialUiPickersDate | undefined;
    startRegistration?: MaterialUiPickersDate | undefined;
    endRegistration?: MaterialUiPickersDate | undefined;
    hours?: number;
    volunteers?: number;
    location?: string;
    description?: string;
    caption?: string;
    image?: File | null;
    [key: string]: MaterialUiPickersDate | string | number | File | undefined | null;
}

const AddEventPage: NextPage = () => {
    const styles = useStyles();
    const initialDate = new Date(Date.now());
    const [values, setValues] = useState<IFormValues>({
        startDate: initialDate,
        endDate: initialDate,
        startRegistration: initialDate,
        endRegistration: initialDate,
    });

    // check required date fields on submit since MUI doesnt check it for dates
    const handleDateChange = (id: string) => (date: MaterialUiPickersDate) => {
        setValues(values => ({ ...values, [id]: date }));
    };

    // text and number state changes
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValues(values => ({ ...values, [event.target.id]: event.target.value }));
    };

    // handle form submission, essentially just creating formdata to send
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fd = new FormData();
        let key: string;
        for (key in values) {
            if (typeof values[key] === "string") {
                fd.append(key, values[key] as string);
            } else if (values[key] && values[key] instanceof Date) {
                fd.append(key, new Date(values[key] as Date).toUTCString());
            } else {
                fd.append(key, values[key] as Blob);
            }
        }
        const response = await fetch("/api/events", {
            method: "POST",
            body: fd,
        });
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setValues(values => ({ ...values, ["image"]: event.dataTransfer.files[0] }));
        }
    };

    const handleFileUpload = (event: React.SyntheticEvent) => {
        event.persist();

        const target = event?.target as HTMLInputElement;
        if (target.files && target.files.length > 0 && target.files[0]) {
            setValues(values => ({ ...values, ["image"]: target?.files?.item(0) }));
        }
    };

    // these 2 below are needed to handle onFileDrop properly
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    };
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <>
            <Header />

            <Container maxWidth="xl" className={styles.pageHeader}>
                <CoreTypography variant="h1">Add New Event</CoreTypography>
            </Container>

            <Container maxWidth="xl" className={styles.bodyWrapper}>
                <Container maxWidth="md" className={styles.formWrapper}>
                    <form className={styles.root} autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                id="name"
                                label="Event Name"
                                required
                                fullWidth
                                color="secondary"
                                rowsMax={4}
                                onChange={handleTextChange}
                            />
                        </div>

                        <div>
                            <DateTimePicker
                                value={values["startDate"]}
                                variant="inline"
                                required
                                disablePast
                                onChange={handleDateChange("startDate")}
                                label="Start Date"
                                // showTodayButton // cant show in inline mode
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
                                value={values["endDate"]}
                                variant="inline"
                                required
                                disablePast
                                onChange={handleDateChange("endDate")}
                                label="End Date"
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
                                value={values["startRegistration"]}
                                variant="inline"
                                required
                                disablePast
                                onChange={handleDateChange("startRegistration")}
                                label="Registration Starts"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <TodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <DateTimePicker
                                value={values["endRegistration"]}
                                variant="inline"
                                required
                                disablePast
                                onChange={handleDateChange("endRegistration")}
                                label="Registration Ends"
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
                                id="hours"
                                label="Event Duration"
                                type="number"
                                required
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                                // InputProps={{
                                //     endAdornment: <InputAdornment position="start">Hours</InputAdornment>,
                                // }}
                                // onChange={handleChange}
                            />
                            <TextField
                                id="maxVolunteers"
                                label="Max Volunteers"
                                type="number"
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                                // onChange={handleChange}
                            />
                        </div>

                        <div>
                            <TextField
                                id="location"
                                label="Location"
                                variant="filled"
                                required
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                                // onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                id="description"
                                label="Description"
                                variant="filled"
                                required
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                                // onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                id="caption"
                                label="Caption"
                                variant="filled"
                                required
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                                // onChange={handleChange}
                            />
                        </div>

                        <div className={styles.fileUploadContainer}>
                            <div
                                className={styles.fileUploadWrapper}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDrop={handleFileDrop}
                            >
                                <PublishIcon style={{ fontSize: "100px" }} />
                                <CoreTypography variant="body1" style={{ paddingBottom: "20px" }}>
                                    Drag and Drop Image
                                </CoreTypography>
                                <Button variant="contained" component="label" className={styles.button}>
                                    <input type="file" hidden onChange={handleFileUpload} />
                                    <CoreTypography variant="button">Browse</CoreTypography>
                                </Button>
                                <CoreTypography variant="body2">{values.image && values.image.name}</CoreTypography>
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            type="submit"
                            className={styles.button}
                            style={{ marginTop: "40px", float: "right" }}
                        >
                            <CoreTypography variant="button">Create Event</CoreTypography>
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
            minWidth: "150px",
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
        },
        fileUploadContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
        },
        fileUploadWrapper: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed",
            borderColor: colors.grays["60"],
            borderRadius: "5px",
            borderWidth: "2px",
            padding: "30px 90px",
            paddingTop: "20px",
        },
    })
);

export default AddEventPage;
