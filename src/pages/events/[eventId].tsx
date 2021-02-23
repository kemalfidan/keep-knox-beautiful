import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { getEvent } from "server/actions/Event";
import { Event } from "utils/types";
import { GetStaticPropsContext, NextPage } from "next";
import constants from "utils/constants";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Error from "next/error";
import errors from "utils/errors";
import CoreTypography from "src/components/core/typography/CoreTypography";

interface Props {
    event: Event;
}

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const EventPage: NextPage<Props> = ({ event }) => {
    const classes = useStyles();

    if (!event) {
        return <Error statusCode={404} />;
    }

    return (
        <>
            <Header />

            <CoreTypography variant="h1">{event.name}</CoreTypography>
            <CoreTypography variant="h5">{JSON.stringify(event)}</CoreTypography>

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
