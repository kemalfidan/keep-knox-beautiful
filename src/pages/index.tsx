import React from "react";
import { GetStaticPropsContext, NextPage } from "next";
import withWidth from "@material-ui/core/withWidth";
import { Button, Container, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import EventsContainer from "src/components/EventsContainer";
import CoreTypography from "src/components/core/typography";
import { getEvents } from "server/actions/Event";
import constants from "utils/constants";
import { Event } from "utils/types";

interface Props {
    events: Event[];
    width: string;
}

const Home: NextPage<Props> = ({ events, width }) => {
    const classes = useStyles();

    return (
        <div style={{ width: "100%" }}>
            <div className={classes.jumbotron}>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justify="center"
                    style={{ width: "100%", paddingTop: width == "xs" ? "10%" : "" }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={7}
                        lg={6}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingLeft: "10%",
                            marginTop: "20px",
                        }}
                    >
                        <CoreTypography variant="h1" style={{ color: "white" }}>
                            Upcoming events
                        </CoreTypography>
                        <CoreTypography variant="h3" style={{ fontWeight: "normal", color: "white", marginBottom: 30 }}>
                            Join us for a workday!
                        </CoreTypography>
                    </Grid>
                    {width == "xs" ? null : (
                        <Grid
                            item
                            xs={5}
                            lg={6}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src={`/${constants.org.images.logo}`}
                                alt={`${constants.org.name.short} logo`}
                                style={{ height: "200px" }}
                            />
                        </Grid>
                    )}
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        jumbotron: {
            width: "100%",
            height: "55vh",
            backgroundColor: theme.palette.primary.main,
            position: "relative",
            top: 0,
        },
    })
);

export default withWidth()(Home);
