import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Container from "@material-ui/core/Container";
import constants from "utils/constants";
import urls from "utils/urls";

const Header: React.FC = () => {
    const styles = useStyles();
    const router = useRouter();

    const handleLogout = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const response = await fetch(`${urls.baseUrl}${urls.api.logout}`, { method: "PUT" });
        // by forwarding admin to admin home, we actually route them to the login
        //   page since they're not logged in anymore
        if (response.status == 200) {
            await router.push(urls.pages.adminHome);
        }
    };

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
                <button onClick={handleLogout}>logout</button>
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
        adminContent: {
            position: "absolute",
            right: "20px",
        },
    })
);

export default Header;
