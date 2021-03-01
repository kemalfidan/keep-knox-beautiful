import React from "react";
import { GetStaticPropsContext, NextPage } from "next";
import Footer from "src/components/Footer";
import EventsContainer from "src/components/EventsContainer";
import Header from "src/components/Header";
import DDate from "src/components/DummyDate";
import urls from "utils/urls";

import { Event } from "utils/types";
import { useRouter } from "next/router";
import { getEvents } from "server/actions/Event";
import constants from "utils/constants";
import { Button, Container, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import CoreTypography from "src/components/core/typography";

interface Props {
    events: Event[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        jumbotron: {
            width: "100%",
            height: "65vh",
            backgroundColor: theme.palette.primary.main,
            position: "relative",
            top: 0,
        },
    })
);

const Home: NextPage<Props> = ({ events }) => {
    const classes = useStyles();

    return (
        <div style={{ width: "100%" }}>
            <div className={classes.jumbotron}>
                <Grid container spacing={3} direction="row" justify="center" style={{ width: "100%" }}>
                    <Grid
                        item
                        xs={6}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingLeft: "10%",
                        }}
                    >
                        <CoreTypography variant="h1" style={{ color: "white" }}>
                            Upcoming events
                        </CoreTypography>
                        <CoreTypography variant="h3" style={{ fontWeight: "normal", color: "white", marginBottom: 30 }}>
                            Join us for a workday!
                        </CoreTypography>
                        <DDate />
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                            src={`/${constants.org.images.logo}`}
                            alt={`${constants.org.name.short} logo`}
                            style={{ width: 250 }}
                        />
                    </Grid>
                </Grid>
            </div>
            <Container disableGutters style={{ marginTop: "-20vh" }}>
                <EventsContainer events={events} />
                <Button>Load More</Button>
            </Container>
        </div>
    );
};

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const events: Event[] = await getEvents();
        return {
            props: {
                events: JSON.parse(JSON.stringify(events)) as Event[],
            },
            revalidate: constants.revalidate.upcomingEvents,
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                events: [],
            },
            revalidate: constants.revalidate.upcomingEvents,
        };
    }
}

export default Home;
