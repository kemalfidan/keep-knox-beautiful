import React, { useRef, useState } from "react";
import CoreTypography from "src/components/core/typography";
import { ApiResponse } from "utils/types";
import urls from "utils/urls";
import colors from "src/components/core/colors";
import { Button, Container, createStyles, makeStyles, Theme } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";

const AddAdmin = () => {
    const styles = useStyles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSuccess("");
        setError("");
        setLoading(true);
        // required inputs make it so we don't need to check for empty fields

        const r = await fetch(urls.api.createAdminAccount, {
            method: "POST",
            body: JSON.stringify({
                email: email.current!.value,
                password: password.current!.value,
            }),
        });
        const response = (await r.json()) as ApiResponse;

        setLoading(false);
        if (response.success) {
            setSuccess("Successfully created your new admin account.");
        } else {
            setError(response.message || "");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <Container maxWidth="xl" className={styles.jumbotron}>
                <CoreTypography variant="h1">Add New Admin</CoreTypography>
            </Container>

            <Container maxWidth="xl" className={styles.bodyWrapper}>
                <Container maxWidth="sm" className={styles.formWrapper}>
                    <form className={styles.root} autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                id="email"
                                inputRef={email}
                                label="Email"
                                required
                                fullWidth
                                color="secondary"
                                rowsMax={4}
                            />
                            <TextField
                                id="password"
                                inputRef={password}
                                label="Password"
                                required
                                fullWidth
                                color="secondary"
                                rowsMax={4}
                            />
                        </div>
                        <div style={{ paddingLeft: "16px" }}>
                            {loading && <LinearProgress color="secondary" />}
                            {success && <CoreTypography> {success} </CoreTypography>}
                            {error && <CoreTypography className={styles.error}> {error} </CoreTypography>}
                        </div>

                        <Button
                            variant="contained"
                            type="submit"
                            className={styles.button}
                            style={{ marginTop: "40px", float: "right" }}
                        >
                            <CoreTypography variant="button">Create Account</CoreTypography>
                        </Button>
                    </form>
                </Container>
            </Container>
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        jumbotron: {
            backgroundColor: theme.palette.primary.main,
            textAlign: "center",
            height: "220px",
            color: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "30px",
        },
        bodyWrapper: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        formWrapper: {
            marginTop: "30px",
            marginBottom: "100px",
        },
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(2),
            },
        },
        button: {
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            minWidth: "150px",
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
        },
        error: {
            color: theme.palette.error.main,
        },
    })
);

export default AddAdmin;
