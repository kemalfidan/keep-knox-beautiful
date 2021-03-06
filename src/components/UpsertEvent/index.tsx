import React, { useState } from "react";
import CoreTypography from "src/components/core/typography/CoreTypography";
import colors from "src/components/core/colors";
import errorConstants from "utils/errors";
import urls from "utils/urls";
import constants from "utils/constants";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ApiResponse, Event } from "utils/types";
import { isBefore } from "date-fns";

// quill
const ReactQuill = dynamic(import("react-quill"), { ssr: false, loading: () => <p>Loading ...</p> });
import "react-quill/dist/quill.snow.css";

// material ui
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import { DateTimePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import TodayIcon from "@material-ui/icons/Today";
import PublishIcon from "@material-ui/icons/Publish";
import DescriptionIcon from "@material-ui/icons/Description";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SubjectIcon from "@material-ui/icons/Subject";
import InfoIcon from "@material-ui/icons/Info";

interface IFormValues {
    name?: string;
    startDate?: MaterialUiPickersDate | undefined;
    endDate?: MaterialUiPickersDate | undefined;
    startRegistration?: MaterialUiPickersDate | undefined;
    endRegistration?: MaterialUiPickersDate | undefined;
    hours?: number;
    maxVolunteers?: number;
    groupSignUp?: boolean;
    location?: string;
    description?: string;
    caption?: string;
    image?: File | null;
    [key: string]: MaterialUiPickersDate | string | number | File | boolean | undefined | null;
}

interface IErrors {
    fileTooLarge?: boolean;
    submissionError?: boolean;
    emptyQuill?: boolean;
    startDateError?: boolean;
    registrationDateError?: boolean;
}

interface Props {
    existingEvent?: Event;
}

const UpsertEvent: React.FC<Props> = ({ existingEvent }) => {
    const styles = useStyles();
    const initialDate = new Date(Date.now());
    const [errors, setErrors] = useState<IErrors>({});
    const [loading, setLoading] = useState<boolean>();
    const [values, setValues] = useState<IFormValues>({
        startDate: existingEvent?.startDate || initialDate,
        endDate: existingEvent?.endDate || initialDate,
        startRegistration: existingEvent?.startRegistration || initialDate,
        endRegistration: existingEvent?.endRegistration || initialDate,
        name: existingEvent?.name,
        hours: existingEvent?.hours,
        maxVolunteers: existingEvent?.maxVolunteers,
        groupSignUp: existingEvent?.groupSignUp || false,
        location: existingEvent?.location,
        description: existingEvent?.description,
        caption: existingEvent?.caption,
    });
    const router = useRouter();

    // quill formatted text options
    const modules = {
        toolbar: {
            container: [
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }, { align: [] }],
                ["link", "clean"],
            ],
        },
        clipboard: { matchVisual: false },
    };

    const handleQuillChange = (content: string) => {
        setValues(values => ({ ...values, ["description"]: content }));
    };

    // check required date fields on submit since MUI doesnt check it for dates
    const handleDateChange = (id: string) => (date: MaterialUiPickersDate) => {
        setValues(values => ({ ...values, [id]: date }));
    };

    // text and number state changes
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValues(values => ({ ...values, [event.target.id]: event.target.value }));
    };

    // boolean state changes
    const handleBoolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues(values => ({ ...values, [event.target.id]: event.target.checked }));
    };

    // most error checking is done on input but this function runs when form is submitted
    // returns true if any errors are found
    const errorCheckFields = async () => {
        const emptyDescription = "<p><br></p>";
        let anyErrors = false;

        // clear past errors since this is a new submission
        setErrors(errors => ({ ...errors, ["submissionError"]: false }));
        setErrors(errors => ({ ...errors, ["startDateError"]: false }));
        setErrors(errors => ({ ...errors, ["registrationDateError"]: false }));
        setErrors(errors => ({ ...errors, ["emptyQuill"]: false }));

        // start and registration date checking
        if (isBefore(values.endDate as Date, values.startDate as Date)) {
            setErrors(errors => ({ ...errors, ["startDateError"]: true }));
            anyErrors = true;
        }
        if (isBefore(values.endRegistration as Date, values.startRegistration as Date)) {
            setErrors(errors => ({ ...errors, ["registrationDateError"]: true }));
            anyErrors = true;
        }

        // quill error checking
        if (!values.description || values.description == "" || values.description == emptyDescription) {
            setErrors({ ...errors, ["emptyQuill"]: true });
            anyErrors = true;
        }

        // set on upload
        if (errors.fileTooLarge) {
            anyErrors = true;
        }

        return anyErrors;
    };

    // handle form submission, essentially just creating formdata to send
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (await errorCheckFields()) {
            return;
        }

        setLoading(true);
        const fd = new FormData();
        let key: string;
        for (key in values) {
            if (typeof values[key] === "string") {
                fd.append(key, values[key] as string);
            } else if (typeof values[key] === "number") {
                fd.append(key, values[key]?.toString() as string);
            } else if (typeof values[key] === "boolean") {
                fd.append(key, values[key]?.toString() as string);
            } else if (values[key] instanceof Date) {
                fd.append(key, new Date(values[key] as Date).toUTCString());
            } else if (values[key] instanceof File) {
                fd.append(key, values[key] as Blob);
            }
        }

        // either create or update an event depending on whether we have the _id for the
        // event that was passed in
        let r;
        if (existingEvent && existingEvent?._id) {
            // update
            r = await fetch(urls.api.event(existingEvent._id), {
                method: "POST",
                body: fd,
            });
        } else {
            // create
            r = await fetch(urls.api.events, {
                method: "POST",
                body: fd,
            });
        }
        const response = (await r.json()) as ApiResponse;
        setLoading(false);

        // error check response
        if (response) {
            if (response.success) {
                await router.push(urls.pages.adminHome);
            } else {
                setErrors(errors => ({ ...errors, ["submissionError"]: true }));
            }
        } else {
            setErrors(errors => ({ ...errors, ["submissionError"]: true }));
        }
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            errorCheckImage(event.dataTransfer.files[0]);
        }
    };

    const handleFileUpload = (event: React.SyntheticEvent) => {
        event.persist();

        const target = event?.target as HTMLInputElement;
        if (target && target.files && target.files.length > 0 && target.files?.item(0)) {
            errorCheckImage(target.files?.item(0) as File);
        }
    };

    const errorCheckImage = (image: File) => {
        if (image.size >= constants.contentfulImageLimit) {
            setValues(values => ({ ...values, ["image"]: undefined }));
            setErrors(errors => ({ ...errors, ["fileTooLarge"]: true }));
            return;
        }
        setErrors(errors => ({ ...errors, ["fileTooLarge"]: false }));
        setValues(values => ({ ...values, ["image"]: image }));
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

    const getImageDisplay = () => {
        if (values.image) {
            // once user uploads a new image, that display should take precedence
            return <CoreTypography variant="body2">{values.image.name}</CoreTypography>;
        } else if (existingEvent && existingEvent.image && existingEvent.image.url) {
            // show a link to the existing image if it exists and only if the user hasn't uploaded a new image
            return (
                <a href={existingEvent.image.url} target="_blank" rel="noreferrer" style={{ paddingTop: "15px" }}>
                    <CoreTypography variant="body2">Existing Image</CoreTypography>
                </a>
            );
        }
    };

    return (
        <>
            <Container maxWidth="xl" className={styles.pageHeader}>
                <CoreTypography variant="h1">
                    {existingEvent && existingEvent._id ? "Update Event" : "Add New Event"}
                </CoreTypography>
            </Container>

            <Container maxWidth="xl" className={styles.bodyWrapper}>
                <Container maxWidth="md" className={styles.formWrapper}>
                    <form className={styles.root} autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                id="name"
                                label="Event Name"
                                value={values.name}
                                required
                                fullWidth
                                color="secondary"
                                rowsMax={4}
                                onChange={handleTextChange}
                            />
                        </div>

                        <div>
                            <DateTimePicker
                                value={values.startDate}
                                variant="inline"
                                required
                                disablePast
                                onChange={handleDateChange("startDate")}
                                label="Start Date"
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
                                value={values.endDate}
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
                                value={values.startRegistration}
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
                                value={values.endRegistration}
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
                                value={values.hours}
                                helperText="Total duration in hours."
                                required
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                            />
                            <TextField
                                id="maxVolunteers"
                                label="Max Volunteers"
                                type="number"
                                value={values.maxVolunteers}
                                helperText="Value of 0 will hide signup form."
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                            />
                        </div>

                        <div style={{ margin: "0px 15px" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="groupSignUp"
                                        checked={values.groupSignUp}
                                        onChange={handleBoolChange}
                                        color="secondary"
                                    />
                                }
                                label="Allow group sign ups?"
                            />
                        </div>

                        <div className={styles.align}>
                            <LocationOnIcon style={{ fontSize: "40px", marginTop: "30px" }} />
                            <TextField
                                id="location"
                                label="Location"
                                value={values.location}
                                required
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                            />
                        </div>
                        <div style={{ margin: "10px 0px -10px 10px" }}>
                            <Tooltip
                                enterTouchDelay={0}
                                leaveTouchDelay={5000}
                                title="Be careful when pasting formatted text. It's recommended to 
                            clear the formatting (on the very right) and then format it in the editor."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </div>
                        <div className={styles.align}>
                            <DescriptionIcon style={{ fontSize: "40px", marginTop: "15px" }} />
                            <div className={styles.quillWrapper}>
                                <ReactQuill
                                    id="description"
                                    value={values.description || ""}
                                    onChange={handleQuillChange}
                                    theme="snow"
                                    modules={modules}
                                    placeholder="Add description"
                                />
                                <CoreTypography variant="body2" className={styles.error}>
                                    {errors.emptyQuill && errorConstants.EMPTY_DESC}
                                </CoreTypography>
                            </div>
                        </div>
                        <div className={styles.align}>
                            <SubjectIcon style={{ fontSize: "40px", marginTop: "30px" }} />
                            <TextField
                                id="caption"
                                label="Caption"
                                value={values.caption}
                                required
                                fullWidth
                                multiline
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
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
                                {getImageDisplay()}
                                <CoreTypography variant="body2" className={styles.error}>
                                    {errors.fileTooLarge && errorConstants.IMAGE_TOO_LARGE}
                                </CoreTypography>
                            </div>
                        </div>

                        <Container maxWidth="md" className={styles.errorMessages}>
                            <CoreTypography variant="body2" className={styles.error}>
                                {errors.submissionError && errorConstants.FORM_SUBMISSION_ERROR}
                                {errors.startDateError && "The event's end date can not be before the start date. "}
                                {errors.registrationDateError &&
                                    "The registration end date can not be before the registration start date. "}
                            </CoreTypography>
                        </Container>
                        {loading && <LinearProgress color="secondary" />}

                        <Button
                            variant="contained"
                            type="submit"
                            className={styles.button}
                            style={{ marginTop: "40px", float: "right" }}
                        >
                            <CoreTypography variant="button">
                                {existingEvent && existingEvent._id ? "Update" : "Create"} Event
                            </CoreTypography>
                        </Button>
                    </form>
                </Container>
            </Container>
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
        align: {
            display: "flex",
            alignItems: "top",
            justifyContent: "left",
            marginLeft: "-40px",
        },
        quillWrapper: {
            margin: "15px",
            width: "100%",
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
        error: {
            color: theme.palette.error.main,
        },
        errorMessages: {
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
    })
);

export default UpsertEvent;
