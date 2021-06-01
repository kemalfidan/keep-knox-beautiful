import React, { useState } from "react";
import VolunteerEventsList from "../../../../components/VolunteerEventsList";
import { getVolunteer } from "server/actions/Volunteer";
import { Volunteer, ApiResponse } from "utils/types";
import { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import { Router, useRouter } from "next/router";
import ErrorPage from "next/error";
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

    if (!vol || !vol._id) {
        return <ErrorPage statusCode={404} />;
    }

    const firstName = vol.name.split(" ")[0];

    const handleEditClick = async () => {
        await router.push(urls.pages.updateVolunteer(vol._id!));
    };

    const handleSendVerificationEmail = async () => {
        try {
            const confirmed = confirm(`Are you sure you want to send an email to ${vol.name}?`);
            if (confirmed) {
                const res = await fetch(urls.api.sendVerificationEmail(vol._id!), { method: "PUT" });
                const response = (await res.json()) as ApiResponse;
                if (res.status === 200) {
                    setEmailSuccess(true);
                } else {
                    throw new Error(response.message);
                }
            }
        } catch (error) {
            alert(`Error sending email: ${(error instanceof Error && error.message) || "Unexpected error."}`);
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
                                <CoreTypography className={classes.rightCardFont} variant="body1">
                                    {vol.totalEvents == undefined ? 0 : vol.totalEvents}
                                </CoreTypography>
                                <CoreTypography variant="body1">Events Attended</CoreTypography>
                            </div>
                        </Paper>
                        <Paper className={classes.rightCards} elevation={2}>
                            <div className={classes.rightCardsContent}>
                                <CoreTypography className={classes.rightCardFont} variant="body1">
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

export async function getServerSideProps(context: NextPageContext) {
    try {
        // validate valid admin user
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
        if (!vol) {
            throw new Error("Volunteer not found.");
        }

        return {
            props: {
                vol: JSON.parse(JSON.stringify(vol)) as Volunteer,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
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
            [theme.breakpoints.between(0, "md")]: {
                flexDirection: "column",
            },
        },
        volInfoRight: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            [theme.breakpoints.between(0, "md")]: {
                justifyContent: "space-between",
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
            [theme.breakpoints.between(0, "md")]: {
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
            [theme.breakpoints.between(0, "md")]: {
                paddingLeft: "10px",
            },
        },
        nameCardTopRow: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "md")]: {
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
            [theme.breakpoints.between(0, "md")]: {
                marginLeft: "0px",
                "&>*": {
                    margin: theme.spacing(1),
                    width: "40vw",
                    height: theme.spacing(20),
                },
            },
        },
        rightCardsContent: {
            textAlign: "center",
        },
        rightCardFont: {
            fontSize: "130px",
            [theme.breakpoints.between(0, "md")]: {
                fontSize: "75px",
            },
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
            [theme.breakpoints.between(0, "md")]: {
                width: "90vw",
                marginTop: "35px",
                "&>*": {
                    width: "100%",
                    margin: theme.spacing(3),
                    height: theme.spacing(12),
                },
            },
        },
        nameHeaderContent: {
            paddingLeft: "5px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            [theme.breakpoints.between(0, "md")]: {
                paddingLeft: "0",
                paddingRight: "35px",
                flexDirection: "column",
                justifyContent: "space-between",
            },
        },
        hoursVerificationButton: {
            color: colors.white,
            backgroundColor: colors.orange,
            border: "none",
            padding: "4px 10px",
            borderRadius: "10px",
            [theme.breakpoints.between(0, "md")]: {
                padding: "4px 10px",
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
