import React, { useState } from "react";
import VolunteerEventsList from "../../../../components/VolunteerEventsList";
import { getVolunteer } from "server/actions/Volunteer";
import { Volunteer } from "utils/types";
import { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import { Router, useRouter } from "next/router";
import Error from "next/error";
import constants from "utils/constants";
import urls from "utils/urls";
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
    const router = useRouter();
    const [emailSuccess, setEmailSuccess] = useState<boolean>(false);

    if (!vol) {
        return <Error statusCode={404} />;
    }

    const firstName = vol.name.split(" ")[0];

    const handleEditClick = async () => {
        if (vol._id) {
            await router.push(urls.pages.updateVolunteer(vol._id));
        }
    };

    const handleSendVerificationEmail = async () => {
        try {
            if (vol._id) {
                const res = await fetch(`${urls.api.volunteers}/${vol._id}/email`, { method: "PUT" });
                if (res.status === 200) {
                    setEmailSuccess(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className={classes.container}>
                <div className={classes.volInfoContainer}>
                    <Paper className={classes.nameCard} elevation={2}>
                        <div className={classes.nameCardContent}>
                            <CoreTypography variant={vol.name.length < 15 ? "h1" : "h2"}>
                                <div className={classes.nameCardTopRow}>
                                    {vol.name}
                                    <div>
                                        <button className={classes.navIcon} onClick={handleEditClick}>
                                            <EditIcon />
                                        </button>
                                        <button className={classes.navIcon}>
                                            <DeleteIcon />
                                        </button>
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
                                    {vol.totalEvents == undefined ? 0 : vol.totalEvents}
                                </CoreTypography>
                                <CoreTypography variant="body1">Events Attended</CoreTypography>
                            </div>
                        </Paper>
                        <Paper className={classes.rightCards} elevation={2}>
                            <div className={classes.rightCardsContent}>
                                <CoreTypography variant="body1" style={{ fontSize: "130px" }}>
                                    {vol.totalHours == undefined ? 0 : vol.totalHours}
                                </CoreTypography>
                                <CoreTypography variant="body1">Total Hours</CoreTypography>
                            </div>
                        </Paper>
                    </div>
                </div>
                <Paper className={classes.nameHeader} elevation={0}>
                    <div className={classes.nameHeaderContent}>
                        <CoreTypography variant="h2">{firstName}&apos;s Events</CoreTypography>
                        <button className={classes.hoursVerificationButton} onClick={handleSendVerificationEmail}>
                            <CoreTypography variant="body2">
                                <EmailIcon fontSize="large" style={{ verticalAlign: "middle" }} />
                                &nbsp;&nbsp;{emailSuccess ? "Verification Sent!" : "Total Hours Verification"}
                            </CoreTypography>
                        </button>
                    </div>
                </Paper>
                <VolunteerEventsList {...vol} />
            </div>
        </>
    );
};
/*
// get volunteer data
export async function getStaticProps(context: GetStaticPropsContext) {
    try {
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
*/
/*
// required for dynamic pages: prerender volunteers at build time
export async function getStaticPaths() {
    const volunteers: Volunteer[] = []; //await getVolunteers({});

    const paths = volunteers.map(volunteer => ({
        params: { name: volunteer._id },
    }));

    return { paths, fallback: true };
}
*/
// validate valid admin user
export async function getServerSideProps(context: NextPageContext) {
    try {
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

        const { volId } = context.query;
        const vol: Volunteer = await getVolunteer(volId as string);

        const volunteers: Volunteer[] = []; //await getVolunteers({});
        const paths = volunteers.map(volunteer => ({
            params: { name: volunteer._id },
        }));

        return {
            props: {
                vol: JSON.parse(JSON.stringify(vol)) as Volunteer,
            },
            //revalidate: constants.revalidate.volunteerProfile,
            //paths,
            //fallback: true,
        };
    } catch (error) {
        console.log(error);
    }
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
            justifyContent: "space-between",
            width: "90vw",
            [theme.breakpoints.between(0, "sm")]: {
                flexDirection: "column",
            },
        },
        volInfoRight: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            [theme.breakpoints.between(0, "sm")]: {
                marginTop: "20px",
                width: "90vw",
            },
        },
        nameCard: {
            border: `1px solid ${theme.palette.primary.light}`,
            "&>*": {
                margin: theme.spacing(1),
                width: theme.spacing(65),
                height: theme.spacing(30),
            },
            [theme.breakpoints.between(0, "sm")]: {
                width: "90vw",
                "&>*": {
                    width: "90vw",
                    height: theme.spacing(25),
                },
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
            [theme.breakpoints.between(0, "sm")]: {
                paddingLeft: "10px",
            },
        },
        nameCardTopRow: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "sm")]: {
                width: "100%",
                paddingRight: "5px",
            },
        },
        nameCardIcons: {
            textAlign: "right",
        },
        rightCards: {
            marginLeft: "40px",
            border: `1px solid ${theme.palette.primary.light}`,
            "&>*": {
                margin: theme.spacing(1),
                width: theme.spacing(27),
                height: theme.spacing(30),
            },
            [theme.breakpoints.between(0, "sm")]: {
                marginLeft: "0px",
                "&>*": {
                    margin: theme.spacing(1),
                    width: "40vw",
                    height: theme.spacing(30),
                },
            },
        },
        rightCardsContent: {
            textAlign: "center",
        },
        nameHeader: {
            border: `1px solid ${theme.palette.primary.light}`,
            marginTop: "50px",
            marginBottom: "30px",
            width: "90vw",
            "&>*": {
                width: "100%",
                margin: theme.spacing(1),
                height: theme.spacing(7),
            },
            [theme.breakpoints.between(0, "sm")]: {
                width: "90vw",
                "&>*": {
                    width: "100%",
                    margin: theme.spacing(3),
                    height: theme.spacing(10),
                },
            },
        },
        nameHeaderContent: {
            paddingLeft: "5px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "sm")]: {
                flexDirection: "column",
            },
        },
        hoursVerificationButton: {
            color: colors.white,
            backgroundColor: colors.orange,
            border: "none",
            padding: "4px 10px",
            borderRadius: "10px",
            [theme.breakpoints.between(0, "sm")]: {
                padding: "0 4px",
            },
            "&:active": {
                transform: "scale(0.75)",
            },
        },
        navIcon: {
            border: "none",
            backgroundColor: "inherit",
            outline: "none",
            verticalAlign: "top",
            "&:active": {
                transform: "scale(0.95)",
            },
        },
    })
);

export default VolunteerPage;
