import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import constants from "utils/constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
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
                <img src={`/${constants.org.images.logo}`} width="80px" alt={`${constants.org.name.short} logo`}></img>
            </Container>
        </React.Fragment>
    );
}
