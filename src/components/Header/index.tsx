import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
            height: "100px",
            width: "100%",
            display: "flex",
            top: "0",
            right: "0",
            left: "0",
            alignItems: "left",
            justifyContent: "space-around",
        },
        headerBanner: {
            height: "80px",
        },
    })
);

const Header: React.FC = () => {
    const styles = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl" className={styles.container}>
                <img src="/banner.png" className={styles.headerBanner} alt="KKB banner"></img>
            </Container>
        </React.Fragment>
    );
};

export default Header;
