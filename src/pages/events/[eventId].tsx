import Header from "src/components/Header";
import Footer from "src/components/Footer";
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
import { isSameDay, format, addDays } from "date-fns";

interface Props {
    event: Event;
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
            textAlign: "center",
            minHeight: "110px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        caption: {
            marginTop: "50px",
            marginBottom: "50px",
        },
        bodyContainer: {
            [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignItems: "center",
            },
            backgroundColor: theme.palette.primary.light,
            display: "flex",
            justifyContent: "center",
        },
        dateContainer: {
            [theme.breakpoints.down("sm")]: {
                flexDirection: "row",
            },
            display: "flex",
            flexDirection: "column",
        },
        card: {
            width: "160px",
            height: "120px",
            margin: "20px",
            marginRight: "30px",
            borderRadius: 8,
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
    })
);

const EventPage: NextPage<Props> = ({ event }) => {
    const styles = useStyles();

    if (!event) {
        return <Error statusCode={404} />;
    }
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
                        {`${format(event.startDate as Date, "h:m a")}
                        – ${format(event.endDate as Date, "h:m a")}`}
                    </CoreTypography>
                </div>
            );
        } else {
            return (
                <div>
                    <CoreTypography variant="subtitle1" className={styles.cardText}>
                        {format(event.startDate as Date, "ccc, MMMM dd, yyyy")} <br />
                        {`${format(event.startDate as Date, "h:m a")} – `}
                        <br />
                        {format(event.endDate as Date, "ccc, MMMM dd, yyyy")} <br />
                        {format(event.endDate as Date, "h:m a")}
                    </CoreTypography>
                </div>
            );
        }
    };

    return (
        <>
            <Header />

            <Container maxWidth="xl" className={styles.eventHeader}>
                <img
                    src={`/${constants.org.images.logo}`}
                    className={styles.logo}
                    alt={`${constants.org.name.short} logo`}
                />
                <CoreTypography variant="h1">Event Description</CoreTypography>
            </Container>
            <Container maxWidth="xl" className={styles.eventName}>
                <CoreTypography variant="h2"> {event.name} </CoreTypography>
            </Container>
            <Container maxWidth="xl" className={styles.bodyContainer}>
                <div className={styles.dateContainer}>
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
                <div className={styles.descContainer}>
                    <CoreTypography variant="body2">
                        {/* Note: This is a placeholder till we get formatted desc */}
                        Join us on the third Saturday of each month for a Saturday Spruce Up. Each month&apos;s location
                        and activity will change. <br /> <br />
                        This month we will be heading to Danny Mayfield Park in Mechanicsville. We will meet at the park
                        pavilion, across from Maynard Elementary. Parking is located along the street. <br /> <br />
                        Pre-registration is required. Sign ups will close on February 18, 2021. <br /> <br />
                        All supplies will be provided. Please wear closed-toed shoes and bring water. <br /> <br />
                        COVID policies: please wear a mask during supplies distribution and safety instruction.
                        Pre-registration is required.
                    </CoreTypography>
                </div>
            </Container>
            <Container maxWidth="xl" className={`${styles.eventName} ${styles.caption}`}>
                <Container maxWidth="sm">
                    <CoreTypography variant="h4"> {event.caption} </CoreTypography>
                </Container>
            </Container>

            <Footer />
        </>
    );
};

// query data and pass it to component here. this is run server-side
export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        console.log(context.params?.eventId);
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

export default EventPage;
