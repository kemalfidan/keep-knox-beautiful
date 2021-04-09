import React from "react";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { Volunteer } from "utils/types";
import UpdateVolunteer from "src/components/UpdateVolunteer";
import { getVolunteer } from "server/actions/Volunteer";

interface Props {
    vol: Volunteer;
}

const UpdateEventPage: NextPage<Props> = ({ vol }) => {
    return <UpdateVolunteer existingVol={vol} />;
};

export async function getServerSideProps(context: NextPageContext) {
    // get eventId from url by using context
    const volId = context.query.volId as string;

    // this func is run on server-side, so we can safely fetch the volunteer directly
    const vol: Volunteer = await getVolunteer(volId);

    return {
        props: {
            vol: JSON.parse(JSON.stringify(vol)) as Volunteer,
        },
    };
}

export default UpdateEventPage;
