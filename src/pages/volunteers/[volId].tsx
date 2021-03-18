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
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import colors from "src/components/core/colors";

interface Props {
    vol: Volunteer;
}

const VolunteerPage: NextPage<Props> = ({ vol }) => {
    const classes = useStyles();

    if (!vol) {
        return <Error statusCode={404} />;
    }

    const firstName = vol.name.split(" ")[0];

    return (
        <>
            <div className={classes.container}>
                <div className={classes.volInfoContainer}>
                    <Paper className={classes.nameCard} elevation={2}>
                        <div className={classes.nameCardContent}>
                            <CoreTypography variant="body1" style={{ fontSize: "60px" }}>
                                <div className={classes.nameCardTopRow}>
                                    {vol.name}
                                    <div>
                                        <EditIcon style={{ verticalAlign: "top", marginRight: "5px" }} />
                                        <DeleteIcon style={{ verticalAlign: "top", marginRight: "5px" }} />
                                    </div>
                                </div>
                            </CoreTypography>
                            <div>
                                <CoreTypography variant="body1">
                                    <EmailIcon fontSize="large" style={{ verticalAlign: "middle" }} />
                                    &nbsp;&nbsp;{vol.email}
                                </CoreTypography>
                                <CoreTypography variant="body1">
                                    <PhoneIcon fontSize="large" style={{ verticalAlign: "middle" }} />
                                    &nbsp;&nbsp;{vol.phone}
                                </CoreTypography>
                            </div>
                        </div>
                    </Paper>
                    <div className={classes.volInfoRight}>
                        <Paper className={classes.rightCards} elevation={2}>
                            <div className={classes.rightCardsContent}>
                                <CoreTypography variant="body1" style={{ fontSize: "130px" }}>
                                    {/*vol.totalHours*/}6
                                </CoreTypography>
                                <CoreTypography variant="body1">Events Attended</CoreTypography>
                            </div>
                        </Paper>
                        <Paper className={classes.rightCards} elevation={2}>
                            <div className={classes.rightCardsContent}>
                                <CoreTypography variant="body1" style={{ fontSize: "130px" }}>
                                    {/*vol.totalHours*/}
                                    24
                                </CoreTypography>
                                <CoreTypography variant="body1">Total Hours</CoreTypography>
                            </div>
                        </Paper>
                    </div>
                </div>
                <Paper className={classes.nameHeader} elevation={0}>
                    <div className={classes.nameHeaderContent}>
                        <CoreTypography variant="body1" style={{ fontSize: "35px" }}>
                            {firstName}&apos;s Events
                        </CoreTypography>
                        <button className={classes.hoursVerificationButton}>
                            <CoreTypography variant="body2">
                                <EmailIcon fontSize="large" style={{ verticalAlign: "middle" }} />
                                &nbsp;&nbsp;Total Hours Verification
                            </CoreTypography>
                        </button>
                    </div>
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "45px",
        },
        volInfoContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "40px",
            justifyContent: "space-between",
            width: "100%",
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
                width: "90%",
            },
        },
        nameCard: {
            border: `2px solid ${theme.palette.primary.light}`,
            [theme.breakpoints.between(0, "sm")]: {
                width: "90%",
            },
            "&>*": {
                margin: theme.spacing(1),
                width: theme.spacing(65),
                height: theme.spacing(30),
            },
        },
        nameCardContent: {
            paddingTop: "10px",
            paddingLeft: "40px",
            paddingBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "space-between",
        },
        nameCardTopRow: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "sm")]: {
                width: "90%",
            },
        },
        nameCardIcons: {
            textAlign: "right",
        },
        rightCards: {
            marginLeft: "40px",
            border: `2px solid ${theme.palette.primary.light}`,
            [theme.breakpoints.between(0, "sm")]: {
                marginLeft: "0px",
            },
            "&>*": {
                margin: theme.spacing(1),
                width: theme.spacing(27),
                height: theme.spacing(30),
            },
        },
        rightCardsContent: {
            textAlign: "center",
        },
        nameHeader: {
            border: `2px solid ${theme.palette.primary.light}`,
            marginTop: "50px",
            marginBottom: "30px",
            width: "100%",
            "&>*": {
                width: "100%",
                margin: theme.spacing(1),
                height: theme.spacing(7),
            },
            [theme.breakpoints.between(0, "sm")]: {
                width: "90%",
            },
        },
        nameHeaderContent: {
            paddingLeft: "5px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        hoursVerificationButton: {
            color: colors.white,
            backgroundColor: colors.pink,
            border: "none",
            padding: "0 8px",
            borderRadius: "10px",
            [theme.breakpoints.between(0, "sm")]: {
                padding: "0 4px",
            },
        },
    })
);

export default VolunteerPage;
