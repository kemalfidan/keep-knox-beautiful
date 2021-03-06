// utils
import React, { useState, ReactNode, useRef } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";

// components
import { Box, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CoreTypography from "../core/typography/CoreTypography";
import CircularProgress from "@material-ui/core/CircularProgress";

// icons
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleOutlinedIcon from "@material-ui/icons/ScheduleOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

// misc
import { Event, ApiResponse } from "utils/types";
import constants from "utils/constants";
import colors from "src/components/core/colors";
import urls from "utils/urls";
import Link from "next/link";

interface Props {
    event: Event;
    isAdmin?: boolean;
    onLoading: () => void;
    loading: boolean;
    pastEvent: boolean;
}

interface ThumbProps {
    localHover: boolean;
    children: ReactNode;
}

const EventCard: React.FC<Props> = ({ event, isAdmin = false, onLoading, loading, pastEvent }) => {
    const classes = useStyles();
    const router = useRouter();
    const [loadingInMenu, setLoadingInMenu] = useState(false);
    const [successfulDelete, setSuccessfulDelete] = useState(false);

    // display variables for event data
    const eventMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
        new Date(event.startDate as Date).getMonth()
    ];
    const eventDate = new Date(event.startDate as Date).getDate();
    const eventLocation = event.location?.split(",")[0];
    const eventStartTime = `${new Date(event.startDate as Date).getHours() % 12 || 12}:${`0${new Date(
        event.startDate as Date
    ).getMinutes()}`.slice(-2)} ${new Date(event.startDate as Date).getHours() >= 11 ? "PM" : "AM"}`;
    const eventEndTime = `${new Date(event.endDate as Date).getHours() % 12 || 12}:${`0${new Date(
        event.endDate as Date
    ).getMinutes()}`.slice(-2)} ${new Date(event.endDate as Date).getHours() > 11 ? "PM" : "AM"}`;

    // state
    const [hover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLoading() {
        onLoading();
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };

    // helper func to render image or placeholder thumbnail
    const EventThumbnail: React.FC<ThumbProps> = ({ children, localHover = false }) => {
        const hasImage = event.image !== undefined;

        return (
            <div
                className={`${classes.thumbnailPlaceholder} ${pastEvent ? classes.pastEvent : ""}`}
                id="eventThumb"
                style={
                    hasImage
                        ? {
                              height: 200,
                              width: "100%",
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              background: `url("${event.image?.url}") no-repeat center`,
                              backgroundSize: "cover",
                          }
                        : {}
                }
            >
                {children}
            </div>
        );
    };

    const MoreButton: React.FC = () => {
        const anchorRef = useRef(null);
        const [menuOpen, setMenuOpen] = useState(false);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setMenuOpen(true);
        };

        const handleClose = (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setMenuOpen(false);
            setHover(false);
        };

        const handleDelete = async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            setLoadingInMenu(true);
            const confirmed = confirm(`Are you sure you want to delete ${event.name}?`);

            if (confirmed) {
                // api req to delete event
                const r = await fetch(urls.api.event(event._id!), {
                    method: "DELETE",
                });
                const response = (await r.json()) as ApiResponse;

                if (!response.success) {
                    alert(`Delete failed: ${response.message || ""}`);
                }
            }

            // show check for 3 seconds before returning back to normal card display
            setLoadingInMenu(false);
            setSuccessfulDelete(true);
            setTimeout(() => {
                setSuccessfulDelete(false);
                setMenuOpen(false);
                setHover(false);
            }, 3000);
        };

        const getIcon = () => {
            if (loadingInMenu) {
                return <CircularProgress color="secondary" style={{ marginLeft: "5px", marginTop: "5px" }} />;
            } else if (successfulDelete) {
                return (
                    <CheckCircleIcon
                        color="secondary"
                        style={{ width: "50px", height: "50px", marginLeft: "5px", marginTop: "5px" }}
                    />
                );
            } else {
                return (
                    <IconButton
                        aria-label="more options"
                        aria-haspopup="true"
                        aria-controls="simple-menu"
                        onClick={e => handleClick(e)}
                        style={{ position: "absolute", zIndex: 1000, top: "3%" }}
                    >
                        <MoreVertIcon htmlColor="white" ref={anchorRef} />
                    </IconButton>
                );
            }
        };

        return (
            <React.Fragment>
                {getIcon()}
                <Menu
                    id="simple-menu"
                    anchorEl={anchorRef.current}
                    open={menuOpen}
                    onClose={handleClose}
                    style={{ top: "50px" }}
                >
                    <Link href={urls.pages.updateEvent(event._id!)}>
                        <MenuItem onClick={handleClose}>
                            {" "}
                            <EditIcon /> &nbsp; Edit{" "}
                        </MenuItem>
                    </Link>
                    <Link href={urls.pages.manageEvent(event._id!)}>
                        <MenuItem onClick={handleClose}>
                            {" "}
                            <PersonOutlineIcon /> &nbsp; Manage{" "}
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={handleDelete}>
                        {" "}
                        <DeleteIcon /> &nbsp; Delete{" "}
                    </MenuItem>
                </Menu>
            </React.Fragment>
        );
    };

    const handleHover = (event: React.MouseEvent) => {
        setHover(true);
    };

    const handleHoverLeave = (event: React.MouseEvent) => {
        setHover(false);
    };

    return (
        <React.Fragment>
            <Card
                onMouseEnter={e => handleHover(e)}
                onMouseLeave={e => handleHoverLeave(e)}
                onClick={() => {
                    handleLoading();
                    void router.push(urls.pages.event(event._id || ""));
                }}
                className={`${classes.eventCard} ${loading ? classes.cardLoading : ""}`}
                elevation={hover ? 20 : 7}
            >
                <EventThumbnail localHover={hover}>
                    <Box className={classes.eventDate}>
                        <span>
                            <CoreTypography variant="h5" style={{ marginBottom: 0, textTransform: "uppercase" }}>
                                {eventMonth}
                            </CoreTypography>
                            <CoreTypography
                                variant="h3"
                                style={{ marginBottom: 0, lineHeight: "20px", fontSize: "1.75em" }}
                            >
                                {eventDate}
                            </CoreTypography>
                        </span>
                    </Box>
                    {isAdmin ? (
                        <div className={classes.thumbnailOverlay} style={hover ? { opacity: 1 } : { opacity: 0 }}>
                            <MoreButton />
                        </div>
                    ) : null}
                </EventThumbnail>
                <CardContent>
                    <div style={{ height: 100, overflow: "hidden" }}>
                        <CoreTypography gutterBottom variant="h3" className={classes.title} id="eventName">
                            {event.name}
                        </CoreTypography>
                        <CoreTypography
                            variant="body2"
                            style={{
                                color: "rgba(0,0,0,.4)",
                                fontFamily: "Ubuntu",
                            }}
                            id="eventDesc"
                            noWrap
                        >
                            {event.caption}
                        </CoreTypography>
                    </div>
                    {/* location and time info */}
                    <Grid container wrap="nowrap" justify="center" alignItems="center" spacing={1}>
                        <RoomOutlinedIcon color="primary"></RoomOutlinedIcon>
                        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
                            <CoreTypography
                                variant="caption"
                                style={{
                                    color: colors.pink,
                                    fontWeight: 600,
                                    fontFamily: "Ubuntu",
                                    fontSize: 13,
                                }}
                                id="eventLoc"
                                component="p"
                                noWrap
                            >
                                {eventLocation}
                            </CoreTypography>
                        </Grid>
                        <ScheduleOutlinedIcon color="primary"></ScheduleOutlinedIcon>
                        <Grid item xs={5}>
                            <CoreTypography
                                variant="caption"
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color: colors.pink,
                                    fontWeight: 600,
                                    fontFamily: "Ubuntu",
                                    fontSize: 13,
                                }}
                                id="eventTime"
                                component="p"
                            >
                                {eventStartTime} - {eventEndTime}
                            </CoreTypography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        eventCard: {
            height: 360,
            borderRadius: 25,
            // boxShadow: "0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)",
            transition: ".3s ease-out",
            position: "relative",
            cursor: "pointer",
            minWidth: 300,
        },
        cardLoading: {
            cursor: "wait",
        },
        thumbnailPlaceholder: {
            background: `${theme.palette.secondary.main} url("/${constants.org.images.defaultCard}") no-repeat center`,
            backgroundSize: "100px",
            height: 200,
            transition: ".3s",
            width: "100%",
        },
        pastEvent: {
            filter: "grayscale(100%)",
        },
        hidden: {
            opacity: 0,
        },
        shown: {
            opacity: 1,
        },
        thumbnailOverlay: {
            backgroundColor: "rgba(0,0,0,.5)",
            width: "100%",
            height: "100%",
            position: "relative",
            transition: ".5s",
        },
        eventDate: {
            width: 65,
            height: 65,
            backgroundColor: colors.green,
            position: "absolute",
            right: "5%",
            top: "5%",
            boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.15)",
            borderRadius: "10px",
            color: "white",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: 22,
        },
    })
);

export default EventCard;
