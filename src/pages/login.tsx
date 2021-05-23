import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Button, CircularProgress } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import CoreTypography from "src/components/core/typography";
import colors from "src/components/core/colors";
import urls from "utils/urls";
import { ApiResponse } from "utils/types";

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

        const r = await fetch(urls.api.login, {
            method: "POST",
            body: JSON.stringify({
                email: email.current!.value,
                password: password.current!.value,
            }),
        });
        const response = (await r.json()) as ApiResponse;

        setLoading(false);
        if (response.success) {
            setValidLogin(true);
            await router.push(urls.pages.adminHome);
        } else {
            setValidLogin(false);
        }
    };

    return (
        <React.Fragment>
            <Container className={styles.container}>
                <CoreTypography variant="h2" style={{ fontFamily: "Roboto", paddingBottom: "25px" }}>
                    Welcome Back!
                </CoreTypography>
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
            </Container>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: "80px",
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
            borderWidth: "1px",
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
