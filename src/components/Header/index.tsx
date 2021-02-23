import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import constants from "utils/constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
            height: "80px",
            width: "100%",
            display: "flex",
            alignItems: "center",
        },
        headerBanner: {
            height: "60px",
        },
    })
);

const Header: React.FC = () => {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={styles.container}>
                <img
                    src={`/${constants.org.images.banner}`}
                    className={styles.headerBanner}
                    alt={`${constants.org.name.short} banner`}
                ></img>
            </Container>
        </React.Fragment>
    );
};

export default Header;
