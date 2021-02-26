import React from "react";
import { NextPage } from "next";
import Footer from "src/components/Footer";
import EventsContainer from "src/components/EventsContainer";
import Header from "src/components/Header";
import DDate from "src/components/DummyDate";
import urls from "utils/urls";

import { Event } from "utils/types";

const dummyEvents: Event[] = [
    {
        _id: "1",
        name: "Spring Cleaning",
        description:
            "This is going to be super duper duper fun! Oh you want more, do ya? Well, here! This is some more isn't it?? Peeopy ",
        image: {
            assetID: "123",
            url: "https://wallpaperaccess.com/full/3458147.jpg",
        },
        location: "123 Butthead Ln",
        startTime: new Date("12:00 pm"),
        endTime: new Date("3:00 pm"),
        startDate: new Date("3/2/21"),
    },
    {
        _id: "2",
        name: "March Madness, but with cleaning",
        description: "This is going to be super fun! Not as fun as the last one though.",
        location: "1021 Francis St",
        startTime: new Date("12:00 pm"),
        endTime: new Date("3:00 pm"),
        startDate: new Date("3/5/21"),
    },
    {
        _id: "3",
        name: "Test Event w a Long Title like Super Long",
        description: "This is going to be super fun! Eh not really.",
        location: "3332 Bikdell St",
        startTime: new Date("12:00 pm"),
        endTime: new Date("3:00 pm"),
        startDate: new Date("3/23/21"),
    },
];

const Home: NextPage = () => {
    return (
        <div className="container">
            <Header />
            <div style={{ height: 100 }}>This is the home page with the list of events</div>
            <DDate />
            <EventsContainer events={dummyEvents} />
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

export default Home;
