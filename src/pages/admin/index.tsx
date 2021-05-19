import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
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
import AddIcon from "@material-ui/icons/Add";

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
    const [loading, setLoading] = useState(false);

    function handleLoading() {
        setLoading(true);
    }

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
        setLoadMore(!newPastEvents.isLastPage);
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
                    <Grid
                        item
                        xs={4}
                        md={3}
                        lg={3}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <img
                            src={`/${constants.org.images.logo}`}
                            alt={`${constants.org.name.short} logo`}
                            className={classes.headerImage}
                        />
                    </Grid>

                    <Grid item xs={6} sm={7} lg={6} className={classes.pageTitle}>
                        <CoreTypography variant="h1" style={{ color: "white" }}>
                            Upcoming events
                        </CoreTypography>
                        <Link href={urls.pages.addEvent}>
                            <Button variant="contained" className={classes.addEventButton}>
                                Add<AddIcon></AddIcon>
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            <Container disableGutters style={{ marginTop: "-20vh" }}>
                <EventsContainer
                    events={currentEvents}
                    admin
                    onLoading={handleLoading}
                    loading={loading}
                    pastEvents={false}
                />
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
                <EventsContainer
                    events={pastEventsState}
                    admin
                    onLoading={handleLoading}
                    loading={loading}
                    pastEvents={false}
                />
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
        headerImage: {
            height: "230px",
            [theme.breakpoints.down("xs")]: {
                height: "120px",
            },
        },
        pageTitle: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            [theme.breakpoints.down("xs")]: {
                alignItems: "left",
            },
        },
        addEventButton: {
            backgroundColor: theme.palette.accent.main,
            color: colors.white,
            marginTop: "10px",
            width: "100px",
            height: "35px",
            "&:hover": {
                backgroundColor: theme.palette.accent.main,
            },
            [theme.breakpoints.down("xs")]: {
                marginLeft: "0px",
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
            paddingTop: "30px",
            paddingBottom: "10px",
            [theme.breakpoints.down("sm")]: {
                position: "static",
                flexDirection: "column",
                marginBottom: "40px",
            },
        },
        pastEventsTitle: {
            display: "flex",
            [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignSelf: "center",
            },
        },
        pastEventsSearch: {
            width: "150px",
            right: "100px",
            position: "absolute",
            [theme.breakpoints.down("sm")]: {
                marginTop: "10px",
                marginLeft: "auto",
                marginRight: "auto",
                left: "0",
                right: "0",
            },
        },
    })
);

export default withWidth()(Home);
