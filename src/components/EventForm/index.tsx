import React from "react";

import { makeStyles, createStyles, Theme, withTheme } from "@material-ui/core/styles";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import constants from "utils/constants";
import { relative } from "path";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            alignItems: "center",
            textAlign: "center",
        },
        leftWrapper: {
            backgroundColor: colors.green,
            color: colors.white,
            paddingTop: "200px",
            paddingBottom: "200px",
        },

        rightWrapper: {
            paddingTop: "200px",
            paddingBottom: "200px",
        },
    })
);

export default function EventsForm() {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container className={styles.container}>
                <Container className={styles.leftWrapper}>
                    <CoreTypography variant="h2">Left</CoreTypography>
                </Container>
                <Container className={styles.rightWrapper}>
                    <CoreTypography variant="h4">Right</CoreTypography>
                </Container>
            </Container>
        </React.Fragment>
    );
}
