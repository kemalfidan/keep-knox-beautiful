import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.secondary.main,
            height: "120px",
            display: "flex",
            alignItems: "center",
        },
    })
);

export default function Footer() {
    const styles = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl" className={styles.container}>
                <img src="/logo-transparent.png" width="80px" alt="KKB Logo"></img>
            </Container>
        </React.Fragment>
    );
}
