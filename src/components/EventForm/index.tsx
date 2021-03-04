import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import constants from "utils/constants";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const resizeThreshold = 720;
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

            [theme.breakpoints.between(0, resizeThreshold)]: {
                flexDirection: "column",
                width: "375px",
            },
        },

        leftWrapper: {
            backgroundColor: theme.palette.primary.main,
            color: colors.white,
            paddingTop: "220px",
            height: "700px",
            [theme.breakpoints.between(0, resizeThreshold)]: {
                width: "371px",
            },
        },

        rightWrapper: {
            paddingTop: "50px",
            width: "310px",
            height: "700px",

            [theme.breakpoints.between(0, resizeThreshold)]: {
                width: "375",
                textAlign: "center",
                position: "relative",
                left: "20px",
            },
        },

        textWrapper: {
            paddingBottom: "20px",

            [theme.breakpoints.between(0, resizeThreshold)]: {
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
        },

        inputLabel: {
            paddingTop: "25px",
            paddingBottom: "5px",
        },

        bottomContainer: {
            paddingLeft: "0px",
            paddingTop: "5px",
        },

        waiverWrapper: {
            paddingLeft: "0px",
        },

        waiverLink: {
            color: colors.grays[80],
        },

        checkboxText: {
            width: "240px",
            paddingTop: "10px",
        },

        button: {
            marginTop: "25px",
            marginLeft: "140px",
            padding: "15px",
            backgroundColor: theme.palette.primary.main,
            border: "none",
            color: colors.white,
            borderRadius: "6px",
            fontSize: "20px",
            fontFamily: "Roboto",
        },
    })
);

export default function EventsForm() {
    const styles = useStyles();

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
                    <form className={styles.form}>
                        <label>
                            <CoreTypography variant="body1" className={styles.inputLabel}>
                                First Name
                            </CoreTypography>
                            <input type="text" name="firstName" className={styles.input} />
                        </label>
                        <label>
                            <CoreTypography variant="body1" className={styles.inputLabel}>
                                Last Name
                            </CoreTypography>
                            <input type="text" name="lastName" className={styles.input} />
                        </label>
                        <label>
                            <CoreTypography variant="body1" className={styles.inputLabel}>
                                Email
                            </CoreTypography>
                            <input type="text" name="email" className={styles.input} />
                        </label>
                        <label>
                            <CoreTypography variant="body1" className={styles.inputLabel}>
                                Phone Number
                            </CoreTypography>
                            <input type="text" name="phoneNumber" className={styles.input} />
                        </label>
                        <Container className={styles.bottomContainer}>
                            <br></br>
                            <Container className={styles.waiverWrapper}>
                                <Link className={styles.waiverLink}>
                                    <DescriptionIcon htmlColor="gray" /> &nbsp;
                                    {constants.org.name.short} Volunteer Waiver
                                </Link>
                            </Container>
                            <FormControlLabel
                                control={<Checkbox />}
                                label={
                                    <CoreTypography variant="body2" className={styles.checkboxText}>
                                        By checking this box, I have read and acknowledged the waiver.
                                    </CoreTypography>
                                }
                            />
                        </Container>
                        <Container>
                            <input type="button" value="Sign Up" onClick={submitButton} className={styles.button} />
                        </Container>
                    </form>
                </Container>
            </Container>
        </React.Fragment>
    );
}

function submitButton() {
    event?.preventDefault();
    console.log("button pressed");
}
