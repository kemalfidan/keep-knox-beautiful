import React, { useState, useRef } from "react";
import InputMask from "react-input-mask";
import { useRouter } from "next/router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import DescriptionIcon from "@material-ui/icons/Description";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import urls from "utils/urls";
import constants from "utils/constants";
import errors from "utils/errors";
import { Volunteer, ApiResponse } from "utils/types";

interface Props {
    id: string;
    groupSignUp: boolean;
}

const EventSignUp: React.FC<Props> = ({ id, groupSignUp }) => {
    const styles = useStyles();
    const router = useRouter();
    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const [groupCount, setGroupCount] = useState(1);
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

        const r = await fetch(urls.api.signup(id) + "?count=" + `${groupCount}`, {
            method: "POST",
            body: JSON.stringify(volunteer),
        });

        const response = (await r.json()) as ApiResponse;
        setLoading(false);

        // error check response
        if (response) {
            if (response.success) {
                await router.push("/");
            } else {
                setError(response?.message || errors.GENERIC_ERROR);
            }
        } else {
            setError(errors.GENERIC_ERROR);
        }
    };

    const handleGroupCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // sets count to 1 if field is cleared
        setGroupCount(parseInt(e.target?.value) || 1);
    };

    const handleInputMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        e.preventDefault;
        setPhoneNumber(e.target?.value);
    };

    const groupEvent = () => {
        if (groupSignUp == true) {
            return (
                <input
                    type="number"
                    name="groupCount"
                    onChange={handleGroupCountChange}
                    placeholder="Group Count (Optional)"
                    className={styles.otherInput}
                    id="groupCountField"
                />
            );
        }
    };

    return (
        <>
            <Container className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Container className={styles.nameInputContainer}>
                        <input
                            type="text"
                            name="firstName"
                            ref={firstName}
                            placeholder="First Name"
                            required
                            className={styles.firstNameInput}
                            id="firstNameField"
                        />
                        <input
                            type="text"
                            name="lastName"
                            ref={lastName}
                            placeholder="Last Name"
                            required
                            className={styles.lastNameInput}
                            id="lastNameField"
                        />
                    </Container>
                    <input
                        type="email"
                        name="email"
                        ref={email}
                        placeholder="Email"
                        required
                        className={styles.otherInput}
                        id="emailField"
                    />
                    <InputMask
                        mask="(999) 999-9999"
                        className={styles.otherInput}
                        onChange={handleInputMaskChange}
                        placeholder="Phone Number"
                        name="phoneNumber"
                        id="phoneNumberField"
                    />
                    {groupEvent()}
                    <Container className={styles.waiverLinkWrapper}>
                        <DescriptionIcon htmlColor={colors.grays["60"]} style={{ marginRight: "10px" }} />
                        <a href="/waiver" className={styles.waiverLink} target="_blank" rel="noreferrer">
                            <CoreTypography variant="body2">{constants.org.name.short} Volunteer Waiver</CoreTypography>
                        </a>
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
                        <CoreTypography variant="button">Register</CoreTypography>
                    </Button>
                    <CoreTypography variant="body2" className={styles.error} style={{ marginTop: "10px" }}>
                        {error}
                    </CoreTypography>
                </form>
                <Container className={styles.donateWrapper}>
                    <CoreTypography variant="h4">Can&apos;t volunteer?</CoreTypography>
                    <a
                        href="http://www.keepknoxvillebeautiful.org/donate"
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none" }}
                    >
                        <Button variant="contained" className={styles.donateButton}>
                            <CoreTypography variant="button">Donate</CoreTypography>
                        </Button>
                    </a>
                </Container>
            </Container>
        </>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            padding: "0",
            margin: "0",
            flexDirection: "column",
            width: "450px",
        },
        textWrapper: {
            paddingBottom: "20px",
            [theme.breakpoints.between(0, "sm")]: {
                paddingBottom: "35px",
            },
        },
        form: {
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
        },
        nameInputContainer: {
            padding: "0",
            position: "relative",
            display: "inherit",
        },
        firstNameInput: {
            height: "40px",
            fontSize: "20px",
            marginRight: "20px",
            borderStyle: "solid",
            textIndent: "10px",
            marginTop: "15px",
            width: "50%",
            "&:focus": {
                outline: "none",
                borderColor: colors.blue,
            },
        },
        lastNameInput: {
            height: "40px",
            fontSize: "20px",
            borderStyle: "solid",
            textIndent: "10px",
            marginTop: "15px",
            width: "50%",
            "&:focus": {
                outline: "none",
                borderColor: colors.blue,
            },
        },
        otherInput: {
            height: "40px",
            fontSize: "20px",
            marginRight: "20px",
            borderStyle: "solid",
            textIndent: "10px",
            marginTop: "30px",
            width: "100%",
            "&:focus": {
                outline: "none",
                borderColor: colors.blue,
            },
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
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            width: "100%",
            minWidth: "100px",
            borderRadius: "10px",
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
        },
        error: {
            color: theme.palette.error.main,
        },
        donateWrapper: {
            paddingTop: "10px",
            paddingLeft: "0px",
            paddingRight: "0px",
            textAlign: "center",
        },
        donateButton: {
            marginTop: "15px",
            width: "100%",
            backgroundColor: theme.palette.accent.light,
            color: colors.white,
            minWidth: "100px",
            borderRadius: "10px",
            "&:hover": {
                backgroundColor: theme.palette.accent.light,
            },
        },
    })
);

export default EventSignUp;
