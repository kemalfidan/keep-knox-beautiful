import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import constants from "utils/constants";

const Header: React.FC = () => {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={styles.container}>
                <a href="/">
                    <img
                        src={`/${constants.org.images.banner}`}
                        className={styles.headerBanner}
                        alt={`${constants.org.name.short} banner`}
                    ></img>
                </a>
            </Container>
        </React.Fragment>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
            height: "100px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            position: "relative",
            top: 0,
        },
        headerBanner: {
            height: "60px",
        },
    })
);

export default Header;
