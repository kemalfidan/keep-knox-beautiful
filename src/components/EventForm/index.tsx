import React from "react";

import { makeStyles, createStyles, Theme, withTheme } from "@material-ui/core/styles";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            width: "50%",
        },

        leftWrapper: {
            backgroundColor: colors.green,
            color: colors.white,
            paddingTop: "230px",
            paddingBottom: "230px",
            width: "107%",
        },

        rightWrapper: {
            paddingTop: "230px",
            paddingBottom: "230px",
        },

        textWrapper: {
            paddingBottom: "20px",
        },

        form: {
            textAlign: "left",
            paddingLeft: "30px",
            fontSmooth: "true",
        },

        input: {
            backgroundColor: colors.gray,
            border: "none",
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
                    </form>
                </Container>
            </Container>
        </React.Fragment>
    );
}
