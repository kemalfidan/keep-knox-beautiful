import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import constants from "utils/constants";
import { useRouter } from "next/router";
import Link from "next/link";
import urls from "utils/urls";
import CoreTypography from "../core/typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import colors from "src/components/core/colors";

interface Props {
    isAdmin?: boolean;
}

const Header: React.FC<Props> = ({ isAdmin }) => {
    const styles = useStyles();
    const router = useRouter();
    const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);

    const handleLogout = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const response = await fetch(`${urls.baseUrl}${urls.api.logout}`, { method: "PUT" });
        // by forwarding admin to admin home, we actually route them to the login
        //   page since they're not logged in anymore
        if (response.status == 200) {
            await router.push(urls.pages.adminHome);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorMenu(null);
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
                {isAdmin && (
                    <Container maxWidth="lg" className={styles.headerNav}>
                        <Link href={urls.pages.adminHome}>
                            <Button className={styles.navButton}>
                                <CoreTypography variant="h3" style={{ fontWeight: "normal" }}>
                                    Events
                                </CoreTypography>
                            </Button>
                        </Link>
                        <Link href={urls.pages.volunteers}>
                            <Button className={styles.navButton}>
                                <CoreTypography variant="h3" style={{ fontWeight: "normal" }}>
                                    Volunteers
                                </CoreTypography>
                            </Button>
                        </Link>
                        <Button
                            className={styles.navButton}
                            aria-controls="menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                        >
                            <AccountCircleIcon fontSize="large" />
                        </Button>
                        <Menu
                            id="menu"
                            keepMounted
                            anchorEl={anchorMenu}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                            open={Boolean(anchorMenu)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>
                                <CoreTypography variant="body1">Logout</CoreTypography>
                            </MenuItem>
                        </Menu>
                    </Container>
                )}
            </Container>
        </React.Fragment>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.primary.main,
            height: "80px",
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
        headerNav: {
            width: "auto",
            height: "100%",
            position: "relative",
            display: "inline-block",
            textAlign: "right",
            paddingRight: "40px",
            flex: 1,
            [theme.breakpoints.down("sm")]: {
                paddingRight: "0px",
            },
        },
        navButton: {
            height: "100%",
            padding: "0px 25px 0px 25px",
            color: colors.white,
            [theme.breakpoints.down("sm")]: {
                padding: "0px 10px 0px 10px",
            },
        },
    })
);

export default Header;
