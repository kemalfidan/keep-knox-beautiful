import React, { useState, useRef } from "react";
import InputMask from "react-input-mask";
import { useRouter } from "next/router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import DescriptionIcon from "@material-ui/icons/Description";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from '@material-ui/core/CircularProgress';
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import urls from "utils/urls";
import constants from "utils/constants";
import errors from "utils/errors";
import { Volunteer } from "utils/types";

interface Props {
    id: string;
}

const EventSignUp: React.FC<Props> = ({ id }) => {
    const styles = useStyles();
    const router = useRouter();
    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");

    // on sign-up button click
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // creates Volunteer object
        const volunteer: Volunteer = {
            name: firstName.current!.value + " " + lastName.current!.value,
            email: email.current!.value,
            phone: phoneNumber,
        };

        const r = await fetch(urls.api.signup(id), {
            method: "POST",
            body: JSON.stringify(volunteer),
        });
        const response = await r.json();
        setLoading(false);

        // error check response
        if (response) {
            if (response?.success) {
                router.push("/");
            } else {
                setError(response?.message);
            }
        } else {
            setError(errors.GENERIC_ERROR);
        }
    };

    const handleInputMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        e.preventDefault;
        setPhoneNumber(e.target?.value);
    };

    return (
        <React.Fragment>
            <Container className={styles.container}>
                <Container className={styles.leftWrapper}>
                    <CoreTypography variant="h1" className={styles.textWrapper}>
                        Sign Up
                    </CoreTypography>
                    <CoreTypography variant="h2" className={styles.textWrapper}>
                        We&#39;d love for you <br></br>to join us!
                    </CoreTypography>
                </Container>
                <Container className={styles.rightWrapper}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label htmlFor="firstNameField">
                            <CoreTypography variant="body1" className={styles.inputLabel}>
                                First Name
                            </CoreTypography>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            ref={firstName}
                            required
                            className={styles.input}
                            id="firstNameField"
                        />
                        <label htmlFor="lastNameField">
                            <CoreTypography variant="body1" className={styles.inputLabel} id="lastNameLabel">
                                Last Name
                            </CoreTypography>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            ref={lastName}
                            required
                            className={styles.input}
                            id="lastNameField"
                        />
                        <label htmlFor="emailField">
                            <CoreTypography variant="body1" className={styles.inputLabel} id="emailLabel">
                                Email
                            </CoreTypography>
                        </label>
                        <input
                            type="email"
                            name="email"
                            ref={email}
                            required
                            className={styles.input}
                            id="emailField"
                        />
                        <label htmlFor="phoneNumberField">
                            <CoreTypography variant="body1" className={styles.inputLabel} id="phoneNumberLabel">
                                Phone Number
                            </CoreTypography>
                        </label>
                        <InputMask
                            mask="(999) 999-9999"
                            className={styles.input}
                            onChange={handleInputMaskChange}
                            name="phoneNumber"
                            id="phoneNumberField"
                        />

                        <Container className={styles.waiverLinkWrapper}>
<<<<<<< HEAD

                            {/* <br></br> */}
=======
>>>>>>> 4897c28 (Added loading+error messages to sign up form)
                            <DescriptionIcon htmlColor={colors.grays["60"]} style={{ marginRight: "10px" }} />
                            <Link className={styles.waiverLink}>{constants.org.name.short} Volunteer Waiver</Link>

                        </Container>
                        <Container className={styles.waiverCheckboxWrapper}>
                            <Checkbox required name="waiverCheckbox" id="waiverCheckbox" color="secondary" />
                            <label htmlFor="waiverCheckbox">
                                <CoreTypography variant="body2" className={styles.waiverCheckboxText}>
                                    By checking this box, I have read and acknowledged the waiver.
                                </CoreTypography>
                            </label>
                        </Container>
                        {loading && <CircularProgress color="secondary" />}
                        <Button
                            variant="contained"
                            type="submit"
                            className={styles.button}
                            style={{ marginTop: "40px", float: "right" }}
                        >
                            <CoreTypography variant="button">Sign Up</CoreTypography>
                        </Button>
                        <CoreTypography variant="body2" className={styles.error} style={{marginTop: "10px"}}>
                            {error}
                        </CoreTypography>
                    </form>
                </Container>
            </Container>
        </React.Fragment>
    );
};

// styles
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            textAlign: "center",
            width: "750px",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: theme.palette.primary.main,
            height: "auto",
            paddingLeft: "0",

            [theme.breakpoints.between(0, "sm")]: {
                flexDirection: "column",
                width: "375px",
            },
        },
        leftWrapper: {
            backgroundColor: theme.palette.primary.main,
            color: colors.white,
            paddingTop: "220px",
            height: "700px",
            [theme.breakpoints.between(0, "sm")]: {
                height: "350px",
                width: "371px",
                paddingTop: "60px",
            },
        },
        rightWrapper: {
            paddingTop: "50px",
            width: "310px",
            height: "700px",

            [theme.breakpoints.between(0, "sm")]: {
                width: "375",
                textAlign: "center",
                position: "relative",
                left: "20px",
            },
        },
        textWrapper: {
            paddingBottom: "20px",

            [theme.breakpoints.between(0, "sm")]: {
                paddingBottom: "35px",
            },
        },
        form: {
            textAlign: "left",
        },
        input: {
            backgroundColor: colors.lightGray,
            border: "none",
            height: "40px",
            fontSize: "20px",
            marginLeft: "8px",
        },
        inputLabel: {
            paddingTop: "25px",
            paddingBottom: "5px",
            marginLeft: "8px",
        },
        waiverLinkWrapper: {
            display: "flex",
            alignItems: "center",
            paddingLeft: "0px",
            paddingTop: "5px",
            marginTop: "20px",
            marginLeft: "8px",
        },
        waiverLink: {
            color: colors.grays[80],
            cursor: "pointer",
        },
        waiverCheckboxWrapper: {
            display: "flex",
            paddingTop: "10px",
            paddingLeft: "0px",
        },
        waiverCheckbox: {
            marginTop: "15px",
            cursor: "pointer",
        },
        waiverCheckboxText: {
            width: "240px",
            paddingLeft: "10px",
            cursor: "pointer",
        },
        button: {
            backgroundColor: theme.palette.primary.main,
            color: colors.white,
            minWidth: "100px",
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
            },
        },
        error: {
            color: theme.palette.error.main,
        },
    })
);

export default EventSignUp;
