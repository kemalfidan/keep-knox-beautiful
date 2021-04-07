import React, { useState } from "react";
import { GetStaticPropsContext, NextPage } from "next";
import withWidth from "@material-ui/core/withWidth";
import { Button, Container, createStyles, Grid, makeStyles, Theme, Divider } from "@material-ui/core";
import EventsContainer from "src/components/EventsContainer";
import CoreTypography from "src/components/core/typography";
import { getCurrentEventsAdmin, getPastEventsAdmin } from "server/actions/Event";
import constants from "utils/constants";
import { Event } from "utils/types";
import colors from "src/components/core/colors";

interface Props {
    currentEvents: Event[];
    pastEvents: Event[];
    width: string;
}

const Home: NextPage<Props> = ({ currentEvents, pastEvents, width }) => {
    const classes = useStyles();
    const [page, setPage] = useState<number>(1);
    const [pastEventsState, setPastEvents] = useState<Event[]>(pastEvents);

    const loadMoreHandler = async () => {
        setPage(page + 1);
        const response = await fetch("/api/events?type=past&page=" + page.toString(), { method: "GET" });
        const moreEvents = (await response.json()) as Event[];
        console.log("existing past events state:", pastEventsState);
        console.log("more events:", moreEvents);
        setPastEvents(pastEventsState.concat(moreEvents));
        console.log("pastEventsState:", pastEventsState);
    };

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
                <EventsContainer events={currentEvents} />
            </Container>

            <Container disableGutters maxWidth="lg">
                <Divider variant="middle" />
                <CoreTypography variant="h2" style={{ textAlign: "center" }}>
                    Past Events
                </CoreTypography>
            </Container>

            <Container disableGutters style={{ marginTop: "0vh", marginBottom: "100px" }}>
                <EventsContainer events={pastEventsState} />
                <Button onClick={loadMoreHandler}>Load More</Button>
            </Container>
        </div>
    );
};

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const currentEvents: Event[] = await getCurrentEventsAdmin();
        const pastEvents: Event[] = await getPastEventsAdmin(1);

        return {
            props: {
                currentEvents: JSON.parse(JSON.stringify(currentEvents)) as Event[],
                pastEvents: JSON.parse(JSON.stringify(pastEvents)) as Event[],
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
        "@global": {
            ".MuiDivider-middle": {
                borderTop: `2px solid ${colors.gray}`,
                margin: "100px 50px 0px 50px",
            },
        },
    })
);

export default withWidth()(Home);
