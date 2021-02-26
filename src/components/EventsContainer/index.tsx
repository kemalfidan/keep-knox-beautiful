import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Event } from "utils/types";
import EventCard from "../EventCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            padding: "40px",
        },
    })
);

interface Props {
    events: Event[];
}

export default function EventsContainer(props: Props) {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={styles.container}>
                <Grid container direction="row" spacing={6} justify="center">
                    {props.events.map((event: Event, i: number) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                                <EventCard event={event} />
                            </Grid>
                        );
                    })}
                    {/* 
                    
                    TODO: remove placeholder

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
                    
                    */}
                </Grid>
            </Container>
        </React.Fragment>
    );
}
