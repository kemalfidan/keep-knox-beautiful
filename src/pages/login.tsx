import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import constants from "utils/constants";
import { Button, CircularProgress } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import urls from "utils/urls";

function Login() {
    const styles = useStyles();
    const router = useRouter();
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [validLogin, setValidLogin] = useState<boolean>(true);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const response = await fetch(`${urls.baseUrl}${urls.api.login}`, {
            method: "POST",
            body: JSON.stringify({
                email: email.current!.value,
                password: password.current!.value,
            }),
        });
        const responseJSON = (await response.json()) as { success: boolean; payload: unknown };

        setLoading(false);
        if (responseJSON.success) {
            setValidLogin(true);
            await router.push(urls.pages.adminHome);
        } else {
            setValidLogin(false);
        }
    };

    const onForgotPassword = async () => {
        console.log("forgot password");
    };

    return (
        <React.Fragment>
            <Container className={styles.container}>
                <img
                    src={`/${constants.org.images.banner}`}
                    alt={`${constants.org.name.short} logo`}
                    className={styles.banner}
                />
                <CoreTypography variant="h2">Welcome Back!</CoreTypography>
                <form onSubmit={onSubmit} className={styles.form}>
                    <input
                        type="email"
                        name="email"
                        ref={email}
                        required
                        placeholder="username@gmail.com"
                        className={styles.input}
                        id="emailField"
                    />
                    <PersonIcon className={styles.icon} />
                    <input
                        type="password"
                        name="password"
                        ref={password}
                        required
                        placeholder="Enter Password"
                        className={styles.input}
                        id="passwordField"
                    />
                    <LockIcon className={styles.icon} />
                    {loading && (
                        <CircularProgress
                            color="secondary"
                            style={{ alignSelf: "center", position: "relative", bottom: "10px" }}
                        />
                    )}
                    {!validLogin && (
                        <CoreTypography variant="body1" className={styles.errorText}>
                            Incorrect email or password.
                        </CoreTypography>
                    )}
                    <Button variant="contained" type="submit" className={styles.button}>
                        <CoreTypography variant="button">LOGIN</CoreTypography>
                    </Button>
                </form>
                <Link onClick={onForgotPassword} className={styles.forgotPassword}>
                    <CoreTypography variant="caption">FORGOT PASSWORD?</CoreTypography>
                </Link>
            </Container>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
        },
        banner: {
            width: "250px",
            paddingBottom: "50px",
            paddingTop: "45px",
        },
        form: {
            paddingTop: "20px",

            width: "350px",
            display: "inherit",
            flexDirection: "inherit",
        },
        icon: {
            position: "relative",
            bottom: "47px",
            left: "7px",
            color: colors.grays["60"],
        },
        input: {
            height: "40px",
            fontSize: "17px",
            borderStyle: "solid",
            textIndent: "35px",
            marginBottom: "15px",
            "&:focus": {
                outline: "none",
                borderColor: colors.blue,
            },
        },
        login: {
            padding: "0",
            width: "350px",
        },
        loginFailure: {
            alignSelf: "center",
            position: "relative",
            bottom: "10px",
            marginTop: "0",
        },
        errorText: {
            color: theme.palette.error.main,
            position: "relative",
            bottom: "10px",
        },
        button: {
            borderRadius: "56px",
            marginTop: "15px",
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
        },
        forgotPassword: {
            color: colors.grays[80],
            cursor: "pointer",
            paddingTop: "25px",
            display: "inherit",
            alignSelf: "center",
        },
    })
);

export default Login;
