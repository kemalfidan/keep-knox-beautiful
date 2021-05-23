import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import constants from "utils/constants";
import urls from "utils/urls";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";

export default function Footer() {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={styles.container}>
                <Container maxWidth="xl" className={styles.wrapper}>
                    <a href={urls.pages.login}>
                        <img
                            src={`/${constants.org.images.logo}`}
                            className={styles.image}
                            alt={`${constants.org.name.short} logo`}
                        ></img>
                    </a>
                    <Container maxWidth="xl" className={styles.textWrapper}>
                        <CoreTypography variant="h4"> {constants.org.footer.address} </CoreTypography>
                        <CoreTypography variant="h4">
                            {`${constants.org.footer.phone} ${constants.org.footer.email}`}
                        </CoreTypography>
                        <CoreTypography variant="h4" className={styles.lastText}>
                            created by hack4impact utk
                        </CoreTypography>
                    </Container>
                </Container>
            </Container>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
        },
        wrapper: {
            display: "flex",
            alignItems: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "0px",
        },
        image: {
            width: "80px",
            [theme.breakpoints.between(0, "sm")]: {
                width: "60px",
            },
        },
        textWrapper: {
            textAlign: "center",
            color: colors.white,
        },
        lastText: {
            paddingTop: "20px",
        },
    })
);
