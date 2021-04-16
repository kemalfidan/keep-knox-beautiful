import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Container from "@material-ui/core/Container";
import constants from "utils/constants";
<<<<<<< HEAD
=======
import { useRouter } from "next/router";
>>>>>>> e53d8de (Passing admin param to header)
import urls from "utils/urls";

interface Props {
    isAdmin?: boolean;
}

const Header: React.FC<Props> = ({ isAdmin }) => {
    const styles = useStyles();
    const router = useRouter();

    const handleLogout = async (event: React.SyntheticEvent) => {
        event.preventDefault();

<<<<<<< HEAD
        const response = await fetch(`${urls.baseUrl}${urls.api.logout}`, { method: "PUT" });
        // by forwarding admin to admin home, we actually route them to the login
        //   page since they're not logged in anymore
        if (response.status == 200) {
            await router.push(urls.pages.adminHome);
        }
=======
        // const response = await fetch(`${urls.baseUrl}${urls.api.logout}`, { method: "PUT" });
        // // by forwarding admin to admin home, we actually route them to the login
        // //   page since they're not logged in anymore
        // if (response.status == 200) {
        //     await router.push(urls.pages.adminHome);
        // }
>>>>>>> e53d8de (Passing admin param to header)
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
<<<<<<< HEAD
                <button onClick={handleLogout}>logout</button>
=======
                {isAdmin && (
                    <>
                        <button onClick={handleLogout}>Events</button>
                        <button onClick={handleLogout}>Volunteers</button>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
>>>>>>> e53d8de (Passing admin param to header)
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
            [theme.breakpoints.down("sm")]: {
                display: "none",
            },
        },
        adminContent: {
            position: "absolute",
            right: "20px",
        },
    })
);

export default Header;
