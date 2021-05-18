import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import EventsContainer from "src/components/EventsContainer";
import CoreTypography from "src/components/core/typography";
import { getCurrentEventsAdmin, getPastEventsAdmin } from "server/actions/Event";
import constants from "utils/constants";
import { Event, Admin, LoadMorePaginatedData } from "utils/types";
import urls from "utils/urls";
import colors from "src/components/core/colors";
import Router from "next/router";

// mui
import { Button, Container, createStyles, Grid, makeStyles, Theme, Divider } from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";
import { DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import InputAdornment from "@material-ui/core/InputAdornment";
import TodayIcon from "@material-ui/icons/Today";

interface Props {
    currentEvents: Event[];
    pastEvents: LoadMorePaginatedData;
    width: string;
}

const Home: NextPage<Props> = ({ currentEvents, pastEvents, width }) => {
    const classes = useStyles();
    const [nextPage, setNextPage] = useState<number>(2);
    const [pastEventsState, setPastEvents] = useState<Event[]>(pastEvents.data);
    const [searchDate, setSearchDate] = useState<MaterialUiPickersDate>(null);
    const [loadMore, setLoadMore] = useState<boolean>(!pastEvents.isLastPage);

    const loadMoreHandler = async () => {
        const response = await fetch(
            `${urls.api.events}?type=past&page=${nextPage.toString()}&search=${searchDate?.toUTCString() || ""}`,
            { method: "GET" }
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const moreEvents = (await response.json()).payload as LoadMorePaginatedData;

        if (moreEvents.isLastPage) {
            setLoadMore(false);
        }
        setPastEvents(pastEventsState.concat(moreEvents.data));
        setNextPage(nextPage => {
            return nextPage + 1;
        });
    };

    const handleSearchDateChange = async (date: MaterialUiPickersDate) => {
        const response = await fetch(`${urls.api.events}?type=past&page=1&search=${date?.toUTCString() || ""}`, {
            method: "GET",
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const newPastEvents: LoadMorePaginatedData = (await response.json()).payload as LoadMorePaginatedData;

        // no longer appending - this is back to an initial view
        // load more handler will take of loading next pages for search
        setPastEvents(newPastEvents.data);
        setLoadMore(!pastEvents.isLastPage);
        setSearchDate(date);
        setNextPage(2);
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
                    {width == "xs" ? null : (
                        <Grid
                            item
                            xs={5}
                            lg={2}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src={`/${constants.org.images.logo}`}
                                alt={`${constants.org.name.short} logo`}
                                style={{ height: "200px" }}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} sm={7} lg={6} className={classes.pageTitle}>
                        <CoreTypography variant="h1" style={{ color: "white" }}>
                            Upcoming events
                        </CoreTypography>
                        {/* TODO button that goes to add event page here */}
                    </Grid>
                </Grid>
            </div>
            <Container disableGutters style={{ marginTop: "-20vh" }}>
                <EventsContainer events={currentEvents} admin />
            </Container>

            <Container disableGutters maxWidth="lg">
                <Divider variant="middle" />
                <div className={classes.pastEventsHeader}>
                    <CoreTypography variant="h2" className={classes.pastEventsTitle}>
                        Past Events
                    </CoreTypography>
                    <div className={classes.pastEventsSearch}>
                        <DatePicker
                            disableFuture
                            minDate={new Date("2020-01-02")}
                            openTo="year"
                            format="MMM yyyy"
                            views={["year", "month"]}
                            value={searchDate}
                            variant="inline"
                            onChange={handleSearchDateChange}
                            label="Search"
                            color="secondary"
                            className={classes.pastEventsSearch}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <TodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
            </Container>

            <Container disableGutters style={{ marginTop: "0vh", marginBottom: "100px" }}>
                <EventsContainer events={pastEventsState} />
                <div className={classes.center}>
                    {loadMore && (
                        <Button onClick={loadMoreHandler} className={classes.loadMoreButton}>
                            Load More
                        </Button>
                    )}
                </div>
            </Container>
        </div>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    try {
        const cookie = context.req?.headers.cookie;
        const response = await fetch(`${urls.baseUrl}${urls.api.validateLogin}`, {
            method: "POST",
            headers: {
                cookie: cookie || "",
            },
        });

        // redirect
        if (response.status !== 200) {
            context.res?.writeHead(302, {
                Location: urls.pages.login,
            });
            context.res?.end();
            return { props: {} };
        }

        const currentEvents: Event[] = await getCurrentEventsAdmin();
        const pastEvents: LoadMorePaginatedData = await getPastEventsAdmin(1);

        return {
            props: {
                currentEvents: JSON.parse(JSON.stringify(currentEvents)) as Event[],
                pastEvents: JSON.parse(JSON.stringify(pastEvents)) as Event[],
            },
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                events: [],
            },
        };
    }
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        jumbotron: {
            width: "100%",
            height: "55vh",
            backgroundColor: theme.palette.primary.main,
        },
        pageTitle: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "20px",
            [theme.breakpoints.down("xs")]: {
                alignItems: "center",
            },
        },
        "@global": {
            ".MuiDivider-middle": {
                borderTop: `2px solid ${colors.gray}`,
                margin: "100px 50px 0px 50px",
            },
        },
        center: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        loadMoreButton: {
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
        },
        pastEventsHeader: {
            display: "flex",
            position: "relative",
            justifyContent: "center",
            [theme.breakpoints.down("sm")]: {
                position: "static",
                flexDirection: "column",
            },
        },
        pastEventsTitle: {
            display: "flex",
            [theme.breakpoints.down("sm")]: {
                justifyContent: "center",
            },
        },
        pastEventsSearch: {
            width: "150px",
            right: "100px",
            position: "absolute",
            [theme.breakpoints.down("sm")]: {
                position: "static",
                right: "0px",
                flexDirection: "column",
                alignSelf: "center",
            },
        },
    })
);

export default withWidth()(Home);
