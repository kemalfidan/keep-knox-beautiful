import React from "react";

import { makeStyles, createStyles, Theme, withTheme } from "@material-ui/core/styles";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import constants from "utils/constants";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            textAlign: "center",
            width: "700px",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: colors.green,
            height: "600px",
            paddingLeft: "0",
        },

        leftWrapper: {
            backgroundColor: colors.green,
            color: colors.white,
            paddingTop: "150px",
            paddingBottom: "326px",
            width: "400px",
        },

        rightWrapper: {
            paddingTop: "100px",
            textAlign: "right",
            width: "300px",
        },

        textWrapper: {
            paddingBottom: "20px",
        },

        form: {
            textAlign: "left",
        },

        input: {
            backgroundColor: colors.gray,
            border: "none",
            height: "40px",
            fontSize: "20px",
        },

        column: {
            paddingLeft: "0px",
        },

        center: {
            textAlign: "center",
            width: "240px",
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
                        We&#39;d love for you to join us!
                    </CoreTypography>
                </Container>
                <Container className={styles.rightWrapper}>
                    <form className={styles.form}>
                        <label>
                            <CoreTypography variant="body1">First Name</CoreTypography>
                            <input type="text" name="firstName" className={styles.input} />
                        </label>
                        <label>
                            <CoreTypography variant="body1">Last Name</CoreTypography>
                            <input type="text" name="lastName" className={styles.input} />
                        </label>
                        <label>
                            <CoreTypography variant="body1">Email</CoreTypography>
                            <input type="text" name="email" className={styles.input} />
                        </label>
                        <label>
                            <CoreTypography variant="body1">Phone Number</CoreTypography>
                            <input type="text" name="phoneNumber" className={styles.input} />
                        </label>
                        <Container className={styles.column}>
                            <Link>{constants.org.name.short} Volunteer Waiver</Link>

                            <FormControlLabel
                                control={<Checkbox />}
                                label={
                                    <CoreTypography variant="body2" className={styles.center}>
                                        By checking this box, I have read and acknowledged the waiver.
                                    </CoreTypography>
                                }
                            />
                        </Container>

                        <Container>
                            <input type="submit" value="Sign Up" />
                        </Container>
                    </form>
                </Container>
            </Container>
        </React.Fragment>
    );
}
