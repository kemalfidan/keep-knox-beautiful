import React from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { Event } from "utils/types";
import UpsertEvent from "src/components/UpsertEvent";
import { getEvent } from "server/actions/Event";
import urls from "utils/urls";

interface Props {
    event: Event;
}

const UpdateEventPage: NextPage<Props> = ({ event }) => {
    return <UpsertEvent existingEvent={event} />;
};

export async function getServerSideProps(context: NextPageContext) {
    try {
        // valdate valid admin user
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
        }

        // get eventId from url by using context
        const eventId = context.query.eventId as string;

        // this func is run on server-side, so we can safely fetch the event directly
        const event: Event = await getEvent(eventId);
        event.attendedVolunteers = [];
        event.registeredVolunteers = [];

        return {
            props: {
                event: JSON.parse(JSON.stringify(event)) as Event,
            },
        };
    } catch (error) {
        console.log(error);
    }
}

export default UpdateEventPage;
