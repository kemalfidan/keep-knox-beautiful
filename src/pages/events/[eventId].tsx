import { getEvent } from "server/actions/Event";
import { Event } from "utils/types";
import { GetStaticPropsContext, NextPage } from "next";
import Error from "next/error";
import constants from "utils/constants";
import CoreTypography from "src/components/core/typography/CoreTypography";
import colors from "src/components/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import CardContent from "@material-ui/core/CardContent";
import ScheduleIcon from "@material-ui/icons/Schedule";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { isSameDay, format } from "date-fns";
import EventSignUp from "src/components/EventSignUp";
import theme from "utils/theme";

interface Props {
    event: Event;
}

const EventPage: NextPage<Props> = ({ event }) => {
    const styles = useStyles();

    if (!event) {
        return <Error statusCode={404} />;
    }

    const noImage = () => {
        if (event.image !== undefined) {
            return <img src={event.image?.url} alt={`${event.name} img`} style={{ width: "90%" }} />;
        } else {
            return (
                <Container
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: theme.palette.secondary.main,
                        width: "90%",
                        height: "30%",
                    }}
                >
                    <img
                        src={`/${constants.org.images.logo}`}
                        style={{ alignSelf: "center", width: "30%" }}
                        alt={`${constants.org.name.short} logo`}
                    />
                </Container>
            );
        }
    };

    event.startDate = new Date(event.startDate as Date);
    event.endDate = new Date(event.endDate as Date);

    // slightly diff display between events on the same day vs diff days
    const getTime = () => {
        if (isSameDay(event.startDate as Date, event.endDate as Date)) {
            return (
                <div>
                    <CoreTypography variant="subtitle1" className={styles.cardText}>
                        {format(event.startDate as Date, "ccc, MMMM dd, yyyy")}
                        <br />
                        {`${format(event.startDate as Date, "h:mm a")}
                        – ${format(event.endDate as Date, "h:mm a")}`}
                    </CoreTypography>
                </div>
            );
        } else {
            return (
                <div>
                    <CoreTypography variant="subtitle1" className={styles.cardText}>
                        {format(event.startDate as Date, "ccc, MMMM dd, yyyy")} <br />
                        {`${format(event.startDate as Date, "h:mm a")} – `}
                        <br />
                        {format(event.endDate as Date, "ccc, MMMM dd, yyyy")} <br />
                        {format(event.endDate as Date, "h:mm a")}
                    </CoreTypography>
                </div>
            );
        }
    };

    // if signups are not required
    const noSignUp = () => {
        if (event.maxVolunteers != 0) {
            return (
                <Container>
                    <Container className={styles.signUpHeader}>
                        <CoreTypography variant="h4" style={{ float: "left" }}>
                            Sign Up to Volunteer
                        </CoreTypography>
                        <CoreTypography variant="h4" style={{ float: "right", paddingBottom: "10px" }}>
                            {event.volunteerCount}/{event.maxVolunteers} &nbsp;
                            <CoreTypography variant="h5" style={{ float: "right" }}>
                                signed up
                            </CoreTypography>
                        </CoreTypography>
                        <hr style={{ width: "100%", height: "3px", backgroundColor: colors.grays[80] }} />
                    </Container>
                    <Container maxWidth="xl" className={styles.signUpForm}>
                        <EventSignUp id={event._id as string} groupSignUp={event.groupSignUp as boolean} />
                    </Container>
                </Container>
            );
        } else {
            return (
                <Container>
                    <CoreTypography variant="body1" style={{ paddingTop: "30px" }}>
                        Signing up is not required for this event.
                    </CoreTypography>
                </Container>
            );
        }
    };

    return (
        <>
            <Container maxWidth="xl" className={styles.eventHeader}>
                <img
                    src={`/${constants.org.images.logo}`}
                    className={styles.logo}
                    alt={`${constants.org.name.short} logo`}
                />
                <CoreTypography variant="h1">Event Description</CoreTypography>
            </Container>
            <Container className={styles.contentContainer}>
                <Container className={styles.leftWrapper}>
                    {noImage()}
                    <Container maxWidth="xl" className={styles.caption}>
                        <Container maxWidth="sm">
                            <CoreTypography variant="h4"> {event.caption} </CoreTypography>
                        </Container>
                    </Container>
                    <div
                        className={styles.descContainer}
                        dangerouslySetInnerHTML={{ __html: event.description as string }}
                    ></div>
                </Container>
                <Container className={styles.rightWrapper}>
                    <Container maxWidth="xl" className={styles.eventName}>
                        <CoreTypography variant="h2"> {event.name} </CoreTypography>
                    </Container>
                    <div className={styles.cardContainer}>
                        <Card className={styles.card}>
                            <CardContent>
                                <div className={styles.cardTitle}>
                                    <ScheduleIcon className={styles.titleIcon} />
                                    <CoreTypography variant="h5" className={styles.titleName}>
                                        Event Time
                                    </CoreTypography>
                                </div>
                                <CoreTypography variant="subtitle1" className={styles.cardText}>
                                    {getTime()}
                                </CoreTypography>
                            </CardContent>
                        </Card>
                        <Card className={styles.card}>
                            <CardContent>
                                <div className={styles.cardTitle}>
                                    <LocationOnIcon className={styles.titleIcon} />
                                    <CoreTypography variant="h5" className={styles.titleName}>
                                        Location
                                    </CoreTypography>
                                </div>
                                <CoreTypography variant="subtitle1" className={styles.cardText}>
                                    {event.location}
                                </CoreTypography>
                            </CardContent>
                        </Card>
                    </div>
                    {noSignUp()}
                </Container>
            </Container>
        </>
    );
};

