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

interface Props {
    events: Event[];
}

const Home: NextPage<Props> = ({ events }) => {
    return (
        <div className="container">
            <Header />
            <div style={{ height: 100 }}>This is the home page with the list of events</div>
            <DDate />
            <EventsContainer events={events} />
            <Footer />
            <style jsx>{`
                .container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>

            <style jsx global>{`
                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
                        Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                }
                * {
                    box-sizing: border-box;
                }
            `}</style>
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
