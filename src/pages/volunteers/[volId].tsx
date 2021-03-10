import React from "react";
import VolunteerEventsList from "../../components/VolunteerEventsList";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { getVolunteer } from "server/actions/Volunteer";
import { Volunteer } from "utils/types";
import { GetStaticPropsContext, NextPage } from "next";
import Error from "next/error";
import constants from "utils/constants";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
    vol: Volunteer;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            margin: "50px",
        },
    })
);

const VolunteerPage: NextPage<Props> = ({ vol }) => {
    const classes = useStyles();

    if (!vol) {
        return <Error statusCode={404} />;
    }
    return (
        <>
            <div className={classes.container}>
                <VolunteerEventsList {...vol} />
            </div>
        </>
    );
};

// get volunteer data
export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        console.log(context.params?.volId);
        const vol: Volunteer = await getVolunteer(context.params?.volId as string);

        return {
            props: {
                vol: JSON.parse(JSON.stringify(vol)) as Volunteer,
            },
            revalidate: constants.revalidate.volunteerProfile,
        };
    } catch (error) {
        return {
            props: {},
            revalidate: constants.revalidate.volunteerProfile,
        };
    }
}

// required for dynamic pages: prerender volunteers at build time
export async function getStaticPaths() {
    const volunteers: Volunteer[] = []; //await getVolunteers({});

    const paths = volunteers.map(volunteer => ({
        params: { name: volunteer._id },
    }));

    return { paths, fallback: true };
}

export default VolunteerPage;
