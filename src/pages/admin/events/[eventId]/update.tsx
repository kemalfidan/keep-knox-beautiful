import React from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { Event } from "utils/types";
import UpsertEvent from "src/components/UpsertEvent";
import { getEvent } from "server/actions/Event";

interface Props {
    event: Event;
}

const UpdateEventPage: NextPage<Props> = ({ event }) => {
    return <UpsertEvent existingEvent={event} />;
};

export async function getServerSideProps(context: NextPageContext) {
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
}

export default UpdateEventPage;
