import React, { useState, ReactNode } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CoreTypography from "../core/typography/CoreTypography";

import { Event } from "utils/types";
import constants from "utils/constants";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        eventCard: {
            height: 400,
            borderRadius: 25,
            // boxShadow: "0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)",
            transition: ".3s",
            position: "relative",
            cursor: "pointer",
            minWidth: 300,
        },
        thumbnailPlaceholder: {
            background: `#97BBCB url("/${constants.org.images.defaultCard}") no-repeat center`,
            backgroundSize: "100px",
            height: 220,
            transition: ".3s",
            width: "100%",
        },
        thumbnailOverlay: {
            backgroundColor: "rgba(0,0,0,.5)",
            width: "100%",
            height: "100%",
            position: "relative",
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
}

interface ThumbProps {
    localHover: boolean;
    children: ReactNode;
}

const EventCard: React.FC<Props> = ({ event }) => {
    const classes = useStyles();
    const router = useRouter();

    // readable event date
    const eventMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
        new Date(event.startDate as Date).getMonth()
    ];
    const eventDate = new Date(event.startDate as Date).getDate();

    // state
    const [hover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
                className={`${hasImage ? "" : classes.thumbnailPlaceholder}`}
                style={
                    hasImage
                        ? {
                              height: 220,
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
        <Card
            onMouseEnter={e => handleHover(e)}
            onMouseLeave={e => handleHoverLeave(e)}
            onClick={() => {
                void router.push(`/events/${event._id as string}`);
            }}
            className={`${classes.eventCard}`}
            elevation={hover ? 14 : 7}
        >
            {/* <CardActionArea> */}
            <EventThumbnail localHover={hover}>
                {/* TODO: change to box */}
                <div className={classes.eventDate}>
                    <span>
                        <CoreTypography
                            variant="h5"
                            style={{ marginBottom: 0, textTransform: "uppercase", fontSize: "1em" }}
                        >
                            {eventMonth}
                        </CoreTypography>
                        <CoreTypography variant="h3" style={{ marginBottom: 0, lineHeight: "20px" }}>
                            {eventDate}
                        </CoreTypography>
                    </span>
                </div>

                <div className={classes.thumbnailOverlay} style={hover && !hover ? { opacity: 1 } : { opacity: 0 }}>
                    <IconButton
                        aria-label="more options"
                        aria-haspopup="true"
                        onClick={e => handleClick(e)}
                        style={{ position: "absolute", zIndex: 1000, top: "3%" }}
                    >
                        <MoreVertIcon htmlColor="white" />
                    </IconButton>
                    <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={menuOpen} onClose={handleClose}>
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Manage</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>
                </div>
            </EventThumbnail>
            <CardContent>
                <CoreTypography gutterBottom variant="h3" className={classes.title}>
                    {event.name}
                </CoreTypography>
                <CoreTypography variant="body2" color="textSecondary">
                    {event.description}
                </CoreTypography>
            </CardContent>
            {/* </CardActionArea> */}
        </Card>
    );
};

export default EventCard;
