import React from "react";
import { NextPage } from "next";
import Footer from "src/components/Footer";
import EventsContainer from "src/components/EventsContainer";
import Header from "src/components/Header";
import DummyDate from "src/components/DummyDate";

const Home: NextPage = () => {
    return (
        <div className="container">
            <Header />
            <div style={{ height: 100 }}>This is the home page with the list of events</div>
            <DummyDate />
            <EventsContainer />
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