// query data and pass it to component here. this is run server-side
export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const event: Event = await getEvent(context.params?.eventId as string);

        return {
            props: {
                event: JSON.parse(JSON.stringify(event)) as Event,
            },
            revalidate: constants.revalidate.eventDesc,
        };
    } catch (error) {
        return {
            props: {},
            revalidate: constants.revalidate.eventDesc,
        };
    }
}

// required for dynamic pages: prerender events at build time
export async function getStaticPaths() {
    const events: Event[] = []; //await getEvents({});

    const paths = events.map(event => ({
        params: { name: event._id },
    }));

    return { paths, fallback: true };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        eventHeader: {
            backgroundColor: theme.palette.primary.main,
            textAlign: "center",
            height: "220px",
            color: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "30px",
        },
        logo: {
            width: "90px",
            marginRight: "20px",
        },
        eventName: {
            //padding: "0",
            margin: "0",
            minHeight: "110px",
            display: "flex",
            alignItems: "center",
            maxWidth: "500px",
            textAlignLast: "center",
        },
        caption: {
            marginTop: "50px",
            marginBottom: "25px",
            textAlign: "justify",
        },
        contentContainer: {
            display: "flex",
            paddingTop: "80px",
            paddingBottom: "100px",
            [theme.breakpoints.between(0, "sm")]: {
                flexDirection: "column",
            },
        },
        leftWrapper: {
            display: "inherit",
            flexDirection: "column",
            alignItems: "center",
            paddingRight: "0px",
        },
        rightWrapper: {
            display: "flex",
            flexDirection: "column",
            maxWidth: "700px",
            minWidth: "400px",
            paddingLeft: "70px",
        },
        cardContainer: {
            padding: "0",
            paddingBottom: "15px",
            display: "flex",
            flexDirection: "row",
        },
        card: {
            width: "160px",
            height: "120px",
            margin: "20px",
            marginRight: "30px",
            borderRadius: 8,
        },
        signUpHeader: {
            marginTop: "20px",
            width: "450px",
            padding: "0",
            margin: "0",
        },
        descContainer: {
            width: "500px",
            padding: "20px",
        },
        cardTitle: {
            display: "flex",
            alignItems: "center",
        },
        titleName: {
            color: theme.palette.accent.main,
        },
        titleIcon: {
            marginRight: "5px",
        },
        cardText: {
            marginTop: "15px",
        },
        // fix quilljs formatting
        "@global": {
            "p, ol, ul": {
                margin: "0px",
            },
            ".ql-size-huge": {
                fontSize: "1.75em",
            },
            ".ql-size-large": {
                fontSize: "1.25em",
            },
            ".ql-size-small": {
                fontSize: "0.75em",
            },
        },
        signUpForm: {
            marginBottom: "100px",
        },
    })
);

export default EventPage;
