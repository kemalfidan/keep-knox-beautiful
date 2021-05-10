import React from "react";
import Container from "@material-ui/core/Container";
import EventCard from "../EventCard";
import Grid from "@material-ui/core/Grid";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Event } from "utils/types";

interface Props {
    events: Event[];
    pastEvents: boolean;
}

export default function EventsContainer(props: Props) {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={styles.container}>
                <Grid container direction="row" spacing={6} justify="center">
                    {props.events.map((event: Event, i: number) => {
                        return (
                            <Grid item xs={12} sm={8} md={5} lg={4} key={i}>
                                <EventCard event={event} pastEvent={props.pastEvents} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            padding: "40px",
        },
    })
);
