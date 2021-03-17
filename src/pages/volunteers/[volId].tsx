import React from "react";
import VolunteerEventsList from "../../components/VolunteerEventsList";
import { getVolunteer } from "server/actions/Volunteer";
import { Volunteer } from "utils/types";
import { GetStaticPropsContext, NextPage } from "next";
import Error from "next/error";
import constants from "utils/constants";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import CoreTypography from "src/components/core/typography";
import { NONAME } from "dns";

interface Props {
    vol: Volunteer;
}

const VolunteerPage: NextPage<Props> = ({ vol }) => {
    const classes = useStyles();

    if (!vol) {
        return <Error statusCode={404} />;
    }
    return (
        <>
            <div className={classes.container}>
                <div className={classes.volInfoContainer}>
                    <Paper className={classes.nameCard} elevation={3}>
                        <CoreTypography variant="h1">Name</CoreTypography>
                    </Paper>
                    <div className={classes.volInfoRight}>
                        <Paper className={classes.rightCards} elevation={3}>
                            <CoreTypography variant="h1">Name</CoreTypography>
                        </Paper>
                        <Paper className={classes.rightCards} elevation={3}>
                            <CoreTypography variant="h1">Hours</CoreTypography>
                        </Paper>
                    </div>
                </div>
                <Paper className={classes.nameHeader}>
                    <CoreTypography variant="h1">Name Event Header</CoreTypography>
                </Paper>
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            margin: "45px",
        },
        volInfoContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "sm")]: {
                flexDirection: "column",
                width: "100%",
            },
        },
        volInfoRight: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "sm")]: {
                marginTop: "20px",
                width: "100%",
            },
        },
        nameCard: {
            [theme.breakpoints.between(0, "sm")]: {
                width: "100%",
            },
            "&>*": {
                margin: theme.spacing(1),
                width: theme.spacing(70),
                height: theme.spacing(30),
            },
        },
        rightCards: {
            marginLeft: "20px",
            [theme.breakpoints.between(0, "sm")]: {
                marginLeft: "0px",
            },
            "&>*": {
                margin: theme.spacing(1),
                width: theme.spacing(30),
                height: theme.spacing(30),
            },
        },
        nameHeader: {
            border: `1px solid ${theme.palette.primary.light}`,
            marginTop: "20px",
            marginBottom: "20px",
            "&>*": {
                width: "100%",
                margin: theme.spacing(1),
                height: theme.spacing(8),
            },
        },
    })
);

export default VolunteerPage;
