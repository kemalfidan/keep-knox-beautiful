// utils
import React, { useState, ReactNode } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";

// components
import { Box, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CoreTypography from "../core/typography/CoreTypography";

// icons
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleOutlinedIcon from "@material-ui/icons/ScheduleOutlined";

// misc
import { Event } from "utils/types";
import constants from "utils/constants";
import colors from "src/components/core/colors";

// create styles for material-ui
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
        thumbnailPlaceholder: {
            background: `#97BBCB url("/${constants.org.images.defaultCard}") no-repeat center`,
            backgroundSize: "100px",
            height: 200,
            transition: ".3s",
            width: "100%",
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
            backgroundColor: "#87CD9B",
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

interface Props {
    event: Event;
    isAdmin?: boolean;
}

interface ThumbProps {
    localHover: boolean;
    children: ReactNode;
}

const EventCard: React.FC<Props> = ({ event, isAdmin = false }) => {
    const classes = useStyles();
    const router = useRouter();

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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
        console.log(event.currentTarget, anchorEl);
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
                className={`${classes.thumbnailPlaceholder}`}
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

    const handleHover = (event: React.MouseEvent) => {
        setHover(true);
    };

    const handleHoverLeave = (event: React.MouseEvent) => {
        setHover(false);
    };

    return (
        <div>
            <Card
                onMouseEnter={e => handleHover(e)}
                onMouseLeave={e => handleHoverLeave(e)}
                onClick={() => {
                    void router.push(`/events/${event._id as string}`);
                }}
                className={`${classes.eventCard}`}
                elevation={hover ? 20 : 7}
            >
                {/* <CardActionArea> */}
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
                            <IconButton
                                aria-label="more options"
                                aria-haspopup="true"
                                onClick={e => handleClick(e)}
                                style={{ position: "absolute", zIndex: 1000, top: "3%" }}
                            >
                                <MoreVertIcon htmlColor="white" />
                            </IconButton>
                        </div>
                    ) : null}
                </EventThumbnail>
                <CardContent>
                    <div style={{ height: 105, overflow: "hidden" }}>
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
                        >
                            {event.description}
                        </CoreTypography>
                    </div>
                    {/* location and time info */}
                    <Grid container wrap="nowrap" justify="center" alignItems="center" spacing={1}>
                        <RoomOutlinedIcon color="primary"></RoomOutlinedIcon>
                        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
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
                                id="eventLoc"
                                component="p"
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
                {/* </CardActionArea> */}
            </Card>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={menuOpen}>
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose}>Manage</MenuItem>
                <MenuItem onClick={handleClose}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export default EventCard;
