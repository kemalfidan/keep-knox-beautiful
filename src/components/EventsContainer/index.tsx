import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            padding: "40px",
        },
    })
);

export default function EventsContainer() {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={styles.container}>
                <Grid container direction="row" spacing={6} justify="center">
                    <Grid item>
                        <Paper style={{ height: 250, width: 220 }} />
                    </Grid>
                    <Grid item>
                        <Paper style={{ height: 250, width: 220 }} />
                    </Grid>
                    <Grid item>
                        <Paper style={{ height: 250, width: 220 }} />
                    </Grid>
                    <Grid item>
                        <Paper style={{ height: 250, width: 220 }} />
                    </Grid>
                    <Grid item>
                        <Paper style={{ height: 250, width: 220 }} />
                    </Grid>
                    <Grid item>
                        <Paper style={{ height: 250, width: 220 }} />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}
