import React, { useState } from "react";
import CoreTypography from "src/components/core/typography/CoreTypography";
import colors from "src/components/core/colors";
import errorConstants from "utils/errors";
import urls from "utils/urls";
import { useRouter } from "next/router";
import { ApiResponse, Volunteer } from "utils/types";
import InputMask from "react-input-mask";

// material ui
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

interface IFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    [key: string]: string | undefined;
}

interface IErrors {
    submissionError?: boolean;
}

interface Props {
    existingVol: Volunteer;
}

const UpdateVolunteer: React.FC<Props> = ({ existingVol }) => {
    const styles = useStyles();
    const [errors, setErrors] = useState<IErrors>({});
    const [loading, setLoading] = useState<boolean>();
    const [values, setValues] = useState<IFormValues>({
        firstName: existingVol.name.split(" ")[0],
        lastName: existingVol.name.split(" ")[1],
        email: existingVol.email || "",
        phoneNumber: existingVol.phone,
    });
    const router = useRouter();

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValues(values => ({ ...values, [event.target.id]: event.target.value }));
    };

    const handleInputMaskChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        event.preventDefault();
        setValues(values => ({ ...values, ["phoneNumber"]: event.target?.value }));
    };

    // handle form submission, essentially just creating formdata to send
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // clear past submission error since this is a new submission
        if (errors.submissionError) {
            setErrors({ ...errors, ["submissionError"]: false });
        }

        setLoading(true);
        const formdata = new FormData();
        const name = `${values.firstName} ${values.lastName}`;
        formdata.append("name", name);
        formdata.append("email", values.email);
        formdata.append("phone", values.phoneNumber as string);

        // update volunteer info
        let r;
        let response;
        if (existingVol && existingVol._id) {
            r = await fetch(urls.api.volunteer(existingVol._id), {
                method: "POST",
                body: formdata,
            });

            response = (await r.json()) as ApiResponse;
        }
        setLoading(false);

        // error check response
        if (response) {
            if (response.success) {
                if (existingVol._id) {
                    await router.push(urls.pages.volunteer(existingVol._id));
                }
            } else {
                setErrors(errors => ({ ...errors, ["submissionError"]: true }));
            }
        } else {
            setErrors(errors => ({ ...errors, ["submissionError"]: true }));
        }
    };

    return (
        <>
            <Container maxWidth="xl" className={styles.pageHeader}>
                <CoreTypography variant="h1">Update Volunteer Info</CoreTypography>
            </Container>

            <Container maxWidth="xl" className={styles.bodyWrapper}>
                <Container maxWidth="md" className={styles.formWrapper}>
                    <form className={styles.root} autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                id="firstName"
                                label="First Name"
                                type="text"
                                value={values.firstName}
                                required
                                color="secondary"
                                rowsMax={4}
                                onChange={handleTextChange}
                            />
                            <TextField
                                id="lastName"
                                label="Last Name"
                                type="text"
                                value={values.lastName}
                                required
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                            />
                            <TextField
                                id="email"
                                label="Email"
                                type="text"
                                value={values.email}
                                required
                                rowsMax={4}
                                color="secondary"
                                onChange={handleTextChange}
                            />
                            <InputMask
                                mask="(999) 999-9999"
                                onChange={handleInputMaskChange}
                                value={values.phoneNumber}
                            >
                                {() => (
                                    <TextField id="phonenumber" label="Phone Number" rowsMax={4} color="secondary" />
                                )}
                            </InputMask>
                        </div>
                        <CoreTypography variant="body2" className={styles.error} style={{ marginTop: "40px" }}>
                            {errors.submissionError && errorConstants.FORM_SUBMISSION_ERROR}
                        </CoreTypography>
                        {loading && <LinearProgress color="secondary" />}

                        <Button
                            variant="contained"
                            type="submit"
                            className={styles.button}
                            style={{ marginTop: "40px", float: "right" }}
                        >
                            <CoreTypography variant="button">Update Volunteer</CoreTypography>
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
        error: {
            color: theme.palette.error.main,
        },
    })
);

export default UpdateVolunteer;
